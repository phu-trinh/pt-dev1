const pjtCalculator = {
  setRoomSizeRatio: function () {
    // svg 좌표값 기준 room size (해당 비율로 모든 값 실제 계산됨)
    // room height, depth 기준 side view
    // room width, height 기준 front view

    let ra1 = 1;
    let ra2 = 1;
    let ra = 260 / 460;
    let x, y, d;
    x = currentStatus.roomWidth;
    y = currentStatus.roomHeight;
    d = currentStatus.roomDepth;
    // side view (d,y)
    if (y < d * ra) {
      ra1 = 460 / d;
    } else {
      ra1 = 260 / y;
    }
    // front view (x,y)
    if (y < x * ra) {
      ra2 = 460 / x;
    } else {
      ra2 = 260 / y;
    }

    currentStatus.roomSizeRatio = ra1 > ra2 ? ra2 : ra1;
  },
  getCurrentCoefficient: function (d, di) {
    let nameArr = [
      'AU810P',
      'HU810P',
      'HU710P',
      'GRU510N',
      'BU50N',
      'BU60P',
      'SGU510N',
      'KPU510N',
      'KPU520N',
      'DBU510P',
    ];
    let z = currentStatus.zoomRange;
    let zo = currentStatus.rangeData.zoomRange;
    if (nameArr.indexOf(currentStatus.modelName) > -1) {
      let tele = {
        min: 3.681650711,
        max: 3.73944643,
      };
      let wide = {
        min: 2.272189507,
        max: 2.331726924,
      };
      let dRange;
      if (di == 'dist') {
        d = !!d ? d : currentStatus.distance;
        dRange = currentStatus.rangeData.distance;
      } else if (di == 'inch') {
        let h = !!d ? d : currentStatus.screenHeight;
        let dd = pjtCalculator.getDiagonalFromHeight169(h);
        let ddd = commonFunc.calculateUnits(dd, 'inch').realValue;
        d = ddd;
        dRange = currentStatus.rangeData.screenInches;
      }

      if (!d && !dRange) {
        return null;
      }

      let teleEff = +commonFunc.getLinearValue(d, dRange, tele);
      let wideEff = +commonFunc.getLinearValue(d, dRange, wide);
      let currEff = +commonFunc.getLinearValue(z, zo, { min: wideEff, max: teleEff }, true);

      return currEff;
    } else {
      return +commonFunc.getLinearValue(z, zo, currentStatus.rangeData.coefficient, true);
    }
  },
  getCurrentCorrectionRange: function (d, di) {
    let cor = 0;

    if (currentStatus.modelName == 'HF60L') {
      if (di == 'dist') {
        let z = currentStatus.zoomRange;
        let dd = d / z;
        if (dd < 1310) {
          cor = 24.961;
        } else if (dd >= 1310 && dd <= 1500) {
          cor = 10.761;
        } else {
          cor = 22.761;
        }
      } else if (di == 'inch') {
        if (d < 40) {
          cor = 24.961;
        } else if (d >= 40 && d <= 44) {
          cor = 10.761;
        } else {
          cor = 22.761;
        }
      }
      return {
        max: cor * 1.100477536,
        min: cor,
      };
    } else {
      return currentStatus.rangeData.correction;
    }
  },
  setCurrentCoefficient: function (d, di) {
    if (di == 'dist') {
      d = !!d ? d : currentStatus.distance;
    } else if (di == 'inch') {
      d = !!d ? d : currentStatus.screenHeight;
    }

    let z = currentStatus.zoomRange;
    let zr = currentStatus.rangeData.zoomRange;
    let co = pjtCalculator.getCurrentCoefficient(d, di);
    currentStatus.coefficient = co;

    let range = pjtCalculator.getCurrentCorrectionRange(d, di);
    currentStatus.correction = +commonFunc.getLinearValue(z, zr, range, false);
  },
  setDistanceRangeFromZoom: function (z) {
    currentStatus.zoomRange = z;
    let min, max;
    let iRan = currentStatus.rangeData.screenInches;

    let hMin = pjtCalculator.getSquareFromDiagonal169(iRan.min).height;
    currentStatus.rangeData.distance.min = pjtCalculator.getDistanceFromHeight(hMin);

    let hMax = pjtCalculator.getSquareFromDiagonal169(iRan.max).height;
    currentStatus.rangeData.distance.max = pjtCalculator.getDistanceFromHeight(hMax);
  },
  getDiagonalFromWidth: function (w) {
    w = !!w ? w : +currentStatus.screenWidth;
    let h = +currentStatus.screenHeight;
    let r = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
    return r;
  },
  getDiagonalFromHeight: function (h) {
    h = !!h ? h : +currentStatus.screenHeight;
    let w = pjtCalculator.getWidthFromHeight(h);
    let r = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
    return r;
  },
  getDiagonalFromHeight169: function (h) {
    h = !!h ? h : +currentStatus.screenHeight;
    let w = (h * 16) / 9;
    let r = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
    return r;
  },
  setDiagonalFromWidth: function (w) {
    w = !!w ? w : currentStatus.screenWidth;
    let h = pjtCalculator.getHeightFromWidth(w);
    let r = pjtCalculator.getDiagonalFromWidth(w);
    let rInch = +commonFunc.calculateUnits(r, 'inch').value;

    let range = currentStatus.rangeData.distance;
    let dist = pjtCalculator.getDistanceFromHeight(h);
    let nHt = h;
    let blocked = false;
    if (dist < +range.min) {
      nHt = pjtCalculator.getSquareFromDistance(range.min).height;
      blocked = true;
    } else if (dist > +currentStatus.roomDepth) {
      nHt = pjtCalculator.getSquareFromDistance(currentStatus.roomDepth).height;
      blocked = true;
    } else if (dist > +range.max) {
      nHt = pjtCalculator.getSquareFromDistance(range.max).height;
      blocked = true;
    }
    if (blocked == true) {
      let nWid = pjtCalculator.getWidthFromHeight(nHt);
      currentStatus.screenHeight = nHt;
      currentStatus.screenWidth = nWid;
      r = pjtCalculator.getDiagonalFromHeight(nHt);
    }
    currentStatus.diagonal1 = +commonFunc.calculateUnits(r, 'inch').value;
    currentStatus.diagonal2 = +commonFunc.calculateUnits(r, 'cm').value;
  },
  getHeightFromWidth: function (w) {
    let ra = currentStatus.aspectRatio.split(':');
    w = !!w ? w : +currentStatus.screenWidth;
    let h = w * (ra[1] / ra[0]);
    return h;
  },
  setHeightFromWidth: function () {
    let w = +currentStatus.screenWidth;
    let h = pjtCalculator.getHeightFromWidth(w);
    currentStatus.screenHeight = h;
  },
  getWidthFromHeight: function (h) {
    h = !!h ? h : +currentStatus.screenHeight;
    let ra = currentStatus.aspectRatio.split(':');
    let w = h * (ra[0] / ra[1]);
    return w;
  },
  setWidthFromHeight: function () {
    let h = currentStatus.screenHeight;
    let w = pjtCalculator.getWidthFromHeight(h);
    currentStatus.screenWidth = w;
  },
  getSquareFromDiagonal169: function (d) {
    d = !!d ? d * 25.4 : +currentStatus.diagonal1 * 25.4; // inch to mm
    let rw = 16;
    let rh = 9;
    let r = rw / rh;
    let h = Math.sqrt(Math.pow(d, 2) / (Math.pow(r, 2) + 1));
    let w = h * r;
    return {
      width: w,
      height: h,
    };
  },
  getSquareFromDiagonal: function (d) {
    d = !!d ? d * 25.4 : +currentStatus.diagonal1 * 25.4; // inch to mm
    let ra = currentStatus.aspectRatio.split(':');
    let rw = +ra[0];
    let rh = +ra[1];
    let r = rw / rh;
    let h = Math.sqrt(Math.pow(d, 2) / (Math.pow(r, 2) + 1));
    let w = h * r;
    return {
      width: w,
      height: h,
    };
  },
  setSquareFromDiagonal: function () {
    let d = +currentStatus.diagonal1;
    let square = pjtCalculator.getSquareFromDiagonal(d);
    currentStatus.screenWidth = square.width;
    currentStatus.screenHeight = square.height;
    currentStatus.diagonal2 = +commonFunc.calculateUnits(d * 25.4, 'cm').value;
  },
  getSquareFromDistance: function (d) {
    // screenWidth = (distance + correction) / coefficient
    // screenWidth = distance / currentThrowRatio
    d = !!d ? d : currentStatus.distance;

    pjtCalculator.setCurrentCoefficient(d, 'dist');

    let ra = currentStatus.aspectRatio.split(':');
    let co = currentStatus.coefficient;
    let cr = currentStatus.correction;
    let h = (d + cr) / co;
    let w = (h * +ra[0]) / +ra[1];
    return {
      width: w,
      height: h,
    };
  },
  setSquareFromDistance: function () {
    let sq = pjtCalculator.getSquareFromDistance(currentStatus.distance);
    currentStatus.screenWidth = sq.width;
    currentStatus.screenHeight = sq.height;
    pjtCalculator.setDiagonalFromWidth();
  },
  getDistanceFromHeight: function (h) {
    h = !!h ? h : +currentStatus.screenHeight;

    pjtCalculator.setCurrentCoefficient(h, 'inch');

    let co = currentStatus.coefficient;
    let cr = currentStatus.correction;
    let d = h * co - cr;
    return d;
  },
  setDistanceFromHeight: function () {
    let h = currentStatus.screenHeight;
    let d = pjtCalculator.getDistanceFromHeight(h);
    currentStatus.distance = d;
    currentStatus.lensPosition.d = d;
  },
  setLensPosition: function () {
    /* lens position - first time */
    let room = {
      w: +currentStatus.roomWidth,
      h: +currentStatus.roomHeight,
      d: +currentStatus.roomDepth,
    };
    let lens = {
      x: room.w / 2,
      y: 0,
    };
    if (currentStatus.installType == 'Ceiling mount') {
      // lens type is normal and desktop
      if (currentStatus.throwType == 'ust') {
        lens.y = 500;
      } else {
        lens.y = 500;
      }
    } else if (currentStatus.installType == 'Desktop') {
      if (currentStatus.throwType == 'ust') {
        lens.y = room.h - 500;
      } else {
        lens.y = room.h - 500;
      }
    }
    currentStatus.lensPosition.x = lens.x;
    currentStatus.lensPosition.y = lens.y;
    currentStatus.lensPosition.d = currentStatus.distance;
  },
  getScreenPositionFromLensPosition: function (lens) {
    if (!lens) {
      lens = {
        x: +currentStatus.lensPosition.x,
        y: +currentStatus.lensPosition.y,
        d: +currentStatus.distance,
      };
    }
    let shift = {
      v: +currentStatus.shiftVertical,
      h: +currentStatus.shiftHorizontal,
    };
    let scrW = +currentStatus.screenWidth;
    let scrH = +currentStatus.screenHeight;
    let roomW = +currentStatus.roomWidth;
    let roomH = +currentStatus.roomHeight;
    let roomD = +currentStatus.roomDepth;
    let rRatio = +currentStatus.roomSizeRatio;

    let flip = currentStatus.installType != 'Desktop';
    let isUst = currentStatus.throwType == 'ust';

    let range = currentStatus.rangeData.distance;
    let pjtWid = +document.getElementById('prj-img-side')?.getAttribute('width') || 0;
    let pjtWid2 = +document.getElementById('prj-img-front')?.getAttribute('width') || 0;
    let roomMaxD = roomD - (currentStatus.overwrapRoom ? 0 : pjtWid / rRatio); // projector depth in side view ( optional )
    let minD = +range.min < roomD ? +range.min : roomD;
    let maxD = +range.max < roomMaxD ? +range.max : roomMaxD;

    if (+lens.d < minD) {
      lens.d = minD;
      currentStatus.distance = minD;
      currentStatus.lensPosition.d = minD;
      pjtCalculator.setSquareFromDistance();
      return false;
    } else if (lens.d > maxD) {
      lens.d = maxD;
      currentStatus.distance = maxD;
      currentStatus.lensPosition.d = maxD;
      pjtCalculator.setSquareFromDistance();
      return false;
    } else {
      let t, b, l, r;

      // accept lens shift values
      t = lens.y - scrH / 2;
      l = lens.x - scrW / 2;
      if (flip) {
        t = t + (scrH * shift.v) / 100;
      } else {
        t = t - (scrH * shift.v) / 100;
      }
      l = l - (scrW * shift.h) / 100;
      b = roomH - (t + scrH);
      r = roomW - (l + scrW);

      return {
        t: t,
        b: b,
        l: l,
        r: r,
      };
    }
  },
  setScreenPositionFromLensPosition: function () {
    let pos = pjtCalculator.getScreenPositionFromLensPosition();
    if (pos == false) {
      pjtCalculator.setScreenPositionFromLensPosition();
      return false;
    }
    currentStatus.fromTop = pos.t;
    currentStatus.fromBottom = pos.b;
    currentStatus.fromLeft = pos.l;
    currentStatus.fromRight = pos.r;
  },
};
const changeValues = {
  /*
		all the numeric value is started from diagonal inch value, only use real value in calculation!!!!!!
	*/
  resetFunc: function () {
    let frm = document.forms.controlForm;
    // room dimension to default value
    let defaultRoomSize = {
      width: 3500,
      height: 3500,
      depth: 6000,
    };
    let userP = 1750;
    let userPd = 3000;
    if (currentStatus.projectorType == 'LG ProBeam') {
      defaultRoomSize.width = 5000;
      defaultRoomSize.height = 3500;
      userP = 2500;
      userPd = 3000;
    }
    let userW_s = (currentStatus.userHeight * 4) / 20;
    let userW_f = (currentStatus.userHeight * 6) / 20;
    currentStatus.roomWidth = defaultRoomSize.width;
    currentStatus.roomHeight = defaultRoomSize.height;
    currentStatus.roomDepth = defaultRoomSize.depth;
    currentStatus.userPosition.x = userP;
    currentStatus.userPosition.d = userPd; // - userW_s/2;

    // set values from seleted model
    let sel = frm.modelName;
    changeValues.changeAction({ target: sel });
  },
  changeAction: function (e) {
    changeValues[e.target.name](e);
    pjtCalculator.setScreenPositionFromLensPosition();
    changeValues.setFormValues();
    drawRoom.run();
    if (e.target.name == 'units') {
      setHtmlTags.layout();
    }
  },
  getProductNamesFromProductList: function () {
    // product list
    // return product name array
    let arr = [];
    productsDataArr.forEach(function (c) {
      arr.push(c.modelName);
    });
    return arr;
  },

  // changes from input form
  units: function (e) {
    // change all the number units
    currentStatus.units = e.target.value;
  },
  projectorType: function (e) {
    // update the modelName selectbox and fire the change event.
    let vl = e.target.value;
    currentStatus.projectorType = vl;
    // productsDataArr = commonFunc.copyArray( vl == 'LG ProBeam' ? productsDataArr_probeam : productsDataArr_cinebeam );
    productsDataArr = commonFunc.makeProdArr(vl);
    // let arr = productNamesArray[vl];
    let arr = changeValues.getProductNamesFromProductList();
    let sel = document.forms.controlForm.modelName;
    sel.innerHTML = '';
    arr.forEach(function (c, i) {
      let da = commonFunc.getProjectorInfor(c);
      let opt = document.createElement('OPTION');
      opt.value = c;
      opt.innerText = da.displayName;
      if (!!da.newFlag) {
        // 202504 :: new flag - enable normal text
        let addTxt = da.newFlag == true ? 'New' : da.newFlag;
        opt.innerText = da.displayName + ' (' + addTxt + ')';
      }
      opt.selected = i == 0;
      sel.append(opt);
    });
    changeValues.resetFunc();
    // changeValues.changeAction({target:sel});
  },
  modelName: function (e) {
    let v = e.target.value;
    currentStatus.modelName = v;

    // set currentStatus to default
    let d = commonFunc.getProjectorInfor(v);
    let cu = currentStatus;
    let cr = currentStatus.rangeData;
    for (key in d) {
      if (cu[key]) {
        let vl = d[key];
        if (key == 'ratio') {
        } else if (key == 'rangeData') {
          for (nm in vl) {
            cr[nm].min = vl[nm].min;
            cr[nm].max = vl[nm].max;
          }
        } else {
          cu[key] = vl;
        }
      }
    }
    currentStatus.rangeData.currZoomDistance = {
      min: currentStatus.rangeData.distance.min,
      max: currentStatus.rangeData.distance.max,
    };
    // range default to current status
    currentStatus.userPosition.x = currentStatus.roomWidth / 2;
    cu.zoomRange = 1;
    cu.coefficient = cr.coefficient.max;
    cu.correction = cr.correction.min;

    if (d.throwType == 'ust') {
      cu.shiftVertical = d.rangeData.shiftVertical.min;
    } else {
      cu.shiftVertical = 50;
    }
    cu.shiftHorizontal = 0;

    let rat = document.forms.controlForm.aspectRatio;
    rat.innerHTML = '';
    d.ratio.forEach(function (c, i) {
      let opt = document.createElement('OPTION');
      let selected = i == 0; //c=='16:9';
      opt.value = c;
      opt.innerText = c;
      opt.selected = selected;
      rat.append(opt);
    });
    cu.aspectRatio = rat.value;
    cu.diagonal1 = +d.rangeData.screenInches.min;
    pjtCalculator.setSquareFromDiagonal();
    pjtCalculator.setDistanceFromHeight();
    pjtCalculator.setLensPosition();
  },
  installType: function (e) {
    // only change the projector and screen position
    currentStatus.installType = e.target.value;
    pjtCalculator.setLensPosition();
  },
  aspectRatio: function (e) {
    // only change screen size(horizontal), diagonal, width value)
    let v = e.target.value;
    currentStatus.aspectRatio = v;
    pjtCalculator.setWidthFromHeight();
    pjtCalculator.setDiagonalFromWidth();
  },
  distance: function (e) {
    let val = e.target.value;
    let v = commonFunc.getRealValue(val);
    let ran = currentStatus.rangeData.distance;
    if (v > ran.max) {
      v = ran.max;
      e.target.value = commonFunc.calculateUnits(v);
    } else if (v < ran.min) {
      v = ran.min;
      e.target.value = commonFunc.calculateUnits(v);
    }
    currentStatus.distance = v;
    currentStatus.lensPosition.d = v;
    pjtCalculator.setSquareFromDistance(v);
  },
  diagonal1: function (e) {
    let val = e.target.value;
    let v = val * 25.4; // inch
    let ran = currentStatus.rangeData.screenInches;
    let rat = currentStatus.aspectRatio.split(':')[1] / currentStatus.aspectRatio.split(':')[0];
    let nHt = pjtCalculator.getSquareFromDiagonal(val).height;
    let v_16_9 = pjtCalculator.getDiagonalFromHeight169(nHt);
    let vInch_16_9 = commonFunc.calculateUnits(v_16_9, 'inch').value;
    let newVal = v;
    let nWd = 0;
    if (vInch_16_9 < ran.min) {
      let rMin = ran.min;
      nHt = pjtCalculator.getSquareFromDiagonal169(ran.min).height;
      newVal = pjtCalculator.getDiagonalFromHeight(nHt);
    } else if (vInch_16_9 > ran.max) {
      nHt = pjtCalculator.getSquareFromDiagonal169(ran.max).height;
      newVal = pjtCalculator.getDiagonalFromHeight(nHt);
    }
    currentStatus.diagonal1 = commonFunc.calculateUnits(newVal, 'inch').value;
    currentStatus.diagonal2 = commonFunc.calculateUnits(newVal, 'cm').value;
    pjtCalculator.setSquareFromDiagonal();
    pjtCalculator.setDistanceFromHeight();
  },
  diagonal2: function (e) {
    let val = e.target.value;
    let v = val * 10; // centimeter
    let vi = commonFunc.calculateUnits(v, 'inch').value;

    let ran = currentStatus.rangeData.screenInches;
    let rat = currentStatus.aspectRatio.split(':')[1] / currentStatus.aspectRatio.split(':')[0];
    let nHt = pjtCalculator.getSquareFromDiagonal(vi).height;
    let v_16_9 = pjtCalculator.getDiagonalFromHeight169(nHt);
    let vInch_16_9 = commonFunc.calculateUnits(v_16_9, 'inch').value;
    let newVal = v;
    if (vInch_16_9 < ran.min) {
      nHt = pjtCalculator.getSquareFromDiagonal169(ran.min).height;
      newVal = pjtCalculator.getDiagonalFromHeight(nHt);
    } else if (vInch_16_9 > ran.max) {
      nHt = pjtCalculator.getSquareFromDiagonal169(ran.max).height;
      newVal = pjtCalculator.getDiagonalFromHeight(nHt);
    }
    currentStatus.diagonal1 = commonFunc.calculateUnits(newVal, 'inch').value;
    currentStatus.diagonal2 = commonFunc.calculateUnits(newVal, 'cm').value;
    pjtCalculator.setSquareFromDiagonal();
    pjtCalculator.setDistanceFromHeight();
  },
  screenWidth: function (e) {
    let val = e.target.value;
    let v = commonFunc.getRealValue(val);
    currentStatus.screenWidth = v;
    pjtCalculator.setHeightFromWidth();
    pjtCalculator.setDiagonalFromWidth();
    pjtCalculator.setDistanceFromHeight();
  },
  screenHeight: function (e) {
    let val = e.target.value;
    let v = commonFunc.getRealValue(val);
    currentStatus.screenHeight = v;
    pjtCalculator.setWidthFromHeight();
    pjtCalculator.setDiagonalFromWidth();
    pjtCalculator.setDistanceFromHeight();
  },
  roomWidth: function (e) {
    let val = e.target.value;
    let v = commonFunc.getRealValue(val);
    let limit = currentStatus.rangeData.roomWidth;
    if (v < limit.min) {
      e.target.value = commonFunc.calculateUnits(limit.min);
      v = limit.min;
    } else if (v > limit.max) {
      e.target.value = commonFunc.calculateUnits(limit.max);
      v = limit.max;
    }
    currentStatus.roomWidth = v;
    // currentStatus.lensPosition.x = v/2;
    // currentStatus.userPosition.x = v/2;
  },
  roomHeight: function (e) {
    let val = e.target.value;
    let v = commonFunc.getRealValue(val);
    let limit = currentStatus.rangeData.roomHeight;
    if (v < limit.min) {
      e.target.value = commonFunc.calculateUnits(limit.min);
      v = limit.min;
    } else if (v > limit.max) {
      e.target.value = commonFunc.calculateUnits(limit.max);
      v = limit.max;
    }
    currentStatus.roomHeight = v;
  },
  roomDepth: function (e) {
    let val = e.target.value;
    let limit = currentStatus.rangeData.roomDepth;
    let v = commonFunc.getRealValue(val);
    if (v < limit.min) {
      e.target.value = commonFunc.calculateUnits(limit.min);
      v = limit.min;
    } else if (v > limit.max) {
      e.target.value = commonFunc.calculateUnits(limit.max);
      v = limit.max;
    }
    currentStatus.roomDepth = v;
  },
  fromTop: function (e) {
    let val = e.target.value;
    let v = commonFunc.getRealValue(val);
    let max = currentStatus.roomHeight - currentStatus.screenHeight;
    if (v < 0) {
      v = 0;
      e.target.value = 0;
    } else if (v > max) {
      v = max;
      e.target.value = max;
    }
    let prev = e.target.previousValue || 0;
    let vPrev = commonFunc.getRealValue(prev);
    let chg = v - vPrev;
    currentStatus.lensPosition.y = currentStatus.lensPosition.y + chg;
    currentStatus.fromTop = v;
    currentStatus.fromBottom = currentStatus.roomHeight - v - currentStatus.screenHeight;
  },
  fromBottom: function (e) {
    let val = e.target.value;
    let v = commonFunc.getRealValue(val);
    let max = currentStatus.roomHeight - currentStatus.screenHeight;
    if (v < 0) {
      v = 0;
      e.target.value = 0;
    } else if (v > max) {
      v = max;
      e.target.value = max;
    }
    let prev = e.target.previousValue;
    let vPrev = commonFunc.getRealValue(prev);
    let chg = v - vPrev;
    currentStatus.lensPosition.y = currentStatus.lensPosition.y - chg;
    currentStatus.fromBottom = v;
    currentStatus.fromTop = currentStatus.roomHeight - v - currentStatus.screenHeight;
  },
  fromLeft: function (e) {
    let val = e.target.value;
    let v = commonFunc.getRealValue(val);
    let max = currentStatus.roomWidth - currentStatus.screenWidth;
    if (v < 0) {
      v = 0;
      e.target.value = 0;
    } else if (v > max) {
      v = max;
      e.target.value = max;
    }
    let prev = e.target.previousValue;
    let vPrev = commonFunc.getRealValue(prev);
    let chg = v - vPrev;
    currentStatus.lensPosition.x = currentStatus.lensPosition.x + chg;
    currentStatus.fromLeft = v;
    currentStatus.fromRight = +currentStatus.roomWidth - v - +currentStatus.screenWidth;
  },
  fromRight: function (e) {
    let val = e.target.value;
    let v = commonFunc.getRealValue(val);
    let max = currentStatus.roomWidth - currentStatus.screenWidth;
    if (v < 0) {
      v = 0;
      e.target.value = 0;
    } else if (v > max) {
      v = max;
      e.target.value = max;
    }
    let prev = e.target.previousValue;
    let vPrev = commonFunc.getRealValue(prev);
    let chg = v - vPrev;
    let nextPos = +currentStatus.lensPosition.x - chg;
    currentStatus.lensPosition.x = nextPos;
    currentStatus.fromRight = v;
    currentStatus.fromLeft = +currentStatus.roomWidth - v - +currentStatus.screenWidth;
  },
  shiftVertical: function (e) {
    let v = +e.target.value;
    let limit = currentStatus.rangeData.shiftVertical;
    if (v < limit.min) {
      v = limit.min;
      e.target.value = v;
    } else if (v > limit.max) {
      v = limit.max;
      e.target.value = v;
    }
    currentStatus.shiftVertical = v;
  },
  shiftHorizontal: function (e) {
    let v = +e.target.value;
    let limit = currentStatus.rangeData.shiftHorizontal;
    if (v < limit.min) {
      v = limit.min;
      e.target.value = v;
    } else if (v > limit.max) {
      v = limit.max;
      e.target.value = v;
    }
    currentStatus.shiftHorizontal = v;
  },
  userHeight: function (e) {
    // user height changed --> room redraw.
    let v = e.target.value;
    let val = commonFunc.getRealValue(v);
    let limit = currentStatus.rangeData.userHeight;
    if (val < limit.min) {
      e.target.value = commonFunc.calculateUnits(limit.min);
    } else if (val > limit.max) {
      e.target.value = commonFunc.calculateUnits(limit.max);
    } else {
      currentStatus.userHeight = val;
      drawRoom.setHumanImage();
    }
  },
  // change from room
  zoomRange: function (e) {
    let v = e.target.value;
    currentStatus.zoomRange = v;
    pjtCalculator.setDistanceRangeFromZoom(v);
    pjtCalculator.setSquareFromDistance();
  },

  // drag functions
  dragStart: function (e) {
    if (e.button && e.button != 0) {
      return;
    }
    let _this = changeValues;
    let root = document.getElementById('projection-calculator-en-root');
    let svg = e.target.parentElement;
    let evt = root.currentDragEvt;
    if (evt[0] == 'touchstart') {
      e.pageX = e.touches[0].pageX;
      e.pageY = e.touches[0].pageY;
    }
    _this.dragStartPosition = {
      x: +e.target.getAttribute('x'),
      y: +e.target.getAttribute('y'),
      lx: currentStatus.lensPosition.x,
      ly: currentStatus.lensPosition.y,
      ld: currentStatus.lensPosition.d,
      ux: currentStatus.userPosition.x,
      ud: currentStatus.userPosition.d,
      pageX: e.pageX,
      pageY: e.pageY,
    };
    _this.draggingElement = e.target;
    e.target.classList.add('dragging');
    window.addEventListener(evt[1], _this.dragMove);
    window.addEventListener(evt[2], _this.dragEnd);
    if (evt[2] === 'touchend') {
      window.addEventListener('touchcancel', _this.dragEnd);
    }
  },
  dragMove: function (e) {
    let root = document.getElementById('projection-calculator-en-root'); // added
    let _this = changeValues;
    let drg = _this.draggingElement;
    let pjt, sil;
    if (drg.id.indexOf('human') > -1) {
      sil = drg;
    } else {
      pjt = drg;
    }
    let svg = drg.parentElement;
    let ratio = currentStatus.roomSizeRatio;
    let ratio2 = svg.scrollWidth / 600;

    // pageX value event mapping
    let evt = root.currentDragEvt;
    if (evt[0] == 'touchstart') {
      e.pageX = e.touches[0].pageX;
      e.pageY = e.touches[0].pageY;
    }

    // projector(lens) position x,y,d(x = from left, y = from top, z = from screen (distance));
    let start = _this.dragStartPosition;
    // moved pixel
    let moveX = e.pageX - start.pageX;
    let moveY = e.pageY - start.pageY;

    // moved point in svg(actually scaled)
    let realX = moveX / ratio2;
    let realY = moveY / ratio2;

    // moved to currerntStatus
    let statX = realX / ratio;
    let statY = realY / ratio;

    let currX = +start.x + realX;
    let currY = +start.y + realY;
    // get disabled posion
    let disabled = !!pjt ? currentStatus.disabledPosition.silhouette : currentStatus.disabledPosition.projector;
    let wid = +drg.getAttribute('width');
    let hgt = +drg.getAttribute('height');

    let isSide = svg.id.indexOf('side') == 0;

    // duplicated YN - silhuette and projector
    let canMove = { x: true, y: true, d: true };

    let currUserHt = currentStatus.userHeight;
    let currLens = {
      x: !isSide && !!pjt ? start.lx + statX : start.lx,
      y: !!pjt ? start.ly + statY : start.ly,
      d: isSide && !!pjt ? start.ld + statX : start.ld,
      sWid: 35,
      sHit: 19,
      fWid: 54,
      fHit: 30,
    };
    let currUser = {
      x: !isSide && !!sil ? start.ux + statX : start.ux,
      d: isSide && !!sil ? start.ud + statX : start.ud,
      sWid: (currUserHt * 4) / 20,
      fWid: (currUserHt * 6) / 20,
      fHit: currUserHt,
    };
    /* projector and silhuette duplicated :: not in use..
		if ( !!pjt ) {
			if ( isSide ) {
				if ( currUser.x - currUser.fWid/2 < currLens.x + currLens.fWid/2  && currUser.x + currUser.fWid/2 > currLens.x - currLens.fWid/2  ) {
					if ( currUser.y > currLens.y+currLens.fHit && currLens.d + sWid > currUser.d - currUser.sWid/2 && currLens.d < currUser.d + currUser.sWid/2 ) {
						return;
					}
				}
			} else {
				if (  currUser.d - currUser.sWid/2 < currLens.d + currLens.sWid && currLens.d < currUser.d + currUser.sWid/2  ) {
					if ( currLens.x + currLens.fWid/2 > currUser.x - currUser.fWid/2 && currLens.x - currLens.fWid/2 < currUser.x + currUser.fWid/2  &&  currLens.y + currLens.fHit < currUser.y ) {
						return
					}
				}
			}
		}
		if ( !!sil ) {
			if ( isSide ) {
				if ( currUser.x - currUser.fWid/2 < currLens.x + currLens.fWid/2  && currUser.x + currUser.fWid/2 > currLens.x - currLens.fWid/2  && currLens.y + currLens.fHit < currUser.y ) {
					if ( currUser.d - currUser.sWid/2 > currLens.d + currLens.sWid/2  && currUser.d - currUser.sWid/2 < currLens.d - currLens.sWid/2 ) {
						return;
					}
				}
			} else {
				if ( currUser.d - currUser.sWid/2 < currLens.d + currLens.sWid  && currUser.d + currUser.sWid/2 > currLens.d  && currLens.y + currLens.fHit < currUser.y ) {
					if ( currUser.x - currUser.fWid/2 > currLens.x + currLens.fWid/2  && currUser.x - currUser.fWid/2 < currLens.x - currLens.fWid/2 ) {
						return;
					}
				}
			}
		}
		*/

    let moved = 0;
    // y positions is same at side or front view
    if (!currentStatus.lockYn.lensPosition_vertical) {
      let yy = 0;
      if (!!pjt) {
        if (currY >= +disabled.room.y.min && currY <= +disabled.room.y.max) {
          yy = currY;
          currentStatus.lensPosition.y = currLens.y;
        } else {
          if (currY < +disabled.room.y.min) {
            yy = +disabled.room.y.min;
            currentStatus.lensPosition.y = 0;
          } else if (currY > +disabled.room.y.max) {
            yy = +disabled.room.y.max;
            currentStatus.lensPosition.y = currentStatus.roomHeight;
          }
        }
        pjt.setAttribute('y', yy);
        moved++;
      }
    }
    if (svg.id.indexOf('front') == 0) {
      // in front view, use x values
      if (!currentStatus.lockYn.lensPosition_horizontal) {
        if (!!pjt) {
          if (currX < +disabled.room.x.min) {
            drg.setAttribute('x', currX);
            currentStatus.lensPosition.x = 0;
            moved++;
          } else if (currX > +disabled.room.x.max) {
            drg.setAttribute('x', +disabled.room.x.max);
            currentStatus.lensPosition.x = currentStatus.roomWidth;
            moved++;
          } else {
            drg.setAttribute('x', currX);
            currentStatus.lensPosition.x = currLens.x;
            moved++;
          }
        } else {
          if (currX - wid / 2 >= +disabled.room.x.min && currX + wid / 2 <= +disabled.room.x.max) {
            drg.setAttribute('x', currX - wid / 2);
            currentStatus.userPosition.x = currUser.x - currUser.fWid / 2;
            moved++;
          } else if (currX - wid / 2 < +disabled.room.x.min) {
            drg.setAttribute('x', +disabled.room.x.min + wid / 2);
            currentStatus.userPosition.x = currUser.fWid / 2;
            moved++;
          } else if (currX + wid / 2 > +disabled.room.x.max) {
            drg.setAttribute('x', +disabled.room.x.max - wid / 2);
            currentStatus.userPosition.x = currentStatus.roomWidth - currUser.fWid / 2;
            moved++;
          }
        }
      }
    } else {
      // in side view, use d values
      if (!!pjt) {
        if (!currentStatus.lockYn.distance && !currentStatus.lockYn.screenSize) {
          if (
            currLens.d >= currentStatus.rangeData.distance.min &&
            currLens.d <= currentStatus.rangeData.distance.max &&
            currX <= +disabled.room.d.max
          ) {
            drg.setAttribute('x', currX);
            currentStatus.lensPosition.d = currLens.d;
            currentStatus.distance = currLens.d;
            moved++;
          } else {
            if (currLens.d < currentStatus.rangeData.distance.min) {
              drg.setAttribute('x', disabled.room.d.min + currentStatus.rangeData.distance.min / ratio);
              currentStatus.lensPosition.d = currentStatus.rangeData.distance.min;
              currentStatus.distance = currentStatus.rangeData.distance.min;
              moved++;
            } else if (
              currLens.d > currentStatus.rangeData.distance.max &&
              currentStatus.rangeData.distance.max <= currentStatus.roomDepth
            ) {
              let maxX = disabled.room.d.min + currentStatus.rangeData.distance.max / ratio;
              let lensMax = currentStatus.rangeData.distance.max;
              drg.setAttribute('x', maxX);
              currentStatus.lensPosition.d = lensMax;
              currentStatus.distance = lensMax;
              moved++;
            } else if (currX > disabled.room.d.max && currentStatus.rangeData.distance.max >= currentStatus.roomDepth) {
              let maxX = disabled.room.d.max;
              let lensMax = currentStatus.roomDepth;
              drg.setAttribute('x', maxX);
              currentStatus.lensPosition.d = lensMax;
              currentStatus.distance = lensMax;
              moved++;
            }
          }
        }
      } else {
        if (currX >= +disabled.room.d.min && currX <= +disabled.room.d.max - wid) {
          drg.setAttribute('x', currX);
          currentStatus.userPosition.d = currUser.d;
          moved++;
        } else if (currX < +disabled.room.d.min) {
          drg.setAttribute('x', +disabled.room.d.min);
          currentStatus.userPosition.d = currUser.sWid / 2;
          moved++;
        } else if (currX > +disabled.room.d.max - wid) {
          drg.setAttribute('x', +disabled.room.d.max - wid / 2);
          currentStatus.userPosition.d = currentStatus.roomDepth - currUser.sWid / 2;
          moved++;
        }
      }
    }
    if (moved) {
      pjtCalculator.setSquareFromDistance();
      pjtCalculator.setScreenPositionFromLensPosition();
      changeValues.setFormValues();
      drawRoom.refreshRoom();
    }
  },
  dragEnd: function (e) {
    let _this = changeValues;
    let root = document.getElementById('projection-calculator-en-root');
    let evt = root.currentDragEvt;
    _this.dragStartPosition = null;
    _this.draggingElement.classList.remove('dragging');
    _this.draggingElement = null;
    drawRoom.updateDisabledPosition();
    window.removeEventListener(evt[1], _this.dragMove);
    window.removeEventListener(evt[2], _this.dragEnd);
    if (evt[2] === 'touchend') {
      window.removeEventListener('touchcancel', _this.dragEnd);
    }
  },
  draggingElement: null,
  dragStartPosition: null,

  lock: function (e) {
    let frm = document.forms.controlForm;
    let inp = e.target;
    let els = frm[inp.name];

    els.forEach(function (c) {
      if (inp.value == 'vertical' && c.value == 'vertical') {
        c.checked = inp.checked;
      }
    });
    currentStatus.lockYn['lensPosition_' + inp.value] = inp.checked;
  },
  lockBtn: function (e) {
    let frm = document.forms.controlForm;
    let btn = e.target;
    let group = e.target.getAttribute('data-lock');
    let lockYn = false;
    if (btn.classList.contains('lock')) {
      btn.classList.remove('lock');
    } else {
      btn.classList.add('lock');
      lockYn = true;
    }
    let fds = frm.querySelector('fieldset[data-id="' + group + '"]');
    let inps = fds.querySelectorAll('input');
    inps.forEach(function (c) {
      if (lockYn) {
        c.setAttribute('readonly', 'readonly');
      } else {
        c.removeAttribute('readonly');
      }
      if (group == 'screenSize') {
        frm.zoomRange.forEach(function (cc) {
          cc.disabled = lockYn;
        });
      }
    });
    if (typeof currentStatus.lockYn[group] != 'undefined') {
      currentStatus.lockYn[group] = lockYn;
    }
  },
  refreshForm: function () {
    let chk = null;
    document.forms.controlForm.projectorType.forEach(function (c) {
      if (c.checked) {
        chk = c;
      }
    });
    if (chk) {
      this.changeAction({ target: chk });
    }
  },
  setFormValues: function () {
    let frm = document.forms.controlForm;
    for (key in currentStatus) {
      if (frm[key]) {
        let v = currentStatus[key];
        if (key == 'availableLenses') {
          let mn = currentStatus.rangeData.throwRatio.min;
          let mx = currentStatus.rangeData.throwRatio.max;
          let rat = mn == mx ? mn : mn + ' ~ ' + mx;
          v = v + '(TR ' + rat + ')';
        } else if (key.indexOf('shift') == 0) {
          v = +v;
        } else if (key != 'diagonal1' && key != 'diagonal2' && !!+v) {
          v = commonFunc.calculateUnits(v).value;
        }
        if (key == 'zoomRange') {
          frm[key].forEach(function (c) {
            let rn = currentStatus.rangeData.zoomRange;
            c.value = currentStatus[key];
            c.previousValue = currentStatus[key];
            c.setAttribute('min', rn.min);
            c.setAttribute('max', rn.max);
            c.parentElement.querySelector('.minMax [data-minmax="min"]').innerHTML = rn.min;
            c.parentElement.querySelector('.minMax [data-minmax="max"]').innerHTML = rn.max;
          });
        } else {
          frm[key].value = v;
          frm[key].previousValue = v;
        }
        if (key == 'distance') {
          setHtmlTags.layout('.projector-distance');
        }
      }
    }

    if (currentStatus.projectorType == 'LG ProBeam') {
      frm.querySelector('.user-height').style.display = 'block';
    } else {
      frm.querySelector('.user-height').style.display = 'none';
    }
    if (currentStatus.rangeData.shiftVertical.min == currentStatus.rangeData.shiftVertical.max) {
      frm.querySelector('.lens-shift').style.display = 'none';
    } else {
      frm.querySelector('.lens-shift').style.display = 'block';
    }
    if (currentStatus.rangeData.zoomRange.min == currentStatus.rangeData.zoomRange.max) {
      frm.querySelector('.elevation-section').classList.add('zoom-hide');
    } else {
      frm.querySelector('.elevation-section').classList.remove('zoom-hide');
    }
  },
};
