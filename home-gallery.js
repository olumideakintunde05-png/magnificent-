/* ==========================================================
   HOME PAGE — GALLERY STRIP
   Shows the latest pictures from the Gallery (Admin -> Gallery).
   Tapping one opens it full-size; "View All" goes to the Gallery page.
========================================================== */
(function(){
  const section = document.getElementById("homeGallery");
  const strip = document.getElementById("homeGalleryStrip");
  if(!section || !strip) return;

  function render(items){
    if(!items.length) return;
    strip.innerHTML = "";
    items.forEach((it) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "home-gallery-item";
      btn.setAttribute("aria-label", "View " + it.title);
      if(it.isVideo){
        const video = document.createElement("video");
        video.src = it.src; video.muted = true; video.preload = "metadata";
        const play = document.createElement("span");
        play.className = "hg-play"; play.textContent = "\u25B6";
        btn.append(video, play);
      } else {
        const img = document.createElement("img");
        img.src = it.src; img.alt = it.title; img.loading = "lazy";
        btn.appendChild(img);
      }
      btn.addEventListener("click", () => window.openMediaLightbox(it.src, it.title));
      strip.appendChild(btn);
    });
    section.style.display = "";
  }

  // Live gallery (what the admin manages). If it is slow, show the built-in
  // pictures after a moment.
  let loaded = false;
  function fallbackItems(){
    const items = [];
    if(typeof PROPERTIES === "undefined") return items;
    PROPERTIES.forEach((p) => (p.images || []).slice(0, 2).forEach((img) => items.push({ src: img, title: p.title })));
    return items.slice(0, 10);
  }
  if(typeof DataService === "undefined"){ render(fallbackItems()); return; }
  const timer = setTimeout(() => { if(!loaded) render(fallbackItems()); }, 2500);
  DataService.galleryFeed().then((items) => {
    loaded = true; clearTimeout(timer);
    render(items.slice(0, 12));
  }).catch(() => { clearTimeout(timer); if(!loaded) render(fallbackItems()); });
})();
