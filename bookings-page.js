/* ==========================================================
   MY BOOKINGS PAGE (requires login)
========================================================== */
(function(){
  const root = document.getElementById("bookingsRoot");
  if(!root) return;
  let currentBookings = [];

  root.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-receipt]");
    if(!btn || typeof DataService === "undefined") return;
    const booking = currentBookings.find((b) => (b.id || "") === btn.dataset.receipt);
    if(booking) DataService.showReceipt(booking);
  });

  // This device's saved copies. Only the ones made while THIS account was
  // signed in are used — bookings made by someone else on the same phone (or
  // before logging in) never show up here.
  function getLocalBookings(user){
    let list = [];
    try{ list = JSON.parse(localStorage.getItem("dh_enquiries") || "[]"); }catch(e){}
    return user ? list.filter((b) => b && b.uid === user.uid) : [];
  }
  // Booking details were typed by a guest, so they are escaped before display.
  const esc = (x) => (typeof escHTML === "function" ? escHTML(x) : String(x == null ? "" : x).replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c])));
  function formatDate(iso){
    if(!iso) return "";
    const d = new Date(iso);
    if(isNaN(d)) return iso;
    return d.toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
  }

  function loginRequiredHTML(){
    return `
      <div class="account-page-card account-login-required">
        <p>Log in to see the stays you've requested to book.</p>
        <button type="button" class="btn btn-gold" id="goLoginBtn">Log In / Sign Up</button>
      </div>
    `;
  }

  function bookingsHTML(bookings){
    if(bookings.length === 0){
      return `<p class="profile-empty">No booking requests yet. When you request to book a stay, it'll show up here.</p>`;
    }
    return `<div class="enquiry-list">` + bookings.map(item => `
      <article class="enquiry-card">
        <div class="enquiry-card-top">
          <h3>${esc(item.property || "General Enquiry")}</h3>
          <span class="enquiry-status">${esc(item.status || "Pending")}</span>
        </div>
        ${item.orderNo ? `<p class="enquiry-meta"><strong>Order:</strong> ${esc(item.orderNo)}</p>` : ""}
        <p class="enquiry-meta">${esc(formatDate(item.checkin)) || "—"} → ${esc(formatDate(item.checkout)) || "—"}${item.nights ? ` (${esc(item.nights)} night${item.nights > 1 ? "s" : ""})` : ""}</p>
        ${item.guests ? `<p class="enquiry-meta">Guests: ${esc(item.guests)}</p>` : ""}
        ${item.paymentMethod ? `<p class="enquiry-meta">Payment: ${esc(item.paymentMethod)}${item.total ? ` · Total: ₦${Number(item.total).toLocaleString("en-NG")}` : ""}</p>` : ""}
        <p class="enquiry-meta">Submitted: ${esc(formatDate(item.submittedAt))}</p>
        <div class="enquiry-card-foot">
          <span>${esc(item.name || "")}</span>
          <span>${esc(item.phone || "")}</span>
        </div>
        <button type="button" class="btn btn-outline btn-full" data-receipt="${esc(item.id || "")}" style="margin-top:12px;color:var(--navy-deep);border-color:var(--border);background:var(--white);">View receipt</button>
      </article>
    `).join("") + `</div>`;
  }

  // Merge this device's local copy with whatever Firestore has for this
  // account, deduping by id so a booking made on this device before
  // logging in doesn't show up twice.
  function loadMergedBookings(user){
    const local = getLocalBookings(user);
    const remote$ = (typeof DataService !== "undefined" && user)
      ? DataService.listEnquiriesForUser(user.uid).catch(() => [])
      : Promise.resolve([]);
    return remote$.then((remote) => {
      const byId = new Map();
      local.forEach(b => byId.set(b.id || JSON.stringify(b), b));
      remote.forEach(b => byId.set(b.id, b));
      return Array.from(byId.values()).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    });
  }

  function render(){
    const user = (typeof Auth !== "undefined") ? Auth.currentUser() : null;
    if(!user){
      root.innerHTML = loginRequiredHTML();
      document.getElementById("goLoginBtn").addEventListener("click", () => {
        window.location.href = "login.html?next=bookings.html";
      });
      return;
    }
    root.innerHTML = `
      <div style="padding: 20px;">
        ${SkeletonLoader.createBookingCardSkeleton()}
        ${SkeletonLoader.createBookingCardSkeleton()}
        ${SkeletonLoader.createBookingCardSkeleton()}
      </div>
    `;
    loadMergedBookings(user)
      .then((bookings) => {
        currentBookings = bookings;
        root.innerHTML = bookingsHTML(bookings);
      })
      .catch((error) => {
        console.error("Error loading bookings:", error);
        ErrorHandler.handleNetworkError(error, 'Loading bookings');
        root.innerHTML = `
          <div class="error-message" role="alert">
            Unable to load your bookings. Your local bookings are still accessible.
          </div>
          ${bookingsHTML(getLocalBookings(user))}
        `;
      });
  }

  if(typeof Auth !== "undefined"){
    Auth.onInit(render);
    Auth.onLogin(render);
    Auth.onLogout(render);
  } else {
    render();
  }
})();
