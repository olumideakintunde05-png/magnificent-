/* ==========================================================
   PROFILE PAGE (account hub — menu-style layout)
   Every row links to its own page (bookings.html,
   payment.html, etc.), which each handle their own
   login-required state. This file only renders the
   identity card and the menu, and reflects Auth state.
========================================================== */
(function(){
  const root = document.getElementById("profileRoot");
  if(!root) return;

  const ICONS = {
    bookings: `<svg viewBox="0 0 24 24" fill="none"><rect x="6" y="4" width="12" height="16" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M9 3.5H15V5.5H9V3.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    payment: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M3 10H21" stroke="currentColor" stroke-width="1.7"/><path d="M6 15H10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    notifications: `<svg viewBox="0 0 24 24" fill="none"><path d="M6 10.5C6 7.5 8.2 5 12 5C15.8 5 18 7.5 18 10.5C18 14.5 19.5 15.5 19.5 16.5H4.5C4.5 15.5 6 14.5 6 10.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M10 19C10.3 19.9 11.1 20.5 12 20.5C12.9 20.5 13.7 19.9 14 19" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    saved: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 19.5C12 19.5 4.5 15.2 4.5 9.8C4.5 7.2 6.5 5.5 8.7 5.5C10.2 5.5 11.3 6.3 12 7.4C12.7 6.3 13.8 5.5 15.3 5.5C17.5 5.5 19.5 7.2 19.5 9.8C19.5 15.2 12 19.5 12 19.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
    help: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.7"/><path d="M9.6 9.5C9.8 8.2 10.8 7.5 12 7.5C13.3 7.5 14.4 8.3 14.4 9.5C14.4 10.9 12 11 12 13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="16.2" r="0.9" fill="currentColor"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7"/><path d="M19.4 13.5C19.5 13 19.5 12.5 19.4 12L21 10.6L19.5 8L17.5 8.6C17 8.2 16.5 7.9 16 7.6L15.6 5.5H12.4L12 7.6C11.5 7.9 11 8.2 10.5 8.6L8.5 8L7 10.6L8.6 12C8.5 12.5 8.5 13 8.6 13.5L7 15L8.5 17.6L10.5 17C11 17.4 11.5 17.7 12 17.9L12.4 20H15.6L16 17.9C16.5 17.7 17 17.4 17.5 17L19.5 17.6L21 15L19.4 13.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
    faq: `<svg viewBox="0 0 24 24" fill="none"><path d="M5 5.5H19C19.6 5.5 20 5.9 20 6.5V15.5C20 16.1 19.6 16.5 19 16.5H10L6 19.5V16.5H5C4.4 16.5 4 16.1 4 15.5V6.5C4 5.9 4.4 5.5 5 5.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9.8 9.8C9.9 8.9 10.8 8.5 12 8.5C13.1 8.5 14 9.1 14 10C14 11.1 12 11.1 12 12.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    chevron: `<svg viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };

  const MENU_ITEMS = [
    { key:"bookings",      label:"My Bookings",       icon:ICONS.bookings,      href:"bookings.html" },
    { key:"payment",       label:"Payment Methods",   icon:ICONS.payment,       href:"payment.html" },
    { key:"notifications", label:"Notifications",     icon:ICONS.notifications, href:"notifications.html" },
    { key:"saved",         label:"Saved Apartments",  icon:ICONS.saved,         href:"saved.html" },
    { key:"faq",           label:"FAQ",               icon:ICONS.faq,           href:"faq.html" },
    { key:"help",          label:"Help & Support",    icon:ICONS.help,          href:"help.html" },
    { key:"settings",      label:"Settings",          icon:ICONS.settings,      href:"settings.html" }
  ];

  function getProfile(){
    return JSON.parse(localStorage.getItem("dh_profile") || "null") || { name:"", email:"", phone:"" };
  }
  function isLoggedIn(){
    return typeof Auth !== "undefined" && !!Auth.currentUser();
  }
  function goToLogin(){
    window.location.href = "login.html?next=profile.html";
  }

  /* ---------- Shell ---------- */
  root.innerHTML = `
    <div class="profile-hub-card">
      <div class="profile-hub-header" id="profileTopCard"></div>
      <ul class="profile-menu" id="profileMenuView">
        ${MENU_ITEMS.map(item => `
          <li>
            <a href="${item.href}" class="profile-menu-item" data-key="${item.key}">
              <span class="profile-menu-icon">${item.icon}</span>
              <span>${item.label}</span>
              <span class="profile-menu-chevron">${ICONS.chevron}</span>
            </a>
          </li>
        `).join("")}
      </ul>
    </div>
    <button type="button" class="profile-logout-btn" id="profileAuthAction">Log Out</button>
  `;

  const authActionBtn = document.getElementById("profileAuthAction");

  /* ---------- Identity card + auth action button ---------- */
  function renderTopCard(){
    const loggedIn = isLoggedIn();
    const user = loggedIn ? Auth.currentUser() : null;
    // Only pull name/email from the local profile while actually logged in —
    // otherwise a stale saved profile lingers on screen after logout.
    const profile = loggedIn ? getProfile() : null;
    const displayName = (profile && profile.name) || (user && user.displayName) || "Guest User";
    const displayEmail = (profile && profile.email) || (user && user.email) || "Sign in to sync your account";
    const initials = displayName.trim().split(/\s+/).map(w => w[0]).slice(0,2).join("").toUpperCase();

    document.getElementById("profileTopCard").innerHTML = `
      <div class="profile-avatar">${initials || "GU"}</div>
      <div class="profile-name-block">
        <h2>${escHTML(displayName)}</h2>
        <p>${escHTML(displayEmail)}</p>
      </div>
    `;
    authActionBtn.textContent = loggedIn ? "Log Out" : "Log In";
    showUnreadBadge(user);
  }

  // A small red number on the Notifications row when there is something new.
  function showUnreadBadge(user){
    const row = root.querySelector('.profile-menu-item[data-key="notifications"]');
    if(!row) return;
    const old = row.querySelector(".menu-badge");
    if(old) old.remove();
    if(!user || typeof DataService === "undefined") return;
    DataService.countUnreadNotifications(user).then((n) => {
      if(!n || Auth.currentUser() !== user) return;
      const badge = document.createElement("span");
      badge.className = "menu-badge";
      badge.textContent = n > 9 ? "9+" : String(n);
      row.insertBefore(badge, row.querySelector(".profile-menu-chevron"));
    });
  }

  authActionBtn.addEventListener("click", () => {
    if(isLoggedIn()) Auth.logout();
    else goToLogin();
  });

  if(typeof Auth !== "undefined"){
    Auth.onInit(renderTopCard);
    Auth.onLogin(renderTopCard);
    Auth.onLogout(renderTopCard);
  } else {
    renderTopCard();
  }
})();
