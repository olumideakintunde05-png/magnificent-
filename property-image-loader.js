/* ==========================================================
   PROPERTY IMAGE LOADER — error handling & lazy loading.
   Handles image loading states, error recovery, and cache busting.
========================================================== */
(function(){
  const imageTimeout = 8000; // 8 second timeout per image
  const maxRetries = 2;
  const loadedImages = new Set();

  function showErrorToast(msg){
    const existingToasts = document.querySelectorAll(".error-toast");
    if(existingToasts.length > 2) return; // Limit toast spam
    
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

  function handlePropertyImage(img){
    if(loadedImages.has(img.src)) return;

    const container = img.closest(".property-media");
    if(!container) return;

    let retries = 0;
    let timeoutId = null;

    const cleanup = () => clearTimeout(timeoutId);

    const loadImage = () => {
      timeoutId = setTimeout(() => {
        if(img.naturalHeight === 0){
          if(retries < maxRetries){
            retries++;
            img.src = img.src.split("?")[0] + "?retry=" + retries + "&t=" + Date.now();
          } else {
            showLoadError();
          }
        }
      }, imageTimeout);

      img.classList.add("loading");
      img.classList.remove("loaded", "error");
    };

    const showLoadSuccess = () => {
      cleanup();
      img.classList.remove("loading", "error");
      img.classList.add("loaded");
      const placeholder = container.querySelector(".image-placeholder");
      if(placeholder) placeholder.classList.remove("show");
      loadedImages.add(img.src);
    };

    const showLoadError = () => {
      cleanup();
      img.classList.remove("loading");
      img.classList.add("error");
      const placeholder = container.querySelector(".image-placeholder");
      if(placeholder) {
        placeholder.classList.add("show");
        placeholder.textContent = "Image unavailable";
      }
      showErrorToast("Failed to load image");
    };

    img.addEventListener("load", showLoadSuccess, { once: true });
    img.addEventListener("error", showLoadError, { once: true });

    // Start with cache buster
    const separator = img.dataset.src ? (img.dataset.src.includes("?") ? "&" : "?") : "?";
    img.src = (img.dataset.src || img.src) + separator + "t=" + Date.now();
    
    loadImage();
  }

  // Observe all images in property cards
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if(mutation.addedNodes.length){
        mutation.addedNodes.forEach((node) => {
          if(node.nodeType === 1){ // Element node
            const imgs = node.querySelectorAll ? node.querySelectorAll(".property-media img") : [];
            imgs.forEach(handlePropertyImage);
            if(node.classList && node.classList.contains("property-media")){
              handlePropertyImage(node.querySelector("img"));
            }
          }
        });
      }
    });
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false
  });

  // Handle existing images on page load
  window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".property-media img").forEach(handlePropertyImage);
  });

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    observer.disconnect();
    loadedImages.clear();
  });
})();
