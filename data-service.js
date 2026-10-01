/* ==========================================================
   DATA SERVICE — Firestore-backed, with graceful fallback.

   Collections used:
     properties  — one doc per listing (doc id == property id)
     reviews     — one doc per review
     enquiries   — one doc per "Request to Book" submission
     gallery     — photos/videos the admin adds to the public Gallery
     users       — one doc per guest account (written on sign-up / login)
     settings    — settings/site: contact phone, WhatsApp, email
     admins      — one doc per extra admin, doc id == their email
     counters    — counters/orders: last booking order number issued
     promos      — promo codes (doc id == the code)
     content     — editable wording: faq, privacy, terms, about, site,
                   plus home-page sections: locations, categories, why
     bookingFeed — public "just booked" pop-up entries (first name, area, time)
     broadcasts  — notifications sent to every guest
     notifications — notifications sent to one guest (toUid)

   If Firestore isn't reachable (offline, not yet enabled on the
   project, or the compat script failed to load), read calls fall
   back to the PROPERTIES/REVIEWS arrays defined in script.js so
   the public site still works. Write calls (admin edits, new
   enquiries) reject with a clear error instead of silently
   pretending to succeed — callers decide how to surface that
   (see admin-shared.js's adminToast, and script.js's enquiry
   flow which still completes the WhatsApp handoff either way).
========================================================== */

window.DataService = (function(){
  function db(){ return window.db || null; }

  function collection(name){
    if(!db()) throw new Error("Firestore isn't available (offline, or not yet enabled on this Firebase project).");
    return db().collection(name);
  }

  // Runs once per page load. Before the FIRST write to an empty collection,
  // copies the code-level defaults in first — otherwise saving/deleting a
  // single item would leave Firestore with only that one document, making
  // every other default listing/review vanish from view.
  var ensuredCollections = {};
  function ensureSeeded(name, defaults){
    if(ensuredCollections[name]) return ensuredCollections[name];
    ensuredCollections[name] = collection(name).limit(1).get().then(function(snap){
      if(!snap.empty || !defaults || !defaults.length) return;
      return Promise.all(defaults.map(function(item, i){
        var id = item.id || (name + "_seed_" + i);
        var data = Object.assign({}, item);
        delete data.id;
        return collection(name).doc(id).set(data);
      }));
    });
    return ensuredCollections[name];
  }

  /* ---------- Properties ---------- */
  function listProperties(){
    if(!db()){
      return Promise.resolve(typeof PROPERTIES !== "undefined" ? PROPERTIES : []);
    }
    return collection("properties").get().then(function(snap){
      if(snap.empty) return typeof PROPERTIES !== "undefined" ? PROPERTIES : [];
      return snap.docs.map(function(d){ return Object.assign({ id: d.id }, d.data()); });
    }).catch(function(err){
      console.warn("DataService.listProperties fell back to defaults:", err.message);
      return typeof PROPERTIES !== "undefined" ? PROPERTIES : [];
    });
  }

  function getProperty(id){
    return listProperties().then(function(list){
      return list.find(function(p){ return p.id === id; }) || null;
    });
  }

  function saveProperty(prop){
    var isNew = !prop.id;
    if(isNew) prop.id = "shortlet-" + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
    return ensureSeeded("properties", typeof PROPERTIES !== "undefined" ? PROPERTIES : []).then(function(){
      var data = Object.assign({}, prop);
      delete data.id;
      return collection("properties").doc(prop.id).set(data);
    }).then(function(){ return prop; });
  }

  function deleteProperty(id){
    return ensureSeeded("properties", typeof PROPERTIES !== "undefined" ? PROPERTIES : []).then(function(){
      return collection("properties").doc(id).delete();
    });
  }

  /* ---------- Reviews ---------- */
  function listReviews(){
    if(!db()){
      return Promise.resolve(typeof REVIEWS !== "undefined" ? REVIEWS : []);
    }
    return collection("reviews").get().then(function(snap){
      if(snap.empty) return typeof REVIEWS !== "undefined" ? REVIEWS : [];
      return snap.docs.map(function(d){ return Object.assign({ id: d.id }, d.data()); });
    }).catch(function(err){
      console.warn("DataService.listReviews fell back to defaults:", err.message);
      return typeof REVIEWS !== "undefined" ? REVIEWS : [];
    });
  }

  function defaultReviewsWithIds(){
    return (typeof REVIEWS !== "undefined" ? REVIEWS : []).map(function(r, i){
      return Object.assign({ id: "rev_seed_" + i }, r);
    });
  }

  function saveReview(review){
    var isNew = !review.id;
    if(isNew) review.id = "rev_" + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
    return ensureSeeded("reviews", defaultReviewsWithIds()).then(function(){
      var data = Object.assign({}, review);
      delete data.id;
      return collection("reviews").doc(review.id).set(data);
    }).then(function(){ return review; });
  }

  function deleteReview(id){
    return ensureSeeded("reviews", defaultReviewsWithIds()).then(function(){
      return collection("reviews").doc(id).delete();
    });
  }

  /* ---------- Enquiries / Bookings ---------- */
  // Order numbers: "magnificent-shortlet 001", "... 002", ... The counter
  // and the enquiry are written in one transaction so two guests booking at
  // the same moment can never get the same number.
  function orderNoFor(n){
    return "magnificent-shortlet " + String(n).padStart(3, "0");
  }
  function createEnquiry(entry){
    if(!entry.id) entry.id = "enq_" + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
    var data = Object.assign({ status: "New" }, entry);
    var enqRef = collection("enquiries").doc(entry.id);
    var counterRef = collection("counters").doc("orders");
    return db().runTransaction(function(tx){
      return tx.get(counterRef).then(function(snap){
        var n = (snap.exists ? (snap.data().n || 0) : 0) + 1;
        data.orderNo = orderNoFor(n);
        tx.set(counterRef, { n: n });
        tx.set(enqRef, data);
      });
    }).then(function(){
      entry.orderNo = data.orderNo;
      if(Number(data.discount) > 0) bumpPromoUse(data.promo);
      addToBookingFeed(entry);
      return entry;
    }).catch(function(){
      // Couldn't get a number (offline, counter rule not published yet…).
      // Still save the booking; the admin panel numbers it later.
      delete data.orderNo;
      return enqRef.set(data).then(function(){
        if(Number(data.discount) > 0) bumpPromoUse(data.promo);
        addToBookingFeed(entry);
        return entry;
      });
    });
  }

  /* ---------- "Just booked" pop-up feed (real bookings only) ---------- */
  // Public form of a guest's name: first name + last initial ("Fatima A.").
  function publicName(full){
    var parts = String(full || "").replace(/[<>]/g, "").trim().split(/\s+/).filter(Boolean);
    if(!parts.length) return "A guest";
    var out = parts[0].slice(0, 20);
    if(parts.length > 1) out += " " + parts[parts.length - 1].charAt(0).toUpperCase() + ".";
    return out;
  }
  function feedDoc(entry, location){
    return {
      name: publicName(entry.name),
      location: String(location || entry.propertyLocation || "").replace(/[<>]/g, "").slice(0, 80),
      at: entry.submittedAt || new Date().toISOString()
    };
  }
  // Runs right after a booking is saved. If it fails the booking is unaffected.
  function addToBookingFeed(entry){
    if(!db() || !entry || !entry.id) return;
    collection("bookingFeed").doc(entry.id).set(feedDoc(entry)).catch(function(err){
      console.warn("Booking pop-up entry not saved:", err.message);
    });
  }
  // Admin: a cancelled booking leaves the pop-up; any other status keeps/puts it back.
  function syncBookingFeed(booking, status, location){
    if(!booking || !booking.id) return Promise.resolve();
    var ref = collection("bookingFeed").doc(booking.id);
    if(status === "Cancelled") return ref.delete();
    return ref.set(feedDoc(booking, location));
  }
  // Admin: puts the latest bookings (not cancelled) into the pop-up feed.
  function rebuildBookingFeed(bookings, locationFor){
    var recent = bookings.filter(function(b){ return b.id && b.status !== "Cancelled"; }).slice(0, 20);
    return Promise.all(recent.map(function(b){
      return collection("bookingFeed").doc(b.id).set(feedDoc(b, locationFor ? locationFor(b) : ""));
    })).then(function(){ return recent.length; });
  }
  // Live feed: calls onChange(list) now and every time a booking is added or
  // removed. Returns a function that stops listening.
  function watchBookingFeed(onChange){
    if(!db() || typeof db().collection("bookingFeed").onSnapshot !== "function") return function(){};
    return collection("bookingFeed").orderBy("at", "desc").limit(15).onSnapshot(function(snap){
      onChange(snap.docs.map(function(d){ return Object.assign({ id: d.id }, d.data()); }));
    }, function(err){
      console.warn("Booking pop-up feed unavailable:", err.message);
    });
  }

  // Gives an order number to every enquiry that doesn't have one yet,
  // oldest first, so old bookings are numbered in the order they came in.
  function assignOrderNumbers(list){
    var counterRef = collection("counters").doc("orders");
    var sorted = list.filter(function(b){ return b.id && !b.orderNo; })
      .sort(function(a, b){ return String(a.submittedAt || "").localeCompare(String(b.submittedAt || "")); });
    return sorted.reduce(function(chain, b){
      return chain.then(function(){
        var enqRef = collection("enquiries").doc(b.id);
        return db().runTransaction(function(tx){
          return Promise.all([tx.get(counterRef), tx.get(enqRef)]).then(function(r){
            if(!r[1].exists || r[1].data().orderNo) return;
            var n = (r[0].exists ? (r[0].data().n || 0) : 0) + 1;
            tx.set(counterRef, { n: n });
            tx.update(enqRef, { orderNo: orderNoFor(n) });
          });
        });
      });
    }, Promise.resolve());
  }

  function listAllEnquiries(){
    if(!db()) return Promise.resolve([]);
    return collection("enquiries").orderBy("submittedAt", "desc").get().then(function(snap){
      return snap.docs.map(function(d){ return Object.assign({ id: d.id }, d.data()); });
    }).catch(function(err){
      console.warn("DataService.listAllEnquiries failed:", err.message);
      return [];
    });
  }

  function listEnquiriesForUser(uid){
    if(!db() || !uid) return Promise.resolve([]);
    return collection("enquiries").where("uid", "==", uid).get().then(function(snap){
      return snap.docs.map(function(d){ return Object.assign({ id: d.id }, d.data()); });
    }).catch(function(err){
      console.warn("DataService.listEnquiriesForUser failed:", err.message);
      return [];
    });
  }

  function setEnquiryStatus(id, status){
    return collection("enquiries").doc(id).update({ status: status });
  }


  /* ---------- Gallery (admin-managed photos & videos) ---------- */
  function listGallery(opts){
    var strict = !!(opts && opts.strict);
    if(!db()){
      return strict ? Promise.reject(new Error("Firestore isn't available.")) : Promise.resolve([]);
    }
    return collection("gallery").orderBy("createdAt", "desc").limit(120).get().then(function(snap){
      return snap.docs.map(function(d){ return Object.assign({ id: d.id }, d.data()); });
    }).catch(function(err){
      if(strict) throw err;
      console.warn("DataService.listGallery failed:", err.message);
      return [];
    });
  }
  function addGalleryItem(item){
    var data = Object.assign({ createdAt: new Date().toISOString() }, item);
    return collection("gallery").add(data).then(function(ref){ return Object.assign({ id: ref.id }, data); });
  }
  function updateGalleryItem(id, patch){ return collection("gallery").doc(id).update(patch); }
  function deleteGalleryItem(id){ 
    return collection("gallery").doc(id).delete().then(function(){
      // Clear gallery cache in browser to force refresh
      if(window.galleryCache) delete window.galleryCache;
      if(typeof window.dispatchEvent !== "undefined"){
        window.dispatchEvent(new Event("galleryUpdated"));
      }
    });
  }


  /* ---------- Gallery feed + one-time import of the property pictures ---------- */
  function galleryItem(u){
    return { src: u.src, title: u.title || "Shortlet Magnificent", isVideo: u.type === "video" };
  }
  function propertyGalleryItems(list){
    var items = [];
    list.forEach(function(p){
      (p.images || []).forEach(function(src){ items.push({ src: src, type: "image", title: p.title, propertyId: p.id }); });
      (p.videos || []).forEach(function(src){ items.push({ src: src, type: "video", title: p.title, propertyId: p.id }); });
    });
    return items;
  }

  // What the public Gallery page and the home strip show. Once the admin's
  // Gallery has been set up (imported), it is the gallery's own list — deleting
  // a picture there removes it from the site. Before that, property photos.
  function galleryFeed(){
    return Promise.all([listGallery(), getContent("galleryMeta")]).then(function(r){
      var uploads = r[0].map(galleryItem);
      if(r[1] && r[1].seeded) return uploads;
      return listProperties().then(function(props){
        return uploads.concat(propertyGalleryItems(props).map(galleryItem));
      });
    });
  }

  // Admin: copies the pictures that were showing on the Gallery page (the
  // property photos) into the gallery so they can be captioned and deleted
  // there. Safe to run twice: it only adds pictures that aren't there yet.
  function seedGalleryFromProperties(){
    return getContent("galleryMeta").then(function(meta){
      if(meta && meta.seeded) return 0;
      return Promise.all([listGallery({ strict: true }), listProperties()]).then(function(r){
        var have = {};
        r[0].forEach(function(g){ if(g.source === "property") have[(g.propertyId || "") + "|" + g.src] = true; });
        var toAdd = propertyGalleryItems(r[1]).filter(function(it){ return !have[it.propertyId + "|" + it.src]; });
        var base = Date.now();
        var chunks = [];
        for(var i = 0; i < toAdd.length; i += 400) chunks.push(toAdd.slice(i, i + 400));
        return chunks.reduce(function(chain, chunk, ci){
          return chain.then(function(){
            var batch = db().batch();
            chunk.forEach(function(it, i2){
              var idx = ci * 400 + i2;
              // older than any upload, and kept in the original order (newest-first list)
              batch.set(collection("gallery").doc(), Object.assign({ source: "property", createdAt: new Date(base - (idx + 1) * 1000).toISOString() }, it));
            });
            return batch.commit();
          });
        }, Promise.resolve()).then(function(){
          return saveContent("galleryMeta", { seeded: true, count: toAdd.length });
        }).then(function(){ return toAdd.length; });
      });
    });
  }

  /* ---------- Notifications ---------- */
  function sortNewest(list){
    return list.sort(function(a, b){ return String(b.createdAt || "").localeCompare(String(a.createdAt || "")); });
  }
  // Admin: send to every guest
  function sendBroadcast(n, by){
    return collection("broadcasts").add({
      title: String(n.title || "").trim().slice(0, 120),
      message: String(n.message || "").trim().slice(0, 1000),
      createdAt: new Date().toISOString(),
      createdBy: by || ""
    });
  }
  // Admin: send to one guest
  function sendNotification(user, n, by){
    return collection("notifications").add({
      toUid: user.uid || user.id,
      toEmail: String(user.email || "").toLowerCase(),
      toName: user.name || "",
      title: String(n.title || "").trim().slice(0, 120),
      message: String(n.message || "").trim().slice(0, 1000),
      createdAt: new Date().toISOString(),
      createdBy: by || ""
    });
  }
  // Admin: everything that was sent, newest first
  function listSentNotifications(){
    return Promise.all([
      collection("broadcasts").orderBy("createdAt", "desc").limit(50).get(),
      collection("notifications").orderBy("createdAt", "desc").limit(50).get()
    ]).then(function(r){
      var all = r[0].docs.map(function(d){ return Object.assign({ id: d.id, kind: "broadcast" }, d.data()); })
        .concat(r[1].docs.map(function(d){ return Object.assign({ id: d.id, kind: "direct" }, d.data()); }));
      return sortNewest(all).slice(0, 60);
    });
  }
  function deleteSentNotification(item){
    return collection(item.kind === "direct" ? "notifications" : "broadcasts").doc(item.id).delete();
  }
  // Guest: what this signed-in guest may see (rules enforce it), newest first.
  function listMyNotifications(uid){
    if(!db() || !uid) return Promise.resolve([]);
    return Promise.all([
      collection("broadcasts").orderBy("createdAt", "desc").limit(30).get().catch(function(){ return { docs: [] }; }),
      collection("notifications").where("toUid", "==", uid).get().catch(function(){ return { docs: [] }; })
    ]).then(function(r){
      var all = r[0].docs.map(function(d){ return Object.assign({ id: d.id, kind: "broadcast" }, d.data()); })
        .concat(r[1].docs.map(function(d){ return Object.assign({ id: d.id, kind: "direct" }, d.data()); }));
      return sortNewest(all).slice(0, 50);
    });
  }
  // When this guest last opened their notifications (before that = new account time).
  function getNotifSeenAt(user){
    return collection("users").doc(user.uid).get().then(function(snap){
      var d = snap.exists ? snap.data() : {};
      return d.notifSeenAt || (user.metadata && user.metadata.creationTime ? new Date(user.metadata.creationTime).toISOString() : "");
    }).catch(function(){ return ""; });
  }
  function markNotificationsSeen(user){
    return collection("users").doc(user.uid).set({ notifSeenAt: new Date().toISOString() }, { merge: true }).catch(function(){});
  }
  function countUnreadNotifications(user){
    return Promise.all([getNotifSeenAt(user), listMyNotifications(user.uid)]).then(function(r){
      return r[1].filter(function(n){ return String(n.createdAt || "") > String(r[0] || ""); }).length;
    }).catch(function(){ return 0; });
  }

  /* ---------- Users (guest accounts) ---------- */
  function listUsers(){
    return collection("users").get().then(function(snap){
      return snap.docs.map(function(d){ return Object.assign({ id: d.id }, d.data()); });
    });
  }

  /* ---------- Site settings ---------- */
  var SITE_DEFAULTS = {
    phone: "+2348142230897",
    whatsapp: "2348142230897",
    email: "Magnificenthomes4u@gmail.com"
  };
  window.SITE_CONTACT = Object.assign({}, SITE_DEFAULTS);

  function getSettings(){
    if(!db()) return Promise.resolve(Object.assign({}, SITE_DEFAULTS));
    return collection("settings").doc("site").get().then(function(snap){
      return Object.assign({}, SITE_DEFAULTS, snap.exists ? snap.data() : {});
    }).catch(function(err){
      console.warn("DataService.getSettings fell back to defaults:", err.message);
      return Object.assign({}, SITE_DEFAULTS);
    });
  }
  function saveSettings(data){
    return collection("settings").doc("site").set(data, { merge: true });
  }

  /* ---------- Admins ---------- */
  function listAdmins(){
    return collection("admins").get().then(function(snap){
      return snap.docs.map(function(d){ return Object.assign({ id: d.id }, d.data()); });
    });
  }
  // Only someone who already has an account on the website can be made an
  // admin. (Otherwise a stranger could sign up with that address first and
  // walk straight into the admin panel.)
  function addAdmin(email, addedBy){
    email = String(email || "").trim().toLowerCase();
    return collection("users").where("email", "==", email).limit(1).get().then(function(snap){
      if(snap.empty) throw new Error(email + " hasn't signed up or logged in on the website yet. Ask them to do that once, then add them.");
      return collection("admins").doc(email).set({ email: email, addedBy: addedBy || "", addedAt: new Date().toISOString() });
    });
  }
  function removeAdmin(email){
    return collection("admins").doc(String(email).toLowerCase()).delete();
  }

  /* ---------- Push saved contact details into the public pages ---------- */
  // The phone / WhatsApp / email links are written in each page's HTML, so
  // once settings load we rewrite them in place. Nothing changes if the admin
  // hasn't saved anything yet.
  function formatPhone(p){
    var m = /^\+234(\d{3})(\d{3})(\d{4})$/.exec(String(p).replace(/\s+/g, ""));
    return m ? "+234 " + m[1] + " " + m[2] + " " + m[3] : p;
  }
  function patchContactLinks(c){
    var waDigits = String(c.whatsapp || "").replace(/\D/g, "");
    var phone = String(c.phone || "").replace(/\s+/g, "");
    document.querySelectorAll('a[href^="tel:"]').forEach(function(a){
      if(phone) a.setAttribute("href", "tel:" + phone);
      if(!phone) return;
      Array.prototype.forEach.call(a.childNodes, function(n){
        if(n.nodeType === 3 && /^\s*\+?\d[\d\s]{8,}\s*$/.test(n.nodeValue)) n.nodeValue = "\n        " + formatPhone(phone) + "\n      ";
      });
    });
    document.querySelectorAll('a[href^="mailto:"]').forEach(function(a){
      if(!c.email) return;
      var old = a.getAttribute("href").replace(/^mailto:/i, "");
      a.setAttribute("href", "mailto:" + c.email);
      Array.prototype.forEach.call(a.childNodes, function(n){
        if(n.nodeType === 3 && n.nodeValue.trim().toLowerCase() === old.toLowerCase()) n.nodeValue = "\n        " + c.email + "\n      ";
      });
    });
    document.querySelectorAll('a[href*="wa.me/"]').forEach(function(a){
      if(waDigits) a.setAttribute("href", a.getAttribute("href").replace(/wa\.me\/\d+/, "wa.me/" + waDigits));
    });
  }
  function applySiteSettings(){
    if(document.body && document.body.classList.contains("admin-body")) return;
    getSettings().then(function(s){
      window.SITE_CONTACT = { phone: s.phone, whatsapp: s.whatsapp, email: s.email };
      patchContactLinks(window.SITE_CONTACT);
    });
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", applySiteSettings);
  else applySiteSettings();



  /* ---------- Editable pages & wording (content collection) ---------- */
  function getContent(id){
    if(!db()) return Promise.resolve(null);
    return collection("content").doc(id).get().then(function(snap){
      return snap.exists ? snap.data() : null;
    }).catch(function(){ return null; });
  }
  function saveContent(id, data){
    return collection("content").doc(id).set(Object.assign({}, data, { updatedAt: new Date().toISOString() }));
  }
  function deleteContent(id){ return collection("content").doc(id).delete(); }

  // Turns the admin's simple text into safe HTML:
  //   blank line = new paragraph, "# " = heading, "- " = bullet,
  //   **bold**, [label](https://link), and bare links / emails are linked.
  function inlineRich(text){
    var keep = [];
    var s = escHtml(text).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|tel:[^\s)]+)\)/g, function(m, label, url){
      keep.push('<a href="' + url + '" target="_blank" rel="noopener">' + label + '</a>');
      return "\u0000" + (keep.length - 1) + "\u0000";
    });
    s = s.replace(/(https?:\/\/[^\s<]+)/g, function(m){
      keep.push('<a href="' + m + '" target="_blank" rel="noopener">' + m + '</a>');
      return "\u0000" + (keep.length - 1) + "\u0000";
    });
    s = s.replace(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, function(m){
      keep.push('<a href="mailto:' + m + '">' + m + '</a>');
      return "\u0000" + (keep.length - 1) + "\u0000";
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return s.replace(/\u0000(\d+)\u0000/g, function(m, i){ return keep[Number(i)]; });
  }
  function renderRichText(text){
    var src = String(text == null ? "" : text).replace(/\r/g, "").replace(/^(#{1,3}\s+.*)$/gm, "\n$1\n");
    return src.split(/\n\s*\n/).map(function(block){
      var lines = block.split("\n").map(function(l){ return l.trim(); }).filter(Boolean);
      if(!lines.length) return "";
      if(lines.length === 1 && /^#{1,3}\s+/.test(lines[0])) return "<h3>" + inlineRich(lines[0].replace(/^#{1,3}\s+/, "")) + "</h3>";
      if(lines.every(function(l){ return /^[-•*]\s+/.test(l); })){
        return "<ul>" + lines.map(function(l){ return "<li>" + inlineRich(l.replace(/^[-•*]\s+/, "")) + "</li>"; }).join("") + "</ul>";
      }
      return "<p>" + lines.map(inlineRich).join("<br>") + "</p>";
    }).join("");
  }

  /* ---------- Site wording: elements marked data-cms="key" ---------- */
  var SITE_TEXT_CACHE = "siteTextCache";
  function setCmsText(el, value){
    if(!el.hasAttribute("data-cms-orig")) el.setAttribute("data-cms-orig", el.innerHTML);
    if(el.hasAttribute("data-cms-lines")){
      el.textContent = "";
      String(value).split("\n").forEach(function(line, i){
        if(i) el.appendChild(document.createElement("br"));
        el.appendChild(document.createTextNode(line));
      });
    } else if(el.children.length){
      var node = Array.prototype.find.call(el.childNodes, function(n){ return n.nodeType === 3 && n.nodeValue.trim(); });
      if(node) node.nodeValue = value; else el.insertBefore(document.createTextNode(value), el.firstChild);
    } else {
      el.textContent = value;
    }
  }
  function paintSiteText(texts){
    document.querySelectorAll("[data-cms]").forEach(function(el){
      var v = texts[el.getAttribute("data-cms")];
      if(typeof v === "string" && v.trim()){
        setCmsText(el, v);
      } else if(el.hasAttribute("data-cms-orig")){
        el.innerHTML = el.getAttribute("data-cms-orig");   // override removed: back to the original wording
        el.removeAttribute("data-cms-orig");
      }
    });
  }
  function applySiteText(){
    if(document.body && document.body.classList.contains("admin-body")) return;
    try{
      var cached = JSON.parse(localStorage.getItem(SITE_TEXT_CACHE) || "null");
      if(cached) paintSiteText(cached);        // instant, from the last visit
    }catch(e){}
    getContent("site").then(function(c){
      var texts = (c && c.texts) || {};
      paintSiteText(texts);
      try{ localStorage.setItem(SITE_TEXT_CACHE, JSON.stringify(texts)); }catch(e){}
    });
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", applySiteText);
  else applySiteText();

  /* ---------- Promo codes & discounts ---------- */
  function normalizeCode(c){ return String(c || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, ""); }
  function getPromo(code){
    code = normalizeCode(code);
    if(!code || !db()) return Promise.resolve(null);
    return collection("promos").doc(code).get().then(function(snap){
      return snap.exists ? Object.assign({ id: snap.id }, snap.data()) : null;
    }).catch(function(){ return null; });
  }
  function listPromos(){
    return collection("promos").get().then(function(snap){
      return snap.docs.map(function(d){ return Object.assign({ id: d.id }, d.data()); });
    });
  }
  function savePromo(p){
    var code = normalizeCode(p.code);
    if(!code) return Promise.reject(new Error("Enter a promo code."));
    return collection("promos").doc(code).set(Object.assign({}, p, { code: code }), { merge: true });
  }
  function deletePromo(code){ return collection("promos").doc(normalizeCode(code)).delete(); }

  function promoDiscount(promo, subtotal){
    var v = Number(promo.value) || 0;
    var d = promo.type === "fixed" ? v : Math.floor(subtotal * v / 100);
    return Math.max(0, Math.min(d, subtotal));
  }
  // Resolves { ok, reason?, promo?, discount?, code? }
  function checkPromo(code, nights, subtotal){
    code = normalizeCode(code);
    if(!code) return Promise.resolve({ ok: false, reason: "" });
    if(!db()) return Promise.resolve({ ok: false, reason: "Promo codes can't be checked right now." });
    return getPromo(code).then(function(p){
      if(!p || p.active === false) return { ok: false, reason: "That promo code isn't valid." };
      if(p.expiresAt){
        var end = new Date(p.expiresAt + "T23:59:59");
        if(!isNaN(end) && end < new Date()) return { ok: false, reason: "That promo code has expired." };
      }
      if(p.maxUses && (p.usedCount || 0) >= p.maxUses) return { ok: false, reason: "That promo code has been fully used." };
      if(p.minNights && nights < p.minNights) return { ok: false, reason: "This code needs a stay of at least " + p.minNights + " nights." };
      var d = promoDiscount(p, subtotal);
      if(d <= 0) return { ok: false, reason: "That promo code doesn't apply to this stay." };
      return { ok: true, promo: p, discount: d, code: code };
    });
  }
  function bumpPromoUse(code){
    code = normalizeCode(code);
    if(!code || !db() || !window.firebase || !firebase.firestore || !firebase.firestore.FieldValue) return;
    collection("promos").doc(code).update({ usedCount: firebase.firestore.FieldValue.increment(1) }).catch(function(){});
  }

  /* ---------- Unavailable dates ---------- */
  // ranges: [{ from, to }] as YYYY-MM-DD, both days inclusive (the nights that are taken).
  // A stay uses the nights from check-in up to the night before check-out.
  function availabilityProblem(ranges, checkin, checkout){
    if(!ranges || !ranges.length || !checkin || !checkout) return "";
    for(var i = 0; i < ranges.length; i++){
      var r = ranges[i];
      if(r && r.from && r.to && checkin <= r.to && checkout > r.from){
        return "Sorry, those dates aren't available. Unavailable: " + receiptDate(r.from) + " to " + receiptDate(r.to) + ".";
      }
    }
    return "";
  }

  /* ---------- Booking receipt (used by the admin panel and My Bookings) ---------- */
  function escHtml(x){
    return String(x == null ? "" : x).replace(/[&<>"']/g, function(c){
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
    });
  }
  function receiptDate(iso){
    if(!iso) return "—";
    var d = new Date(iso);
    return isNaN(d) ? iso : d.toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
  }
  function receiptMoney(n){ return "₦" + Number(n || 0).toLocaleString("en-NG"); }

  function addReceiptStyles(){
    if(document.getElementById("dsReceiptStyles")) return;
    var st = document.createElement("style");
    st.id = "dsReceiptStyles";
    st.textContent =
      "#dsReceiptOverlay{position:fixed;inset:0;z-index:9999;background:rgba(15,23,43,.6);display:flex;align-items:flex-start;justify-content:center;padding:18px 14px;overflow:auto;}" +
      "#dsReceiptOverlay .dsr-card{background:#fff;color:#172033;width:100%;max-width:420px;border-radius:16px;padding:22px 20px;font-family:'Lato',Arial,sans-serif;box-shadow:0 16px 40px rgba(7,21,47,.3);}" +
      "#dsReceiptOverlay .dsr-brand{text-align:center;font-family:'Cinzel',Georgia,serif;font-weight:700;letter-spacing:1.6px;font-size:14px;color:#0f172b;}" +
      "#dsReceiptOverlay .dsr-title{text-align:center;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#7a7f8c;margin:4px 0 16px;}" +
      "#dsReceiptOverlay .dsr-order{background:#F7F5F0;border:1px dashed #d9a868;border-radius:12px;padding:12px;text-align:center;margin-bottom:14px;}" +
      "#dsReceiptOverlay .dsr-order small{display:block;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#7a7f8c;margin-bottom:4px;}" +
      "#dsReceiptOverlay .dsr-order strong{font-size:17px;word-break:break-word;}" +
      "#dsReceiptOverlay .dsr-row{display:flex;justify-content:space-between;gap:14px;padding:9px 0;border-bottom:1px solid #eee9de;font-size:14px;}" +
      "#dsReceiptOverlay .dsr-row span:first-child{color:#7a7f8c;flex:0 0 auto;}" +
      "#dsReceiptOverlay .dsr-row span:last-child{font-weight:700;text-align:right;word-break:break-word;}" +
      "#dsReceiptOverlay .dsr-total{display:flex;justify-content:space-between;align-items:center;padding:14px 0 4px;font-size:16px;font-weight:800;}" +
      "#dsReceiptOverlay .dsr-total span:last-child{font-size:22px;}" +
      "#dsReceiptOverlay .dsr-foot{text-align:center;font-size:12.5px;color:#7a7f8c;line-height:1.6;margin-top:14px;}" +
      "#dsReceiptOverlay .dsr-actions{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;}" +
      "#dsReceiptOverlay .dsr-actions button{flex:1;min-width:110px;font:700 14px 'Lato',Arial,sans-serif;padding:11px 10px;border-radius:10px;border:1px solid #d9d4c7;background:#fff;color:#172033;cursor:pointer;}" +
      "#dsReceiptOverlay .dsr-actions button.gold{background:linear-gradient(180deg,#f0c48d,#d9a868);border-color:#d9a868;}" +
      "@media print{body.ds-printing > *:not(#dsReceiptOverlay){display:none !important;}" +
        "body.ds-printing #dsReceiptOverlay{position:static;background:none;padding:0;overflow:visible;display:block;}" +
        "body.ds-printing #dsReceiptOverlay .dsr-card{box-shadow:none;max-width:none;}" +
        "body.ds-printing #dsReceiptOverlay .dsr-actions{display:none;}}";
    document.head.appendChild(st);
  }

  function closeReceipt(){
    var el = document.getElementById("dsReceiptOverlay");
    if(el) el.remove();
    document.body.classList.remove("ds-printing");
  }

  function showReceipt(b){
    addReceiptStyles();
    closeReceipt();
    var c = window.SITE_CONTACT || {};
    var pay = b.paymentMethod === "Paystack"
      ? "Card (Paystack)" + (b.reference ? " · " + b.reference : "")
      : (b.paymentMethod === "Transfer" ? "Bank transfer" : (b.paymentMethod || "—"));
    var nights = Number(b.nights || 0);
    var rows = [
      ["Guest", b.name || "—"],
      ["Phone", b.phone || "—"],
      ["Property", b.property || "General Enquiry"],
      ["Check-in", receiptDate(b.checkin)],
      ["Check-out", receiptDate(b.checkout)],
      ["Nights", nights || "—"],
      ["Guests", b.guests || "—"]
    ];
    if(b.promo) rows.push(["Promo code", b.promo]);
    if(Number(b.discount) > 0) rows.push(["Discount", "−" + receiptMoney(b.discount)]);
    rows.push(["Payment", pay], ["Status", b.status || "New"], ["Issued", receiptDate(b.submittedAt)]);

    var orderNo = b.orderNo || "Pending";
    var shareText =
      "Shortlet Magnificent — booking receipt\n" +
      "Order: " + orderNo + "\n" +
      "Guest: " + (b.name || "—") + "\n" +
      "Property: " + (b.property || "—") + "\n" +
      "Stay: " + receiptDate(b.checkin) + " → " + receiptDate(b.checkout) + (nights ? " (" + nights + " night" + (nights > 1 ? "s" : "") + ")" : "") + "\n" +
      "Total: " + receiptMoney(b.total);

    var overlay = document.createElement("div");
    overlay.id = "dsReceiptOverlay";
    overlay.innerHTML =
      '<div class="dsr-card" role="dialog" aria-label="Booking receipt">' +
        '<div class="dsr-brand">SHORTLET MAGNIFICENT</div>' +
        '<div class="dsr-title">Booking receipt</div>' +
        '<div class="dsr-order"><small>Order number</small><strong>' + escHtml(orderNo) + '</strong></div>' +
        rows.map(function(r){ return '<div class="dsr-row"><span>' + escHtml(r[0]) + '</span><span>' + escHtml(r[1]) + '</span></div>'; }).join("") +
        '<div class="dsr-total"><span>Total</span><span>' + receiptMoney(b.total) + '</span></div>' +
        '<div class="dsr-foot">Thank you for choosing Shortlet Magnificent.<br>' +
          escHtml(c.phone || "") + (c.email ? ' · ' + escHtml(c.email) : "") + '</div>' +
        '<div class="dsr-actions">' +
          '<button type="button" class="gold" data-act="print">Print / Save PDF</button>' +
          '<button type="button" data-act="share">Share</button>' +
          '<button type="button" data-act="close">Close</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function(e){
      if(e.target === overlay){ closeReceipt(); return; }
      var btn = e.target.closest("button[data-act]");
      if(!btn) return;
      if(btn.dataset.act === "close") closeReceipt();
      if(btn.dataset.act === "print"){
        document.body.classList.add("ds-printing");
        window.addEventListener("afterprint", function(){ document.body.classList.remove("ds-printing"); }, { once: true });
        window.print();
      }
      if(btn.dataset.act === "share"){
        if(navigator.share){ navigator.share({ title: "Booking receipt " + orderNo, text: shareText }).catch(function(){}); }
        else { window.open("https://wa.me/?text=" + encodeURIComponent(shareText), "_blank", "noopener"); }
      }
    });
  }

  /* ---------- One-time seed (admin dashboard button) ---------- */
  function seedIfEmpty(){
    return Promise.all([
      ensureSeeded("properties", typeof PROPERTIES !== "undefined" ? PROPERTIES : []),
      ensureSeeded("reviews", defaultReviewsWithIds())
    ]).then(function(results){
      var didWrite = results.some(function(r){ return r !== undefined; });
      return { written: didWrite ? 1 : 0 };
    });
  }

  return {
    listProperties: listProperties,
    getProperty: getProperty,
    saveProperty: saveProperty,
    deleteProperty: deleteProperty,
    listReviews: listReviews,
    saveReview: saveReview,
    deleteReview: deleteReview,
    getContent: getContent,
    saveContent: saveContent,
    deleteContent: deleteContent,
    renderRichText: renderRichText,
    getPromo: getPromo,
    listPromos: listPromos,
    savePromo: savePromo,
    deletePromo: deletePromo,
    checkPromo: checkPromo,
    promoDiscount: promoDiscount,
    availabilityProblem: availabilityProblem,
    createEnquiry: createEnquiry,
    assignOrderNumbers: assignOrderNumbers,
    showReceipt: showReceipt,
    listAllEnquiries: listAllEnquiries,
    listEnquiriesForUser: listEnquiriesForUser,
    setEnquiryStatus: setEnquiryStatus,
    listGallery: listGallery,
    galleryFeed: galleryFeed,
    seedGalleryFromProperties: seedGalleryFromProperties,
    addGalleryItem: addGalleryItem,
    updateGalleryItem: updateGalleryItem,
    deleteGalleryItem: deleteGalleryItem,
    watchBookingFeed: watchBookingFeed,
    syncBookingFeed: syncBookingFeed,
    rebuildBookingFeed: rebuildBookingFeed,
    sendBroadcast: sendBroadcast,
    sendNotification: sendNotification,
    listSentNotifications: listSentNotifications,
    deleteSentNotification: deleteSentNotification,
    listMyNotifications: listMyNotifications,
    getNotifSeenAt: getNotifSeenAt,
    markNotificationsSeen: markNotificationsSeen,
    countUnreadNotifications: countUnreadNotifications,
    listUsers: listUsers,
    getSettings: getSettings,
    saveSettings: saveSettings,
    listAdmins: listAdmins,
    addAdmin: addAdmin,
    removeAdmin: removeAdmin,
    seedIfEmpty: seedIfEmpty
  };
})();
