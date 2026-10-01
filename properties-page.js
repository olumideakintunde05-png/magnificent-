/* ==========================================================
   PROPERTIES PAGE
========================================================== */
(function(){
  const root = document.getElementById("propertiesGridRoot");
  if(!root) return;

  const params = new URLSearchParams(window.location.search);
  const state2 = {
    type: params.get("type") || "",
    location: params.get("location") || "",
    priceMax: params.get("priceMax") ? Number(params.get("priceMax")) : null,
    status: "",
    sort: "default",
    q: "",
    amenities: []
  };
  const AMENITY_RX = { wifi:/wi-?fi|internet/i, pool:/pool/i, gym:/gym|fitness/i, power:/power|generator|light|electric|inverter/i, air:/air|a\/c|\bac\b|conditioning/i };
  let allProperties = [];

  function apply(){
    let list = allProperties.filter(p => {
      if(state2.type && p.type !== state2.type) return false;
      if(state2.location && !p.location.toLowerCase().includes(state2.location.toLowerCase())) return false;
      if(state2.priceMax && p.priceValue > state2.priceMax) return false;
      if(state2.status && p.guests < Number(state2.status)) return false;
      if(state2.q){
        const hay = (p.title + " " + p.location + " " + p.type + " " + (p.description || "")).toLowerCase();
        if(!hay.includes(state2.q.toLowerCase())) return false;
      }
      if(state2.amenities.length){
        const list = (p.amenities || []).join(" | ");
        if(!state2.amenities.every(k => AMENITY_RX[k].test(list))) return false;
      }
      return true;
    });
    if(state2.sort === "price-asc") list = [...list].sort((a,b) => a.priceValue - b.priceValue);
    if(state2.sort === "price-desc") list = [...list].sort((a,b) => b.priceValue - a.priceValue);

    const countEl = document.getElementById("resultsCount");
    if(countEl){
      const filterBits = [];
      // These come from the page address, so they are escaped before display.
      if(state2.location) filterBits.push(escHTML(state2.location));
      if(state2.type) filterBits.push(escHTML(state2.type));
      if(state2.priceMax) filterBits.push(`under ${money(state2.priceMax)}/night`);
      const suffix = filterBits.length ? ` — ${filterBits.join(", ")} <a href="properties.html" class="clear-filters">(clear)</a>` : "";
      countEl.innerHTML = (list.length === allProperties.length
        ? `Showing all ${list.length} listings`
        : `${list.length} ${list.length === 1 ? "listing" : "listings"} found`) + suffix;
    }

    if(list.length === 0){
      root.innerHTML = `<p style="padding:32px 4px;color:#6B7383;font-size:14px;text-align:center;">No apartments match these filters. Try clearing a filter.</p>`;
      return;
    }

    root.innerHTML = list.map(propertyCardHTML).join("");

    root.querySelectorAll(".property-card").forEach(card => {
      card.addEventListener("click", (e) => {
        if(e.target.closest(".fav-btn")) return;
        window.location.href = `property.html?id=${card.dataset.id}`;
      });
    });
    root.querySelectorAll(".fav-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.fav;
        if(state.favorites.has(id)){ state.favorites.delete(id); btn.classList.remove("active"); showToast("Removed from favourites"); }
        else { state.favorites.add(id); btn.classList.add("active"); showToast("Saved to favourites"); }
        saveFavorites();
      });
    });
  }

  // Reflect any type filter that arrived via URL on the chip row
  if(state2.type){
    document.querySelectorAll("#filterChips .chip").forEach(c => {
      c.classList.toggle("active", c.dataset.type === state2.type);
    });
  }

  document.getElementById("filterChips").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if(!chip) return;
    document.querySelectorAll("#filterChips .chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    state2.type = chip.dataset.type;
    apply();
  });

  document.getElementById("statusFilter").addEventListener("change", (e) => {
    state2.status = e.target.value;
    apply();
  });
  document.getElementById("sortFilter").addEventListener("change", (e) => {
    state2.sort = e.target.value;
    const top = document.getElementById("sortTop"); if(top) top.value = e.target.value;
    apply();
  });

  // ---- Desktop filters (price slider, amenities, search bar, clear) ----
  const priceEl = document.getElementById("priceRange");
  const priceOut = document.getElementById("priceReadout");
  if(priceEl){
    const paintPrice = () => {
      const v = Number(priceEl.value);
      priceOut.textContent = v >= Number(priceEl.max) ? "Any price" : "Up to " + money(v);
    };
    priceEl.addEventListener("input", () => {
      const v = Number(priceEl.value);
      state2.priceMax = v >= Number(priceEl.max) ? null : v;
      paintPrice(); apply();
    });
    if(state2.priceMax){ priceEl.value = Math.min(state2.priceMax, Number(priceEl.max)); }
    paintPrice();
  }
  document.querySelectorAll("#amenityGroup input").forEach(cb => {
    cb.addEventListener("change", () => {
      state2.amenities = [...document.querySelectorAll("#amenityGroup input:checked")].map(i => i.value);
      apply();
    });
  });
  const qEl = document.getElementById("searchQuery");
  if(qEl){
    const runSearch = () => { state2.q = qEl.value.trim(); apply(); };
    document.getElementById("searchQueryBtn").addEventListener("click", runSearch);
    qEl.addEventListener("keydown", (e) => { if(e.key === "Enter"){ e.preventDefault(); runSearch(); } });
    qEl.addEventListener("input", () => { if(!qEl.value) runSearch(); });
  }
  const sortTop = document.getElementById("sortTop");
  if(sortTop){
    sortTop.addEventListener("change", () => {
      state2.sort = sortTop.value;
      document.getElementById("sortFilter").value = sortTop.value;
      apply();
    });
  }
  const clearBtn = document.getElementById("clearFiltersBtn");
  if(clearBtn){
    clearBtn.addEventListener("click", () => {
      Object.assign(state2, { type:"", location:"", priceMax:null, status:"", sort:"default", q:"", amenities:[] });
      document.querySelectorAll("#filterChips .chip").forEach(c => c.classList.toggle("active", c.dataset.type === ""));
      document.querySelectorAll("#amenityGroup input").forEach(i => { i.checked = false; });
      if(qEl) qEl.value = "";
      if(priceEl){ priceEl.value = priceEl.max; priceOut.textContent = "Any price"; }
      document.getElementById("statusFilter").value = "";
      document.getElementById("sortFilter").value = "default";
      if(sortTop) sortTop.value = "default";
      apply();
    });
  }

  // Show loading skeletons while fetching data
  SkeletonLoader.showLoadingState(root, 8);
  
  // The type chips follow the "Browse by Type" list the admin manages.
  function renderTypeChips(items){
    const row = document.getElementById("filterChips");
    if(!row || !items || !items.length) return;
    row.innerHTML = `<button class="chip" data-type="">All</button>` +
      items.map(c => `<button class="chip" data-type="${escHTML(c.type)}">${escHTML(c.name)}</button>`).join("");
    row.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c.dataset.type === state2.type));
  }

  Promise.all([DataService.listProperties(), DataService.getContent("categories")])
    .then(([list, cats]) => {
      allProperties = list;
      if (!list || list.length === 0) {
        ErrorHandler.showErrorState(root, 'No Properties Available', 'There are currently no available listings. Please check back later.');
        return;
      }
      SkeletonLoader.hideLoadingState(root);
      renderTypeChips(cats && cats.items);
      apply();
      injectBackToTop();
    })
    .catch((error) => {
      console.error("Error loading properties:", error);
      SkeletonLoader.hideLoadingState(root);
      ErrorHandler.handleNetworkError(error, 'Loading properties');
      ErrorHandler.showErrorState(
        root,
        'Unable to Load Properties',
        'We encountered an error while loading the listings. Please try refreshing the page.'
      );
    });
})();
