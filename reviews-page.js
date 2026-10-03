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

  /* ---------- Google star rating ----------
     Built live from the reviews shown on this page, so what Google reads always
     matches what visitors see. Uses exactly the reviews that are showing (at least MIN_FOR_STARS). */
  const SEO_SITE = "https://shortletmagnificent.com";
  const MIN_FOR_STARS = 1;
  // A review is only used (shown, counted, sent to Google) when it has a name, text and a 1-5 rating.
  function isValidReview(r){
    const v = Number(r && r.rating);
    return !!(r && r.name && r.text && v >= 1 && v <= 5);
  }
  function applyReviewsSEO(reviews){
    try{
      let ld = document.getElementById("reviewsLd");
      const valid = (reviews || []).filter(isValidReview);
      if(valid.length < MIN_FOR_STARS){ if(ld) ld.remove(); return; }
      const sum = valid.reduce((s, r) => s + Number(r.rating), 0);
      const node = {
        "@type": "LodgingBusiness",
        "@id": SEO_SITE + "/#business",
        "name": "Shortlet Magnificent",
        "url": SEO_SITE + "/",
        "image": SEO_SITE + "/og-image.jpg",
        "telephone": "+234 814 223 0897",
        "address": { "@type": "PostalAddress", "addressLocality": "Lagos", "addressCountry": "NG" },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": (Math.round(sum / valid.length * 10) / 10).toFixed(1),
          "reviewCount": valid.length,
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": valid.slice(0, 20).map(r => ({
          "@type": "Review",
          "author": { "@type": "Person", "name": String(r.name) },
          "reviewRating": { "@type": "Rating", "ratingValue": String(Number(r.rating)), "bestRating": "5", "worstRating": "1" },
          "reviewBody": String(r.text)
        }))
      };
      if(!ld){ ld = document.createElement("script"); ld.type = "application/ld+json"; ld.id = "reviewsLd"; document.head.appendChild(ld); }
      ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": [node] });
    }catch(e){ console.warn("Review markup skipped:", e); }
  }

  DataService.listReviews()
    .then((all) => {
      const reviews = (all || []).filter(isValidReview);
      if (reviews.length === 0) {
        root.innerHTML = `<p style="padding:32px 16px;color:#6B7383;font-size:14px;text-align:center;">No reviews yet. Be the first to share your experience!</p>`;
        return;
      }
      renderSummary(reviews);
      applyReviewsSEO(reviews);
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
