/* ==========================================================
   FAQ PAGE (accordion). Shows the built-in questions straight away, then
   swaps in the admin's edited list (Admin -> Content -> FAQ) if there is one.
========================================================== */
(function(){
  const root = document.getElementById("faqRoot");
  if(!root) return;

  const ICONS = {
    chevron: `<svg viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };

  const FAQS = [
    {
      q: "How do I book a shortlet apartment?",
      a: "Browse Stays, open a listing you like, and tap “Request to Book.” We'll confirm availability and payment details with you directly before your stay is finalised."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept bank transfer and card payments. You'll see the available options during checkout when you request a booking."
    },
    {
      q: "Can I cancel or reschedule a booking?",
      a: "Yes — contact us as soon as possible by phone or WhatsApp. Cancellation terms depend on how close it is to your check-in date."
    },
    {
      q: "Do I need an account to book a stay?",
      a: "You can browse and view listings as a guest, but you'll need to log in or create an account to request a booking and track it under My Bookings."
    },
    {
      q: "Are your apartments verified?",
      a: "Yes — every listing on Shortlet Magnificent is verified and fully furnished before it goes live on the site."
    },
    {
      q: "How can I contact support?",
      a: "Reach us anytime by phone, WhatsApp or email from the Help & Support page, or the contact details in the footer."
    }
  ];

  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));

  function render(FAQS){
    root.innerHTML = `
    <div class="faq-list">
      ${FAQS.map((item, i) => `
        <div class="faq-item" data-index="${i}">
          <button type="button" class="faq-question">
            <span>${esc(item.q)}</span>
            <span class="faq-chevron">${ICONS.chevron}</span>
          </button>
          <div class="faq-answer"><div><p>${esc(item.a).replace(/\n/g, "<br>")}</p></div></div>
        </div>
      `).join("")}
    </div>
  `;

    root.querySelectorAll(".faq-item").forEach(item => {
      item.querySelector(".faq-question").addEventListener("click", () => {
        const wasOpen = item.classList.contains("open");
        root.querySelectorAll(".faq-item.open").forEach(open => open.classList.remove("open"));
        if(!wasOpen) item.classList.add("open");
      });
    });
  }

  render(FAQS);
  if(typeof DataService !== "undefined"){
    DataService.getContent("faq").then((c) => {
      if(c && Array.isArray(c.items) && c.items.length) render(c.items.filter((x) => x && x.q));
    });
  }
})();
