/// PF600U 가시성 제어 함수 - 무한 루프 방지 버전
let isUpdatingPF600U = false;
function updatePF600UVisibility() {
  if (isUpdatingPF600U) {
    return;
  }

  isUpdatingPF600U = true;

  let root = document.getElementById('projection-calculator-en-root');
  let pSel = root.querySelector('#modelName');

  let puItm = pSel.querySelector('option[value="PF600U"]');

  // console.log('============ 현재 언어:', currentStatus.lang, '현재 프로젝터 타입:', currentStatus.projectorType);

  if (puItm) {
    if (currentStatus.lang == 'kr') {
      if (puItm.hasAttribute('disabled') || puItm.style.display !== 'initial') {
        puItm.removeAttribute('disabled');
        puItm.style.display = 'initial';
      }
    } else {
      if (!puItm.hasAttribute('disabled') || puItm.style.display !== 'none') {
        puItm.setAttribute('disabled', 'disabled');
        puItm.style.display = 'none';

        if (currentStatus.modelName == 'PF600U') {
          let firstOption = pSel.querySelector('option:not([value="PF600U"])');
          if (firstOption && pSel.value !== firstOption.getAttribute('value')) {
            pSel.value = firstOption.getAttribute('value');

            isUpdatingPF600U = false;
            changeValues.changeAction({ target: pSel });
            return;
          }
        }
      }
    }
  } else {
    setTimeout(function () {
      let newPuItm = pSel.querySelector('option[value="PF600U"]');
      if (newPuItm && currentStatus.lang != 'kr') {
        if (!newPuItm.hasAttribute('disabled') || newPuItm.style.display !== 'none') {
          newPuItm.setAttribute('disabled', 'disabled');
          newPuItm.style.display = 'none';
        }
      }
      isUpdatingPF600U = false;
    }, 100);
    return;
  }

  isUpdatingPF600U = false;
}
function setupPF600UVisibilityHandlers() {
  let root = document.getElementById('projection-calculator-en-root');

  let projTypeInputs = root.querySelectorAll('input[name="projectorType"]');
  projTypeInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      setTimeout(updatePF600UVisibility, 300);
    });
  });

  let modelSelect = root.querySelector('#modelName');
  if (modelSelect) {
    let observerTimeout = null;
    const observer = new MutationObserver(function (mutations) {
      if (observerTimeout) {
        clearTimeout(observerTimeout);
      }

      observerTimeout = setTimeout(function () {
        updatePF600UVisibility();
        observerTimeout = null;
      }, 100);
    });

    observer.observe(modelSelect, {
      childList: true,
    });

    modelSelect.addEventListener('change', function () {
      setTimeout(updatePF600UVisibility, 100);
    });
  }
}

// startjs
const currentStatus = {
  lang: 'en',
  units: 'cm',
  projectorType: 'LG ProBeam',
  modelName: 'BU70Q',
  displayName: 'BU70Q',
  availableLenses: 'Fixed',
  throwType: 'normal', // ust, normal
  installType: 'Ceiling mount',
  aspectRatio: '16:9',

  userHeight: 1800,

  distance: 2160,

  diagonal1: 40, // inch
  diagonal2: 102, // cm
  screenWidth: 890,
  screenHeight: 500,

  roomWidth: 4500,
  roomHeight: 4500,
  roomDepth: 6000,

  fromTop: 500,
  fromBottom: 2500,
  fromLeft: 1310,
  fromRight: 1310,

  shiftVertical: 50,
  shiftHorizontal: 0,

  zoomRange: 1,

  lensPosition: {
    x: 1750,
    y: 500,
    d: 2160,
  },
  userPosition: {
    x: 1750,
    d: 2000,
  },

  coefficient: 4.429,
  correction: 46,
  roomSizeRatio: 0.057777777,

  lockYn: {
    distance: false,
    screenSize: false,
    roomDimension: false,
    lensPosition_vertical: false,
    lensPosition_horizontal: false,
    userHeight: false,
  },

  overwrapRoom: false, // side view, the projector can exist outside room (only lens is in room, it's ok) - true

  rangeData: {
    // range data
    screenInches: {
      min: 40,
      max: 300,
      default: 'min',
    },
    distance: {
      min: 2160,
      max: 16500,
      default: 'min',
    },
    throwRatio: {
      min: 1.54,
      max: 2.46,
    },
    coefficient: {
      min: 2.7691,
      max: 4.429, //min,max from zoom range - zoom min is coe max
      default: 'max',
    },
    correction: {
      min: 46, //min,max from zoom range - zoom min is cor min
      max: 54.5,
      default: 'min',
    },
    zoomRange: {
      min: 1,
      max: 1.6,
      default: 1,
    },
    shiftVertical: {
      min: -33,
      max: 60,
      default: 50,
    },
    shiftHorizontal: {
      min: -28,
      max: 28,
      default: 0,
    },
    userHeight: {
      min: 1000,
      max: 2300,
      default: 1800,
    },
    roomWidth: {
      min: 1820,
      max: 20000,
      default: 4500,
    },
    roomHeight: {
      min: 1820,
      max: 20000,
      default: 4500,
    },
    roomDepth: {
      min: 1820,
      max: 20000,
      default: 6000,
    },
  },
  disabledPosition: {
    // can move :: prj and man..cannot move in this limit.
    projector: null,
    silhouette: null,
  },
};

let languageObj = null;
function setLanguageObj() {
  if (currentStatus.lang == 'kr') {
    languageObj = Object.assign({}, languageObj_kr.messages);
    languageObj.title = languageObj_kr.title;
  } else if (currentStatus.lang == 'en') {
    languageObj = Object.assign({}, languageObj_en.messages);
    languageObj.title = languageObj_en.title;
  } else {
    languageObj = Object.assign({}, languageObj_en.messages);
    languageObj.title = languageObj_en.title;
  }
}

const renderFunction = {
  getUnitsValue: function () {
    // get current unit - name
    let rtn = '';
    rtn = languageObj[currentStatus.units];
    return rtn;
  },
  getRangeFromData: function (tgt, step) {
    // tgt : item name
    let stp = '';
    let d = currentStatus.rangeData[tgt] || null;
    let rtn = '';
    if (!tgt || !d) {
      return 'No data';
    }
    let min = d.min;
    let max = d.max;
    if (tgt.indexOf('shift') > -1) {
      // lensShift
      if (min == max) {
        rtn = '';
      } else if (min * min == max * max) {
        rtn = '±' + max;
      } else {
        rtn = min + '~' + max;
      }
      if (tgt.indexOf('Vertical') > -1) {
        rtn = languageObj.Vertical + '(' + rtn + ')';
      } else {
        rtn = languageObj.Horizontal + '(' + rtn + ')';
      }
    } else {
      // humanHeight
      // distance
      rtn = min == max ? min : min + '~' + max;
    }

    if (typeof renderFunction[step] == 'function') {
      stp = renderFunction[step]();
      min = commonFunc.calculateUnits(min).value;
      max = commonFunc.calculateUnits(max).value;
      rtn = min + '~' + max;
    } else {
      stp = step;
    }

    rtn = rtn + ' ' + stp;

    return rtn;
  },
  getCurrentDateTime: function () {
    let date = new Date();
    let m2 = (date.getMonth() + 1).toString().padStart(2, '0');
    let dd = date.getDate().toString().padStart(2, '0');
    let hh = date.getHours().toString().padStart(2, '0');
    let mm = date.getMinutes().toString().padStart(2, '0');
    return `${date.getFullYear()}.${m2}.${dd} ${hh}:${mm}`;
  },
};

const setHtmlTags = {
  rootPath: '/global/business/',
  // app layout
  languageChange: function (lang) {
    let root = document.getElementById('projection-calculator-en-root');
    // change language
    lang = lang ? lang : currentStatus.lang == 'en' ? 'kr' : 'en';
    if (lang == currentStatus.lang) {
      return;
    }
    if (['en', 'kr'].indexOf(lang) == -1) {
      lang = 'en';
    }
    currentStatus.lang = lang;
    root.setAttribute('lang', lang == 'kr' ? 'ko' : 'en');
    window.history.pushState({ lang: lang }, null, setHtmlTags.rootPath + 'projection-calculator-' + lang);
    document.title = languageObj.title;
    setLanguageObj();
    this.layout();

    // 언어 변경 후 PF600U 업데이트
    updatePF600UVisibility();

    setHtmlTags.inquiryToBuy(false);
  },
  layout: function (el) {
    let root = document.getElementById('projection-calculator-en-root');
    let lang = currentStatus.lang;
    root.setAttribute('lang', lang == 'kr' ? 'ko' : 'en');
    let wrap;
    if (el) {
      wrap = root.querySelector(el);
    } else {
      wrap = root;
    }
    let itms = wrap.querySelectorAll('[data-text]');
    itms.forEach(function (c) {
      let nm = c.getAttribute('data-text');
      let txt = languageObj[nm];
      if (txt) {
        c.innerHTML = txt;
      }
    });
    let fnItm = root.querySelectorAll('[data-text-fn]');
    fnItm.forEach(function (c) {
      let nm = c.getAttribute('data-text-fn');
      let txt = '';
      if (typeof renderFunction[nm] == 'function') {
        let fn = renderFunction[nm];
        let tgt = c.getAttribute('data-fn-target') || '';
        let stp = c.getAttribute('data-fn-step') || '';
        txt = fn(tgt, stp);
      }
      if (txt) {
        c.innerHTML = txt;
      }
    });
    let linkItm = root.querySelectorAll('[data-link]');
    linkItm.forEach(function (c) {
      c.href = languageObj[c.getAttribute('data-link')];
    });
  },
  control: function () {
    // change events
    let root = document.getElementById('projection-calculator-en-root');
    let frm = document.forms.controlForm;
    let itms = frm.querySelectorAll('input, select');
    let clbk = function (e) {
      let el = e.target;
      if (el.getAttribute('name') == 'dragLock') {
        changeValues.lock(e);
      } else {
        changeValues.changeAction(e);
      }
    };
    itms.forEach(function (c) {
      let tp = 'change';
      if (c.type == 'radio' || c.type == 'checkbox') {
        tp = 'click';
      } else if (c.type == 'range') {
        tp = 'input';
      }
      if (c.type == 'text' && !!c.parentElement.querySelector('.cm')) {
        c.preInputValue = c.value;
        c.addEventListener('input', function (e) {
          let cc = e.target;
          if (isNaN(+cc.value) && cc.value != '-') {
            cc.value = cc.preInputValue;
          }
          cc.preInputValue = cc.value;
        });
      }
      c.removeEventListener(tp, clbk);
      c.addEventListener(tp, clbk);
    });

    let lockBtns = frm.querySelectorAll('.lock-btn');
    lockBtns.forEach(function (c) {
      c.removeEventListener('click', changeValues.lockBtn);
      c.addEventListener('click', changeValues.lockBtn);
    });

    let fold = frm.querySelectorAll('.fold-btn[data-fold-target], .advanced-setting[data-fold-target]');
    fold.forEach(function (cc) {
      cc.addEventListener('click', function (e) {
        let c = e.target;
        let t = c.getAttribute('data-fold-target');
        let tgt = frm.querySelector('[data-fold="' + t + '"]');
        if (c.classList.contains('fold')) {
          c.classList.remove('fold');
          tgt.style.display = 'none';
        } else {
          c.classList.add('fold');
          tgt.style.display = 'block';
        }
      });
    });

    let resetBtn = root.querySelector('#reset-btn');
    resetBtn.addEventListener('click', function (e) {
      changeValues.resetFunc();
      setHtmlTags.layerPop.closePop();
    });

    // let langBtn = root.querySelector('header .lang');
    // langBtn.addEventListener('click', function (e) {
    //   e.preventDefault();
    //   setHtmlTags.languageChange();
    //   return false;
    // });

    // let moMenuBtn = root.querySelector('header .checkbox.menu-btn');
    // let moMenu = root.querySelector('header .menu');
    // moMenuBtn.addEventListener('click', function (e) {
    //   if (e.target.checked) {
    //     moMenu.classList.add('opened');
    //   } else {
    //     moMenu.classList.remove('opened');
    //   }
    // });

    let aside = root.querySelector('aside');
    let views = root.querySelector('.elevation-section');
    let moNextBtn = aside.querySelector('.next-button');
    let moPrevBtn = views.querySelector('.change-setting-btn .back-btn');
    moNextBtn.addEventListener('click', function () {
      aside.classList.add('hide');
      views.classList.add('show');
      window.scrollTo(0, 0);
    });
    moPrevBtn.addEventListener('click', function () {
      aside.classList.remove('hide');
      views.classList.remove('show');
      window.scrollTo(0, 0);
    });

    let pdfBtn = root.querySelector('.share-section .pdf-storage');
    pdfBtn.addEventListener('click', function () {
      window.print();
    });
    window.addEventListener('beforeprint', function (e) {
      setHtmlTags.pdfPop();
    });

    // let inqBtn = root.querySelector('header #goto-inquiry');
    // inqBtn.addEventListener('click', function () {
    //   setHtmlTags.inquiryToBuy(true);
    // });

    // root.querySelector('header .main-title').addEventListener('click', function () {
    //   setHtmlTags.inquiryToBuy(false);
    // });
    this.updownFunc();
  },
  updownFunc: function () {
    let frm = document.forms.controlForm;
    let evt1 = ['mousedown', 'mouseout', 'mouseup'];
    let evt2 = ['touchstart', 'touchcancle', 'touchend'];
    let evt;
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      evt = evt2;
    } else {
      evt = evt1;
    }
    let updown = frm.querySelectorAll('.btn-updown');
    updown.forEach(function (c) {
      let inp = frm[c.getAttribute('data-target')];
      if (!!inp) {
        c.querySelectorAll('button').forEach(function (cc) {
          cc.addEventListener('click', function (e) {
            let ud = e.target.classList.contains('increase')
              ? true
              : e.target.classList.contains('decrease')
                ? false
                : null;
            inpPlusMinus(inp, ud);
          });
          let clickInterval = null;
          function btnFuncCancel(e) {
            clearInterval(clickInterval);
            clickInterval = null;
            window.removeEventListener(evt[1], btnFuncCancel);
            window.removeEventListener(evt[2], btnFuncCancel);
            if (evt[0].indexOf('touch') > -1) {
              window.removeEventListener('touchmove', updown_touchmove);
            }
          }
          function updown_touchmove(e) {
            let rect = cc.getBoundingClientRect();
            let t = e.touches[0];
            if (t.clientX < rect.left || t.clientX > rect.right || t.clientY < rect.top || t.clientY > rect.bottom) {
              btnFuncCancel(e);
            }
          }
          cc.addEventListener(evt[0], function (e) {
            clickInterval = setInterval(function () {
              e.target.click();
            }, 200);
            if (evt[0].indexOf('touch') > -1) {
              window.addEventListener('touchmove', updown_touchmove);
            }
            window.addEventListener(evt[1], btnFuncCancel);
            window.addEventListener(evt[2], btnFuncCancel);
          });
        });
      }
    });

    let cm = frm.querySelectorAll('.form-group .cm');
    cm.forEach(function (c) {
      let inp = c.parentElement.querySelector('input');
      inp.addEventListener('keydown', function (e) {
        // keypress events
        if (e.keyCode == 38) {
          inpPlusMinus(inp, true);
        } else if (e.keyCode == 40) {
          inpPlusMinus(inp, false);
        }
      });
    });

    function inpPlusMinus(inp, ud) {
      let v = +inp.value;
      if (ud == true) {
        v = parseInt(+v + 1);
      } else if (ud == false) {
        v = parseInt(+v - 1);
      }
      if (!inp.getAttribute('readonly')) {
        inp.value = v;
        changeValues.changeAction({ target: inp });
      }
    }
  },
  popups: function () {
    // open/close reset pop
    let root = document.getElementById('projection-calculator-en-root');
    let layId = 'reset-popup';
    root.querySelector('aside .reset-button').addEventListener('click', function () {
      setHtmlTags.layerPop.openPop(layId);
    });
    root.querySelector('#' + layId + ' .buttons button:last-child').addEventListener('click', function () {
      setHtmlTags.layerPop.closePop(layId);
    });

    // open/close howto layer
    let lay = 'howto-popup';
    root.querySelector('aside .instruction-btn').addEventListener('click', function () {
      setHtmlTags.layerPop.openPop(lay);
    });
    root.querySelector('#' + lay + ' .close-btn').addEventListener('click', function () {
      setHtmlTags.layerPop.closePop(lay);
    });
  },
  inquiryToBuy: function (flag) {
    let root = document.getElementById('projection-calculator-en-root');
    let inq = root.querySelector('#inquiry-iframe');
    let lang = currentStatus.lang;
    if (flag == true) {
      if (!location.search || location.search.indexOf('InquiryToBuy') == -1) {
        window.history.pushState(
          { lang: currentStatus.lang, inquiry: true },
          null,
          setHtmlTags.rootPath + 'projection-calculator-' + lang + '?InquiryToBuy',
        );
      }
      root.classList.add('inquiry-page');
      inq.src = inq.getAttribute('data-src');
    } else {
      if (!!location.search && location.search.indexOf('InquiryToBuy') > -1) {
        window.history.pushState(
          { lang: currentStatus.lang, inquiry: false },
          null,
          setHtmlTags.rootPath + 'projection-calculator-' + lang,
        );
      }
      root.classList.remove('inquiry-page');
      inq.src = 'about:blank';
    }

    // PF600U 업데이트
    updatePF600UVisibility();
  },
  snsShare: function () {
    let root = document.getElementById('projection-calculator-en-root');
    // sns tooltip open/hide
    let btn = root.querySelector('.share-section .share-btn');
    let lay = root.querySelector('.share-section #tooltip-share');
    btn.addEventListener('click', function () {
      if (lay.classList.contains('opened')) {
        lay.classList.remove('opened');
      } else {
        lay.classList.add('opened');
      }
    });
    lay.querySelector('.btn-close').addEventListener('click', function () {
      lay.classList.remove('opened');
    });
    // sns share url and copy url
    lay.querySelectorAll('.sns-list li button').forEach(function (c) {
      c.addEventListener('click', function (e) {
        let b = e.target;
        let tgt = c.getAttribute('data-link-name');
        if (tgt == 'facebook') {
          shareFacebook();
        } else if (tgt == 'twitter') {
          shareTwitter();
        } else if (tgt == 'copy_url') {
          copyUrl();
        } else if (tgt == 'kakaotalk') {
          // do nothing. not in use now...
        }
      });
    });
    function shareFacebook() {
      const sharedUrl = 'https://www.lg.com' + location.pathname;
      window.open(
        'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(sharedUrl),
        'LG Projection Calculator',
        'width=400, height=400',
      );
    }
    function shareTwitter() {
      const sharedUrl = 'https://www.lg.com' + location.pathname;
      var txt = 'LG Projection Calculator';
      window.open(
        'https://twitter.com/intent/tweet?text=' + txt + '&url=' + sharedUrl,
        'LG Projection Calculator',
        'width=400, height=400',
      );
    }
    function copyUrl() {
      const sharedUrl = 'https://www.lg.com' + location.pathname;
      try {
        navigator.clipboard.writeText(sharedUrl);
      } catch (e) {
        console.log(e);
      }
    }
  },
  pdfPop: function () {
    let root = document.getElementById('projection-calculator-en-root');
    let pdf = root.querySelector('#pdf-wrapper');
    let frm = document.forms.controlForm;
    this.layout('#pdf-wrapper');

    pdf.querySelectorAll('[data-target]').forEach(function (c) {
      let cs = currentStatus;
      let ln = languageObj;
      let nm = c.getAttribute('data-target');
      let inp = frm[nm];
      let un = '';
      let val = inp ? inp.value : '';
      if (nm == 'userHeight') {
        let div = c.parentElement;
        let dsp = frm.querySelector('.user-height').style.display;
        div.style.display = dsp;
      } else if (nm == 'shiftVertical') {
        let dsp = frm.querySelector('.lens-shift').style.display;
        let div = c.parentElement.parentElement;
        div.style.display = dsp;
      }

      if (nm == 'units') {
        val = ln['UNITS'] + ' : ' + ln[currentStatus.units];
      } else if (nm == 'modelName') {
        val = cs.projectorType + ' ' + cs.displayName;
      }
      if (nm == 'zoomRange') {
        val = inp[0].value;
        un = ' x';
        if (root.querySelector('.elevation-section').classList.contains('zoom-hide')) {
          c.parentElement.style.display = 'none';
        } else {
          c.parentElement.style.display = 'block';
        }
      } else if (nm.indexOf('shift') == 0) {
        un = '%';
      } else if (nm == 'diagonal1') {
        un = ' ' + ln.inch;
      } else if (nm == 'diagonal2') {
        un = ' ' + ln.cm;
      } else if (inp && val == +val) {
        un = ' ' + ln[cs.units];
      }
      c.innerHTML = val + un;
    });
    pdf.querySelectorAll('.svg-image').forEach(function (c) {
      let svg = frm.querySelector('#' + c.getAttribute('data-target')).outerHTML;
      c.innerHTML = svg;
      c.querySelectorAll('*[id]').forEach(function (cc) {
        if (cc.id == 'g-front-room-screen') {
          cc.id = 'g-front-room-screen4';
          cc.style.clipPath = 'url(#front-room-screen-def2)';
        } else if (cc.id == 'front-room-screen-def') {
          cc.id = 'front-room-screen-def2';
        } else {
          cc.removeAttribute('id');
        }
      });
    });
  },
  layerPop: {
    openPop: function (id) {
      let lay = document.getElementById(id);
      lay.classList.add('opened');
      lay.querySelector('.lay-inner').scrollTo(0, 0);
    },
    closePop: function () {
      let app = document.getElementById('projection-calculator-en-root');
      let lay = app.querySelector('.popup-layer.opened');
      lay.classList.remove('opened');
    },
  },
  htmlTmpls: function () {
    let root = document.getElementById('projection-calculator-en-root');

    // html templates
    let htm = htmlTemplates.app;
    htm += htmlTemplates.popup;
    htm += htmlTemplates.pdf;
    htm += htmlTemplates.inquiry;
    root.innerHTML = htm;
  },
  loading: function (flag) {
    let root = document.getElementById('projection-calculator-en-root');
    let loader = null;

    if (flag == false) {
      loader = root.querySelector('#loading-div');
      if (!!loader) {
        loader.remove();
      }
      loader = null;
    } else {
      if (!root.querySelector('#loading-div')) {
        loader = document.createElement('DIV');
        root.append(loader);
        loader.outerHTML = htmlTemplates.loading;
      }
    }
  },
  run: function () {
    let root = document.getElementById('projection-calculator-en-root');
    let lang = root.getAttribute('lang');
    currentStatus.lang = !lang ? 'en' : lang == 'ko' ? 'kr' : 'en';
    setLanguageObj();

    // layout first
    this.layout();
    // control second.
    this.control();

    // firsttime, probeam was selected
    document.forms.controlForm.projectorType[1].click();

    // PF600U 가시성 제어 핸들러 설정
    setupPF600UVisibilityHandlers();

    // 초기 PF600U 가시성 설정
    updatePF600UVisibility();

    // activate popups
    this.popups();
    // activate sns share
    this.snsShare();
    // activate pdf pop

    if (!!location.search && location.search.indexOf('InquiryToBuy') > -1) {
      setHtmlTags.inquiryToBuy(true);
    }

    window.addEventListener('popstate', function (e) {
      let lang;
      if (!!history.state && !!history.state.lang) {
        lang = history.state.lang;
      } else {
        lang = location.pathname.substr(-2);
      }
      if (lang != currentStatus.lang) {
        setHtmlTags.languageChange(lang);
      }

      if (!!history.state && !!history.state.inquiry) {
        setHtmlTags.inquiryToBuy(true);
      } else {
        setHtmlTags.inquiryToBuy(false);
      }
    });
  },
};

setHtmlTags.htmlTmpls();
setHtmlTags.loading(true);

function main() {
  setHtmlTags.run();
  setHtmlTags.loading(false);
}

if (document.readyState === 'complete') {
  main();
} else {
  window.addEventListener('load', main);
}
