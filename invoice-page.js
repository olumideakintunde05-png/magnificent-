/* ==========================================================
   INVOICE / PAYMENT PAGE
   Shown right after a guest requests to book: the invoice, both
   bank accounts to pay into, and the booking terms. The same
   invoice is emailed to the guest by the Netlify function.
========================================================== */
(function(){
  const root = document.getElementById("invoiceRoot");
  if(!root) return;

  const CFG = window.SITE_CONFIG || {};
  const ACCOUNTS = CFG.bankAccounts || [];
  const REF = CFG.paymentReference || "APARTMENT BOOKING";
  const WA = ((window.SITE_CONTACT || {}).whatsapp || "2348142230897").replace(/\D/g, "");

  const esc = (x) => String(x == null ? "" : x).replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  const naira = (n) => "\u20A6" + Number(n || 0).toLocaleString("en-NG");
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || "";

  function ordinal(n){
    const s = ["th","st","nd","rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  function longDate(iso){
    const d = new Date(iso + "T12:00:00");
    if(isNaN(d)) return iso || "";
    return ordinal(d.getDate()) + " " + d.toLocaleDateString("en-GB", { month:"long" }) + ", " + d.getFullYear();
  }
  function shortDate(iso){
    const d = new Date(iso);
    if(isNaN(d)) return "";
    const p = (n) => String(n).padStart(2, "0");
    return p(d.getDate()) + "/" + p(d.getMonth() + 1) + "/" + d.getFullYear();
  }

  function readLocal(){
    let enq = null, extra = null;
    try{ enq = (JSON.parse(localStorage.getItem("dh_enquiries") || "[]")).find((b) => b && b.id === id) || null; }catch(e){}
    let reported = !!enq;
    if(!enq){ try{ enq = (JSON.parse(localStorage.getItem("dh_drafts") || "{}"))[id] || null; }catch(e){} }
    try{ extra = (JSON.parse(localStorage.getItem("dh_invoices") || "{}"))[id] || null; }catch(e){}
    return { enq, extra, reported };
  }

  // If this device has no copy (e.g. opened from another phone), fall back to the
  // guest's own booking in the database. The price breakdown is rebuilt from the total.
  function readRemote(){
    const user = (typeof Auth !== "undefined" && Auth.currentUser) ? Auth.currentUser() : null;
    if(!user || typeof DataService === "undefined" || !DataService.listEnquiriesForUser) return Promise.resolve(null);
    return DataService.listEnquiriesForUser(user.uid).then((list) => list.find((b) => b.id === id) || null).catch(() => null);
  }

  function build(enq, extra){
    const nights = Number(enq.nights || 0);
    const caution = extra && extra.caution != null ? Number(extra.caution) : Number(CFG.cautionFee || 0);
    const serviceFee = extra && extra.serviceFee != null ? Number(extra.serviceFee) : 0;
    const discount = Number(enq.discount || 0);
    const total = Number(enq.total || 0);
    let unit = extra && extra.unitPrice ? Number(extra.unitPrice) : 0;
    let subtotal = extra && extra.subtotal ? Number(extra.subtotal) : unit * nights;
    let fee = serviceFee;
    if(!unit && nights){            // rebuilt from the total only
      subtotal = Math.max(0, total - caution) + discount;
      unit = Math.round(subtotal / nights);
      fee = 0;
    }
    const m = String(enq.orderNo || "").match(/(\d+)\s*$/);
    return {
      no: m ? m[1].padStart(4, "0") : "",
      issued: shortDate(enq.submittedAt) || shortDate(new Date().toISOString()),
      name: enq.name || "", phone: enq.phone || "", email: (extra && extra.email) || "",
      property: enq.property || "", location: enq.propertyLocation || "",
      checkin: enq.checkin, checkout: enq.checkout, nights, guests: enq.guests,
      unit, subtotal, discount, promo: enq.promo || "", fee, caution, total
    };
  }

  function accountsHTML(){
    return ACCOUNTS.map((a, i) => `
      <div class="inv-acct">
        <div class="row"><span>Bank</span><b>${esc(a.bank)}</b></div>
        <div class="row"><span>Account name</span><b>${esc(a.name)}</b></div>
        <div class="row"><span>Account number</span><b class="num">${esc(a.display || a.number)}</b></div>
        <div class="row"><span>Reference</span><b>${esc(REF)}</b></div>
        <button type="button" class="inv-copy" data-copy="${esc(a.number)}">Copy account number</button>
      </div>`).join("");
  }

  const acceptKey = "dh_terms_" + id;
  const proofKey = "dh_proof_" + id;

  function readProofName(){ try{ return localStorage.getItem(proofKey) || ""; }catch(e){ return ""; } }

  // Proof upload; tries once more because a brand-new order can take a moment to save.
  function uploadProof(enqWithNo, file){
    return DataService.uploadPaymentProof(enqWithNo, file).catch(() => new Promise((r) => setTimeout(r, 2500)).then(() => DataService.uploadPaymentProof(enqWithNo, file)));
  }
  function proofErrorText(err){
    const m = (err && err.message) || "";
    return /permission|insufficient|missing/i.test(m) ? "We couldn't save the picture here. Please send your proof on WhatsApp instead." : (m || "Upload failed. Please try again.");
  }

  function render(v, enq, reported, extra){
    const stay = v.checkin && v.checkout ? `from 2pm on the ${longDate(v.checkin)} to 12pm on the ${longDate(v.checkout)}.` : "";
    let accepted = false;
    try{ accepted = localStorage.getItem(acceptKey) === "1"; }catch(e){}
    if(reported) accepted = true;
    const proofName = readProofName();

    function afterHTML(){
      if(!reported){
        return `
          <p class="inv-label">After you pay</p>
          <p class="inv-help">Add a screenshot of your payment if you can (optional), then tap the button.</p>
          <input type="file" id="invProofFile" accept="image/*">
          <button type="button" class="btn btn-gold btn-full" id="invSentBtn">I've sent the payment</button>
          <p class="inv-proof-msg" id="invProofMsg"></p>`;
      }
      return `
        <p class="inv-label">Payment reported</p>
        <div class="inv-proof-done">&#10003; Thank you! We've been told your payment is on its way${v.no ? ` (order ${esc(v.no)})` : ""}. We'll confirm your booking shortly.</div>
        ${proofName ? `<div class="inv-proof-done" style="margin-top:8px;">&#10003; Proof of payment uploaded</div>` : `
          <p class="inv-help" style="margin-top:12px;">You can add your proof of payment (screenshot or photo):</p>
          <input type="file" id="invProofFile" accept="image/*">
          <button type="button" class="btn btn-gold btn-full" id="invProofBtn">Upload proof of payment</button>
          <p class="inv-proof-msg" id="invProofMsg"></p>`}`;
    }

    root.innerHTML = `
    <article class="inv">
      <div class="inv-head">
        <div class="inv-brand">SHORTLET<br>MAGNIFICENT<small>A brand of The Magnificent Brokerage Ltd.</small></div>
        <div class="inv-title">INVOICE${v.no ? `<small>${esc(v.no)}</small>` : ""}</div>
      </div>
      <div class="inv-body">
        <div class="inv-meta">
          <div>
            <p class="inv-label">Prepared for</p>
            <div class="inv-kv">
              <span>Client</span><b>${esc(v.name)}</b>
              <span>Phone / WhatsApp</span><b>${esc(v.phone)}</b>
              ${v.email ? `<span>Email address</span><b>${esc(v.email)}</b>` : ""}
            </div>
          </div>
          <div class="inv-kv" style="align-content:start;">
            <span>Issued date</span><b>${esc(v.issued)}</b>
            <span>Due date</span><b>${esc(v.issued)}</b>
            ${v.guests ? `<span>Number of guests</span><b>${esc(v.guests)}</b>` : ""}
          </div>
        </div>

        <p class="inv-label">Your booking</p>
        <table class="inv-table">
          <thead><tr><th></th><th>Nights</th><th>Unit price</th><th>Total</th></tr></thead>
          <tbody>
            <tr>
              <td>${esc(v.property)}${v.location ? `, ${esc(v.location)}` : ""}<small>${esc(stay)}</small></td>
              <td>${esc(v.nights)}</td><td>${naira(v.unit)}</td><td>${naira(v.subtotal)}</td>
            </tr>
            ${v.discount ? `<tr class="sub"><td colspan="3">Promo ${esc(v.promo)}</td><td>\u2212${naira(v.discount)}</td></tr>` : ""}
            ${v.fee ? `<tr class="sub"><td colspan="3">Service fee</td><td>${naira(v.fee)}</td></tr>` : ""}
            ${v.caution ? `<tr class="sub"><td colspan="3">Refundable caution fee</td><td>${naira(v.caution)}</td></tr>` : ""}
          </tbody>
        </table>
        <div class="inv-total"><span>TOTAL AMOUNT PAYABLE</span><b>${naira(v.total)}</b></div>

        <p class="inv-readfirst">Please read <a href="booking-policy.html#before-you-pay" target="_blank" rel="noopener">Before you pay</a> and our <a href="booking-policy.html" target="_blank" rel="noopener">booking terms</a> (cancellation, caution deposit, house rules).</p>
        <label class="inv-accept">
          <input type="checkbox" id="invAccept" ${accepted ? "checked" : ""}>
          <span>I have reviewed the booking details and accept the <a href="booking-policy.html" target="_blank" rel="noopener">booking terms</a>, and I am ready to proceed with payment.</span>
        </label>

        <div id="invPaySection" ${accepted ? "" : "hidden"}>
          <div class="inv-pay">
            <p class="inv-label">Pay into either account</p>
            ${accountsHTML()}
            <p class="hint">Use the reference <b>${esc(REF)}</b>. After paying, tap &ldquo;I've sent the payment&rdquo; below.</p>
          </div>

          <div class="inv-upload" id="invAfter">${afterHTML()}</div>
        </div>

        <div class="inv-actions"><button type="button" class="inv-print" id="invPrint">Download / print invoice (PDF)</button></div>
      </div>
      <div class="inv-foot">The Magnificent Brokerage Ltd. (trading as Shortlet Magnificent) &middot; 08142230897 &middot; Magnificenthomes4u@gmail.com &middot; Lagos, Nigeria</div>
    </article>`;

    const box = document.getElementById("invAccept");
    const paySec = document.getElementById("invPaySection");
    box.addEventListener("change", () => {
      try{ localStorage.setItem(acceptKey, box.checked ? "1" : "0"); }catch(e){}
      paySec.hidden = !box.checked;
    });

    root.querySelectorAll("[data-copy]").forEach((btn) => btn.addEventListener("click", () => {
      const n = btn.dataset.copy;
      const done = () => { const t = btn.textContent; btn.textContent = "Copied \u2713"; setTimeout(() => { btn.textContent = t; }, 1800); };
      if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(n).then(done).catch(() => {}); }
      else { const ta = document.createElement("textarea"); ta.value = n; document.body.appendChild(ta); ta.select(); try{ document.execCommand("copy"); done(); }catch(e){} ta.remove(); }
    }));

    const upFile = document.getElementById("invProofFile");
    const upMsg = document.getElementById("invProofMsg");
    const sentBtn = document.getElementById("invSentBtn");
    const upBtn = document.getElementById("invProofBtn");

    // "I've sent the payment": only now is the order created for the admin.
    if(sentBtn) sentBtn.addEventListener("click", () => {
      upMsg.style.color = "#8c1c1c";
      if(typeof saveEnquiry !== "function"){ upMsg.textContent = "Something went wrong. Please refresh and try again."; return; }
      const file = upFile.files && upFile.files[0];
      if(file && !/^image\//.test(file.type)){ upMsg.textContent = "Please choose a photo or screenshot (JPG or PNG)."; return; }
      sentBtn.disabled = true; sentBtn.textContent = "Sending…"; upMsg.textContent = "";
      saveEnquiry(enq, extra || {}).then(() => {
        try{
          const drafts = JSON.parse(localStorage.getItem("dh_drafts") || "{}");
          delete drafts[id];
          localStorage.setItem("dh_drafts", JSON.stringify(drafts));
        }catch(e){}
        const saved = readLocal().enq || enq;
        const withNo = Object.assign({}, saved);
        const done = () => start();
        if(file && typeof DataService !== "undefined" && DataService.uploadPaymentProof){
          uploadProof(withNo, file).then(() => { try{ localStorage.setItem(proofKey, file.name || "proof"); }catch(e){} }).catch(() => {}).then(done);
        } else { done(); }
      });
    });

    // Adding proof after the payment was reported
    if(upBtn) upBtn.addEventListener("click", () => {
      const f = upFile.files && upFile.files[0];
      upMsg.style.color = "#8c1c1c";
      if(!f){ upMsg.textContent = "Please choose your payment screenshot or photo first."; return; }
      if(typeof DataService === "undefined" || !DataService.uploadPaymentProof){ upMsg.textContent = "Upload isn't available right now. Please send it on WhatsApp."; return; }
      upBtn.disabled = true; upBtn.textContent = "Uploading…"; upMsg.textContent = "";
      uploadProof(enq, f).then(() => {
        try{ localStorage.setItem(proofKey, f.name || "proof"); }catch(e){}
        start();
      }).catch((err) => {
        upBtn.disabled = false; upBtn.textContent = "Upload proof of payment";
        upMsg.textContent = proofErrorText(err);
      });
    });

    const pr = document.getElementById("invPrint");
    if(pr) pr.addEventListener("click", () => window.print());
  }

  function missing(){
    root.innerHTML = `<div class="inv inv-missing"><p>We couldn't find this invoice on this device.</p><p>If you already booked, check your email for the invoice, or <a href="https://wa.me/${WA}" target="_blank" rel="noopener">message us on WhatsApp</a>.</p><a class="btn btn-gold" href="properties.html">Browse stays</a></div>`;
  }

  function start(){
    if(!id){ missing(); return; }
    const { enq, extra, reported } = readLocal();
    if(enq){ render(build(enq, extra), enq, reported, extra); return; }
    readRemote().then((r) => { if(r) render(build(r, null), r, true, null); else missing(); });
  }

  if(typeof Auth !== "undefined" && Auth.onInit){ Auth.onInit(start); } else { start(); }
})();
