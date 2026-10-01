/* ==========================================================
   SETTINGS PAGE
========================================================== */
(function(){
  const root = document.getElementById("settingsRoot");
  if(!root) return;

  function getProfile(){
    return JSON.parse(localStorage.getItem("dh_profile") || "null") || { name:"", email:"", phone:"" };
  }

  function render(){
    const profile = getProfile();
    root.innerHTML = `
      <form id="profileForm" class="profile-form">
        <label>Full Name
          <input type="text" name="name" placeholder="e.g. Chioma Eze" value="${escHTML(profile.name || "")}">
        </label>
        <label>Email
          <input type="email" name="email" placeholder="you@example.com" value="${escHTML(profile.email || "")}">
        </label>
        <label>Phone Number
          <input type="tel" name="phone" placeholder="e.g. 080 000 00000" value="${escHTML(profile.phone || "")}">
        </label>
        <label class="desk-only">Location
          <input type="text" name="location" placeholder="e.g. Lagos, Nigeria" value="${escHTML(profile.location || "")}">
        </label>
        <button type="submit" class="btn btn-gold btn-full">Save Changes</button>
      </form>
      <button type="button" class="profile-reset" id="resetLocalData">Clear local data</button>
    `;

    document.getElementById("profileForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const updated = { name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone"), location: fd.get("location") || "" };
      localStorage.setItem("dh_profile", JSON.stringify(updated));
      showToast("Profile updated");
    });
    document.getElementById("resetLocalData").addEventListener("click", () => {
      if(!confirm("Clear saved profile, saved stays and bookings from this device?")) return;
      localStorage.removeItem("dh_profile");
      localStorage.removeItem("dh_enquiries");
      sessionStorage.removeItem("dh_favorites");
      window.location.reload();
    });
  }

  render();
})();
