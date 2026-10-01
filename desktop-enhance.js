/* ==========================================================
   DESKTOP ENHANCEMENTS
   Adds the extra pieces the desktop layout needs (sidebar user
   block, settings tabs, profile form, etc.). Every block added
   here is hidden below 960px by CSS, so mobile is unchanged.
========================================================== */
(function(){
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  function getProfile(){
    try { return JSON.parse(localStorage.getItem("dh_profile") || "null") || {}; } catch(e){ return {}; }
  }
  function currentUser(){
    return (typeof Auth !== "undefined" && Auth.currentUser) ? Auth.currentUser() : null;
  }
  function identity(){
    const user = currentUser();
    const p = user ? getProfile() : {};
    const name = (p.name) || (user && user.displayName) || "Guest User";
    const email = (p.email) || (user && user.email) || "Sign in to sync your account";
    const initials = name.trim().split(/\s+/).map(w => w[0]).slice(0,2).join("").toUpperCase() || "GU";
    return { user, name, email, initials, profile: p };
  }
  function onAuth(fn){
    fn();
    if(typeof Auth !== "undefined"){
      Auth.onInit && Auth.onInit(fn);
      Auth.onLogin && Auth.onLogin(fn);
      Auth.onLogout && Auth.onLogout(fn);
    }
  }

  /* ---------- 1. Account sidebar: user block, Dashboard, Log Out ---------- */
  const sidebar = document.querySelector(".account-sidebar");
  if(sidebar){
    const label = sidebar.querySelector(".account-sidebar-label");
    const userBlock = document.createElement("div");
    userBlock.className = "as-user";
    sidebar.insertBefore(userBlock, sidebar.firstChild);
    if(label) label.remove();

    // "Profile" becomes "Dashboard" and moves to the top, like the reference
    const links = [...sidebar.querySelectorAll(".account-nav-link")];
    const profileLink = links.find(a => a.getAttribute("href") === "profile.html");
    if(profileLink){
      const span = profileLink.querySelector("span");
      if(span) span.textContent = "Dashboard";
      sidebar.insertBefore(profileLink, userBlock.nextSibling);
    }
    // Active item follows the page (the profile page is the dashboard)
    sidebar.querySelectorAll(".account-nav-link").forEach(a => {
      a.classList.toggle("active", a.getAttribute("href") === page);
    });

    const out = document.createElement("button");
    out.type = "button";
    out.className = "account-nav-link as-logout";
    out.innerHTML = '<svg viewBox="0 0 24 24" width="19" height="19" fill="none"><path d="M10 5H6.5C5.7 5 5 5.7 5 6.5V17.5C5 18.3 5.7 19 6.5 19H10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M14 8.5L18 12L14 15.5M18 12H9.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Log Out</span>';
    out.addEventListener("click", () => {
      if(currentUser()) Auth.logout();
      else window.location.href = "login.html?next=" + encodeURIComponent(page);
    });
    sidebar.appendChild(out);

    onAuth(() => {
      const id = identity();
      userBlock.innerHTML = `<span class="as-avatar">${esc(id.initials)}</span><span class="as-id"><strong>${esc(id.name)}</strong><small>${esc(id.email)}</small></span>`;
      out.querySelector("span").textContent = id.user ? "Log Out" : "Log In";
    });
  }

  /* ---------- 2. Settings: inner tab column ---------- */
  const settingsRoot = document.getElementById("settingsRoot");
  if(settingsRoot){
    const content = settingsRoot.closest(".account-content");
    if(content) content.classList.add("has-settings-tabs");
    const tabs = document.createElement("nav");
    tabs.className = "settings-tabs desk-only";
    tabs.setAttribute("aria-label", "Settings sections");
    tabs.innerHTML = `
      <a href="settings.html" class="active">Account</a>
      <a href="notifications.html">Notifications</a>
      <a href="privacy.html">Privacy</a>
      <a href="help.html">Help &amp; Support</a>`;
    settingsRoot.parentNode.insertBefore(tabs, settingsRoot);
    const title = document.createElement("h2");
    title.className = "settings-card-title desk-only";
    title.textContent = "Account Settings";
    settingsRoot.insertBefore(title, settingsRoot.firstChild);
    // settings-page.js fills settingsRoot after us or before us; keep the title on top either way
    new MutationObserver(() => {
      if(!settingsRoot.querySelector(".settings-card-title")){
        const t = document.createElement("h2");
        t.className = "settings-card-title desk-only";
        t.textContent = "Account Settings";
        settingsRoot.insertBefore(t, settingsRoot.firstChild);
      }
    }).observe(settingsRoot, { childList:true });
  }

  /* ---------- 3. Profile: header + Personal Information form ---------- */
  const profileRoot = document.getElementById("profileRoot");
  if(profileRoot){
    const shell = document.createElement("section");
    shell.className = "profile-desk desk-only";
    profileRoot.parentNode.insertBefore(shell, profileRoot);
    function renderProfileDesk(){
      const id = identity();
      const p = id.profile;
      shell.innerHTML = `
        <h1 class="pd-title">My Profile</h1>
        <p class="pd-sub">Manage your account and personal information.</p>
        <div class="pd-card">
          <div class="pd-head">
            <span class="pd-avatar">${esc(id.initials)}</span>
            <span class="pd-id"><strong>${esc(id.name)}</strong><small>${esc(id.email)}</small></span>
            <a href="settings.html" class="pd-edit">Edit Profile</a>
          </div>
          <div class="pd-tabs">
            <a href="profile.html" class="active">Personal Information</a>
            <a href="notifications.html">Notifications</a>
            <a href="settings.html">Settings</a>
          </div>
          <form class="pd-form" id="pdForm">
            <label>Full Name<input type="text" name="name" value="${esc(id.user ? (p.name || (id.user.displayName || "")) : (p.name || ""))}" placeholder="e.g. Chioma Eze"></label>
            <label>Email Address<input type="email" name="email" value="${esc(id.user ? (p.email || id.user.email || "") : (p.email || ""))}" placeholder="you@example.com"></label>
            <label>Phone Number<input type="tel" name="phone" value="${esc(p.phone || "")}" placeholder="e.g. 080 000 00000"></label>
            <label>Location<input type="text" name="location" value="${esc(p.location || "")}" placeholder="e.g. Lagos, Nigeria"></label>
            <button type="submit" class="pd-save">Save Changes</button>
          </form>
        </div>`;
      shell.querySelector("#pdForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        localStorage.setItem("dh_profile", JSON.stringify({
          name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone"), location: fd.get("location")
        }));
        if(typeof showToast === "function") showToast("Profile updated");
        renderProfileDesk();
      });
    }
    onAuth(renderProfileDesk);
  }

  /* ---------- 4. Payments: Payment Methods + Transaction History ---------- */
  const payRoot = document.getElementById("paymentRoot");
  if(payRoot){
    const wrap = document.createElement("div");
    wrap.className = "pay-desk desk-only";
    wrap.innerHTML = `
      <div class="pay-card">
        <h2>Payment Methods</h2>
        <p class="profile-empty">No payment methods saved yet. You'll be asked for payment details when you book a stay.</p>
      </div>
      <div class="pay-card">
        <div class="pay-card-head"><h2>Transaction History</h2><a href="bookings.html">View all</a></div>
        <p class="profile-empty">Your payments will appear here after you book a stay.</p>
      </div>`;
    payRoot.parentNode.insertBefore(wrap, payRoot);
  }

  /* ---------- 5. Property detail: Overview / Amenities / Location / Reviews tabs ---------- */
  const detailRoot = document.getElementById("propertyDetailRoot");
  if(detailRoot){
    function addBookPrice(){
      const side = detailRoot.querySelector(".detail-sidebar");
      const price = detailRoot.querySelector(".detail-header .detail-price");
      if(!side || !price || side.querySelector(".book-card-price")) return;
      const per = price.querySelector("small, span");
      const amount = (price.firstChild && price.firstChild.textContent || price.textContent).trim();
      const box = document.createElement("div");
      box.className = "book-card-price desk-only";
      box.innerHTML = `<strong>${esc(amount)}</strong><span>${esc(per ? per.textContent.trim() : "/night")}</span>`;
      side.insertBefore(box, side.firstChild);
    }
    function addDetailTabs(){
      addBookPrice();
      if(detailRoot.querySelector(".detail-tabs")) return;
      const info = detailRoot.querySelector(".info-card");
      if(!info) return;
      const sections = [...detailRoot.querySelectorAll(".detail-section")];
      const find = (txt) => sections.find(s => (s.querySelector("h2") || {}).textContent === txt);
      const map = { Overview: find("Description"), Amenities: find("What This Place Offers"), Location: find("Location") };
      Object.entries(map).forEach(([k, el]) => { if(el) el.id = "tab-" + k.toLowerCase(); });
      const nav = document.createElement("nav");
      nav.className = "detail-tabs desk-only";
      nav.innerHTML = `<a href="#tab-overview" class="active">Overview</a><a href="#tab-amenities">Amenities</a><a href="#tab-location">Location</a><a href="reviews.html">Reviews</a>`;
      info.insertAdjacentElement("afterend", nav);
      nav.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", (e) => {
        const t = document.querySelector(a.getAttribute("href"));
        if(!t) return;
        e.preventDefault();
        nav.querySelectorAll("a").forEach(x => x.classList.remove("active"));
        a.classList.add("active");
        t.scrollIntoView({ behavior:"smooth", block:"start" });
      }));
    }
    new MutationObserver(addDetailTabs).observe(detailRoot, { childList:true });
    addDetailTabs();

    /* Full view: click the main photo (or the Full view button) to see it large,
       then use the arrows / keyboard to move through every photo. */
    let viewer = null, viewerIdx = 0, viewerSrcs = [];
    function photoList(){
      return [...detailRoot.querySelectorAll("#galleryMain img")].map(i => i.currentSrc || i.src).filter(Boolean);
    }
    function showViewer(i){
      viewerIdx = (i + viewerSrcs.length) % viewerSrcs.length;
      viewer.querySelector("img").src = viewerSrcs[viewerIdx];
      viewer.querySelector(".pl-count").textContent = (viewerIdx + 1) + " / " + viewerSrcs.length;
      const many = viewerSrcs.length > 1;
      viewer.querySelector(".pl-prev").style.display = many ? "" : "none";
      viewer.querySelector(".pl-next").style.display = many ? "" : "none";
    }
    function closeViewer(){ if(viewer){ viewer.classList.remove("open"); document.body.classList.remove("no-scroll"); } }
    function openViewer(){
      viewerSrcs = photoList();
      if(!viewerSrcs.length) return;
      if(!viewer){
        viewer = document.createElement("div");
        viewer.className = "pl-viewer";
        viewer.setAttribute("role", "dialog");
        viewer.setAttribute("aria-label", "Photo full view");
        viewer.innerHTML = '<button type="button" class="pl-btn pl-close" aria-label="Close">&times;</button><button type="button" class="pl-btn pl-prev" aria-label="Previous photo">&#8249;</button><img alt=""><button type="button" class="pl-btn pl-next" aria-label="Next photo">&#8250;</button><span class="pl-count"></span>';
        document.body.appendChild(viewer);
        viewer.addEventListener("click", (e) => { if(e.target === viewer) closeViewer(); });
        viewer.querySelector(".pl-close").addEventListener("click", closeViewer);
        viewer.querySelector(".pl-prev").addEventListener("click", () => showViewer(viewerIdx - 1));
        viewer.querySelector(".pl-next").addEventListener("click", () => showViewer(viewerIdx + 1));
        document.addEventListener("keydown", (e) => {
          if(!viewer.classList.contains("open")) return;
          if(e.key === "Escape") closeViewer();
          if(e.key === "ArrowLeft") showViewer(viewerIdx - 1);
          if(e.key === "ArrowRight") showViewer(viewerIdx + 1);
        });
      }
      const active = detailRoot.querySelector("#galleryMain img.active");
      showViewer(active ? Number(active.dataset.idx) || 0 : 0);
      viewer.classList.add("open");
      document.body.classList.add("no-scroll");
    }
    function wireFullView(){
      const main = detailRoot.querySelector("#galleryMain");
      if(!main || main.querySelector(".pl-expand")) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pl-expand desk-only";
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M4 9V4H9M20 9V4H15M4 15V20H9M20 15V20H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Full view';
      main.appendChild(btn);
      main.addEventListener("click", (e) => {
        if(window.innerWidth < 960) return;
        if(e.target.closest(".gallery-count, #galleryCount")) return;
        openViewer();
      });
    }
    new MutationObserver(wireFullView).observe(detailRoot, { childList:true, subtree:true });
    wireFullView();
  }

  /* ---------- 6. Login: heading moves to the form side ---------- */
  const headline = document.getElementById("authHeadline");
  const sheet = document.querySelector(".auth-sheet");
  if(headline && sheet){
    const sub = document.getElementById("authSubline");
    const box = document.createElement("div");
    box.className = "auth-desk-title desk-only";
    sheet.insertBefore(box, sheet.firstChild);
    const sync = () => { box.innerHTML = `<div class="auth-desk-logo"><img src="images/logo-icon.png?v=2" alt="Shortlet Magnificent"><span>SHORTLET<br>MAGNIFICENT</span></div><h2>${esc(headline.textContent)}</h2><p>${esc(sub ? sub.textContent : "")}</p>`; };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(headline, { childList:true, characterData:true, subtree:true });
    if(sub) mo.observe(sub, { childList:true, characterData:true, subtree:true });
  }
})();
