/* ==========================================================
   SITE CONFIG
   The Paystack key below is a placeholder token. On Netlify,
   set an environment variable named PAYSTACK_PUBLIC_KEY in
   Site settings → Environment variables, and the build command
   in netlify.toml will swap it in automatically at deploy time.
   Locally (or if the env var isn't set), Paystack checkout will
   show a friendly "not configured yet" message instead of
   failing silently.
========================================================== */
window.SITE_CONFIG = {
  paystackPublicKey: "__PAYSTACK_PUBLIC_KEY__"
};
