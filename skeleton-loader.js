/* ==========================================================
   SKELETON LOADER UTILITY
========================================================== */

const SkeletonLoader = {
  // Create a single property card skeleton
  createPropertyCardSkeleton() {
    return `
      <div class="skeleton-card" aria-busy="true" aria-label="Loading property">
        <div class="skeleton-card-media">
          <div class="skeleton" style="width:100%; height:100%;"></div>
        </div>
        <div class="skeleton-card-info">
          <div class="skeleton skeleton-text title"></div>
          <div class="skeleton skeleton-text location"></div>
          <div class="skeleton skeleton-text price"></div>
          <div class="skeleton skeleton-text meta"></div>
          <div class="skeleton skeleton-text meta" style="margin-top:6px;"></div>
        </div>
      </div>
    `;
  },

  // Create multiple skeleton cards for grid
  createPropertyGridSkeletons(count = 8) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += this.createPropertyCardSkeleton();
    }
    return html;
  },

  // Load skeletons into a container
  showLoadingState(container, skeletonCount = 8) {
    if (!container) return;
    container.innerHTML = this.createPropertyGridSkeletons(skeletonCount);
    container.setAttribute('data-loading', 'true');
  },

  // Clear skeletons
  hideLoadingState(container) {
    if (!container) return;
    container.removeAttribute('data-loading');
    container.innerHTML = '';
  },

  // Create review skeleton
  createReviewSkeleton() {
    return `
      <div class="review-card" style="opacity: 0.6;">
        <div style="display:flex; gap:10px; margin-bottom:12px;">
          <div class="skeleton" style="width:40px; height:40px; border-radius:50%; flex-shrink:0;"></div>
          <div style="flex:1;">
            <div class="skeleton skeleton-text" style="width:100%;"></div>
            <div class="skeleton skeleton-text" style="width:70%;"></div>
          </div>
        </div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    `;
  },

  // Create booking card skeleton
  createBookingCardSkeleton() {
    return `
      <div class="booking-card" style="padding:16px; background:white; border-radius:10px; margin-bottom:12px;">
        <div style="display:flex; gap:12px; margin-bottom:12px;">
          <div class="skeleton" style="width:80px; height:60px; flex-shrink:0; border-radius:6px;"></div>
          <div style="flex:1;">
            <div class="skeleton skeleton-text" style="width:90%;"></div>
            <div class="skeleton skeleton-text" style="width:70%;"></div>
            <div class="skeleton skeleton-text short" style="margin-top:6px;"></div>
          </div>
        </div>
        <div class="skeleton skeleton-text" style="width:60%;"></div>
      </div>
    `;
  },

  // Create form field skeleton
  createFormFieldSkeleton() {
    return `
      <div style="margin-bottom:16px;">
        <div class="skeleton skeleton-text" style="width:40%; margin-bottom:8px;"></div>
        <div class="skeleton" style="width:100%; height:40px; border-radius:8px;"></div>
      </div>
    `;
  },

  // Create profile skeleton
  createProfileSkeleton() {
    return `
      <div style="text-align:center;">
        <div class="skeleton" style="width:100px; height:100px; border-radius:50%; margin:0 auto 16px;"></div>
        <div class="skeleton skeleton-text" style="width:60%; margin:0 auto 8px;"></div>
        <div class="skeleton skeleton-text short" style="width:45%; margin:0 auto 20px;"></div>
        <div class="skeleton" style="width:100%; height:40px; border-radius:8px;"></div>
      </div>
    `;
  },

  // Create payment skeleton
  createPaymentSkeleton() {
    return `
      <div style="padding:16px;">
        <div class="skeleton skeleton-text" style="width:70%; margin-bottom:16px;"></div>
        <div class="skeleton" style="width:100%; height:50px; border-radius:8px; margin-bottom:12px;"></div>
        <div class="skeleton" style="width:100%; height:50px; border-radius:8px;"></div>
      </div>
    `;
  },

  // Add skeleton to existing element
  addSkeletonOverlay(element) {
    if (!element) return;
    element.classList.add('skeleton-loading');
    const overlay = document.createElement('div');
    overlay.className = 'skeleton-overlay';
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    `;
    overlay.innerHTML = '<div class="skeleton" style="width: 40px; height: 40px; border-radius: 50%;"></div>';
    element.appendChild(overlay);
  },

  // Remove skeleton overlay
  removeSkeletonOverlay(element) {
    if (!element) return;
    element.classList.remove('skeleton-loading');
    const overlay = element.querySelector('.skeleton-overlay');
    if (overlay) overlay.remove();
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SkeletonLoader;
}

if (typeof window !== "undefined") { window.SkeletonLoader = SkeletonLoader; }
