/* ==========================================================
   REVIEWS PAGE — full list, tap to zoom (same lightbox as Gallery)
========================================================== */
(function(){
  const root = document.getElementById("reviewsPageRoot");
  if(!root) return;

  // Show skeleton loading state
  root.innerHTML = `
    <div style="padding: 16px;">
      ${SkeletonLoader.createReviewSkeleton()}
      ${SkeletonLoader.createReviewSkeleton()}
      ${SkeletonLoader.createReviewSkeleton()}
    </div>
  `;

  // Rating summary (shown on desktop only): average, count and 5-to-1 star bars.
  function renderSummary(reviews){
    const host = document.getElementById("reviewsSummary");
    if(!host) return;
    const n = reviews.length;
    const counts = [0,0,0,0,0,0];
    let sum = 0;
    reviews.forEach(r => { const v = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 0))); counts[v]++; sum += Number(r.rating) || 0; });
    const avg = n ? (sum / n) : 0;
    host.innerHTML = `
      <div class="rs-score">
        <span class="rs-num">${avg.toFixed(1)}</span>
        <div class="review-stars">${starRow(Math.round(avg))}</div>
        <span class="rs-based">Based on ${n} review${n === 1 ? "" : "s"}</span>
      </div>
      <div class="rs-bars">
        ${[5,4,3,2,1].map(k => `<div class="rs-row"><span>${k}</span><span class="rs-star">★</span><div class="rs-track"><i style="width:${n ? Math.round(counts[k] / n * 100) : 0}%"></i></div><span class="rs-pct">${n ? Math.round(counts[k] / n * 100) : 0}%</span></div>`).join("")}
      </div>`;
  }

  DataService.listReviews()
    .then((reviews) => {
      if (!reviews || reviews.length === 0) {
        root.innerHTML = `<p style="padding:32px 16px;color:#6B7383;font-size:14px;text-align:center;">No reviews yet. Be the first to share your experience!</p>`;
        return;
      }
      renderSummary(reviews);
      root.innerHTML = reviews.map(r => `
        <div class="review-page-card">
          <div class="review-stars">${starRow(r.rating)}</div>
          <p class="review-text">"${r.text}"</p>
          <div class="review-author">
            <span class="review-author-name">${r.name}</span>
            <span class="review-author-loc">${r.location}</span>
          </div>
        </div>`).join("");
    })
    .catch((error) => {
      console.error("Error loading reviews:", error);
      ErrorHandler.handleNetworkError(error, 'Loading reviews');
      ErrorHandler.showErrorState(
        root,
        'Unable to Load Reviews',
        'We encountered an error while loading reviews. Please try refreshing the page.'
      );
    });

  const backBtn = document.getElementById("backToTopBtn");
  if(backBtn){
    backBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
