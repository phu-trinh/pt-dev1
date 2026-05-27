/**
 * Custom tracking logic for PDP product data.
 */
(function() {
  // Use a WeakSet to avoid parsing and saving the same element multiple times
  const processedElements = new WeakSet();

  function saveProductDetails() {
    try {
      const productInfoEl = document.querySelector('.data-product-info');
      if (productInfoEl && !processedElements.has(productInfoEl)) {
        processedElements.add(productInfoEl);
        const rawJson = productInfoEl.getAttribute('data-product-info') || productInfoEl.textContent;
        if (rawJson) {
          const productData = JSON.parse(rawJson);
          if (productData) {
            const title = productData.title || '';
            const handle = productData.handle || '';
            const description = productData.description || productData.body_html || '';
            const sku = (productData.variants && productData.variants[0] && productData.variants[0].sku) || '';

            let image = '';
            if (productData.featured_image) {
              image = typeof productData.featured_image === 'string' ? productData.featured_image : (productData.featured_image.src || '');
            }
            if (!image && productData.images && productData.images.length) {
              image = typeof productData.images[0] === 'string' ? productData.images[0] : (productData.images[0].src || '');
            }

            const detailObj = { title, handle, description, sku, image };

            // Store the last viewed product details individually
            localStorage.setItem('last_viewed_product_details', JSON.stringify(detailObj));

            // Append to a list of viewed product details in localStorage
            let detailsList = [];
            try {
              detailsList = JSON.parse(localStorage.getItem('recently_viewed_products_details') || '[]');
            } catch (e) {
              detailsList = [];
            }
            if (!Array.isArray(detailsList)) detailsList = [];

            // Remove if duplicate exists
            detailsList = detailsList.filter(item => item.handle !== handle);
            // Add to the front
            detailsList.unshift(detailObj);
            // Limit to maximum 10 items
            detailsList = detailsList.slice(0, 10);

            localStorage.setItem('recently_viewed_products_details', JSON.stringify(detailsList));
          }
        }
      }
    } catch (error) {
      console.error('Error saving product data to localStorage:', error);
    }
  }

  // 1. Attempt to run immediately
  saveProductDetails();

  // 2. Listen to DOMContentLoaded event if still loading
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', saveProductDetails);
  }

  // 3. Set up a MutationObserver to watch for dynamic DOM hydration / AJAX inserts
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList && node.classList.contains('data-product-info')) {
              shouldCheck = true;
              break;
            }
            if (node.querySelector && node.querySelector('.data-product-info')) {
              shouldCheck = true;
              break;
            }
          }
        }
      }
      if (shouldCheck) break;
    }
    if (shouldCheck) {
      saveProductDetails();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
