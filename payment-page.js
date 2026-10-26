/* ==========================================================
   PAYMENT METHODS PAGE
   Bookings are paid by bank transfer. Shows the accounts and
   links to the guest's invoices.
========================================================== */
(function(){
  const root = document.getElementById("paymentRoot");
  if(!root) return;
  const cfg = window.SITE_CONFIG || {};
  const accts = (cfg.bankAccounts || []).map((a) => `
    <div class="account-page-card" style="margin-bottom:12px;">
      <p style="margin:0 0 4px;font-size:12px;color:#6b7383;">${a.bank}</p>
      <p style="margin:0;font-size:22px;font-weight:900;letter-spacing:1px;">${a.display || a.number}</p>
      <p style="margin:4px 0 0;font-size:13px;">${a.name}</p>
    </div>`).join("");
  root.innerHTML = `
    <p class="profile-empty" style="margin-bottom:14px;">We accept payment by bank transfer. After you request to book, your invoice and these account details are shown and emailed to you. Use the reference <b>${cfg.paymentReference || "APARTMENT BOOKING"}</b>, then send your proof of payment on WhatsApp.</p>
    ${accts}
    <a class="btn btn-gold btn-full" href="bookings.html" style="text-align:center;">View my bookings &amp; invoices</a>
    <p style="font-size:13px;margin-top:14px;"><a href="booking-policy.html">Read our booking policy</a></p>`;
})();
