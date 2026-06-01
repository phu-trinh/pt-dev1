(function() {
  // State management
  let compareList = [];
  
  // Load initial compare list from sessionStorage
  try {
    compareList = JSON.parse(sessionStorage.getItem('compare_products') || '[]');
  } catch (e) {
    compareList = [];
  }

  // Label formatting helper (matches Liquid label logic)
  function formatLabel(key) {
    const keyParts = key.split('_');
    let label = '';
    for (let part of keyParts) {
      if (part === 'inch') {
        label += ' [Inch]';
      } else if (part === 'cm') {
        label += ' [cm]';
      } else if (['1', '2', '3', '4', '5'].includes(part)) {
        label += ` (${part})`;
      } else {
        const capitalized = part.charAt(0).toUpperCase() + part.slice(1);
        if (label === '') {
          label = capitalized;
        } else {
          label += ' ' + capitalized;
        }
      }
    }
    return label;
  }

  // Safe specs parsing helper
  function parseSpecs(jsonScript) {
    if (!jsonScript) return {};
    try {
      const content = jsonScript.textContent.trim();
      if (!content || content === 'null') return {};
      let parsed = JSON.parse(content);
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch (e) {
      console.error('Error parsing product specs JSON:', e);
      return {};
    }
  }

  // Setup DOM Elements (appended dynamically to body)
  function setupDOMElements() {
    // 1. Bottom Compare Drawer
    if (!document.getElementById('CompareDrawer')) {
      const drawerHtml = `
        <div id="CompareDrawer" class="compare-drawer">
          <button type="button" id="CompareDrawerToggle" class="compare-drawer__toggle" aria-label="Toggle compare drawer">
            <svg class="compare-drawer__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
          <div class="compare-drawer__inner section--page-width">
            <div class="compare-drawer__header">
              <h3 id="CompareDrawerTitle" class="compare-drawer__title">Compare (0)</h3>
              <div class="compare-drawer__actions">
                <button type="button" id="CompareClearAll" class="compare-drawer__clear-btn">Clear All</button>
                <button type="button" id="CompareStartAction" class="compare-drawer__compare-btn" disabled>Compare</button>
              </div>
            </div>
            <div id="CompareDrawerGrid" class="compare-drawer__grid"></div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', drawerHtml);
    }

    // 2. Comparison Modal Popup
    if (!document.getElementById('CompareModalOverlay')) {
      const modalHtml = `
        <div id="CompareModalOverlay" class="compare-modal-overlay">
          <div class="compare-modal">
            <div class="compare-modal__header">
              <h2 class="compare-modal__title">Product Comparison</h2>
              <button type="button" id="CompareModalClose" class="compare-modal__close-btn" aria-label="Close modal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div id="CompareModalBody" class="compare-modal__body"></div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
  }

  // Save current compare state to storage
  function saveState() {
    sessionStorage.setItem('compare_products', JSON.stringify(compareList));
  }

  // Highlight/unhighlight checkboxes on current page & heal stale storage specs/data
  function syncCheckboxes() {
    let updated = false;
    document.querySelectorAll('.compare-checkbox-input').forEach(checkbox => {
      const productId = checkbox.getAttribute('data-product-id');
      const itemIndex = compareList.findIndex(item => String(item.id) === String(productId));
      const isSelected = itemIndex !== -1;
      checkbox.checked = isSelected;

      if (isSelected) {
        const item = compareList[itemIndex];
        const container = checkbox.closest('[data-compare-button]');
        const jsonScript = container ? container.querySelector('.product-specs-json') : null;
        if (jsonScript) {
          const currentSpecs = parseSpecs(jsonScript);
          if (Object.keys(currentSpecs).length > 0 && (!item.specs || Object.keys(item.specs).length === 0)) {
            item.specs = currentSpecs;
            updated = true;
          }
        }

        const currentTitle = checkbox.getAttribute('data-product-title');
        const currentImage = checkbox.getAttribute('data-product-image');
        const currentUrl = checkbox.getAttribute('data-product-url');
        const currentType = checkbox.getAttribute('data-product-type');

        if (currentTitle && !item.title) {
          item.title = currentTitle;
          updated = true;
        }
        if (currentImage && (!item.image || item.image.includes('null') || item.image.includes('undefined'))) {
          item.image = currentImage;
          updated = true;
        }
        if (currentUrl && !item.url) {
          item.url = currentUrl;
          updated = true;
        }
        if (currentType && !item.type) {
          item.type = currentType;
          updated = true;
        }
      }
    });

    if (updated) {
      saveState();
      renderDrawer();
    }
  }

  // Render bottom drawer list
  function renderDrawer() {
    const drawer = document.getElementById('CompareDrawer');
    const title = document.getElementById('CompareDrawerTitle');
    const grid = document.getElementById('CompareDrawerGrid');
    const compareBtn = document.getElementById('CompareStartAction');
    
    if (!drawer || !title || !grid || !compareBtn) return;

    if (compareList.length === 0) {
      drawer.classList.remove('is-visible');
      drawer.classList.remove('is-collapsed');
      return;
    }

    drawer.classList.add('is-visible');
    title.textContent = `Compare (${compareList.length})`;
    compareBtn.disabled = compareList.length < 2;

    // Render 4 slots
    let gridHtml = '';
    for (let i = 0; i < 4; i++) {
      const item = compareList[i];
      if (item) {
        gridHtml += `
          <div class="compare-drawer__slot has-product">
            <div class="compare-drawer__product-card">
              <img class="compare-drawer__product-img" src="${item.image}" alt="${item.title}">
              <p class="compare-drawer__product-title">${item.title}</p>
            </div>
            <button type="button" class="compare-drawer__remove-btn" data-remove-id="${item.id}" aria-label="Remove ${item.title}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        `;
      } else {
        gridHtml += `
          <div class="compare-drawer__slot">
            <span style="font-size: 0.75rem; color: rgba(255,255,255,0.25);">Empty Slot</span>
          </div>
        `;
      }
    }
    grid.innerHTML = gridHtml;
  }

  // Show customized alert
  function showAlert(msg) {
    alert(msg); // Falls back to system alert (can style later if required)
  }

  // Core functions
  function addProduct(product) {
    // Rule: max 4 products
    if (compareList.length >= 4) {
      showAlert('You can compare a maximum of 4 products.');
      return false;
    }

    // Rule: same product type
    if (compareList.length > 0) {
      const currentType = compareList[0].type;
      if (product.type !== currentType) {
        showAlert(`You can only compare products of the same category (${currentType}).`);
        return false;
      }
    }

    compareList.push(product);
    saveState();
    renderDrawer();
    syncCheckboxes();
    return true;
  }

  function removeProduct(productId) {
    compareList = compareList.filter(item => String(item.id) !== String(productId));
    saveState();
    renderDrawer();
    syncCheckboxes();
  }

  function clearAll() {
    compareList = [];
    saveState();
    renderDrawer();
    syncCheckboxes();
  }

  // Open the Compare modal and build comparative spec table
  function openCompareModal() {
    const modalOverlay = document.getElementById('CompareModalOverlay');
    const modalBody = document.getElementById('CompareModalBody');
    if (!modalOverlay || !modalBody) return;

    // 1. Gather all unique spec groups and fields preserving JSON order
    const groupOrder = []; // array of groupKeys to preserve order
    const groupFields = {}; // e.g. { system: [] } containing fieldKeys in order
    
    compareList.forEach(product => {
      if (!product.specs || typeof product.specs !== 'object') return;
      
      Object.keys(product.specs).forEach(groupKey => {
        const groupValue = product.specs[groupKey];
        if (!groupValue || typeof groupValue !== 'object') return;
        
        if (!groupOrder.includes(groupKey)) {
          groupOrder.push(groupKey);
        }
        if (!groupFields[groupKey]) {
          groupFields[groupKey] = [];
        }
        
        Object.keys(groupValue).forEach(fieldKey => {
          if (!groupFields[groupKey].includes(fieldKey)) {
            groupFields[groupKey].push(fieldKey);
          }
        });
      });
    });

    // 2. Build the Comparison Table
    let tableHtml = `<table class="compare-table">`;
    
    // Header Row: Product info cards
    tableHtml += `<tr><th class="compare-table__product-header"></th>`;
    compareList.forEach(product => {
      tableHtml += `
        <th class="compare-table__product-header">
          <div class="compare-table__product-card">
            <img class="compare-table__product-img" src="${product.image}" alt="${product.title}">
            <p class="compare-table__product-title">${product.title}</p>
            <a href="${product.url}" class="compare-table__product-link">View Product</a>
          </div>
        </th>
      `;
    });
    // Pad rest of columns up to 4 if less than 4 compared products
    for (let k = compareList.length; k < 4; k++) {
      tableHtml += `<th></th>`;
    }
    tableHtml += `</tr>`;

    // Spec Rows Grouped (in original JSON order)
    if (groupOrder.length === 0) {
      tableHtml += `<tr><td colspan="5" style="text-align:center; padding: 40px; color: rgba(0,0,0,0.5);">No specifications available to compare.</td></tr>`;
    } else {
      groupOrder.forEach(groupKey => {
        const formattedGroup = groupKey.toUpperCase();
        // Span group header across all columns (label + 4 product columns)
        tableHtml += `
          <tr>
            <td colspan="5" class="compare-table__group-header">${formattedGroup}</td>
          </tr>
        `;
        
        const fields = groupFields[groupKey] || [];
        fields.forEach(fieldKey => {
          const formattedLabel = formatLabel(fieldKey);
          tableHtml += `<tr><td class="compare-table__label">${formattedLabel}</td>`;
          
          compareList.forEach(product => {
            let val = '-';
            if (product.specs && product.specs[groupKey] && product.specs[groupKey][fieldKey] !== undefined) {
              const rawVal = product.specs[groupKey][fieldKey];
              val = rawVal !== null && rawVal !== '' ? String(rawVal).replace(/\n/g, '<br>') : '-';
            }
            tableHtml += `<td class="compare-table__value">${val}</td>`;
          });
          
          // Pad remaining empty columns
          for (let k = compareList.length; k < 4; k++) {
            tableHtml += `<td></td>`;
          }
          
          tableHtml += `</tr>`;
        });
      });
    }

    tableHtml += `</table>`;
    modalBody.innerHTML = tableHtml;
    modalOverlay.classList.add('is-open');
  }

  function closeCompareModal() {
    const modalOverlay = document.getElementById('CompareModalOverlay');
    if (modalOverlay) {
      modalOverlay.classList.remove('is-open');
    }
  }

  // Setup Event Bindings
  function bindEvents() {
    // 1. Page Checkbox Change Handler
    document.addEventListener('change', function(e) {
      if (e.target && e.target.classList.contains('compare-checkbox-input')) {
        const checkbox = e.target;
        const productId = checkbox.getAttribute('data-product-id');
        
        if (checkbox.checked) {
          // Read specifications JSON
          const container = checkbox.closest('[data-compare-button]');
          const jsonScript = container ? container.querySelector('.product-specs-json') : null;
          const specs = parseSpecs(jsonScript);
          
          const product = {
            id: productId,
            title: checkbox.getAttribute('data-product-title'),
            image: checkbox.getAttribute('data-product-image'),
            url: checkbox.getAttribute('data-product-url'),
            type: checkbox.getAttribute('data-product-type'),
            specs: specs
          };
          
          const added = addProduct(product);
          if (!added) {
            checkbox.checked = false;
          }
        } else {
          removeProduct(productId);
        }
      }
    });

    // 2. Drawer Remove Button Click Handler
    document.addEventListener('click', function(e) {
      const removeBtn = e.target.closest('.compare-drawer__remove-btn');
      if (removeBtn) {
        const removeId = removeBtn.getAttribute('data-remove-id');
        removeProduct(removeId);
      }
    });

    // 3. Clear All Button
    document.addEventListener('click', function(e) {
      if (e.target && e.target.id === 'CompareClearAll') {
        clearAll();
      }
    });

    // 4. Compare Start Action Button
    document.addEventListener('click', function(e) {
      if (e.target && e.target.id === 'CompareStartAction') {
        openCompareModal();
      }
    });

    // 5. Drawer Minimize/Expand Toggle
    document.addEventListener('click', function(e) {
      const toggle = e.target.closest('#CompareDrawerToggle');
      if (toggle) {
        const drawer = document.getElementById('CompareDrawer');
        if (drawer) {
          drawer.classList.toggle('is-collapsed');
        }
      }
    });

    // 6. Close Modal triggers
    document.addEventListener('click', function(e) {
      if (e.target && (e.target.closest('#CompareModalClose') || e.target.id === 'CompareModalOverlay')) {
        closeCompareModal();
      }
    });
  }

  // Initialize feature
  function init() {
    setupDOMElements();
    bindEvents();
    renderDrawer();
    syncCheckboxes();
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
