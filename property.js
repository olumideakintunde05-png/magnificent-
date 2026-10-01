/* ==========================================================
   PROPERTY DETAILS — PAGE LOGIC
   (relies on PROPERTIES, state, showToast, setupModal from script.js)
========================================================== */
let currentImageIndex = 0;
let currentProperty = null;

function getPropertyIdFromUrl(){
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function renderDetailPage(property){
  currentProperty = property;
  const root = document.getElementById("propertyDetailRoot");

  const badgeClass = property.status === "For Rent" ? "rent" : "";
  const isFav = state.favorites.has(property.id);

  root.innerHTML = `
    <div class="detail-layout">
    <section class="gallery">
      <div class="gallery-main" id="galleryMain">
        ${property.images.map((src,i) => `<img src="${src}" alt="${property.title} photo ${i+1}" class="${i===0?"active":""}" data-idx="${i}">`).join("")}
        <span class="gallery-count" id="galleryCount">1 / ${property.images.length}</span>
      </div>
      <div class="gallery-thumbs" id="galleryThumbs">
        ${property.images.map((src,i) => `<button class="gallery-thumb ${i===0?"active":""}" data-idx="${i}"><img src="${src}" alt="Thumbnail ${i+1}"></button>`).join("")}
      </div>
    </section>

    <section class="detail-header">
      <div class="detail-badges">
        <span class="badge status">${property.status}</span>
        <span class="badge type">${property.type}</span>
      </div>
      <h1>${property.title}</h1>
      <p class="detail-loc">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 21C12 21 19 15.1 19 10.2C19 6.2 15.9 3 12 3C8.1 3 5 6.2 5 10.2C5 15.1 12 21 12 21Z" stroke="#9AA3B2" stroke-width="1.8"/><circle cx="12" cy="10" r="2.3" stroke="#9AA3B2" stroke-width="1.8"/></svg>
        ${property.location}
      </p>
      <p class="detail-price">${property.price}${property.period ? `<span class="per"> ${property.period}</span>` : ""}</p>
    </section>

    <section class="info-card">
      <div class="info-cell"><span class="num">${property.bedrooms}</span><span class="lbl">Bedrooms</span></div>
      <div class="info-cell"><span class="num">${property.bathrooms}</span><span class="lbl">Bathrooms</span></div>
      <div class="info-cell"><span class="num">${property.guests}</span><span class="lbl">Guests</span></div>
    </section>

    <section class="detail-section on-white">
      <h2>Description</h2>
      <p class="desc-text">${property.description}</p>
    </section>

    <section class="detail-section on-white">
      <h2>What This Place Offers</h2>
      <ul class="amenities-list">
        ${property.amenities.map(a => `<li>${a}</li>`).join("")}
      </ul>
    </section>

    <aside class="detail-sidebar">
    <section class="detail-section">
      <h2>Host</h2>
      <div class="agent-card">
        <img class="agent-photo" src="${property.host.photo}" alt="${property.host.name}">
        <div class="agent-info">
          <h4>${property.host.name}</h4>
          <p>${property.host.company}</p>
        </div>
        <div class="agent-contact-icons">
          <a class="agent-icon-btn" href="tel:${property.host.phone}" aria-label="Call host">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none"><path d="M6.6 10.8C8 13.6 10.4 16 13.2 17.4L15.4 15.2C15.7 14.9 16.1 14.8 16.5 14.9C17.7 15.3 19 15.5 20.3 15.5C20.9 15.5 21.3 15.9 21.3 16.5V20C21.3 20.6 20.9 21 20.3 21C10.9 21 3.3 13.4 3.3 4C3.3 3.4 3.7 3 4.3 3H7.8C8.4 3 8.8 3.4 8.8 4C8.8 5.3 9 6.6 9.4 7.8C9.5 8.2 9.4 8.6 9.1 8.9L6.6 10.8Z" stroke="#D89A16" stroke-width="1.6" stroke-linejoin="round"/></svg>
          </a>
          <a class="agent-icon-btn" href="mailto:${property.host.email}" aria-label="Email host">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#D89A16" stroke-width="1.6"/><path d="M4 6L12 13L20 6" stroke="#D89A16" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
        </div>
      </div>
    </section>

    <section class="detail-section on-white">
      <div class="action-grid">
        <div class="action-row">
          <button class="action-btn save ${isFav ? "active":""}" id="saveBtn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="${isFav ? "#801424" : "none"}"><path d="M12 21C12 21 4 15.6 4 9.8C4 6.6 6.5 4.2 9.4 4.2C11 4.2 12 5 12 5C12 5 13 4.2 14.6 4.2C17.5 4.2 20 6.6 20 9.8C20 15.6 12 21 12 21Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
            Save
          </button>
          <a class="action-btn whatsapp" href="https://wa.me/${property.host.whatsapp}?text=${encodeURIComponent("Hi, I'm interested in " + property.title + " (" + property.location + ") listed on Shortlet Magnificent.")}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 3C7 3 3 7 3 12C3 13.6 3.4 15.1 4.2 16.4L3 21L7.7 19.8C9 20.6 10.5 21 12 21C17 21 21 17 21 12C21 7 17 3 12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.5 11.5C9.5 13.8 10.2 14.5 12.5 15.5C12.9 15.65 13.5 15.3 13.8 14.9L14.3 14.2C14.5 13.9 14.9 13.8 15.2 13.95L16.8 14.7C17.1 14.85 17.25 15.2 17.1 15.55C16.7 16.5 15.6 17.1 14.6 16.9C11.9 16.4 9.6 14.1 9.1 11.4C8.9 10.4 9.5 9.3 10.45 8.9C10.8 8.75 11.15 8.9 11.3 9.2L12.05 10.8C12.2 11.1 12.1 11.5 11.8 11.7L11.1 12.2C10.7 12.5 10.35 12.9 10.5 13.3" stroke="currentColor" stroke-width="0.6"/></svg>
            WhatsApp
          </a>
        </div>
        <div class="action-row">
          <a class="action-btn call" href="tel:${property.host.phone}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M6.6 10.8C8 13.6 10.4 16 13.2 17.4L15.4 15.2C15.7 14.9 16.1 14.8 16.5 14.9C17.7 15.3 19 15.5 20.3 15.5C20.9 15.5 21.3 15.9 21.3 16.5V20C21.3 20.6 20.9 21 20.3 21C10.9 21 3.3 13.4 3.3 4C3.3 3.4 3.7 3 4.3 3H7.8C8.4 3 8.8 3.4 8.8 4C8.8 5.3 9 6.6 9.4 7.8C9.5 8.2 9.4 8.6 9.1 8.9L6.6 10.8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
            Call Host
          </a>
          <button class="action-btn inspect" id="inspectBtn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M8 3V6M16 3V6M4 9H20M5 5H19C19.5523 5 20 5.4 20 6V20C20 20.5523 19.5523 21 19 21H5C4.4 21 4 20.5523 4 20V6C4 5.4 4.4 5 5 5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
            Check Availability
          </button>
        </div>
      </div>
    </section>
    </aside>

    <section class="detail-section">
      <h2>Property Details</h2>
      <div class="facts-table">
        <div class="facts-row"><span class="k">Property Type</span><span class="v">${property.type}</span></div>
        <div class="facts-row"><span class="k">Status</span><span class="v">${property.status}</span></div>
        <div class="facts-row"><span class="k">Bedrooms</span><span class="v">${property.bedrooms}</span></div>
        <div class="facts-row"><span class="k">Bathrooms</span><span class="v">${property.bathrooms}</span></div>
        <div class="facts-row"><span class="k">Max Guests</span><span class="v">${property.guests}</span></div>
        <div class="facts-row"><span class="k">Furnishing</span><span class="v">${property.furnishing}</span></div>
        <div class="facts-row"><span class="k">Minimum Stay</span><span class="v">${property.minStay}</span></div>
        <div class="facts-row"><span class="k">Property ID</span><span class="v">${property.id}</span></div>
      </div>
    </section>

    <section class="detail-section on-white">
      <h2>Location</h2>
      <div class="map-preview">
        <iframe loading="lazy" title="Property location map" src="${mapInfo(property).embed}"></iframe>
        <div class="map-info">
          <p class="addr-main">${property.location}, Nigeria</p>
          <p class="addr-sub">${property.title}</p>
          <a class="directions-link" href="${mapInfo(property).directions}" target="_blank" rel="noopener">
            Get Directions
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none"><path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
        </div>
      </div>
    </section>
    </div>
  `;

  wireGallery(property);
  wireDetailActions(property);
  document.title = `${property.title} | Shortlet Magnificent`;
}

// The admin can give the map as a Google Maps link, an address, or (older
// listings) plain "lat,lng" coordinates. Works out what to show on the map.
function mapInfo(property){
  const raw = String(property.mapLocation || property.coords || "").trim();
  const fallback = (property.location ? property.location + ", " : "") + "Nigeria";
  let query = "";
  let link = "";

  if(/^https?:\/\//i.test(raw)){
    link = raw;
    try{
      const u = new URL(raw);
      const bang = raw.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
      const at = decodeURIComponent(u.pathname).match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      const param = u.searchParams.get("q") || u.searchParams.get("query") || u.searchParams.get("destination");
      const place = u.pathname.match(/\/maps\/place\/([^/@]+)/);
      if(bang) query = bang[1] + "," + bang[2];
      else if(at) query = at[1] + "," + at[2];
      else if(param) query = param;
      else if(place) query = decodeURIComponent(place[1].replace(/\+/g, " "));
    }catch(e){ /* unreadable link: fall back below */ }
  } else if(raw){
    query = raw;
  }
  // Short links (maps.app.goo.gl) can't be read, so show the area instead
  // and let "Get Directions" open the exact link.
  if(!query) query = fallback;

  return {
    embed: "https://www.google.com/maps?q=" + encodeURIComponent(query) + "&output=embed",
    directions: (link || ("https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(query))).replace(/"/g, "%22")
  };
}

function setGalleryImage(idx, property){
  currentImageIndex = idx;
  document.querySelectorAll("#galleryMain img").forEach(img => img.classList.toggle("active", Number(img.dataset.idx) === idx));
  document.querySelectorAll(".gallery-thumb").forEach(t => t.classList.toggle("active", Number(t.dataset.idx) === idx));
  document.getElementById("galleryCount").textContent = `${idx+1} / ${property.images.length}`;
}

function wireGallery(property){
  document.querySelectorAll(".gallery-thumb").forEach(thumb => {
    thumb.addEventListener("click", () => setGalleryImage(Number(thumb.dataset.idx), property));
  });

  const main = document.getElementById("galleryMain");
  let startX = 0;
  main.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive:true });
  main.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) < 40) return;
    let next = currentImageIndex + (dx < 0 ? 1 : -1);
    next = Math.max(0, Math.min(property.images.length - 1, next));
    setGalleryImage(next, property);
  }, { passive:true });
}

function wireDetailActions(property){
  const saveBtn = document.getElementById("saveBtn");
  const topbarFav = document.getElementById("topbarFav");
  function syncFav(){
    const active = state.favorites.has(property.id);
    saveBtn.classList.toggle("active", active);
    saveBtn.querySelector("svg").setAttribute("fill", active ? "#801424" : "none");
    topbarFav.classList.toggle("active", active);
  }
  syncFav();
  function toggleFav(){
    if(state.favorites.has(property.id)){ state.favorites.delete(property.id); showToast("Removed from favourites"); }
    else { state.favorites.add(property.id); showToast("Saved to favourites"); }
    saveFavorites();
    syncFav();
  }
  saveBtn.addEventListener("click", toggleFav);
  topbarFav.addEventListener("click", toggleFav);

  document.getElementById("inspectBtn").addEventListener("click", () => {
    window.openInspectionModal(property.title, property.priceValue, property);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("propertyDetailRoot");
  if(root) {
    // Show skeleton loader while loading
    root.innerHTML = `
      <div style="padding: 20px;">
        <div class="skeleton" style="width: 100%; height: 300px; border-radius: 12px; margin-bottom: 20px;"></div>
        <div class="skeleton skeleton-text title"></div>
        <div class="skeleton skeleton-text location" style="margin-bottom: 20px;"></div>
        <div class="skeleton skeleton-text" style="margin-bottom: 10px;"></div>
        <div class="skeleton skeleton-text" style="margin-bottom: 10px;"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
    `;
  }
  
  const id = getPropertyIdFromUrl();
  if (!id) {
    ErrorHandler.showErrorState(root, 'Property Not Found', 'The requested property could not be found. Please return to the listings page.');
    return;
  }
  
  DataService.listProperties()
    .then((list) => {
      if (!list || list.length === 0) {
        ErrorHandler.showErrorState(root, 'No Properties Available', 'There are currently no properties available. Please check back later.');
        return;
      }
      
      const property = list.find(p => p.id === id);
      if (!property) {
        ErrorHandler.showErrorState(root, 'Property Not Found', 'The requested property could not be found. Please try browsing other listings.');
        return;
      }
      
      renderDetailPage(property);
    })
    .catch((error) => {
      console.error("Error loading property details:", error);
      ErrorHandler.handleNetworkError(error, 'Loading property details');
      ErrorHandler.showErrorState(
        root,
        'Unable to Load Property',
        'We encountered an error while loading this property. Please try refreshing the page.'
      );
    });
});
