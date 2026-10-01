/* ==========================================================
   GALLERY PAGE — photos & videos with skeleton loading & error handling.
   Shows what the admin manages under Admin -> Gallery. Tapping an
   item opens it full-view right here (lightbox); it does NOT
   navigate away.
========================================================== */
(function(){
  const root = document.getElementById("galleryRoot");
  if(!root) return;
  let loaded = false;
  const imageCache = new Set();

  function showErrorToast(msg){
    const toast = document.createElement("div");
    toast.className = "error-toast show";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hide");
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function showSkeletons(count = 8){
    root.innerHTML = "";
    for(let i = 0; i < count; i++){
      const skeleton = document.createElement("div");
      skeleton.className = "gallery-item skeleton";
      root.appendChild(skeleton);
    }
  }

  function render(items){
    root.innerHTML = "";
    if(!items || items.length === 0){
      root.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px 16px;">No pictures yet.</p>';
      return;
    }

    items.forEach((it) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-item";
      btn.setAttribute("aria-label", "View " + it.title);

      if(it.isVideo){
        const video = document.createElement("video");
        video.muted = true; 
        video.preload = "metadata";
        const play = document.createElement("span");
        play.className = "gallery-play-icon"; 
        play.textContent = "\u25B6";

        video.addEventListener("error", () => {
          showErrorToast("Failed to load video");
          btn.style.opacity = "0.5";
        });
        video.addEventListener("loadedmetadata", () => {
          imageCache.add(it.src);
          video.src = it.src;
        });
        // Start loading
        video.src = it.src;
        btn.append(video, play);
      } else {
        const img = document.createElement("img");
        img.alt = it.title;
        img.loading = "lazy";
        img.style.opacity = "0.3";

        const onLoad = () => {
          img.style.opacity = "1";
          imageCache.add(it.src);
        };
        const onError = () => {
          showErrorToast("Failed to load image: " + it.title);
          img.style.opacity = "0.3";
          img.style.backgroundColor = "#e0dace";
        };

        img.addEventListener("load", onLoad, { once: true });
        img.addEventListener("error", onError, { once: true });

        // Add cache buster to avoid stale images
        const cacheBuster = "?t=" + Date.now();
        img.src = it.src + (it.src.includes("?") ? "&" : cacheBuster);
        btn.appendChild(img);
      }

      const label = document.createElement("span");
      label.className = "gallery-item-label";
      label.textContent = it.title;
      btn.appendChild(label);

      btn.addEventListener("click", () => window.openMediaLightbox(it.src, it.title));
      root.appendChild(btn);
    });
  }

  function fallbackItems(){
    const items = [];
    if(typeof PROPERTIES === "undefined") return items;
    PROPERTIES.forEach((p) => {
      (p.images || []).forEach((img) => items.push({ src: img, title: p.title }));
      (p.videos || []).forEach((vid) => items.push({ src: vid, title: p.title, isVideo: true }));
    });
    return items;
  }

  // Show skeletons immediately
  showSkeletons();

  if(typeof DataService === "undefined"){ 
    render(fallbackItems()); 
    return; 
  }

  // If the live list is slow (or offline), show the built-in pictures after 2.5s
  const timer = setTimeout(() => { 
    if(!loaded){
      render(fallbackItems());
      loaded = true;
    }
  }, 2500);

  DataService.galleryFeed()
    .then((items) => {
      loaded = true; 
      clearTimeout(timer);
      
      // Force refresh on deleted items
      if(items && items.length > 0){
        render(items);
      } else {
        render([]);
      }
    })
    .catch((err) => { 
      clearTimeout(timer);
      console.error("Gallery load error:", err);
      if(!loaded){
        showErrorToast("Failed to load gallery. Showing cached images.");
        render(fallbackItems());
        loaded = true;
      }
    });
})();
