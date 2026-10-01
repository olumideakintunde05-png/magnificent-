/* ==========================================================
   FIREBASE AUTH — replaces Netlify Identity
   Loaded as plain classic scripts (no build step), so this
   file must come AFTER the firebase-app-compat.js and
   firebase-auth-compat.js <script> tags, and BEFORE any
   script that uses window.Auth (login.js, profile-page.js,
   script.js).
========================================================== */
(function(){
  const firebaseConfig = {
    apiKey: "AIzaSyAEND_ol4-zj_RsD56r0giYCrkHs-AyZ7A",
    authDomain: "magnificent-shortlet.firebaseapp.com",
    projectId: "magnificent-shortlet",
    storageBucket: "magnificent-shortlet.firebasestorage.app",
    messagingSenderId: "287881648023",
    appId: "1:287881648023:web:23f2c23c1fac84e54b16d2"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore ? firebase.firestore() : null;
  window.db = db;

  // Owner account(s): always treated as admin, even before the Firestore
  // "admins" collection has any documents. Other admins are managed from
  // Admin -> Settings and live in Firestore (admins/<email>).
  const OWNER_EMAILS = [
    "magnificenthomes4u@gmail.com"
  ];
  window.ADMIN_EMAILS = OWNER_EMAILS;

  // Keeps a users/<uid> document in Firestore for every guest so the admin
  // panel can list them (the browser SDK can't list Firebase Auth users).
  function syncUserRecord(user, extra){
    if(!db || !user) return Promise.resolve();
    const flag = "userSynced:" + user.uid;
    try{
      if(!extra && sessionStorage.getItem(flag)) return Promise.resolve();
    }catch(e){ /* storage blocked — just sync every time */ }
    const meta = user.metadata || {};
    const data = Object.assign({
      uid: user.uid,
      email: (user.email || "").toLowerCase(),
      createdAt: meta.creationTime ? new Date(meta.creationTime).toISOString() : new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    }, extra || {});
    if(user.displayName && !data.name) data.name = user.displayName;
    return db.collection("users").doc(user.uid).set(data, { merge: true }).then(() => {
      // Only remember it worked; a failed write is retried on the next page load.
      try{ sessionStorage.setItem(flag, "1"); }catch(e){}
    }).catch((err) => {
      console.warn("Couldn't update user record:", err.message);
    });
  }

  // Everything the site keeps on this device about a guest (profile, their
  // bookings, saved stays) belongs to whoever is signed in. When someone logs
  // out, or a different person logs in on the same phone, it is wiped so the
  // next person never sees it.
  function wipeLocalGuestData(){
    try{
      localStorage.removeItem("dh_profile");
      localStorage.removeItem("dh_enquiries");
      sessionStorage.removeItem("dh_favorites");
    }catch(e){}
  }
  function guardLocalGuestData(user){
    try{
      const owner = localStorage.getItem("dh_owner");
      if(user){
        if(owner && owner !== user.uid) wipeLocalGuestData();
        localStorage.setItem("dh_owner", user.uid);
      } else if(owner){
        wipeLocalGuestData();
        localStorage.removeItem("dh_owner");
      }
    }catch(e){ /* storage blocked — nothing is being kept anyway */ }
  }

  let hasInitialized = false;
  let currentUser = null;
  const initCallbacks = [];
  const loginCallbacks = [];
  const logoutCallbacks = [];

  auth.onAuthStateChanged((user) => {
    const wasLoggedIn = !!currentUser;
    currentUser = user;
    guardLocalGuestData(user);
    if(user) syncUserRecord(user);

    if(!hasInitialized){
      hasInitialized = true;
      initCallbacks.forEach(cb => cb(user));
      return;
    }
    if(user && !wasLoggedIn) loginCallbacks.forEach(cb => cb(user));
    if(!user && wasLoggedIn) logoutCallbacks.forEach(cb => cb());
  });

  window.Auth = {
    // Fires once, as soon as Firebase reports the starting auth state
    // (mirrors netlifyIdentity's "init" event).
    onInit(cb){ hasInitialized ? cb(currentUser) : initCallbacks.push(cb); },
    onLogin(cb){ loginCallbacks.push(cb); },
    onLogout(cb){ logoutCallbacks.push(cb); },
    currentUser(){ return currentUser; },

    login(email, password){
      return auth.signInWithEmailAndPassword(email, password);
    },
    signup(email, password, fullName){
      return auth.createUserWithEmailAndPassword(email, password).then((cred) => {
        const done = fullName
          ? cred.user.updateProfile({ displayName: fullName }).then(() => cred.user)
          : Promise.resolve(cred.user);
        return done.then((user) => syncUserRecord(user, fullName ? { name: fullName } : null).then(() => user));
      });
    },
    logout(){ return auth.signOut(); },

    // Resolves true if this user may use the admin panel: either an owner
    // email above, or an email listed in the Firestore "admins" collection.
    isAdmin(user){
      user = user || currentUser;
      if(!user || !user.email) return Promise.resolve(false);
      const email = user.email.toLowerCase();
      if(OWNER_EMAILS.includes(email)) return Promise.resolve(true);
      if(!db) return Promise.resolve(false);
      return db.collection("admins").doc(email).get()
        .then((snap) => snap.exists)
        .catch(() => false);
    },
    sendPasswordReset(email){ return auth.sendPasswordResetEmail(email); }
  };
})();
