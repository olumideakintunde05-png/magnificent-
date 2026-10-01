/* ==========================================================
   HELP & SUPPORT PAGE
========================================================== */
(function(){
  const root = document.getElementById("helpRoot");
  if(!root) return;

  root.innerHTML = `
    <div class="profile-form" style="gap:14px;">
      <a href="faq.html" class="btn btn-outline btn-full" style="justify-content:flex-start; color:var(--navy-deep); border-color:var(--border); background:var(--white);">Frequently Asked Questions</a>
      <a href="tel:+2348142230897" class="btn btn-outline btn-full" style="justify-content:flex-start; color:var(--navy-deep); border-color:var(--border); background:var(--white);">Call +234 814 223 0897</a>
      <a href="https://wa.me/2348142230897" target="_blank" rel="noopener" class="btn btn-outline btn-full" style="justify-content:flex-start; color:var(--navy-deep); border-color:var(--border); background:var(--white);">WhatsApp Us</a>
      <a href="mailto:Magnificenthomes4u@gmail.com" class="btn btn-outline btn-full" style="justify-content:flex-start; color:var(--navy-deep); border-color:var(--border); background:var(--white);">Email Support</a>
    </div>
  `;
})();
