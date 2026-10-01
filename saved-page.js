/* ==========================================================
   SAVED APARTMENTS PAGE
========================================================== */
(function(){
  const root = document.getElementById("savedRoot");
  if(!root) return;

  function getSavedStays(){
    try {
      const favIds = [...state.favorites];
      if (!PROPERTIES || PROPERTIES.length === 0) {
        ErrorHandler.showErrorState(root, 'No Properties Available', 'Unable to load saved properties. Please try again later.');
        return [];
      }
      return PROPERTIES.filter(p => favIds.includes(p.id));
    } catch (error) {
      console.error('Error getting saved stays:', error);
      ErrorHandler.handleNetworkError(error, 'Loading saved stays');
      return [];
    }
  }

  function render(){
    try {
      const savedStays = getSavedStays();
      if(savedStays.length === 0){
        root.innerHTML = `<p class="profile-empty">You haven't saved any stays yet. Tap the heart icon on a listing to save it here.</p>`;
        return;
      }
      root.innerHTML = `<div class="properties-grid">${savedStays.map(propertyCardHTML).join("")}</div>`;

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
          try {
            state.favorites.delete(id);
            saveFavorites();
            ErrorHandler.showToast("Removed from saved stays", false);
            render();
          } catch (error) {
            console.error('Error removing favorite:', error);
            ErrorHandler.showToast("Failed to remove from saved stays", true);
          }
        });
      });
    } catch (error) {
      console.error('Error rendering saved apartments:', error);
      ErrorHandler.showErrorState(root, 'Unable to Load Saved Apartments', 'Please try refreshing the page.');
    }
  }

  render();
})();
