/* ==========================================================
   LOAD GUARD
   Makes sure visitors never stare at a blank page:
   1. Empty content areas get a shimmering placeholder straight away.
   2. If an area is still not loaded after a few seconds it shows
      "Taking longer than usual — check your internet connection"
      with a Try again button (and clears itself if content arrives).
   3. A banner appears when the device goes offline, or the whole
      page is slow to finish loading.
   4. Photos that are slow or fail get a soft placeholder instead of
      an empty gap.
========================================================== */
(function(){
  var SLOW_MS = 8000;        // area still empty after this → show the message
  var PAGE_SLOW_MS = 12000;  // whole page still loading after this → banner

  /* ---------- placeholders ---------- */
  var card = '<div class="skeleton-card lg-skel" aria-hidden="true"><div class="skeleton-card-media"><div class="skeleton"></div></div><div class="skeleton-card-info"><div class="skeleton skeleton-text title"></div><div class="skeleton skeleton-text location"></div><div class="skeleton skeleton-text price"></div><div class="skeleton skeleton-text meta"></div></div></div>';
  var review = '<div class="lg-skel lg-review" aria-hidden="true"><div class="skeleton skeleton-text" style="width:40%"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text" style="width:80%"></div></div>';
  var tile = '<div class="lg-skel lg-tile skeleton" aria-hidden="true"></div>';
  var chip = '<div class="lg-skel lg-chip" aria-hidden="true"><div class="skeleton lg-chip-img"></div><div class="skeleton skeleton-text" style="width:70%;margin:6px auto 0"></div></div>';
  var lines = '<div class="lg-skel lg-lines" aria-hidden="true"><div class="skeleton skeleton-text title"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text" style="width:75%"></div></div>';
  var detail = '<div class="lg-skel lg-detail" aria-hidden="true"><div class="skeleton lg-detail-img"></div><div class="skeleton skeleton-text title" style="margin-top:18px"></div><div class="skeleton skeleton-text location"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text" style="width:80%"></div></div>';
  function rep(html, n){ var s = ""; for(var i = 0; i < n; i++) s += html; return s; }

  var AREAS = [
    { id:"propertyScroll",    html: rep(card, 4),   what:"the apartments" },
    { id:"reviewScroll",      html: rep(review, 3), what:"guest reviews" },
    { id:"categoryGrid",      html: rep(tile, 4),   what:"apartment types" },
    { id:"locationChips",     html: rep(chip, 5),   what:"locations" },
    { id:"propertiesGridRoot",html: rep(card, 6),   what:"the apartments" },
    { id:"propertyDetailRoot",html: detail,         what:"this apartment" },
    { id:"galleryRoot",       html: rep(tile, 6),   what:"the gallery" },
    { id:"reviewsPageRoot",   html: rep(review, 3), what:"guest reviews" },
    { id:"savedRoot",         html: rep(card, 3),   what:"your saved stays" },
    { id:"bookingsRoot",      html: rep(lines, 2),  what:"your bookings" },
    { id:"notificationsRoot", html: rep(lines, 2),  what:"your notifications" },
    { id:"paymentRoot",       html: lines,          what:"your payments" },
    { id:"profileRoot",       html: lines,          what:"your profile" },
    { id:"settingsRoot",      html: lines,          what:"your settings" },
    { id:"faqRoot",           html: rep(lines, 2),  what:"the questions" },
    { id:"helpRoot",          html: lines,          what:"the support options" }
  ];

  function isPlaceholder(child){
    if(child.nodeType !== 1) return true;
    if(child.matches(".lg-skel, .lg-msg, .skeleton, .skeleton-card")) return true;
    if(child.querySelector && child.querySelector(".skeleton")) return true;
    return false;
  }
  function isLoaded(el){
    for(var i = 0; i < el.children.length; i++){
      if(!isPlaceholder(el.children[i])) return true;
    }
    return false;
  }
  function isEmpty(el){ return el.children.length === 0 && !el.textContent.trim(); }

  function messageHTML(what){
    return '<div class="lg-msg" role="alert">' +
      '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true"><path d="M2.5 9.2C5 6.8 8.3 5.5 12 5.5C15.7 5.5 19 6.8 21.5 9.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M5.6 12.6C7.4 11 9.6 10.2 12 10.2C14.4 10.2 16.6 11 18.4 12.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="17.5" r="1.6" fill="currentColor"/></svg>' +
      '<h3>Taking longer than usual</h3>' +
      '<p>We\u2019re still loading ' + what + '. Please check your internet connection.</p>' +
      '<button type="button" class="btn btn-gold btn-sm lg-retry">Try again</button>' +
    '</div>';
  }

  function watch(area){
    var el = document.getElementById(area.id);
    if(!el || el.__lgWatched) return;
    el.__lgWatched = true;

    if(isEmpty(el)) el.insertAdjacentHTML("afterbegin", area.html);

    var slowTimer = setTimeout(function(){
      if(isLoaded(el)) return;
      el.classList.add("lg-slow");
      if(!el.querySelector(".lg-msg")) el.insertAdjacentHTML("afterbegin", messageHTML(area.what));
      var btn = el.querySelector(".lg-retry");
      if(btn) btn.addEventListener("click", function(){ location.reload(); });
    }, SLOW_MS);

    var busy = false;
    new MutationObserver(function(){
      if(busy) return;
      if(!isLoaded(el)) return;
      busy = true;
      clearTimeout(slowTimer);
      el.classList.remove("lg-slow");
      var m = el.querySelector(".lg-msg"); if(m) m.remove();
      el.querySelectorAll(":scope > .lg-skel").forEach(function(n){ n.remove(); });
      busy = false;
    }).observe(el, { childList:true });
  }

  /* ---------- banners ---------- */
  function banner(id, text){
    if(!document.body) return;
    var b = document.getElementById(id);
    if(!b){
      b = document.createElement("div");
      b.id = id; b.className = "lg-banner"; b.setAttribute("role", "status");
      document.body.appendChild(b);
    }
    b.textContent = text;
    b.classList.add("show");
  }
  function unbanner(id){
    var b = document.getElementById(id);
    if(b) b.classList.remove("show");
  }
  function offlineCheck(){
    if(navigator.onLine === false) banner("lgOffline", "You appear to be offline. Check your internet connection.");
    else unbanner("lgOffline");
  }
  window.addEventListener("offline", offlineCheck);
  window.addEventListener("online", function(){ offlineCheck(); });

  // whole page still loading after PAGE_SLOW_MS
  var pageTimer = setTimeout(function(){
    if(document.readyState !== "complete") banner("lgSlowPage", "This page is taking longer than usual to load. Check your internet connection.");
  }, PAGE_SLOW_MS);
  window.addEventListener("load", function(){ clearTimeout(pageTimer); unbanner("lgSlowPage"); });

  /* ---------- photos: soft placeholder if one fails ---------- */
  document.addEventListener("error", function(e){
    var img = e.target;
    if(!img || img.tagName !== "IMG") return;
    // Stacked slideshow: just hide the broken photo, the others keep working
    if(img.closest(".gallery-main")){ img.style.visibility = "hidden"; return; }
    var box = img.closest(".property-media, .gallery-item, .location-chip-img, .gallery-thumb, .review-media");
    if(!box) return;
    img.style.visibility = "hidden";
    box.classList.add("lg-img-failed");
  }, true);

  function init(){
    AREAS.forEach(watch);
    offlineCheck();
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
