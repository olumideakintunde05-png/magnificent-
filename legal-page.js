/* ==========================================================
   LEGAL / INFO PAGES (Privacy, Terms, About)
   The page ships with its original wording. If the admin has edited it
   (Admin -> Content), that version replaces it as soon as it loads.
========================================================== */
(function(){
  const box = document.querySelector(".legal-content[data-doc]");
  if(!box || typeof DataService === "undefined") return;

  DataService.getContent(box.dataset.doc).then((c) => {
    if(!c || !c.body) return;
    box.innerHTML = DataService.renderRichText(c.body);
    const title = document.getElementById("legalTitle");
    const updated = document.getElementById("legalUpdated");
    if(c.title && title){ title.textContent = c.title; document.title = c.title + " | Shortlet Magnificent"; }
    if(updated && c.updated) updated.textContent = "Last updated: " + c.updated;
  });
})();
