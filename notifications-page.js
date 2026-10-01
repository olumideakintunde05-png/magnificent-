/* ==========================================================
   NOTIFICATIONS PAGE (requires login)
   Shows what the admin sent to everyone plus anything sent to
   this guest only. Firestore rules make sure a guest can never
   read another guest's messages.
========================================================== */
(function(){
  const root = document.getElementById("notificationsRoot");
  if(!root) return;

  function loginRequiredHTML(){
    return `
      <div class="account-page-card account-login-required">
        <p>Log in to see updates about your bookings and account.</p>
        <button type="button" class="btn btn-gold" id="goLoginBtn">Log In / Sign Up</button>
      </div>
    `;
  }

  function formatWhen(iso){
    const d = new Date(iso);
    if(isNaN(d)) return "";
    return d.toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }) + " · " +
      d.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" });
  }

  function listHTML(items, seenAt){
    return `<div class="enquiry-list">` + items.map((n) => {
      const isNew = String(n.createdAt || "") > String(seenAt || "");
      return `
        <article class="enquiry-card${isNew ? " notif-unread" : ""}">
          <div class="enquiry-card-top">
            <h3>${escHTML(n.title || "Update")}</h3>
            ${isNew ? `<span class="enquiry-status">New</span>` : ""}
          </div>
          <p class="notif-message">${escHTML(n.message || "")}</p>
          <p class="enquiry-meta">${escHTML(formatWhen(n.createdAt))}</p>
        </article>`;
    }).join("") + `</div>`;
  }

  function render(){
    const user = (typeof Auth !== "undefined") ? Auth.currentUser() : null;
    if(!user){
      root.innerHTML = loginRequiredHTML();
      document.getElementById("goLoginBtn").addEventListener("click", () => {
        window.location.href = "login.html?next=notifications.html";
      });
      return;
    }
    
    // Show skeleton loading state
    root.innerHTML = `
      <div style="padding: 20px;">
        ${SkeletonLoader.createReviewSkeleton()}
        ${SkeletonLoader.createReviewSkeleton()}
      </div>
    `;
    
    Promise.all([DataService.listMyNotifications(user.uid), DataService.getNotifSeenAt(user)])
      .then(([items, seenAt]) => {
        if (!items || items.length === 0) {
          root.innerHTML = `<p class="profile-empty">You're all caught up — no notifications yet.</p>`;
        } else {
          root.innerHTML = listHTML(items, seenAt);
        }
        // Everything shown counts as read from now on (the "New" tags above stay for this visit).
        DataService.markNotificationsSeen(user).catch((error) => {
          console.error('Error marking notifications as seen:', error);
        });
      })
      .catch((error) => {
        console.error('Error loading notifications:', error);
        ErrorHandler.handleNetworkError(error, 'Loading notifications');
        root.innerHTML = `<p class="profile-empty">Couldn't load your notifications. Please try again later.</p>`;
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
