/**
 * applyProdBtnPositions
 * Reads [data-position] on every .prod-btn and converts it to an inline style.
 *
 * data-position format:  "valY,valX|…"  (only the first segment before | is used)
 *   valX starts with "r"  → top/right positioning   (inset: Ypx Xpx auto auto)
 *   valX is a plain number → top/left  positioning   (inset: Ypx auto auto Xpx)
 * All buttons are also set to display:block.
 */
function applyProdBtnPositions() {
    document.querySelectorAll('[data-position]').forEach((el) => {
        const node = /** @type {HTMLElement} */ (el);
        const raw = node.dataset.position;
        if (!raw) return;

        // Take only the first segment (before any "|")
        const segment = raw.split('|')[0] ?? '';
        const [valY, valX] = segment.split(',');
        if (!valY || !valX) return;

        if (valX.startsWith('r')) {
            const right = valX.slice(1); // strip leading "r"
            node.style.inset = `${valY}px ${right}px auto auto`;
        } else {
            node.style.inset = `${valY}px auto auto ${valX}px`;
        }

        node.style.display = 'block';
    });
}

document.addEventListener('DOMContentLoaded', applyProdBtnPositions);

const tabNav = document.querySelector('.tab-nav');

if (tabNav) {
    const nav = /** @type {HTMLElement} */ (tabNav);
    nav.addEventListener('click', (e) => {
        const target = /** @type {HTMLElement | null} */ (e.target instanceof HTMLElement ? e.target : null);
        const link = target ? target.closest('a[href^="#"]') : null;
        if (!link) return;

        e.preventDefault();

        const href = link.getAttribute('href');
        if (!href) return;
        const targetId = href.slice(1);
        const targetArticle = /** @type {HTMLElement | null} */ (document.getElementById(targetId));
        if (!targetArticle) return;

        const currentArticle = /** @type {HTMLElement | null} */ (document.querySelector('.visual-img-area > article.active'));
        if (currentArticle === targetArticle) return;

        // Update tab nav active state immediately
        nav.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        const li = link.closest('li');
        if (li) li.classList.add('active');

        const DURATION = 350; // ms

        if (currentArticle) {
            // Fade out current panel
            currentArticle.style.transition = `opacity ${DURATION}ms ease`;
            currentArticle.style.opacity = '0';

            setTimeout(() => {
                currentArticle.classList.remove('active');
                currentArticle.style.transition = '';
                currentArticle.style.opacity = '';

                // Fade in next panel
                targetArticle.style.opacity = '0';
                targetArticle.classList.add('active');
                // Force reflow so the browser registers opacity:0 before transition starts
                targetArticle.getBoundingClientRect();
                targetArticle.style.transition = `opacity ${DURATION}ms ease`;
                targetArticle.style.opacity = '1';

                setTimeout(() => {
                    targetArticle.style.transition = '';
                    targetArticle.style.opacity = '';
                }, DURATION);
            }, DURATION);
        } else {
            // No current panel — just show the target
            targetArticle.classList.add('active');
        }
    });
}

/**
 * prod_zoom_func
 * @param {string} roomClass  - class of the article wrapper, e.g. 'creative-studio'
 * @param {string} prodNum    - product identifier, e.g. '40wt95uf'
 * @param {string} _p3        - zoom/scale params (unused for now)
 * @param {string} _p4        - zoom/scale params (unused for now)
 * @param {string} _p5        - zoom/scale params (unused for now)
 */
function prod_zoom_func(roomClass, prodNum, _p3, _p4, _p5) {
    const article = /** @type {HTMLElement | null} */ (document.querySelector(`article.${roomClass}`));
    if (!article) return;

    applyPanoramaBgZoom(article, _p3, _p4, _p5);

    // Let the background zoom animation start before showing the overlay content.
    window.setTimeout(() => {
        // Show matching higher-res overlay image, hide the rest
        article.querySelectorAll('.img-higher img').forEach((imgEl) => {
            const img = /** @type {HTMLImageElement} */ (imgEl);
            img.style.display = img.dataset.prodNum === prodNum ? 'block' : 'none';
        });

        // Fade in matching product info panel, fade out the rest
        article.querySelectorAll('.info-wrap .prod-info').forEach((panelEl) => {
            const panel = /** @type {HTMLElement} */ (panelEl);
            // Remove inline display:none from Liquid so CSS transitions can work.
            panel.style.display = 'block';
            if (panel.dataset.prodNum === prodNum) {
                panel.classList.add('is-open');
            } else {
                panel.classList.remove('is-open');
            }
        });
    }, 400);
}

function parseZoomParam(/** @type {unknown} */ str) {
    if (!str || typeof str !== 'string') return null;
    const parts = str.split('|').map(s => s.trim());
    if (parts.length < 3) return null;
    const scale = Number(parts[0]);
    const x = Number(parts[1]);
    const y = Number(parts[2]);
    if (!Number.isFinite(scale) || !Number.isFinite(x) || !Number.isFinite(y)) return null;
    return { scale, x, y };
}

function pickZoomParam(
    /** @type {unknown} */ p3,
    /** @type {unknown} */ p4,
    /** @type {unknown} */ p5
) {
    // Heuristic: these templates typically pass 3 zoom configs for responsive breakpoints.
    // p3: desktop, p4: tablet, p5: mobile
    const w = window.innerWidth || 0;
    if (w >= 1024) return parseZoomParam(p3) || parseZoomParam(p4) || parseZoomParam(p5);
    if (w >= 768) return parseZoomParam(p4) || parseZoomParam(p3) || parseZoomParam(p5);
    return parseZoomParam(p5) || parseZoomParam(p4) || parseZoomParam(p3);
}

function applyPanoramaBgZoom(
    /** @type {HTMLElement} */ article,
    /** @type {unknown} */ p3,
    /** @type {unknown} */ p4,
    /** @type {unknown} */ p5
) {
    const img = /** @type {HTMLImageElement | null} */ (article.querySelector('.panorama-inner img.img'));
    if (!img) return;

    // Preserve the original inline values once, so Back can restore them reliably.
    if (!img.dataset.lgPointOrigTransform) {
        img.dataset.lgPointOrigTransform = img.style.transform || '';
    }
    if (!img.dataset.lgPointOrigTransformOrigin) {
        img.dataset.lgPointOrigTransformOrigin = img.style.transformOrigin || '';
    }

    const z = pickZoomParam(p3, p4, p5);
    if (z) {
        img.style.transformOrigin = `${z.x}px ${z.y}px`;
    }

    // Mild zoom for "background focus" effect (independent from product zoom scale params).
    img.dataset.lgPointBgZoomed = '1';

    // Force a new frame so CSS transition consistently fires.
    img.style.transform = img.dataset.lgPointOrigTransform || 'scale(1)';
    img.getBoundingClientRect();
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // Use per-product scale from the zoom param so each point can tune intensity.
            img.style.transform = `scale(${z ? z.scale : 1.25})`;
        });
    });
}

/**
 * zoomOutPos
 * Resets the active article back to the default panorama view.
 */
function zoomOutPos() {
    const article = /** @type {HTMLElement | null} */ (document.querySelector('.visual-img-area > article.active'));
    if (!article) return;

    const bgImg = /** @type {HTMLImageElement | null} */ (article.querySelector('.panorama-inner img.img'));
    if (bgImg && bgImg.dataset.lgPointBgZoomed === '1') {
        bgImg.style.transform = bgImg.dataset.lgPointOrigTransform || '';
        bgImg.style.transformOrigin = bgImg.dataset.lgPointOrigTransformOrigin || '';
        delete bgImg.dataset.lgPointBgZoomed;
    }

    article.querySelectorAll('.img-higher img').forEach((imgEl) => {
        const img = /** @type {HTMLImageElement} */ (imgEl);
        img.style.display = 'none';
    });

    article.querySelectorAll('.info-wrap .prod-info').forEach((panelEl) => {
        const panel = /** @type {HTMLElement} */ (panelEl);
        panel.classList.remove('is-open');
        // keep display:block; CSS handles visibility/pointer-events
    });
}

// Expose to global scope so inline onclick handlers in the Liquid template can call them
window.prod_zoom_func = prod_zoom_func;
window.zoomOutPos = zoomOutPos;

/** 360° product view in #room-prod (25 frames: 00.png … 24.png). */
const ROOM_PROD_RENDER360_BASE = 'https://digital-showroom.lge.com/images/render360/';
const ROOM_PROD_FRAME_MAX = 24;

/** In-flight / completed preload per product so we do not duplicate 25× requests. */
const roomProdPreloadByProd = new Map();

/**
 * @param {string} prodNum
 * @param {number} frameIndex 0 … 24
 */
function roomProdFrameUrl(prodNum, frameIndex) {
    const n = Math.max(0, Math.min(ROOM_PROD_FRAME_MAX, Math.round(frameIndex)));
    return `${ROOM_PROD_RENDER360_BASE}${prodNum}/${String(n).padStart(2, '0')}.png`;
}

/**
 * Warm HTTP cache + decode pipeline for all 360 frames (parallel).
 * @param {string} prodNum
 * @returns {Promise<void>}
 */
function preloadRoomProdFrames(prodNum) {
    const key = prodNum.trim();
    if (!key) return Promise.resolve();

    const existing = roomProdPreloadByProd.get(key);
    if (existing) return existing;

    const jobs = [];
    for (let i = 0; i <= ROOM_PROD_FRAME_MAX; i++) {
        const url = roomProdFrameUrl(key, i);
        jobs.push(
            new Promise((/** @type {(value?: void) => void} */ resolve) => {
                const im = new Image();
                im.onload = () => {
                    if (typeof im.decode === 'function') {
                        im.decode().then(() => resolve()).catch(() => resolve());
                    } else {
                        resolve();
                    }
                };
                im.onerror = () => resolve();
                im.src = url;
            })
        );
    }

    const p = Promise.all(jobs).then(() => {});
    roomProdPreloadByProd.set(key, p);
    return p;
}

/**
 * @param {HTMLElement} overlay
 * @param {number} frameIndex
 */
function setRoomProdFrame(overlay, frameIndex) {
    const prodNum = overlay.dataset.roomProdNum;
    if (!prodNum) return;

    const idx = Math.max(0, Math.min(ROOM_PROD_FRAME_MAX, Math.round(frameIndex)));
    if (overlay.dataset.roomFrameIndex === String(idx)) return;

    const img = /** @type {HTMLImageElement | null} */ (overlay.querySelector('.img-wrap img'));
    const handle = /** @type {HTMLElement | null} */ (overlay.querySelector('.range .ui-slider-handle'));

    if (img) img.src = roomProdFrameUrl(prodNum, idx);
    if (handle) handle.style.left = `${(idx / ROOM_PROD_FRAME_MAX) * 100}%`;
    overlay.dataset.roomFrameIndex = String(idx);
}

function hideRoomProd() {
    const overlay = /** @type {HTMLElement | null} */ (document.getElementById('room-prod'));
    if (!overlay) return;
    overlay.style.display = 'none';
    delete overlay.dataset.roomProdNum;
    delete overlay.dataset.roomFrameIndex;
}

function showRoomProd(/** @type {string} */ prodNum) {
    const overlay = /** @type {HTMLElement | null} */ (document.getElementById('room-prod'));
    if (!overlay) return;

    const key = prodNum.trim();
    overlay.dataset.roomProdNum = key;
    overlay.style.display = 'block';
    void preloadRoomProdFrames(key);
    /* New product must refresh src even when still at frame 0 (same index skips update). */
    delete overlay.dataset.roomFrameIndex;
    setRoomProdFrame(overlay, 0);
}

function initRoomProd360() {
    const overlay = /** @type {HTMLElement | null} */ (document.getElementById('room-prod'));
    if (!overlay || overlay.dataset.roomProdSliderInit === '1') return;
    overlay.dataset.roomProdSliderInit = '1';

    const range = /** @type {HTMLElement | null} */ (overlay.querySelector('.range'));
    const handle = /** @type {HTMLElement | null} */ (overlay.querySelector('.range .ui-slider-handle'));
    if (!range || !handle) return;

    const rangeEl = range;
    const handleEl = handle;

    /**
     * @param {number} clientX
     */
    function clientXToFrame(clientX) {
        const rect = rangeEl.getBoundingClientRect();
        const w = rect.width;
        if (w <= 0) return 0;
        const x = Math.min(Math.max(0, clientX - rect.left), w);
        return Math.round((x / w) * ROOM_PROD_FRAME_MAX);
    }

    let draggingHandle = false;
    let draggingTrack = false;

    rangeEl.addEventListener('pointerdown', (e) => {
        const t = /** @type {HTMLElement | null} */ (e.target instanceof HTMLElement ? e.target : null);
        const onHandle = Boolean(t && (t === handleEl || handleEl.contains(t)));
        if (onHandle) {
            draggingHandle = true;
            try {
                handleEl.setPointerCapture(e.pointerId);
            } catch {
                /* ignore */
            }
        } else {
            setRoomProdFrame(overlay, clientXToFrame(e.clientX));
            draggingTrack = true;
            try {
                rangeEl.setPointerCapture(e.pointerId);
            } catch {
                /* ignore */
            }
        }
        e.preventDefault();
    });

    rangeEl.addEventListener('pointermove', (e) => {
        if (draggingTrack) {
            setRoomProdFrame(overlay, clientXToFrame(e.clientX));
        }
    });

    rangeEl.addEventListener('pointerup', (e) => {
        if (!draggingTrack) return;
        draggingTrack = false;
        try {
            rangeEl.releasePointerCapture(e.pointerId);
        } catch {
            /* ignore */
        }
    });

    rangeEl.addEventListener('pointercancel', () => {
        draggingTrack = false;
    });

    handleEl.addEventListener('pointermove', (e) => {
        if (!draggingHandle) return;
        setRoomProdFrame(overlay, clientXToFrame(e.clientX));
    });

    handleEl.addEventListener('pointerup', (e) => {
        if (!draggingHandle) return;
        draggingHandle = false;
        try {
            handleEl.releasePointerCapture(e.pointerId);
        } catch {
            /* ignore */
        }
    });

    handleEl.addEventListener('pointercancel', () => {
        draggingHandle = false;
    });

    overlay.querySelector('.btn-plus')?.addEventListener('click', () => {
        const cur = Number(overlay.dataset.roomFrameIndex || 0);
        setRoomProdFrame(overlay, cur + 1);
    });

    overlay.querySelector('.btn-minus')?.addEventListener('click', () => {
        const cur = Number(overlay.dataset.roomFrameIndex || 0);
        setRoomProdFrame(overlay, cur - 1);
    });

    overlay.addEventListener('click', (e) => {
        const t = /** @type {HTMLElement | null} */ (e.target instanceof HTMLElement ? e.target : null);
        if (t?.closest('.btn-close')) {
            e.preventDefault();
            hideRoomProd();
            return;
        }
        if (t?.classList.contains('popup-bg')) {
            hideRoomProd();
        }
    });
}

function setupRoomProdModal() {
    initRoomProd360();

    document.addEventListener(
        'mouseover',
        (e) => {
            const t = /** @type {Element | null} */ (e.target instanceof Element ? e.target : null);
            const btn = /** @type {HTMLElement | null} */ (t?.closest('.info-wrap .btn-area .btn-modal'));
            if (!btn || btn.classList.contains('disabled')) return;
            const pn = btn.getAttribute('data-prod-num');
            if (!pn || btn.dataset.room360Preload === '1') return;
            btn.dataset.room360Preload = '1';
            void preloadRoomProdFrames(pn);
        },
        true
    );

    document.addEventListener('click', (e) => {
        const t = /** @type {HTMLElement | null} */ (e.target instanceof HTMLElement ? e.target : null);
        const btn = t?.closest('.info-wrap .btn-area .btn-modal');
        if (!btn || btn.classList.contains('disabled')) return;

        const prodNum = btn.getAttribute('data-prod-num');
        if (!prodNum) return;

        e.preventDefault();
        showRoomProd(prodNum);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupRoomProdModal);
} else {
    setupRoomProdModal();
}
