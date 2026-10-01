/* ==========================================================
   LOGIN / SIGN UP PAGE LOGIC
========================================================== */
(function(){
  const params = new URLSearchParams(window.location.search);
  // Only ever send people to a page on this same site (e.g. "bookings.html" or
  // "property.html?id=shortlet-001"). Anything else — another website, or a
  // "javascript:" link — is ignored, so a crafted login link can't hijack a session.
  function safeNextPage(value){
    const v = String(value || "");
    return /^[A-Za-z0-9_-]+\.html([?#].*)?$/.test(v) ? v : "profile.html";
  }
  const nextPage = safeNextPage(params.get("next"));

  const els = {
    close: document.getElementById("authClose"),
    guestLink: document.getElementById("guestLink"),
    headline: document.getElementById("authHeadline"),
    subline: document.getElementById("authSubline"),
    tabLogin: document.getElementById("tabLogin"),
    tabSignup: document.getElementById("tabSignup"),
    loginPanel: document.getElementById("loginPanel"),
    signupPanel: document.getElementById("signupPanel"),
    switchLine: document.getElementById("authSwitchLine"),
    switchToSignup: document.getElementById("switchToSignup"),
    loginError: document.getElementById("loginError"),
    loginNote: document.getElementById("loginNote"),
    signupError: document.getElementById("signupError"),
    signupNote: document.getElementById("signupNote"),
    loginSubmit: document.getElementById("loginSubmit"),
    signupSubmit: document.getElementById("signupSubmit"),
    forgotLink: document.getElementById("forgotLink"),
  };

  // Close / guest link both return to wherever the person came from
  els.close.addEventListener("click", () => { window.location.href = nextPage; });
  els.guestLink.setAttribute("href", nextPage);

  /* ---------- Tabs ---------- */
  function showLogin(){
    els.tabLogin.classList.add("active"); els.tabLogin.setAttribute("aria-selected","true");
    els.tabSignup.classList.remove("active"); els.tabSignup.setAttribute("aria-selected","false");
    els.loginPanel.classList.add("active");
    els.signupPanel.classList.remove("active");
    els.headline.textContent = "Welcome back";
    els.subline.textContent = "Sign in to manage your saved stays and bookings.";
    els.switchLine.innerHTML = 'New to Shortlet Magnificent? <button type="button" id="switchToSignup">Create an account</button>';
    els.switchLine.querySelector("#switchToSignup").addEventListener("click", showSignup);
  }
  function showSignup(){
    els.tabSignup.classList.add("active"); els.tabSignup.setAttribute("aria-selected","true");
    els.tabLogin.classList.remove("active"); els.tabLogin.setAttribute("aria-selected","false");
    els.signupPanel.classList.add("active");
    els.loginPanel.classList.remove("active");
    els.headline.textContent = "Create your account";
    els.subline.textContent = "Join to save stays and track your bookings in one place.";
    els.switchLine.innerHTML = 'Already have an account? <button type="button" id="switchToLogin">Log In</button>';
    els.switchLine.querySelector("#switchToLogin").addEventListener("click", showLogin);
  }
  els.tabLogin.addEventListener("click", showLogin);
  els.tabSignup.addEventListener("click", showSignup);
  els.switchToSignup.addEventListener("click", showSignup);

  /* ---------- Password visibility ---------- */
  document.querySelectorAll(".auth-toggle-pw").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    });
  });

  /* ---------- Helpers ---------- */
  function setError(el, message){
    if(!message){ el.classList.remove("show"); el.textContent = ""; return; }
    el.textContent = message;
    el.classList.add("show");
  }
  function setLoading(btn, isLoading){
    btn.classList.toggle("loading", isLoading);
    btn.disabled = isLoading;
  }
  function friendlyError(err){
    const code = (err && err.code) || "";
    const msg = (err && err.message) || "";
    if(code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found"){
      return "That email or password doesn't look right. Please try again.";
    }
    if(code === "auth/email-already-in-use"){
      return "An account with this email already exists — try logging in instead.";
    }
    if(code === "auth/weak-password"){
      return "Please choose a password with at least 8 characters.";
    }
    if(code === "auth/invalid-email"){
      return "That doesn't look like a valid email address.";
    }
    if(code === "auth/network-request-failed"){
      return "Network error — check your connection and try again.";
    }
    if(code === "auth/too-many-requests"){
      return "Too many attempts. Please wait a moment and try again.";
    }
    return msg || "Something went wrong. Please try again.";
  }

  /* ---------- Auth actions (Firebase) ---------- */
  function finishAuth(){
    window.location.href = nextPage;
  }

  els.loginPanel.addEventListener("submit", (e) => {
    e.preventDefault();
    setError(els.loginError, "");
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    setLoading(els.loginSubmit, true);

    Auth.login(email, password)
      .then(() => { setLoading(els.loginSubmit, false); finishAuth(); })
      .catch((err) => { setLoading(els.loginSubmit, false); setError(els.loginError, friendlyError(err)); });
  });

  els.signupPanel.addEventListener("submit", (e) => {
    e.preventDefault();
    setError(els.signupError, "");
    setError(els.signupNote, "");
    els.signupNote.classList.remove("show");
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    if(password.length < 8){
      setError(els.signupError, "Please choose a password with at least 8 characters.");
      return;
    }
    setLoading(els.signupSubmit, true);

    Auth.signup(email, password, name)
      .then(() => { setLoading(els.signupSubmit, false); finishAuth(); })
      .catch((err) => { setLoading(els.signupSubmit, false); setError(els.signupError, friendlyError(err)); });
  });

  els.forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    setError(els.loginError, "");
    setError(els.loginNote, "");
    const email = document.getElementById("loginEmail").value.trim();
    if(!email){ setError(els.loginError, "Enter your email above first, then tap \u201cForgot password\u201d."); return; }
    Auth.sendPasswordReset(email)
      .then(() => { els.loginNote.textContent = "Reset link sent — check your email."; els.loginNote.classList.add("show"); })
      .catch((err) => setError(els.loginError, friendlyError(err)));
  });

  // If already logged in, skip straight through
  Auth.onInit((user) => { if(user) finishAuth(); });
})();
