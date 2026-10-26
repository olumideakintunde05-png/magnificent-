/* ==========================================================
   SITE CONFIG
   Guests pay by bank transfer. Change the account details,
   or the refundable caution fee, here and every page
   (booking form, invoice page, invoice email page) follows.
   The invoice EMAIL is built in netlify/functions/send-booking-email.js,
   so change the account details there too.
   Set cautionFee to 0 to stop charging a caution fee.
========================================================== */
window.SITE_CONFIG = {
  cautionFee: 100000,
  bankAccounts: [
    { bank: "PROVIDUS BANK", name: "THE MAGNIFICENT BROKERAGE LTD.", number: "1307866306", display: "130-786-6306" },
    { bank: "MONIEPOINT", name: "THE MAGNIFICENT BROKERAGE LTD.", number: "6329975976", display: "6329975976" }
  ],
  paymentReference: "APARTMENT BOOKING"
};
