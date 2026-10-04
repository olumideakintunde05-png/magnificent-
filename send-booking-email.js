/* ==========================================================
   Netlify Function: send-booking-email
   Emails the admin whenever a booking comes in.

   Runs on Netlify's server, so the Resend key stays secret.
   Set these in Netlify -> Site configuration -> Environment variables:
     RESEND_API_KEY        (required) your Resend key
     BOOKING_NOTIFY_EMAIL  (optional) where alerts go; separate several with commas
     RESEND_FROM           (optional) default: Shortlet Magnificent <bookings@shortletmagnificent.com>
========================================================== */
"use strict";

const SITE = "https://shortletmagnificent.com";
const DEFAULT_TO = "Magnificenthomes4u@gmail.com";
const DEFAULT_FROM = "Shortlet Magnificent <bookings@shortletmagnificent.com>";

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
    paymentMethod: b.paymentMethod === "Paystack" ? "Paystack" : "Transfer",
    reference: str(b.reference, 80),
    submittedAt: str(b.submittedAt, 40)
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
  const paid = b.paymentMethod === "Paystack";
  const status = paid ? "Paid online (Paystack)" : "Awaiting payment (transfer via WhatsApp)";
  const dates = b.checkin && b.checkout
    ? `${b.checkin} to ${b.checkout}${b.nights ? ` (${b.nights} night${b.nights > 1 ? "s" : ""})` : ""}`
    : "Not given";
  const rows = [
    ["Apartment", b.property + (b.propertyLocation ? `, ${b.propertyLocation}` : "")],
    ["Guest", b.name],
    ["Phone", b.phone],
    ["Dates", dates],
    ["Guests", b.guests != null ? String(b.guests) : "Not given"],
    ["Total", b.total != null ? naira(b.total) : "Not given"],
    ...(b.promo ? [["Promo code", `${b.promo}${b.discount ? ` (-${naira(b.discount)})` : ""}`]] : []),
    ["Payment", status],
    ...(b.reference ? [["Paystack reference", b.reference]] : []),
    ...(b.orderNo ? [["Order number", b.orderNo]] : []),
    ["Received", lagosTime(b.submittedAt) + " (Lagos time)"]
  ];

  const subject = isTest
    ? "Test: your booking alerts are working"
    : `New booking: ${b.property} - ${b.name} (${paid ? "paid" : "awaiting payment"})`;

  const wa = whatsappLink(b.phone);
  const html = `<!doctype html><html><body style="margin:0;background:#f7f5f0;font-family:Arial,Helvetica,sans-serif;color:#0f172b;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px;">
  <div style="background:#0f172b;color:#fff;padding:20px 24px;border-radius:14px 14px 0 0;">
    <div style="font-size:12px;letter-spacing:2px;color:#f0c48d;">SHORTLET MAGNIFICENT</div>
    <div style="font-size:22px;font-weight:bold;margin-top:6px;">${isTest ? "Test email" : "New booking received"}</div>
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
    ${paid ? `<p style="font-size:12.5px;color:#6b7383;line-height:1.6;margin:14px 0 0;">Please confirm this payment in your Paystack dashboard before the guest arrives.</p>` : ""}
  </div>
</div></body></html>`;

  const text = [isTest ? "TEST EMAIL - booking alerts are working." : "NEW BOOKING RECEIVED", ""]
    .concat(rows.map(([k, v]) => `${k}: ${v}`))
    .concat(["", wa ? `WhatsApp the guest: ${wa}` : "", `Admin: ${SITE}/admin.html`])
    .filter((x, i, a) => !(x === "" && a[i - 1] === ""))
    .join("\n");

  return { subject, html, text };
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
    if (booking.id) {
      if (seen.has(booking.id)) return json(200, { ok: true, duplicate: true });
      seen.set(booking.id, Date.now());
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
  const mail = buildEmail(booking, isTest);

  try {
    const headers = { Authorization: "Bearer " + key, "Content-Type": "application/json" };
    if (booking.id) headers["Idempotency-Key"] = "booking-" + booking.id;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers,
      body: JSON.stringify({ from, to, subject: mail.subject, html: mail.html, text: mail.text })
    });
    if (!res.ok) {
      let detail = "";
      try { detail = (await res.text()).slice(0, 300); } catch (e) {}
      console.error("send-booking-email: Resend answered " + res.status + " " + detail);
      if (booking.id) seen.delete(booking.id);
      return json(502, { ok: false, error: res.status === 401 || res.status === 403 ? "Resend refused the key. Check RESEND_API_KEY in Netlify." : "The email service couldn't send it." });
    }
    return json(200, { ok: true });
  } catch (err) {
    console.error("send-booking-email: " + err.message);
    if (booking.id) seen.delete(booking.id);
    return json(502, { ok: false, error: "Couldn't reach the email service." });
  }
};

// exported for tests
exports._internals = { cleanBooking, buildEmail, esc };
