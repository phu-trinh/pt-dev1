const drawRoom = {
  setValues: function () {
    // all values must calculated from real value
    // all position or width value must be changed by room size ratio
    // this function has no action, but notice room informations
    /*
			** side view
			
			1) room outline
			2) room inline
			
			3) room depth values
			4) lens position : front, back
			
			6) screen position : top, bottom, height
			7) screen red square
			8) lens position : top, bottom
			
			9) room height
			
			10) projector image
			11) red triangle
			
			12) silhouette
			
			*) zoom range
			*) lock vertical position
			*) units

				**********************************************************************

			** front view
			
			1) room outline
			2) room inline
			
			3) screen position : fron left, from right, width
			
			4) screen position : top, bottom, height
			
			5) lens position : top, bottom
			6) room height
			
			7) lens position : from left, from right
			8) room width values
			
			10) projector image
			11) screen red square
			
			12) silhouette
			
			*) zoom range
			*) lock vertical position
			*) lock horizontal position
			*) units
		*/
  },
  updateDisabledPosition: function () {
    // after draw room, refresh disabled positions for drag event
    let root = document.getElementById('projection-calculator-en-root');
    let side = root.querySelector('#side-svg');
    let front = root.querySelector('#front-svg');
    const roomDimension = {
      x: {
        min: +front.querySelector('#front-room-inner-square').getAttribute('x'),
        max:
          +front.querySelector('#front-room-inner-square').getAttribute('x') +
          +front.querySelector('#front-room-inner-square').getAttribute('width'),
      },
      y: {
        min: +front.querySelector('#front-room-inner-square').getAttribute('y'),
        max:
          +front.querySelector('#front-room-inner-square').getAttribute('y') +
          +front.querySelector('#front-room-inner-square').getAttribute('height'),
      },
      d: {
        min: +side.querySelector('#side-room-inner-square').getAttribute('x'),
        max:
          +side.querySelector('#side-room-inner-square').getAttribute('x') +
          +side.querySelector('#side-room-inner-square').getAttribute('width'),
      },
    };
    const pjt = {
      x: {
        min: +front.querySelector('#prj-img-front').getAttribute('x'),
        max:
          +front.querySelector('#prj-img-front').getAttribute('x') +
          +front.querySelector('#prj-img-front').getAttribute('width'),
      },
      y: {
        min: +front.querySelector('#prj-img-front').getAttribute('y'),
        max:
          +front.querySelector('#prj-img-front').getAttribute('y') +
          +front.querySelector('#prj-img-front').getAttribute('height'),
      },
      d: {
        min: +side.querySelector('#prj-img-side').getAttribute('x'),
        max:
          +side.querySelector('#prj-img-side').getAttribute('x') +
          +side.querySelector('#prj-img-side').getAttribute('width'),
      },
    };
    const sil = {
      x: {
        min: +front.querySelector('#human-img-front').getAttribute('x'),
        max:
          +front.querySelector('#human-img-front').getAttribute('x') +
          +front.querySelector('#human-img-front').getAttribute('width'),
      },
      y: {
        min: +front.querySelector('#human-img-front').getAttribute('y'),
        max:
          +front.querySelector('#human-img-front').getAttribute('y') +
          +front.querySelector('#human-img-front').getAttribute('height'),
      },
      d: {
        min: +side.querySelector('#human-img-side').getAttribute('x'),
        max:
          +side.querySelector('#human-img-side').getAttribute('x') +
          +side.querySelector('#human-img-side').getAttribute('width'),
      },
    };
    currentStatus.disabledPosition = {
      // can move :: prj and man..cannot move in this limit.
      projector: {
        room: roomDimension,
        inner: sil,
      },
      silhouette: {
        room: roomDimension,
        inner: pjt,
      },
    };
  },
  setRoomDefault: function () {
    // set svg's innerHTML
    let view = document.querySelector('#projection-calculator-en-root .elevation-section');
    let svgS = view.querySelector('.side-viewer');
    let svgF = view.querySelector('.front-viewer');
    if (!view.classList.contains('activated')) {
      svgS.innerHTML = htmlTemplates.sideSvg;
      svgF.innerHTML = htmlTemplates.frontSvg;
      view.classList.add('activated');
    }
  },
  setRoomlayout: function () {
    // set side/front room's dimensions line and outlines.
    let frm = document.forms.controlForm;
    let view = document.querySelector('#projection-calculator-en-root .elevation-section');
    let ratio = currentStatus.roomSizeRatio;
    let width = currentStatus.roomWidth;
    let height = currentStatus.roomHeight;
    let depth = currentStatus.roomDepth;

    let w = width * ratio;
    let h = height * ratio;
    let d = depth * ratio;
    // center position : 300, 200;

    let sideX = 300 - d / 2;
    let sideY = 200 - h / 2;
    let frontX = 300 - w / 2;

    let side, sOut, front, fOut;

    function sideViewLines() {
      side = view.querySelector('#side-room-inner-square');
      sOut = view.querySelector('#side-room-outer-square');

      // Side View
      side.setAttribute('x', sideX);
      side.setAttribute('y', sideY);
      side.setAttribute('width', d);
      side.setAttribute('height', h);

      let sOutX = sideX - 7;
      let sOutY = sideY - 7;
      sOut.setAttribute('x', sideX - 7);
      sOut.setAttribute('y', sideY - 7);
      sOut.setAttribute('width', d + 14);
      sOut.setAttribute('height', h + 14);

      // set lines - side view
      let topLinePos = sOutY - 40;
      let gTop = view.querySelector('#side-room-top-lines');
      let gTopLine = gTop.querySelector('.line');
      let gTopStart = gTop.querySelector('.line-start');
      let gTopEnd = gTop.querySelector('.line-end');
      gTopLine.setAttribute('x1', sideX);
      gTopLine.setAttribute('x2', sideX + d);
      gTopLine.setAttribute('y1', topLinePos);
      gTopLine.setAttribute('y2', topLinePos);
      gTopStart.setAttribute('x1', sideX);
      gTopStart.setAttribute('x2', sideX);
      gTopStart.setAttribute('y1', topLinePos - 10);
      gTopStart.setAttribute('y2', topLinePos + 10);
      gTopEnd.setAttribute('x1', sideX + d);
      gTopEnd.setAttribute('x2', sideX + d);
      gTopEnd.setAttribute('y1', topLinePos - 10);
      gTopEnd.setAttribute('y2', topLinePos + 10);

      let gTop2 = view.querySelector('#side-room-top-lines2');
      let gTop2Line = gTop2.querySelector('.line');
      let gTop2Start = gTop2.querySelector('.line-start');
      let gTop2End = gTop2.querySelector('.line-end');
      gTop2Line.setAttribute('x1', sideX);
      gTop2Line.setAttribute('x2', sideX + d);
      gTop2Line.setAttribute('y1', topLinePos + 30);
      gTop2Line.setAttribute('y2', topLinePos + 30);
      gTop2Start.setAttribute('x1', sideX);
      gTop2Start.setAttribute('x2', sideX);
      gTop2Start.setAttribute('y1', topLinePos + 30 - 10);
      gTop2Start.setAttribute('y2', topLinePos + 30 + 10);
      gTop2End.setAttribute('x1', sideX + d);
      gTop2End.setAttribute('x2', sideX + d);
      gTop2End.setAttribute('y1', topLinePos + 30 - 10);
      gTop2End.setAttribute('y2', topLinePos + 30 + 10);

      let leftLinePos = sOutX - 10;
      let gLeft = view.querySelector('#side-room-left-lines');
      let gLeftLine = gLeft.querySelector('.line');
      let gLeftStart = gLeft.querySelector('.line-start');
      let gLeftEnd = gLeft.querySelector('.line-end');
      gLeftLine.setAttribute('x1', leftLinePos);
      gLeftLine.setAttribute('x2', leftLinePos);
      gLeftLine.setAttribute('y1', sideY);
      gLeftLine.setAttribute('y2', sideY + h);
      gLeftStart.setAttribute('x1', leftLinePos - 10);
      gLeftStart.setAttribute('x2', leftLinePos + 10);
      gLeftStart.setAttribute('y1', sideY);
      gLeftStart.setAttribute('y2', sideY);
      gLeftEnd.setAttribute('x1', leftLinePos - 10);
      gLeftEnd.setAttribute('x2', leftLinePos + 10);
      gLeftEnd.setAttribute('y1', sideY + h);
      gLeftEnd.setAttribute('y2', sideY + h);

      let rightLinePos = sideX + d + 7 + 10;
      let gRight = view.querySelector('#side-room-right-lines');
      let gRightLine = gRight.querySelector('.line');
      let gRightStart = gRight.querySelector('.line-start');
      let gRightEnd = gRight.querySelector('.line-end');
      gRightLine.setAttribute('x1', rightLinePos + 30);
      gRightLine.setAttribute('x2', rightLinePos + 30);
      gRightLine.setAttribute('y1', sideY);
      gRightLine.setAttribute('y2', sideY + h);
      gRightStart.setAttribute('x1', rightLinePos - 10 + 30);
      gRightStart.setAttribute('x2', rightLinePos + 10 + 30);
      gRightStart.setAttribute('y1', sideY);
      gRightStart.setAttribute('y2', sideY);
      gRightEnd.setAttribute('x1', rightLinePos - 10 + 30);
      gRightEnd.setAttribute('x2', rightLinePos + 10 + 30);
      gRightEnd.setAttribute('y1', sideY + h);
      gRightEnd.setAttribute('y2', sideY + h);

      let gRight2 = view.querySelector('#side-room-right-lines2');
      let gRight2Line = gRight2.querySelector('.line');
      let gRight2Start = gRight2.querySelector('.line-start');
      let gRight2End = gRight2.querySelector('.line-end');
      gRight2Line.setAttribute('x1', rightLinePos);
      gRight2Line.setAttribute('x2', rightLinePos);
      gRight2Line.setAttribute('y1', sideY);
      gRight2Line.setAttribute('y2', sideY + h);
      gRight2Start.setAttribute('x1', rightLinePos - 10);
      gRight2Start.setAttribute('x2', rightLinePos + 10);
      gRight2Start.setAttribute('y1', sideY);
      gRight2Start.setAttribute('y2', sideY);
      gRight2End.setAttribute('x1', rightLinePos - 10);
      gRight2End.setAttribute('x2', rightLinePos + 10);
      gRight2End.setAttribute('y1', sideY + h);
      gRight2End.setAttribute('y2', sideY + h);

      let bottomLinePos = sideY + h + 7 + 10;
      let gBottom = view.querySelector('#side-room-bottom-lines');
      let gBottomLine = gBottom.querySelector('.line');
      let gBottomStart = gBottom.querySelector('.line-start');
      let gBottomEnd = gBottom.querySelector('.line-end');
      gBottomLine.setAttribute('x1', sideX);
      gBottomLine.setAttribute('x2', sideX + d);
      gBottomLine.setAttribute('y1', bottomLinePos);
      gBottomLine.setAttribute('y2', bottomLinePos);
      gBottomStart.setAttribute('x1', sideX);
      gBottomStart.setAttribute('x2', sideX);
      gBottomStart.setAttribute('y1', bottomLinePos - 10);
      gBottomStart.setAttribute('y2', bottomLinePos + 10);
      gBottomEnd.setAttribute('x1', sideX + d);
      gBottomEnd.setAttribute('x2', sideX + d);
      gBottomEnd.setAttribute('y1', bottomLinePos - 10);
      gBottomEnd.setAttribute('y2', bottomLinePos + 10);
    }

    function frontViewLines() {
      // front view
      front = view.querySelector('#front-room-inner-square');
      fOut = view.querySelector('#front-room-outer-square');

      front.setAttribute('x', frontX);
      front.setAttribute('y', sideY);
      front.setAttribute('width', w);
      front.setAttribute('height', h);

      let fOutX = frontX - 7;
      let fOutY = sideY - 7;
      fOut.setAttribute('x', fOutX);
      fOut.setAttribute('y', fOutY);
      fOut.setAttribute('width', w + 14);
      fOut.setAttribute('height', h + 14);

      // set lines - front view
      let topLinePos2 = fOutY - 10;
      let gTop = view.querySelector('#front-room-top-lines');
      let gTopLine = gTop.querySelector('.line');
      let gTopStart = gTop.querySelector('.line-start');
      let gTopEnd = gTop.querySelector('.line-end');
      gTopLine.setAttribute('x1', frontX);
      gTopLine.setAttribute('x2', frontX + w);
      gTopLine.setAttribute('y1', topLinePos2);
      gTopLine.setAttribute('y2', topLinePos2);
      gTopStart.setAttribute('x1', frontX);
      gTopStart.setAttribute('x2', frontX);
      gTopStart.setAttribute('y1', topLinePos2 - 10);
      gTopStart.setAttribute('y2', topLinePos2 + 10);
      gTopEnd.setAttribute('x1', frontX + w);
      gTopEnd.setAttribute('x2', frontX + w);
      gTopEnd.setAttribute('y1', topLinePos2 - 10);
      gTopEnd.setAttribute('y2', topLinePos2 + 10);

      let leftLinePos2 = frontX - 7 - 10;
      let gLeft = view.querySelector('#front-room-left-lines');
      let gLeftLine = gLeft.querySelector('.line');
      let gLeftStart = gLeft.querySelector('.line-start');
      let gLeftEnd = gLeft.querySelector('.line-end');
      gLeftLine.setAttribute('x1', leftLinePos2);
      gLeftLine.setAttribute('x2', leftLinePos2);
      gLeftLine.setAttribute('y1', sideY);
      gLeftLine.setAttribute('y2', sideY + h);
      gLeftStart.setAttribute('x1', leftLinePos2 - 10);
      gLeftStart.setAttribute('x2', leftLinePos2 + 10);
      gLeftStart.setAttribute('y1', sideY);
      gLeftStart.setAttribute('y2', sideY);
      gLeftEnd.setAttribute('x1', leftLinePos2 - 10);
      gLeftEnd.setAttribute('x2', leftLinePos2 + 10);
      gLeftEnd.setAttribute('y1', sideY + h);
      gLeftEnd.setAttribute('y2', sideY + h);

      let rightLinePos2 = frontX + w + 7 + 10;
      let gRight = view.querySelector('#front-room-right-lines');
      let gRightLine = gRight.querySelector('.line');
      let gRightStart = gRight.querySelector('.line-start');
      let gRightEnd = gRight.querySelector('.line-end');
      gRightLine.setAttribute('x1', rightLinePos2 + 30);
      gRightLine.setAttribute('x2', rightLinePos2 + 30);
      gRightLine.setAttribute('y1', sideY);
      gRightLine.setAttribute('y2', sideY + h);
      gRightStart.setAttribute('x1', rightLinePos2 - 10 + 30);
      gRightStart.setAttribute('x2', rightLinePos2 + 10 + 30);
      gRightStart.setAttribute('y1', sideY);
      gRightStart.setAttribute('y2', sideY);
      gRightEnd.setAttribute('x1', rightLinePos2 - 10 + 30);
      gRightEnd.setAttribute('x2', rightLinePos2 + 10 + 30);
      gRightEnd.setAttribute('y1', sideY + h);
      gRightEnd.setAttribute('y2', sideY + h);

      let gRight2 = view.querySelector('#front-room-right-lines2');
      let gRight2Line = gRight2.querySelector('.line');
      let gRight2Start = gRight2.querySelector('.line-start');
      let gRight2End = gRight2.querySelector('.line-end');
      gRight2Line.setAttribute('x1', rightLinePos2);
      gRight2Line.setAttribute('x2', rightLinePos2);
      gRight2Line.setAttribute('y1', sideY);
      gRight2Line.setAttribute('y2', sideY + h);
      gRight2Start.setAttribute('x1', rightLinePos2 - 10);
      gRight2Start.setAttribute('x2', rightLinePos2 + 10);
      gRight2Start.setAttribute('y1', sideY);
      gRight2Start.setAttribute('y2', sideY);
      gRight2End.setAttribute('x1', rightLinePos2 - 10);
      gRight2End.setAttribute('x2', rightLinePos2 + 10);
      gRight2End.setAttribute('y1', sideY + h);
      gRight2End.setAttribute('y2', sideY + h);

      let bottomLinePos2 = sideY + h + 7 + 10;
      let gBottom = view.querySelector('#front-room-bottom-lines');
      let gBottomLine = gBottom.querySelector('.line');
      let gBottomStart = gBottom.querySelector('.line-start');
      let gBottomEnd = gBottom.querySelector('.line-end');
      gBottomLine.setAttribute('x1', frontX);
      gBottomLine.setAttribute('x2', frontX + w);
      gBottomLine.setAttribute('y1', bottomLinePos2);
      gBottomLine.setAttribute('y2', bottomLinePos2);
      gBottomStart.setAttribute('x1', frontX);
      gBottomStart.setAttribute('x2', frontX);
      gBottomStart.setAttribute('y1', bottomLinePos2 - 10);
      gBottomStart.setAttribute('y2', bottomLinePos2 + 10);
      gBottomEnd.setAttribute('x1', frontX + w);
      gBottomEnd.setAttribute('x2', frontX + w);
      gBottomEnd.setAttribute('y1', bottomLinePos2 - 10);
      gBottomEnd.setAttribute('y2', bottomLinePos2 + 10);

      let bottomLinePos3 = bottomLinePos2 + 28;
      let gBottom2 = view.querySelector('#front-room-bottom-lines2');
      let gBottom2Line = gBottom2.querySelector('.line');
      let gBottom2Start = gBottom2.querySelector('.line-start');
      let gBottom2End = gBottom2.querySelector('.line-end');
      gBottom2Line.setAttribute('x1', frontX);
      gBottom2Line.setAttribute('x2', frontX + w);
      gBottom2Line.setAttribute('y1', bottomLinePos3);
      gBottom2Line.setAttribute('y2', bottomLinePos3);
      gBottom2Start.setAttribute('x1', frontX);
      gBottom2Start.setAttribute('x2', frontX);
      gBottom2Start.setAttribute('y1', bottomLinePos3 - 10);
      gBottom2Start.setAttribute('y2', bottomLinePos3 + 10);
      gBottom2End.setAttribute('x1', frontX + w);
      gBottom2End.setAttribute('x2', frontX + w);
      gBottom2End.setAttribute('y1', bottomLinePos3 - 10);
      gBottom2End.setAttribute('y2', bottomLinePos3 + 10);
    }

    sideViewLines();
    frontViewLines();
  },
  setRoomLines: function () {
    let frm = document.forms.controlForm;
    let view = document.querySelector('#projection-calculator-en-root .elevation-section');
    let ratio = currentStatus.roomSizeRatio;
    let width = currentStatus.roomWidth;
    let height = currentStatus.roomHeight;
    let depth = currentStatus.roomDepth;

    let w = width * ratio;
    let h = height * ratio;
    let d = depth * ratio;
    // center position : 3000, 2000;

    let sideX = 300 - d / 2;
    let sideY = 200 - h / 2;
    let frontX = 300 - w / 2;

    let sOutX = sideX - 7;
    let sOutY = sideY - 7;

    // get distance and lens positions
    let dist = currentStatus.distance * ratio;
    let scrW = currentStatus.screenWidth * ratio;
    let scrH = currentStatus.screenHeight * ratio;

    let lensPosX = currentStatus.lensPosition.x;
    let lensPosY = currentStatus.lensPosition.y;
    let lensPosD = currentStatus.lensPosition.d;

    let lensX = lensPosX * ratio;
    let lensY = lensPosY * ratio;
    let lensD = lensPosD * ratio;

    // draw screen in side view & front view
    let scrS = view.querySelector('#side-room-screen');
    let scrF = view.querySelector('#front-room-screen');
    let scrF2 = view.querySelector('#front-room-screen2');
    let scrX, scrY, scrB, scrR;
    scrX = currentStatus.fromLeft * ratio;
    scrY = currentStatus.fromTop * ratio;
    scrB = currentStatus.fromBottom * ratio;
    scrR = currentStatus.fromRight * ratio;
    scrS.setAttribute('x', sOutX);
    scrS.setAttribute('y', sideY + scrY);
    scrS.setAttribute('width', 7);
    scrS.setAttribute('height', scrH);
    scrF.setAttribute('x', frontX + scrX);
    scrF.setAttribute('y', sideY + scrY);
    scrF.setAttribute('width', scrW);
    scrF.setAttribute('height', scrH);
    scrF2.setAttribute('x', frontX + scrX);
    scrF2.setAttribute('y', sideY + scrY);
    scrF2.setAttribute('width', scrW);
    scrF2.setAttribute('height', scrH);
    let scrTxt = view.querySelector('#g-front-room-screen').querySelector('text');
    scrTxt.setAttribute('x', frontX + scrX + scrW / 2);
    scrTxt.setAttribute('y', sideY + scrY + scrH / 2);

    // draw triangle in side view
    let poly = view.querySelector('#side-room-screen-triangle');
    let pnts = '';
    pnts = sideX + ',' + (sideY + scrY);
    pnts += ' ' + sideX + ',' + (sideY + scrY + scrH);
    pnts += ' ' + (sideX + dist) + ',' + (sideY + lensY);
    poly.setAttribute('points', pnts);

    function sideViewLines() {
      // Side view red dot and numbers
      let topLinePos = sOutY - 40;
      let gTop = view.querySelector('#side-room-top-lines');
      let gTopTxt = gTop.querySelector('.g-txt');
      gTopTxt.style.transform = 'translate(' + (sideX + d / 2) + 'px, ' + topLinePos + 'px)';
      gTopTxt.querySelector('text').textContent = frm.roomDepth.value;
      let fromBack = commonFunc.calculateUnits(depth - currentStatus.distance).value;
      let gTop2 = view.querySelector('#side-room-top-lines2');
      let gTop2Txt1 = gTop2.querySelector('.g-txt1');
      let gTop2Txt2 = gTop2.querySelector('.g-txt2');
      let gTop2Circle = gTop2.querySelector('.circle');
      gTop2Circle.setAttribute('cx', sideX + dist);
      gTop2Circle.setAttribute('cy', topLinePos + 30);
      gTop2Txt1.style.transform = 'translate(' + (sideX + dist / 2) + 'px, ' + (topLinePos + 30) + 'px)';
      gTop2Txt2.style.transform = 'translate(' + (sideX + dist + (d - dist) / 2) + 'px, ' + (topLinePos + 30) + 'px)';
      gTop2Txt1.querySelector('text').textContent = +frm.distance.value;
      gTop2Txt2.querySelector('text').textContent = fromBack;
      gTop2Txt2.style.display = fromBack < 0 ? 'none' : 'block';

      let leftLinePos = sOutX - 10;
      let gLeft = view.querySelector('#side-room-left-lines');
      let gLeftTxt1 = gLeft.querySelector('.g-txt1');
      let gLeftTxt2 = gLeft.querySelector('.g-txt2');
      let gLeftTxt3 = gLeft.querySelector('.g-txt3');
      let gLeftCircle1 = gLeft.querySelector('.circle-1');
      let gLeftCircle2 = gLeft.querySelector('.circle-2');
      gLeftCircle1.setAttribute('cx', leftLinePos);
      gLeftCircle1.setAttribute('cy', sideY + scrY);
      gLeftCircle2.setAttribute('cx', leftLinePos);
      gLeftCircle2.setAttribute('cy', sideY + scrY + scrH);
      gLeftTxt1.style.transform = 'translate(' + leftLinePos + 'px, ' + (sideY + scrY / 2) + 'px)';
      gLeftTxt2.style.transform = 'translate(' + leftLinePos + 'px, ' + (sideY + scrY + scrH / 2) + 'px)';
      gLeftTxt3.style.transform = 'translate(' + leftLinePos + 'px, ' + (sideY + scrY + scrH + scrB / 2) + 'px)';
      gLeftTxt1.querySelector('text').textContent = frm.fromTop.value;
      gLeftTxt2.querySelector('text').textContent = frm.screenHeight.value;
      gLeftTxt3.querySelector('text').textContent = frm.fromBottom.value;
      gLeftTxt1.style.display = frm.fromTop.value <= 0 ? 'none' : 'block';
      gLeftTxt3.style.display = frm.fromBottom.value <= 0 ? 'none' : 'block';

      let rightLinePos = sideX + d + 7 + 10;
      let gRight = view.querySelector('#side-room-right-lines');
      let gRightTxt = gRight.querySelector('.g-txt');
      gRightTxt.style.transform = 'translate(' + (rightLinePos + 30) + 'px, ' + (sideY + h / 2) + 'px)';
      gRightTxt.querySelector('text').textContent = frm.roomHeight.value;

      let gRight2 = view.querySelector('#side-room-right-lines2');
      let gRight2Circle = gRight2.querySelector('.circle');
      let gRight2Txt1 = gRight2.querySelector('.g-txt1');
      let gRight2Txt2 = gRight2.querySelector('.g-txt2');
      gRight2Circle.setAttribute('cx', rightLinePos);
      gRight2Circle.setAttribute('cy', sideY + lensY);
      gRight2Txt1.style.transform = 'translate(' + rightLinePos + 'px, ' + (sideY + lensY / 2) + 'px)';
      gRight2Txt2.style.transform = 'translate(' + rightLinePos + 'px, ' + (sideY + lensY + (h - lensY) / 2) + 'px)';
      gRight2Txt1.querySelector('text').textContent = commonFunc.calculateUnits(lensPosY).value;
      gRight2Txt2.querySelector('text').textContent = commonFunc.calculateUnits(height - lensPosY).value;

      let bottomLinePos = sideY + h + 7 + 10;
      let gBottom = view.querySelector('#side-room-bottom-lines');
      let gBottomCircle = gBottom.querySelector('.circle');
      let gBottomTxt1 = gBottom.querySelector('.g-txt1');
      let gBottomTxt2 = gBottom.querySelector('.g-txt2');
      let userD = currentStatus.userPosition.d * ratio;
      let userW = +view.querySelector('#side-svg .human-img').getAttribute('width') || 0;
      let userW2 = (currentStatus.userHeight * 4) / 20;
      gBottomCircle.setAttribute('cx', sideX + userD);
      gBottomCircle.setAttribute('cy', bottomLinePos);
      gBottomTxt1.style.transform = 'translate(' + (sideX + (userD - userW / 2) / 2) + 'px, ' + bottomLinePos + 'px)';
      gBottomTxt2.style.transform =
        'translate(' + (sideX + +userD + userW / 2 + (d - userD - userW / 2) / 2) + 'px, ' + bottomLinePos + 'px)';
      let uPosD = commonFunc.calculateUnits(currentStatus.userPosition.d).value;
      let uPosD2 = commonFunc.calculateUnits(depth).value - uPosD;
      gBottomTxt1.querySelector('text').textContent = uPosD;
      gBottomTxt2.querySelector('text').textContent = uPosD2;
      // gBottomTxt1.style.display = userD < 0 ? 'none' : 'block';
      gBottom.style.display = currentStatus.projectorType == 'LG CineBeam' ? 'none' : 'block';

      // set inner lines - side view
      let gInnerLine = view.querySelector('#side-room-inner-lines');
      let line1 = gInnerLine.querySelector('.lens-vertical');
      let line2 = gInnerLine.querySelector('.lens-horizontal');
      line1.setAttribute('x1', sideX + dist);
      line1.setAttribute('x2', sideX + dist);
      line1.setAttribute('y1', sideY);
      line1.setAttribute('y2', sideY + h);
      line2.setAttribute('x1', sideX);
      line2.setAttribute('x2', sideX + d);
      line2.setAttribute('y1', sideY + lensY);
      line2.setAttribute('y2', sideY + lensY);
      gInnerLine.querySelector('.line').style = 'stroke: rgb(251, 77, 101); stroke-dasharray: 5, 5;';
    }

    function frontViewLines() {
      // Front view red dot and numbers
      let topLinePos2 = sideY - 7 - 10;
      let gTop = view.querySelector('#front-room-top-lines');
      let gTopCircle1 = gTop.querySelector('.circle-1');
      let gTopCircle2 = gTop.querySelector('.circle-2');
      let gTopTxt1 = gTop.querySelector('.g-txt1');
      let gTopTxt2 = gTop.querySelector('.g-txt2');
      let gTopTxt3 = gTop.querySelector('.g-txt3');
      gTopCircle1.setAttribute('cx', frontX + scrX);
      gTopCircle1.setAttribute('cy', topLinePos2);
      gTopCircle2.setAttribute('cx', frontX + scrX + scrW);
      gTopCircle2.setAttribute('cy', topLinePos2);
      gTopTxt1.style.transform = 'translate(' + (frontX + scrX / 2) + 'px, ' + topLinePos2 + 'px)';
      gTopTxt2.style.transform = 'translate(' + (frontX + scrX + scrW / 2) + 'px, ' + topLinePos2 + 'px)';
      gTopTxt3.style.transform = 'translate(' + (frontX + scrX + scrW + scrR / 2) + 'px, ' + topLinePos2 + 'px)';
      gTopTxt1.querySelector('text').textContent = frm.fromLeft.value;
      gTopTxt2.querySelector('text').textContent = frm.screenWidth.value;
      gTopTxt3.querySelector('text').textContent = frm.fromRight.value;
      gTopTxt1.style.display = frm.fromLeft.value <= 0 ? 'none' : 'block';
      gTopTxt3.style.display = frm.fromRight.value <= 0 ? 'none' : 'block';

      let leftLinePos = frontX - 7 - 10;
      let gLeft = view.querySelector('#front-room-left-lines');
      let gLeftCircle1 = gLeft.querySelector('.circle-1');
      let gLeftCircle2 = gLeft.querySelector('.circle-2');
      let gLeftTxt1 = gLeft.querySelector('.g-txt1');
      let gLeftTxt2 = gLeft.querySelector('.g-txt2');
      let gLeftTxt3 = gLeft.querySelector('.g-txt3');
      gLeftCircle1.setAttribute('cx', leftLinePos);
      gLeftCircle1.setAttribute('cy', sideY + scrY);
      gLeftCircle2.setAttribute('cx', leftLinePos);
      gLeftCircle2.setAttribute('cy', sideY + scrY + scrH);
      gLeftTxt1.style.transform = 'translate(' + leftLinePos + 'px, ' + (sideY + scrY / 2) + 'px)';
      gLeftTxt2.style.transform = 'translate(' + leftLinePos + 'px, ' + (sideY + scrY + scrH / 2) + 'px)';
      gLeftTxt3.style.transform =
        'translate(' + leftLinePos + 'px, ' + (sideY + scrY + scrH + (h - (scrY + scrH)) / 2) + 'px)';
      gLeftTxt1.querySelector('text').textContent = frm.fromTop.value;
      gLeftTxt2.querySelector('text').textContent = frm.screenHeight.value;
      gLeftTxt3.querySelector('text').textContent = frm.fromBottom.value;
      gLeftTxt1.style.display = frm.fromTop.value <= 0 ? 'none' : 'block';
      gLeftTxt3.style.display = frm.fromBottom.value <= 0 ? 'none' : 'block';

      let rightLinePos = frontX + w + 7 + 10;
      let gRight = view.querySelector('#front-room-right-lines');
      let gRightTxt = gRight.querySelector('.g-txt');
      gRightTxt.style.transform = 'translate(' + (rightLinePos + 30) + 'px, ' + (sideY + h / 2) + 'px)';
      gRightTxt.querySelector('text').textContent = frm.roomHeight.value;

      let gRight2 = view.querySelector('#front-room-right-lines2');
      let gRight2Circle = gRight2.querySelector('.circle');
      let gRight2Txt1 = gRight2.querySelector('.g-txt1');
      let gRight2Txt2 = gRight2.querySelector('.g-txt2');
      gRight2Circle.setAttribute('cx', rightLinePos);
      gRight2Circle.setAttribute('cy', sideY + lensY);
      gRight2Txt1.style.transform = 'translate(' + rightLinePos + 'px, ' + (sideY + lensY / 2) + 'px)';
      gRight2Txt2.style.transform = 'translate(' + rightLinePos + 'px, ' + (sideY + lensY + (h - lensY) / 2) + 'px)';
      gRight2Txt1.querySelector('text').textContent = commonFunc.calculateUnits(lensPosY).value;
      gRight2Txt2.querySelector('text').textContent = commonFunc.calculateUnits(height - lensPosY).value;

      let bottomLinePos = sideY + h + 7 + 10;
      let gBottom = view.querySelector('#front-room-bottom-lines');
      let gBottomTxt = gBottom.querySelector('.g-txt');
      gBottomTxt.style.transform = 'translate(' + (frontX + w / 2) + 'px, ' + (bottomLinePos + 28) + 'px)';
      gBottomTxt.querySelector('text').textContent = frm.roomWidth.value;

      let gBottom2 = view.querySelector('#front-room-bottom-lines2');
      let gBottom2Circle = gBottom2.querySelector('.circle');
      let gBottom2Txt1 = gBottom2.querySelector('.g-txt1');
      let gBottom2Txt2 = gBottom2.querySelector('.g-txt2');
      gBottom2Circle.setAttribute('cx', frontX + lensX);
      gBottom2Circle.setAttribute('cy', bottomLinePos);
      gBottom2Txt1.style.transform = 'translate(' + (frontX + lensX / 2) + 'px, ' + bottomLinePos + 'px)';
      gBottom2Txt2.style.transform = 'translate(' + (frontX + lensX + (w - lensX) / 2) + 'px, ' + bottomLinePos + 'px)';
      gBottom2Txt1.querySelector('text').textContent = commonFunc.calculateUnits(lensPosX).value;
      gBottom2Txt2.querySelector('text').textContent = commonFunc.calculateUnits(width - lensPosX).value;

      // set inner lines - front view
      let gInnerLine = view.querySelector('#front-room-inner-lines');
      let line1 = gInnerLine.querySelector('.lens-vertical');
      let line2 = gInnerLine.querySelector('.lens-horizontal');
      let line3 = gInnerLine.querySelector('.screen-top');
      let line4 = gInnerLine.querySelector('.screen-bottom');
      let line5 = gInnerLine.querySelector('.screen-left');
      let line6 = gInnerLine.querySelector('.screen-right');
      line1.setAttribute('x1', frontX + lensX);
      line1.setAttribute('x2', frontX + lensX);
      line1.setAttribute('y1', sideY + scrY + scrH);
      line1.setAttribute('y2', sideY + h);
      line2.setAttribute('x1', frontX + lensX);
      line2.setAttribute('x2', frontX + w);
      line2.setAttribute('y1', sideY + lensY);
      line2.setAttribute('y2', sideY + lensY);
      line3.setAttribute('x1', frontX);
      line3.setAttribute('x2', frontX + scrX);
      line3.setAttribute('y1', sideY + scrY);
      line3.setAttribute('y2', sideY + scrY);
      line4.setAttribute('x1', frontX);
      line4.setAttribute('x2', frontX + scrX);
      line4.setAttribute('y1', sideY + scrY + scrH);
      line4.setAttribute('y2', sideY + scrY + scrH);
      line5.setAttribute('x1', frontX + scrX);
      line5.setAttribute('x2', frontX + scrX);
      line5.setAttribute('y1', sideY);
      line5.setAttribute('y2', sideY + scrY);
      line6.setAttribute('x1', frontX + scrX + scrW);
      line6.setAttribute('x2', frontX + scrX + scrW);
      line6.setAttribute('y1', sideY);
      line6.setAttribute('y2', sideY + scrY);
      gInnerLine.querySelector('.line').style = 'stroke: rgb(251, 77, 101); stroke-dasharray: 5, 5;';
    }

    sideViewLines();
    frontViewLines();
  },
  setProjectorImage: function () {
    let imgNm = '';
    let imgWidth = 35;
    let imgHeight = 19;
    let offsetX = 0;
    let offsetY = -7;
    let paths = 'https://www.lg.com/_ncms/btb/projection-calculator-en/images/';
    if (currentStatus.modelName == 'PU700R') {
      imgNm = 'normal-projector-PU700R.png';
      imgWidth = 20;
    } else if (currentStatus.modelName != 'PU615U' && currentStatus.throwType == 'ust') {
      imgNm = 'ust-projector.png';
      imgWidth = 33;
      offsetX = -32;
      offsetY = 0;
    } else if (currentStatus.modelName == 'PU615U' && currentStatus.throwType == 'ust') {
      imgNm = 'ust-projector.png';
      imgWidth = 24;
      offsetX = -24;
      offsetY = 0;
    } else {
      imgNm = 'normal-projector.png';
    }
    if (currentStatus.installType != 'Desktop') {
      imgNm = imgNm.replace('.png', '-flip.png');
      offsetY = -1 * (offsetY + imgHeight);
    }
    let ratio = currentStatus.roomSizeRatio;
    let side = document.getElementById('side-svg');
    let sideImg = side.querySelector('#prj-img-side');
    let room = side.querySelector('#side-room-inner-square');
    let rX = room.getAttribute('x');
    let rY = room.getAttribute('y');
    sideImg.setAttribute('href', paths + imgNm);
    sideImg.setAttribute('x', +rX + currentStatus.distance * ratio);
    sideImg.setAttribute('y', +rY + currentStatus.lensPosition.y * ratio);
    sideImg.setAttribute('width', imgWidth);
    sideImg.setAttribute('height', imgHeight);
    sideImg.style.transform = 'translate(' + offsetX + 'px,' + offsetY + 'px)';

    let frontOffsetY = currentStatus.throwType == 'normal' ? -10 : -5;
    if (currentStatus.installType != 'Desktop') {
      frontOffsetY = -1 * (frontOffsetY + 30);
    }
    let front = document.getElementById('front-svg');
    let frontImg = front.querySelector('#prj-img-front');
    let fr = front.querySelector('#front-room-inner-square');
    let fX = fr.getAttribute('x');
    let fY = fr.getAttribute('y');
    frontImg.setAttribute('href', paths + 'back-projector.svg');
    frontImg.setAttribute('x', +fX + currentStatus.lensPosition.x * ratio);
    frontImg.setAttribute('y', +fY + currentStatus.lensPosition.y * ratio);
    frontImg.setAttribute('width', 54);
    frontImg.setAttribute('height', 30);
    frontImg.style.transform = 'translate(-27px,' + frontOffsetY + 'px)';
  },
  setHumanImage: function () {
    let app = document.querySelector('#projection-calculator-en-root');
    let r = currentStatus.roomSizeRatio;
    let size = currentStatus.userHeight * r;
    let d = currentStatus.userPosition.d * r;
    let x = currentStatus.userPosition.x * r;
    let rH = currentStatus.roomHeight * r;
    let sL = +app.querySelector('#side-room-inner-square').getAttribute('x');
    let sT = +app.querySelector('#side-room-inner-square').getAttribute('y');
    let fL = +app.querySelector('#front-room-inner-square').getAttribute('x');
    let fT = +app.querySelector('#front-room-inner-square').getAttribute('y');

    let sposY = sT + rH - size;
    let sposX = sL + d;

    let sImg = app.querySelector('#human-img-side'); // 4/20
    let fImg = app.querySelector('#human-img-front'); // 6/20

    if (currentStatus.projectorType == 'LG CineBeam') {
      sImg.style.display = 'none';
      fImg.style.display = 'none';
      return;
    } else {
      sImg.style.display = 'block	';
      fImg.style.display = 'block	';
    }

    // side
    let s_w, s_x;
    s_w = (size * 4) / 20;
    sImg.setAttribute('x', sposX - s_w / 2);
    sImg.setAttribute('y', sposY);
    sImg.setAttribute('width', s_w);
    sImg.setAttribute('height', size);

    // front
    let f_w = (size * 6) / 20;
    let fposY = fT + rH - size;
    let fposX = fL + x - f_w / 2;
    fImg.setAttribute('x', fposX);
    fImg.setAttribute('y', fposY);
    fImg.setAttribute('width', f_w);
    fImg.setAttribute('height', size);

    /*// front screen shadow
		let isFlip = currentStatus.installType != 'Desktop';
		let shadow = app.querySelector('#human-img-shadow');
		let lens = {
			x: currentStatus.lensPosition.x,
			y: currentStatus.lensPosition.y,
			d: currentStatus.lensPosition.d
		};
		let scr = {
			t: currentStatus.fromTop,
			l: currentStatus.fromLeft,
		};
		let usr  = {
			x: currentStatus.userPosition.x,
			d: currentStatus.userPosition.d
		};
		let usrH = currentStatus.userHeight;
		let dist2 = lens.d-usr.d;
		
		let scr2T, scr2L, scr2R, scr2B, scr2W;
		let sqr2 = pjtCalculator.getSquareFromDistance(dist2);
		let pos2 = pjtCalculator.getScreenPositionFromLensPosition(lens);
		let scr2 = {//svg room size value
			t: fT + pos2.t*r,
			l: fL + pos2.l*r,
			w: sqr2.width * r,
			h: sqr2.height * r
		};
		if ( ( scr2.t+scr2.h>fposY && scr2.t<rH) && ( fposX-f_w/2<scr2.l+scr2.w && fposX+f_w/2>scr2.l ) ) {// screen has shadow
			let sh_ra = lens.d/dist2;
			let sh_h = size * sh_ra;
			let sh_w = sh_h * (6/20);
			let sh_x = fL + x - sh_w/2;
			// let sh_y = fT + rH - sh_h;
			let sh_y = fposY;
			if ( !isFlip ) {
				sh_y = fT + rH - size*sh_ra;
			}
			shadow.setAttribute('x', sh_x);
			shadow.setAttribute('y', sh_y);
			shadow.setAttribute('width', sh_w);
			shadow.setAttribute('height', sh_h);
			shadow.style.display = 'block';
		} else {
			shadow.style.display = 'none';
		}
		//*/
  },
  drags: function () {
    let root = document.getElementById('projection-calculator-en-root');
    let side = root.querySelector('#side-svg');
    let front = root.querySelector('#front-svg');

    let sP = side.querySelector('#prj-img-side');
    let sH = side.querySelector('#human-img-side');
    let fP = front.querySelector('#prj-img-front');
    let fH = front.querySelector('#human-img-front');

    sP.setAttribute('draggable', true);
    sH.setAttribute('draggable', true);
    fP.setAttribute('draggable', true);
    fH.setAttribute('draggable', true);

    let evt1 = ['mousedown', 'mousemove', 'mouseup'];
    let evt2 = ['touchstart', 'touchmove', 'toucchend'];
    let evt;
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      evt = evt2;
    } else {
      evt = evt1;
    }
    root.currentDragEvt = evt;
    sP.addEventListener(evt[0], changeValues.dragStart);
    fP.addEventListener(evt[0], changeValues.dragStart);
    sH.addEventListener(evt[0], changeValues.dragStart);
    fH.addEventListener(evt[0], changeValues.dragStart);

    root.querySelector('#projection-calculator-en-root .elevation-section').classList.add('drag-activated');
  },
  refreshRoom: function () {
    drawRoom.setRoomLines();
    drawRoom.setProjectorImage();
    drawRoom.setHumanImage();
  },
  run: function () {
    pjtCalculator.setRoomSizeRatio();
    drawRoom.setRoomDefault();
    drawRoom.setRoomlayout();
    drawRoom.setRoomLines();
    drawRoom.setProjectorImage();
    drawRoom.setHumanImage();
    if (
      !document.querySelector('#projection-calculator-en-root .elevation-section').classList.contains('drag-activated')
    ) {
      this.drags();
    }
    drawRoom.updateDisabledPosition();
  },
};
