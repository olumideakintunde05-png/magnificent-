/* ==========================================================
   Netlify Function: send-booking-email
   Emails the admin whenever a booking comes in.

   Runs on Netlify's server, so the Resend key stays secret.
   Set these in Netlify -> Site configuration -> Environment variables:
     RESEND_API_KEY        (required) your Resend key
     BOOKING_NOTIFY_EMAIL  (optional) where alerts go; separate several with commas
     RESEND_FROM           (optional) default: Shortlet Magnificent <bookings@shortletmagnificent.com>

   Two kinds of email (the "kind" field of the request):
     "invoice"  the invoice with both bank accounts, sent to the guest as soon as
                they get their payment page. Nothing reaches the admin yet.
     "booking"  (default) the alert to the admin, sent only when the guest taps
                "I've sent the payment".
========================================================== */
"use strict";

const SITE = "https://shortletmagnificent.com";
const DEFAULT_TO = "Magnificenthomes4u@gmail.com";
const DEFAULT_FROM = "Shortlet Magnificent <bookings@shortletmagnificent.com>";

// Bank accounts shown on the invoice (keep in sync with config.js on the site).
const ACCOUNTS = [
  { bank: "PROVIDUS BANK", name: "THE MAGNIFICENT BROKERAGE LTD.", number: "130-786-6306" },
  { bank: "MONIEPOINT", name: "THE MAGNIFICENT BROKERAGE LTD.", number: "6329975976" }
];
const PAY_REFERENCE = "APARTMENT BOOKING";
const WHATSAPP_DISPLAY = "081-4223-0897";
const WHATSAPP_LINK = "https://wa.me/2348142230897";

// Best-effort limits (each server instance keeps its own memory)
const seen = new Map();   // booking id -> time
const hits = new Map();   // ip -> [times]
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body)
});

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const num = (v, min, max) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
};
const day = (v) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "");
const naira = (n) => "\u20A6" + Number(n || 0).toLocaleString("en-NG");

function originAllowed(event) {
  const origin = (event.headers.origin || event.headers.Origin || "").toLowerCase();
  const referer = (event.headers.referer || event.headers.Referer || "").toLowerCase();
  const test = origin || referer;
  if (!test) return false;
  let host = "";
  try { host = new URL(test).hostname; } catch (e) { return false; }
  return host === "shortletmagnificent.com" || host === "www.shortletmagnificent.com" || host.endsWith(".netlify.app");
}

function tooMany(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) { hits.set(ip, list); return true; }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 500) hits.clear();
  return false;
}

function cleanBooking(b) {
  const out = {
    id: str(b.id, 60),
    orderNo: str(b.orderNo, 30),
    property: str(b.property, 150),
    propertyLocation: str(b.propertyLocation, 120),
    name: str(b.name, 100),
    phone: str(b.phone, 40),
    checkin: day(b.checkin),
    checkout: day(b.checkout),
    nights: num(b.nights, 0, 365),
    guests: num(b.guests, 1, 50),
    total: num(b.total, 0, 100000000),
    discount: num(b.discount, 0, 100000000) || 0,
    promo: str(b.promo, 40),
    paymentMethod: "Transfer",
    reference: str(b.reference, 80),
    submittedAt: str(b.submittedAt, 40),
    email: /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(str(b.email, 254)) ? str(b.email, 254) : "",
    unitPrice: num(b.unitPrice, 0, 100000000) || 0,
    serviceFee: num(b.serviceFee, 0, 100000000) || 0,
    caution: num(b.caution, 0, 100000000) || 0
  };
  if (!out.property || !out.name || !out.phone) return null;
  return out;
}

function lagosTime(iso) {
  const d = iso ? new Date(iso) : new Date();
  const t = isNaN(d) ? new Date() : d;
  try {
    return new Intl.DateTimeFormat("en-NG", { timeZone: "Africa/Lagos", dateStyle: "medium", timeStyle: "short" }).format(t);
  } catch (e) { return t.toISOString(); }
}

function whatsappLink(phone) {
  let d = String(phone).replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("0")) d = "234" + d.slice(1);
  return d ? "https://wa.me/" + d : "";
}

function buildEmail(b, isTest) {
  const paid = false;
  const status = "Guest says the payment has been sent: confirm it in your bank app";
  const dates = b.checkin && b.checkout
    ? `${b.checkin} to ${b.checkout}${b.nights ? ` (${b.nights} night${b.nights > 1 ? "s" : ""})` : ""}`
    : "Not given";
  const rows = [
    ["Apartment", b.property + (b.propertyLocation ? `, ${b.propertyLocation}` : "")],
    ["Guest", b.name],
    ["Phone", b.phone],
    ...(b.email ? [["Email", b.email]] : []),
    ["Dates", dates],
    ["Guests", b.guests != null ? String(b.guests) : "Not given"],
    ["Total", b.total != null ? naira(b.total) : "Not given"],
    ...(b.promo ? [["Promo code", `${b.promo}${b.discount ? ` (-${naira(b.discount)})` : ""}`]] : []),
    ["Payment", status],
    ...(b.orderNo ? [["Order number", b.orderNo]] : []),
    ["Received", lagosTime(b.submittedAt) + " (Lagos time)"]
  ];

  const subject = isTest
    ? "Test: your booking alerts are working"
    : `Payment reported: ${b.property} - ${b.name} (payment sent)`;

  const wa = whatsappLink(b.phone);
  const html = `<!doctype html><html><body style="margin:0;background:#f7f5f0;font-family:Arial,Helvetica,sans-serif;color:#0f172b;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px;">
  <div style="background:#0f172b;color:#fff;padding:20px 24px;border-radius:14px 14px 0 0;">
    <div style="font-size:12px;letter-spacing:2px;color:#f0c48d;">SHORTLET MAGNIFICENT</div>
    <div style="font-size:22px;font-weight:bold;margin-top:6px;">${isTest ? "Test email" : "Payment reported"}</div>
  </div>
  <div style="background:#fff;padding:8px 24px 24px;border-radius:0 0 14px 14px;border:1px solid #e8e2d4;border-top:none;">
    ${isTest ? `<p style="font-size:14px;line-height:1.6;">This is a test. If you can read this, booking alerts are set up correctly. This is what a real alert looks like:</p>` : ""}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:15px;">
      ${rows.map(([k, v]) => `<tr><td style="padding:10px 0;border-bottom:1px solid #eee8da;color:#6b7383;width:38%;vertical-align:top;">${esc(k)}</td><td style="padding:10px 0;border-bottom:1px solid #eee8da;font-weight:bold;">${esc(v)}</td></tr>`).join("")}
    </table>
    <div style="margin-top:22px;">
      ${wa ? `<a href="${esc(wa)}" style="display:inline-block;background:#25d366;color:#fff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:10px;margin:0 8px 8px 0;">Message guest on WhatsApp</a>` : ""}
      <a href="${SITE}/admin.html" style="display:inline-block;background:#0f172b;color:#f0c48d;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:10px;margin:0 0 8px 0;">Open admin</a>
    </div>
    <p style="font-size:12.5px;color:#6b7383;line-height:1.6;margin:14px 0 0;">The guest tapped "I\'ve sent the payment". Check the transfer in your bank app, then mark the booking Confirmed in the admin panel. Any proof of payment they upload appears next to the booking.</p>
  </div>
</div></body></html>`;

  const text = [isTest ? "TEST EMAIL - booking alerts are working." : "NEW BOOKING RECEIVED", ""]
    .concat(rows.map(([k, v]) => `${k}: ${v}`))
    .concat(["", wa ? `WhatsApp the guest: ${wa}` : "", `Admin: ${SITE}/admin.html`])
    .filter((x, i, a) => !(x === "" && a[i - 1] === ""))
    .join("\n");

  return { subject, html, text };
}


function invoiceNo(b) {
  const m = String(b.orderNo || "").match(/(\d+)\s*$/);
  return m ? m[1].padStart(4, "0") : "";
}

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
function longDay(iso) {
  const d = new Date(iso + "T12:00:00Z");
  if (isNaN(d)) return iso;
  return ordinal(d.getUTCDate()) + " " + d.toLocaleDateString("en-GB", { month: "long", timeZone: "UTC" }) + ", " + d.getUTCFullYear();
}
function lagosShort(iso) {
  const d = iso ? new Date(iso) : new Date();
  const t = isNaN(d) ? new Date() : d;
  try { return new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", day: "2-digit", month: "2-digit", year: "numeric" }).format(t); }
  catch (e) { return t.toISOString().slice(0, 10); }
}


function buildInvoiceEmail(b) {
  const no = invoiceNo(b);
  const subtotal = b.unitPrice && b.nights ? b.unitPrice * b.nights : Math.max(0, (b.total || 0) - b.caution - b.serviceFee) + (b.discount || 0);
  const unit = b.unitPrice || (b.nights ? Math.round(subtotal / b.nights) : subtotal);
  const stay = b.checkin && b.checkout ? `from 2pm on the ${longDay(b.checkin)} to 12pm on the ${longDay(b.checkout)}.` : "";
  const issued = lagosShort(b.submittedAt);
  const td = "padding:10px 6px;border-bottom:1px solid #eee8da;font-size:14px;vertical-align:top;";

  const html = `<!doctype html><html><body style="margin:0;background:#f7f5f0;font-family:Arial,Helvetica,sans-serif;color:#0f172b;">
<div style="max-width:620px;margin:0 auto;padding:20px 12px;">
  <div style="background:#0f172b;color:#fff;padding:20px 24px;border-radius:14px 14px 0 0;">
    <table role="presentation" width="100%"><tr>
      <td style="font-family:Georgia,serif;letter-spacing:2px;font-weight:bold;font-size:16px;line-height:1.3;">SHORTLET<br>MAGNIFICENT<div style="font-family:Arial,sans-serif;font-weight:normal;letter-spacing:0;font-size:11px;color:#f0c48d;margin-top:4px;">A brand of The Magnificent Brokerage Ltd.</div></td>
      <td align="right" style="font-weight:bold;font-size:28px;letter-spacing:3px;">INVOICE${no ? `<div style="font-size:12px;letter-spacing:1px;color:#f0c48d;margin-top:4px;">${esc(no)}</div>` : ""}</td>
    </tr></table>
  </div>
  <div style="background:#fff;padding:20px 24px 24px;border:1px solid #e8e2d4;border-top:none;border-radius:0 0 14px 14px;">
    <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Hello ${esc(b.name)}, thank you for choosing Shortlet Magnificent. Here is your invoice. Your reservation is <b>not confirmed until payment is received</b> and we confirm the booking in writing.</p>

    <table role="presentation" width="100%" style="font-size:13.5px;margin-bottom:18px;">
      <tr><td style="color:#6b7383;padding:3px 0;width:38%;">Client</td><td><b>${esc(b.name)}</b></td></tr>
      <tr><td style="color:#6b7383;padding:3px 0;">Phone / WhatsApp</td><td><b>${esc(b.phone)}</b></td></tr>
      <tr><td style="color:#6b7383;padding:3px 0;">Email</td><td><b>${esc(b.email)}</b></td></tr>
      <tr><td style="color:#6b7383;padding:3px 0;">Issued / due date</td><td><b>${esc(issued)}</b></td></tr>
      ${b.guests ? `<tr><td style="color:#6b7383;padding:3px 0;">Number of guests</td><td><b>${esc(b.guests)}</b></td></tr>` : ""}
    </table>

    <div style="border:1px solid #d9a8a8;background:#fdf8f3;border-radius:14px;padding:12px 14px;margin-bottom:18px;font-size:12px;line-height:1.6;font-style:italic;">
      <div style="font-style:normal;font-weight:bold;letter-spacing:2px;color:#8c1c1c;font-size:10.5px;margin-bottom:6px;">OUR SERVICE TO YOU</div>
      We are your booking agency and trusted link to shortlet apartments in Lagos. We facilitate reservations in carefully selected and inspected apartments that are independently owned or operated by property owners and operators. We do not own or directly operate the apartments we list. On-site facilities, maintenance, cleaning and building management are handled by the relevant property or facility management team, but you are never left without support: we stay available to assist with communication, coordination, follow-up and escalation.
    </div>

    <div style="font-weight:bold;letter-spacing:2px;color:#9a7544;font-size:11px;margin-bottom:6px;">YOUR BOOKING</div>
    <table role="presentation" width="100%" cellspacing="0" style="border-collapse:collapse;">
      <tr style="background:#fbf8f2;font-size:11.5px;color:#6b7383;"><td style="padding:8px 6px;"></td><td align="right" style="padding:8px 6px;">Nights</td><td align="right" style="padding:8px 6px;">Unit price</td><td align="right" style="padding:8px 6px;">Total</td></tr>
      <tr><td style="${td}font-weight:bold;">${esc(b.property)}${b.propertyLocation ? ", " + esc(b.propertyLocation) : ""}${b.guests ? ` (${esc(b.guests)} guest${b.guests > 1 ? "s" : ""})` : ""}<div style="font-weight:normal;font-size:12px;color:#4a5367;margin-top:3px;">${esc(stay)}</div></td>
        <td align="right" style="${td}">${esc(b.nights == null ? "" : b.nights)}</td><td align="right" style="${td}">${naira(unit)}</td><td align="right" style="${td}">${naira(subtotal)}</td></tr>
      ${b.discount ? `<tr><td colspan="3" style="${td}font-style:italic;">Promo ${esc(b.promo)}</td><td align="right" style="${td}">-${naira(b.discount)}</td></tr>` : ""}
      ${b.serviceFee ? `<tr><td colspan="3" style="${td}font-style:italic;">Service fee</td><td align="right" style="${td}">${naira(b.serviceFee)}</td></tr>` : ""}
      ${b.caution ? `<tr><td colspan="3" style="${td}font-style:italic;">Refundable caution fee</td><td align="right" style="${td}">${naira(b.caution)}</td></tr>` : ""}
    </table>
    <table role="presentation" width="100%" style="background:#f5ede3;margin:10px 0 20px;border-radius:8px;"><tr>
      <td style="padding:14px;font-weight:bold;letter-spacing:2px;font-size:12px;">TOTAL AMOUNT PAYABLE</td>
      <td align="right" style="padding:14px;font-family:Georgia,serif;font-weight:bold;font-size:22px;color:#8c1c1c;">${naira(b.total)}</td>
    </tr></table>

    <div style="background:#f5ede3;border-radius:10px;padding:14px 16px;margin-bottom:18px;">
      <div style="font-weight:bold;letter-spacing:2px;color:#9a7544;font-size:11px;margin-bottom:8px;">PAYMENT DETAILS (PAY INTO EITHER ACCOUNT)</div>
      ${ACCOUNTS.map((a) => `<div style="background:#fff;border:1px solid #e8dcc8;border-radius:8px;padding:10px 12px;margin-bottom:8px;font-size:13px;line-height:1.7;">
        <span style="color:#6b7383;">Bank:</span> <b>${esc(a.bank)}</b><br>
        <span style="color:#6b7383;">Account name:</span> <b>${esc(a.name)}</b><br>
        <span style="color:#6b7383;">Account number:</span> <b style="font-size:20px;letter-spacing:1px;">${esc(a.number)}</b><br>
        <span style="color:#6b7383;">Reference:</span> <b>${esc(PAY_REFERENCE)}</b></div>`).join("")}
      <div style="font-size:12px;font-style:italic;text-align:center;">Please send your proof of payment to our WhatsApp on <b>${WHATSAPP_DISPLAY}</b> so we can confirm your reservation promptly.</div>
    </div>

    <p style="font-size:13.5px;line-height:1.6;border-left:3px solid #d9a868;padding-left:12px;margin:0 0 16px;">Before you pay, please read <a href="${SITE}/booking-policy.html#before-you-pay" style="color:#9a6b2f;font-weight:bold;">Before you pay</a> and our <a href="${SITE}/booking-policy.html" style="color:#9a6b2f;font-weight:bold;">booking terms</a> (cancellation policy, caution deposit and house rules). By proceeding with payment, the guest confirms that they have reviewed and accepted the apartment details, booking dates, guest information, total amount payable and the booking terms.</p>
    <p style="font-size:13.5px;line-height:1.6;margin:0 0 6px;">After paying, tap <b>I\'ve sent the payment</b> on your payment page (you can add a screenshot there), or send your proof to us on WhatsApp.</p>
    <p style="margin:12px 0 0;"><a href="${WHATSAPP_LINK}?text=${encodeURIComponent("Hello, I have made payment for invoice" + (no ? " " + no : "") + " (" + naira(b.total) + "). Here is my proof of payment.")}" style="display:inline-block;background:#25d366;color:#fff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:10px;">Send proof on WhatsApp</a></p>
  </div>
  <div style="text-align:center;font-size:11.5px;color:#6b7383;padding:14px 8px;line-height:1.6;">The Magnificent Brokerage Ltd. (trading as Shortlet Magnificent)<br>08142230897 &middot; Magnificenthomes4u@gmail.com &middot; shortletmagnificent.com &middot; Lagos, Nigeria</div>
</div></body></html>`;

  const lines = [
    "INVOICE" + (no ? " " + no : "") + " - Shortlet Magnificent", "",
    `Client: ${b.name}`, `Phone: ${b.phone}`, `Issued/due: ${issued}`, "",
    `${b.property}${b.propertyLocation ? ", " + b.propertyLocation : ""}`,
    stay,
    `${b.nights} night(s) x ${naira(unit)} = ${naira(subtotal)}`,
    b.discount ? `Promo ${b.promo}: -${naira(b.discount)}` : "",
    b.serviceFee ? `Service fee: ${naira(b.serviceFee)}` : "",
    b.caution ? `Refundable caution fee: ${naira(b.caution)}` : "",
    `TOTAL AMOUNT PAYABLE: ${naira(b.total)}`, "",
    "PAY INTO EITHER ACCOUNT (reference: " + PAY_REFERENCE + ")"
  ].concat(ACCOUNTS.map((a) => `${a.bank} | ${a.name} | ${a.number}`))
   .concat(["", `Before you pay, please read: ${SITE}/booking-policy.html#before-you-pay`, `Full booking terms: ${SITE}/booking-policy.html`, "",
     `After paying, tap "I've sent the payment" on your payment page (you can add a screenshot there), or send your proof on WhatsApp: ${WHATSAPP_DISPLAY}`,
     "Your reservation is confirmed once payment is received and we confirm the booking in writing."])
   .filter((x, i, a) => x !== "" || a[i - 1] !== "").join("\n");

  return { subject: `Your invoice${no ? " " + no : ""} from Shortlet Magnificent: ${naira(b.total)}`, html, text: lines };
}

async function sendMail(key, payload, idemKey) {
  const headers = { Authorization: "Bearer " + key, "Content-Type": "application/json" };
  if (idemKey) headers["Idempotency-Key"] = idemKey;
  return fetch("https://api.resend.com/emails", { method: "POST", headers, body: JSON.stringify(payload) });
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: { Allow: "POST, OPTIONS" }, body: "" };
  if (event.httpMethod !== "POST") return json(405, { ok: false, error: "Use POST." });
  if (!originAllowed(event)) return json(403, { ok: false, error: "Not allowed." });
  if ((event.body || "").length > 10000) return json(413, { ok: false, error: "Too large." });

  const ip = (event.headers["x-nf-client-connection-ip"] || (event.headers["x-forwarded-for"] || "").split(",")[0] || "unknown").trim();
  if (tooMany(ip)) return json(429, { ok: false, error: "Too many requests. Try again later." });

  let payload;
  try { payload = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { ok: false, error: "Bad request." }); }

  const isTest = payload && payload.test === true;
  const kind = payload && payload.kind === "invoice" ? "invoice" : "booking";
  let booking;
  if (isTest) {
    booking = {
      id: "", orderNo: "TEST-0001", property: "Minimalist 2-Bedroom Condo", propertyLocation: "Ikate, Lekki",
      name: "Test Guest", phone: "08012345678", checkin: "2026-12-20", checkout: "2026-12-23", nights: 3,
      guests: 2, total: 360000, discount: 0, promo: "", paymentMethod: "Transfer", reference: "", submittedAt: new Date().toISOString()
    };
  } else {
    booking = cleanBooking(payload || {});
    if (!booking) return json(400, { ok: false, error: "Missing booking details." });
    if (kind === "invoice" && !booking.email) return json(400, { ok: false, error: "No email address." });
    if (booking.id) {
      const k = kind + ":" + booking.id;
      if (seen.has(k)) return json(200, { ok: true, duplicate: true });
      seen.set(k, Date.now());
      if (seen.size > 500) seen.clear();
    }
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("send-booking-email: RESEND_API_KEY is not set in Netlify.");
    return json(500, { ok: false, error: "Email isn't set up yet: the Resend key is missing in Netlify." });
  }

  const to = (process.env.BOOKING_NOTIFY_EMAIL || DEFAULT_TO).split(",").map((s) => s.trim()).filter(Boolean);
  const from = process.env.RESEND_FROM || DEFAULT_FROM;
  const seenKey = kind + ":" + booking.id;
  const forget = () => { if (booking.id) seen.delete(seenKey); };

  try {
    let msg;
    if (kind === "invoice") {
      const inv = buildInvoiceEmail(booking);
      msg = { from, to: [booking.email], reply_to: DEFAULT_TO, subject: inv.subject, html: inv.html, text: inv.text };
    } else {
      const mail = buildEmail(booking, isTest);
      msg = { from, to, subject: mail.subject, html: mail.html, text: mail.text };
    }
    const res = await sendMail(key, msg, booking.id ? kind + "-" + booking.id : "");
    if (!res.ok) {
      let detail = "";
      try { detail = (await res.text()).slice(0, 300); } catch (e) {}
      console.error("send-booking-email: Resend answered " + res.status + " " + detail);
      forget();
      return json(502, { ok: false, error: res.status === 401 || res.status === 403 ? "Resend refused the key. Check RESEND_API_KEY in Netlify." : "The email service couldn't send it." });
    }
    return json(200, { ok: true });
  } catch (err) {
    console.error("send-booking-email: " + err.message);
    forget();
    return json(502, { ok: false, error: "Couldn't reach the email service." });
  }
};

// exported for tests
exports._internals = { cleanBooking, buildEmail, buildInvoiceEmail, esc };
