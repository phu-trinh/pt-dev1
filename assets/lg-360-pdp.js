(function () {
  const selectors = {
    root: '[data-lg-360-pdp]',
    open: '[data-lg-360-open]',
    close: '[data-lg-360-close]',
    overlay: '[data-lg-360-overlay]',
    dialog: '[data-lg-360-dialog]',
    content: '[data-lg-360-content]',
    fallback: '[data-lg-360-fallback]',
    customViewer: '[data-lg-360-custom-viewer]',
    frameImage: '[data-lg-360-frame-image]',
    range: '[data-lg-360-range]',
    rangeHandle: '[data-lg-360-range-handle]',
    next: '[data-lg-360-next]',
    prev: '[data-lg-360-prev]',
    spinBlock:
      '.shopify-block[id*="spin_studio_360_product_spin"], .shopify-block[id*="spinstudio"], [id*="spin_studio_360_product_spin"], [id*="spinstudio"]',
    spinRealThumb: '.-spin-studio-large-thumb.reel, .-spin-studio-large-thumb.real, #spin-studio-large-thumb-reel',
  };

  let activeRoot = null;
  let lastFocusedElement = null;
  let spinPlaceholder = null;
  let mountedSpinBlock = null;
  const preloadedFrameSets = new WeakSet();

  function getFocusableElements(container) {
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => element.offsetParent !== null);
  }

  function findSpinBlock(root) {
    const productSection = getProductSection(root);
    const realThumb = Array.from(productSection.querySelectorAll(selectors.spinRealThumb)).find((thumb) => !root.contains(thumb));
    if (!realThumb) return null;

    return realThumb.closest(selectors.spinBlock) || realThumb.parentElement;
  }

  function getProductSection(root) {
    return root.closest('.product-information') || document;
  }

  function hasUsableSpinBlock(candidate) {
    const renderedViewer = candidate.querySelector(selectors.spinRealThumb);

    return Boolean(renderedViewer);
  }

  function getCustomFrames(root) {
    return Array.from(root.querySelectorAll(selectors.frameImage)).filter((image) => image.getAttribute('src'));
  }

  function has360Source(root) {
    const productSection = getProductSection(root);
    const realSpinThumb = Array.from(productSection.querySelectorAll(selectors.spinRealThumb)).find(
      (thumb) => !root.contains(thumb)
    );

    return getCustomFrames(root).length > 0 || Boolean(realSpinThumb);
  }

  function updateRootVisibility(root) {
    const hasSource = has360Source(root);
    root.hidden = false;
    root.dataset.lg360HasSpin = findSpinBlock(root) ? 'true' : 'false';
    root.dataset.lg360Ready = hasSource ? 'true' : 'false';
  }

  function observeSpinStudioAvailability(root) {
    if (root.dataset.lg360ObserverInit === 'true' || getCustomFrames(root).length > 0) return;
    root.dataset.lg360ObserverInit = 'true';

    const productSection = getProductSection(root);
    const observer = new MutationObserver(() => {
      updateRootVisibility(root);
      if (root.dataset.lg360HasSpin === 'true') observer.disconnect();
    });

    observer.observe(productSection || document.body, {
      attributes: true,
      attributeFilter: ['class'],
      childList: true,
      subtree: true,
    });
  }

  function preloadCustomFrames(root, frames) {
    if (preloadedFrameSets.has(root)) return;
    preloadedFrameSets.add(root);

    frames.forEach((image) => {
      if (typeof image.decode === 'function') {
        image.decode().catch(() => {});
      }
    });
  }

  function setCustomFrame(root, frameIndex) {
    const frames = getCustomFrames(root);
    if (frames.length === 0) return;

    const maxFrame = frames.length - 1;
    const idx = Math.max(0, Math.min(maxFrame, Math.round(frameIndex)));
    if (root.dataset.lg360FrameIndex === String(idx)) return;

    const handle = root.querySelector(selectors.rangeHandle);

    frames.forEach((image, index) => {
      image.classList.toggle('is-active', index === idx);
    });
    if (handle) handle.style.left = maxFrame === 0 ? '0%' : `${(idx / maxFrame) * 100}%`;
    root.dataset.lg360FrameIndex = String(idx);
  }

  function showCustomViewer(root) {
    const customViewer = root.querySelector(selectors.customViewer);
    const fallback = root.querySelector(selectors.fallback);
    const frames = getCustomFrames(root);
    if (!customViewer || frames.length === 0) return false;

    customViewer.hidden = false;
    if (fallback) fallback.hidden = true;
    preloadCustomFrames(root, frames);
    delete root.dataset.lg360FrameIndex;
    setCustomFrame(root, 0);
    return true;
  }

  function hideCustomViewer(root) {
    const customViewer = root.querySelector(selectors.customViewer);
    const fallback = root.querySelector(selectors.fallback);
    const frames = getCustomFrames(root);

    if (customViewer) customViewer.hidden = frames.length === 0;
    if (fallback) fallback.hidden = frames.length > 0;
    frames.forEach((image, index) => {
      image.classList.toggle('is-active', index === 0);
    });
    delete root.dataset.lg360FrameIndex;
  }

  function mountSpinBlock(root) {
    const content = root.querySelector(selectors.content);
    const fallback = root.querySelector(selectors.fallback);
    if (!content || content.querySelector(selectors.spinBlock)) return false;

    const spinBlock = findSpinBlock(root);
    if (!spinBlock) return false;

    spinPlaceholder = document.createComment('lg-360-pdp-spin-placeholder');
    spinBlock.parentNode.insertBefore(spinPlaceholder, spinBlock);
    content.appendChild(spinBlock);
    mountedSpinBlock = spinBlock;
    if (fallback) fallback.hidden = true;
    return true;
  }

  function restoreSpinBlock() {
    if (!spinPlaceholder || !spinPlaceholder.parentNode) return;

    if (mountedSpinBlock) {
      spinPlaceholder.parentNode.insertBefore(mountedSpinBlock, spinPlaceholder);
    }

    spinPlaceholder.remove();
    spinPlaceholder = null;
    mountedSpinBlock = null;
  }

  function clientXToFrame(root, clientX) {
    const range = root.querySelector(selectors.range);
    const frames = getCustomFrames(root);
    if (!range || frames.length === 0) return 0;

    const rect = range.getBoundingClientRect();
    const width = rect.width;
    if (width <= 0) return 0;

    const x = Math.min(Math.max(0, clientX - rect.left), width);
    return Math.round((x / width) * (frames.length - 1));
  }

  function openPopup(root) {
    const overlay = root.querySelector(selectors.overlay);
    const dialog = root.querySelector(selectors.dialog);
    if (!overlay || !dialog) return;

    updateRootVisibility(root);
    if (root.hidden) return;

    activeRoot = root;
    lastFocusedElement = document.activeElement;
    const didShowCustomViewer = showCustomViewer(root);
    if (!didShowCustomViewer) mountSpinBlock(root);

    overlay.hidden = false;
    document.body.classList.add('lg-360-pdp-is-open');
    dialog.focus();
  }

  function closePopup(root) {
    const overlay = root.querySelector(selectors.overlay);
    if (!overlay) return;

    overlay.hidden = true;
    document.body.classList.remove('lg-360-pdp-is-open');
    restoreSpinBlock();
    hideCustomViewer(root);

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }

    activeRoot = null;
    lastFocusedElement = null;
  }

  function handleDocumentKeydown(event) {
    if (!activeRoot) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closePopup(activeRoot);
      return;
    }

    if (event.key !== 'Tab') return;

    const dialog = activeRoot.querySelector(selectors.dialog);
    if (!dialog) return;

    const focusableElements = getFocusableElements(dialog);
    if (focusableElements.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  function init360Popup(root) {
    if (root.dataset.lg360PdpInit === 'true') return;
    root.dataset.lg360PdpInit = 'true';
    updateRootVisibility(root);
    observeSpinStudioAvailability(root);
    window.setTimeout(() => updateRootVisibility(root), 1500);
    window.setTimeout(() => updateRootVisibility(root), 2500);

    root.querySelector(selectors.open)?.addEventListener('click', () => openPopup(root));
    root.querySelector(selectors.close)?.addEventListener('click', () => closePopup(root));
    root.querySelector(selectors.overlay)?.addEventListener('click', (event) => {
      if (event.target === event.currentTarget) closePopup(root);
    });

    initCustom360Controls(root);
  }

  function initCustom360Controls(root) {
    const range = root.querySelector(selectors.range);
    const handle = root.querySelector(selectors.rangeHandle);
    if (!range || !handle) return;

    setCustomFrame(root, 0);

    let draggingHandle = false;
    let draggingTrack = false;

    range.addEventListener('pointerdown', (event) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      const onHandle = Boolean(target && (target === handle || handle.contains(target)));

      if (onHandle) {
        draggingHandle = true;
        try {
          handle.setPointerCapture(event.pointerId);
        } catch {
          /* ignore */
        }
      } else {
        setCustomFrame(root, clientXToFrame(root, event.clientX));
        draggingTrack = true;
        try {
          range.setPointerCapture(event.pointerId);
        } catch {
          /* ignore */
        }
      }

      event.preventDefault();
    });

    range.addEventListener('pointermove', (event) => {
      if (draggingTrack) setCustomFrame(root, clientXToFrame(root, event.clientX));
    });

    range.addEventListener('pointerup', (event) => {
      if (!draggingTrack) return;
      draggingTrack = false;
      try {
        range.releasePointerCapture(event.pointerId);
      } catch {
        /* ignore */
      }
    });

    range.addEventListener('pointercancel', () => {
      draggingTrack = false;
    });

    handle.addEventListener('pointermove', (event) => {
      if (!draggingHandle) return;
      setCustomFrame(root, clientXToFrame(root, event.clientX));
    });

    handle.addEventListener('pointerup', (event) => {
      if (!draggingHandle) return;
      draggingHandle = false;
      try {
        handle.releasePointerCapture(event.pointerId);
      } catch {
        /* ignore */
      }
    });

    handle.addEventListener('pointercancel', () => {
      draggingHandle = false;
    });

    root.querySelector(selectors.next)?.addEventListener('click', () => {
      const currentFrame = Number(root.dataset.lg360FrameIndex || 0);
      setCustomFrame(root, currentFrame + 1);
    });

    root.querySelector(selectors.prev)?.addEventListener('click', () => {
      const currentFrame = Number(root.dataset.lg360FrameIndex || 0);
      setCustomFrame(root, currentFrame - 1);
    });
  }

  function initAll360Popups() {
    document.querySelectorAll(selectors.root).forEach(init360Popup);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll360Popups);
  } else {
    initAll360Popups();
  }

  document.addEventListener('shopify:section:load', initAll360Popups);
  document.addEventListener('keydown', handleDocumentKeydown);
})();
