const htmlTemplates = {
  app: `
	<div class="App unselectable">
		
		
		<form id="control-form" name="controlForm" method="post" onsubmit="return false">
		<div class="page-section">
			
			<!-- control area -->
			<aside>
				<div class="control-section">
					<fieldset data-id="units">
						<div class="control-header">
							<h4 data-text="UNITS">UNITS</h4>
						</div>
						<div class="units-radio">
							<legend data-text="UNITS">UNITS</legend>
							<div><label class="checkbox"><input type="radio" name="units" value="cm"><span></span><em data-text="cm">cm</em></label></div>
							<div><label class="checkbox"><input type="radio" name="units" value="m"><span></span><em data-text="m">m</em></label></div>
							<div><label class="checkbox"><input type="radio" name="units" value="inch"><span></span><em data-text="inch">inch</em></label></div>
							<div><label class="checkbox"><input type="radio" name="units" value="ft"><span></span><em data-text="ft">ft</em></label></div>
						</div>
					</fieldset>
					<fieldset data-id="projector">
						<div class="control-header">
							<h4 data-text="PROJECTOR">PROJECTOR</h4>
						</div>
						<button type="button" class="instruction-btn" data-text="How To Use">How To Use</button>
						<div class="projector-choice">
							<label class="checkbox"><input type="radio" name="projectorType" value="LG CineBeam"><span></span><em data-text="LG CineBeam">LG CineBeam</em></label>
							<label class="checkbox"><input type="radio" name="projectorType" value="LG ProBeam" ><span></span><em data-text="LG ProBeam" >LG ProBeam</em></label>
						</div>
						<div class="form-group">
							<label for="modelName" data-text="Model Name">Model Name</label>
							<select id="modelName" name="modelName"></select>
						</div>
						<div class="form-group">
							<label for="availableLense" data-text="Available Lenses">Available Lenses</label>
							<input type="text" id="availableLense" name="availableLenses" class="" readonly value="">
						</div>
						<div class="form-group">
							<label for="installType" data-text="Installation Type">Installation Type</label>
							<select id="installType" name="installType">
								<option value="Desktop" class="" data-text="Desktop">Desktop</option>
								<option value="Ceiling mount" class="" data-text="Ceiling mount">Ceiling mount</option>
							</select>
						</div>
						<div class="form-group">
							<label for="aspectRatio" data-text="Aspect Ratio">Aspect Ratio</label>
							<select id="aspectRatio" name="aspectRatio">
								<option value="16:10" class="">16:10</option>
								<option value="16:9" class="">16:9</option>
								<option value="4:3" class="">4:3</option>
							</select>
						</div>
					</fieldset>
					<fieldset class="user-height" data-id="userHeight">
						<div class="control-header">
							<h4 data-text="USERs HEIGHT">USER'S HEIGHT</h4>
							<button type="button" class="lock-btn" data-lock="userHeight"></button>
						</div>
						<div class="form-group">
							<label for="userHeight" data-text-fn="getRangeFromData" data-fn-target="userHeight" data-fn-step="getUnitsValue">180~230 cm</label>
							<input id="userHeight" name="userHeight" type="text" value="">
							<span class="cm" data-text-fn="getUnitsValue">cm</span>
							<div class="buttons btn-updown" data-target="userHeight">
								<button type="button" class="decrease"></button>
								<button type="button" class="increase"></button>
							</div>
						</div>
					</fieldset>
					<fieldset class="projector-distance" data-id="distance">
						<div class="control-header">
							<h4 data-text="PROJECTOR TO SCREEN DISTANCE">PROJECTOR TO SCREEN DISTANCE</h4>
							<button type="button" class="lock-btn" data-lock="distance"></button>
						</div>
						<div class="form-group">
							<label for="distance" data-text-fn="getRangeFromData" data-fn-target="distance" data-fn-step="getUnitsValue">198~1397 cm</label>
							<input id="distance" name="distance" type="text" value="">
							<span class="cm" data-text-fn="getUnitsValue">cm</span>
							<div class="buttons btn-updown" data-target="distance">
								<button type="button" class="decrease"></button>
								<button type="button" class="increase"></button>
							</div>
						</div>
					</fieldset>
					<fieldset data-id="screenSize">
						<div class="control-header">
							<h4 data-text="SCREEN SIZE">SCREEN SIZE</h4>
							<button type="button" class="lock-btn" data-lock="screenSize"></button>
						</div>
						<div class="form-group">
							<label for="diagonal1" data-text="Diagonal">Diagonal</label>
							<input id="diagonal1" name="diagonal1" type="text" class="" value="">
							<span class="cm" data-text="inch">inch</span>
						</div>
						<div class="form-group">
							<label for="diagonal2"></label>
							<input id="diagonal2" name="diagonal2" type="text" class="" value="">
							<span class="cm" data-text="cm">cm</span>
						</div>
						<div class="form-group">
							<label for="screenHeight" data-text="Height">Height</label>
							<input id="screenHeight" name="screenHeight" type="text" class="" value="">
							<span class="cm" data-text-fn="getUnitsValue">cm</span>
						</div>
						<div class="form-group">
							<label for="screenWidth" data-text="Width">Width</label>
							<input id="screenWidth" name="screenWidth" type="text" class="" value="">
							<span class="cm" data-text-fn="getUnitsValue">cm</span>
						</div>
					</fieldset>
					<fieldset data-id="roomDimensions">
						<div class="control-header">
							<h4 data-text="ROOM DIMENSIONS">ROOM DIMENSIONS</h4>
							<button type="button" class="lock-btn" data-lock="roomDimensions"></button>
						</div>
						<div class="form-group">
							<label for="roomHeight" data-text="Height">Height</label>
							<input id="roomHeight" name="roomHeight" type="text" class="" value="">
							<span class="cm" data-text-fn="getUnitsValue">cm</span>
						</div>
						<div class="form-group">
							<label for="roomWidth" data-text="Width">Width</label>
							<input id="roomWidth" name="roomWidth" type="text" class="" value="">
							<span class="cm" data-text-fn="getUnitsValue">cm</span>
						</div>
						<div class="form-group">
							<label for="roomDepth" data-text="Depth">Depth</label>
							<input id="roomDepth" name="roomDepth" type="text" class="" value="">
							<span class="cm" data-text-fn="getUnitsValue">cm</span>
						</div>
					</fieldset>
					<button type="button" class="advanced-setting" data-fold-target="fold-001" data-text="ADVANCED SETTINGS">ADVANCED SETTINGS</button>
					<div style="display:none" data-fold="fold-001">
						<fieldset data-id="position">
							<div class="control-header">
								<h4 data-text="SCREEN POSITION">SCREEN POSITION</h4>
							</div>
							<div class="form-group">
								<label for="fromTop" data-text="From Top">From Top</label>
								<input id="fromTop" name="fromTop" type="text" class="" value="">
								<span class="cm" data-text-fn="getUnitsValue">cm</span>
							</div>
							<div class="form-group">
								<label for="fromBottom" data-text="From Bottom">From Bottom</label>
								<input id="fromBottom" name="fromBottom" type="text" class="" value="">
								<span class="cm" data-text-fn="getUnitsValue">cm</span>
							</div>
							<div class="form-group">
								<label for="fromLeft" data-text="From Left">From Left</label>
								<input id="fromLeft" name="fromLeft" type="text" class="" value="">
								<span class="cm" data-text-fn="getUnitsValue">cm</span>
							</div>
							<div class="form-group">
								<label for="fromRight" data-text="From Right">From Right</label>
								<input id="fromRight" name="fromRight" type="text" class="" value="">
								<span class="cm" data-text-fn="getUnitsValue">cm</span>
							</div>
						</fieldset>
						<fieldset class="lens-shift" data-id="lensShift">
							<div class="control-header">
								<h4 data-text="LENS SHIFT">LENS SHIFT</h4>
							</div>
							<legend data-text="LENS SHIFT">LENS SHIFT</legend>
							<div class="form-group">
								<label for="shiftVertical" data-text-fn="getRangeFromData" data-fn-target="shiftVertical" data-fn-step="%">Vertical</label>
								<input id="shiftVertical" name="shiftVertical" value="50">
								<span class="cm">%</span>
								<div class="buttons btn-updown" data-target="shiftVertical">
									<button type="button" class="decrease"></button>
									<button type="button" class="increase"></button>
								</div>
							</div>
							<div class="form-group">
								<label for="shiftHorizontal" data-text-fn="getRangeFromData" data-fn-target="shiftHorizontal" data-fn-step="%">Horizontal</label>
								<input id="shiftHorizontal" name="shiftHorizontal" value="">
								<span class="cm">%</span>
								<div class="buttons btn-updown" data-target="shiftHorizontal">
								<button type="button" class="decrease"></button>
								<button type="button" class="increase"></button>
							</div>
							</div>
						</fieldset>
					</div>
					<div class="buttons">
						<button type="button" class="reset-button">RESET</button>
						<button type="button" class="next-button only_mo">NEXT</button>
					</div>
				</div>
			</aside>
			
			<!-- view area -->
			<section class="elevation-section">
				<div class="share-section">
					<button type="button" class="share-btn" data-text="Share">Share</button>
					<button type="button" class="pdf-storage" data-text="Save as PDF">Save as PDF</button>
					<div class="tooltip-box" id="tooltip-share">
						<span class="title" data-text="Share">Share</span>
						<div class="sns-wrap">
							<ul class="sns-list">
								<li><button type="button" title="Share on Facebook" data-link-name="facebook"><span class="ico-btn fb"></span><span class="sns-name" data-text="Facebook">Facebook</span></button></li>
								<li><button type="button" title="Share on Twitter" data-link-name="twitter"><span class="ico-btn tw"></span><span class="sns-name" data-text="Twitter">Twitter</span></button></li>
								<li><button type="button" data-link-name="copy_url"><span class="ico-btn url"></span><span class="sns-name"> <em data-text="CopyURL">Copy URL</em></span></button></li>
								<li><button type="button" class="ico-btn kk" title="Share on KakaoTalk" data-link-name="kakaotalk" style="display: none;"><em data-text="KakaoTalk">KakaoTalk</em></button></li>
							</ul>
						</div>
						<button type="button" class="btn-close"><span class="blind">닫기</span></button>
					</div>
				</div>
				<div class="change-setting-btn">
					<button type="button" class="back-btn only_mo "></button>
					<p class="only_mo"><em data-text="Change the">Change the</em> <strong data-text="product/setting">product/setting</strong></p>
				</div>
				<div class="side-view">
					<div class="viewer-header">
						<h3 data-text="Side View">Side View</h3>
						<button type="button" class="fold-btn fold" data-fold-target="fold-002"></button>
					</div>
					<div class="products-view" data-fold="fold-002">
						<div class="lock-check">
							<div>
								<label class="checkbox"><input type="checkbox" name="dragLock" value="vertical"><span></span><em data-text="Lock Vertical Position">Lock Vertical Position</em></label>
							</div>
							<p><em data-text="UNITS">UNITS</em>: <em data-text-fn="getUnitsValue">cm</em></p>
						</div>
						<div class="viewer" data-id="sideViewSvg">
							<svg viewBox="0 0 600 400" class="side-viewer" id="side-svg" style="touch-action: none;"></svg>
						</div>
						<div class="zoom-range">
							<span data-text="Zoom Range">Zoom Range</span>
							<div>
								<span data-text="Telephoto">Telephoto</span>
								<span data-text="Wide Angle">Wide Angle</span>
							</div>
							<input name="zoomRange" type="range" class="slider" min="1" max="1.6" step="0.01" style="touch-action: none;">
							<div class="minMax">
								<span data-minmax="min">1x</span>
								<span data-minmax="max">1.6x</span>
							</div>
						</div>
					</div>
				</div>
				<div class="front-view">
					<div class="viewer-header">
						<h3>Front View</h3>
						<button type="button" class="fold-btn fold" data-fold-target="fold-003"></button>
					</div>
					<div class="products-view" data-fold="fold-003">
						<div class="lock-check">
							<div>
								<label class="checkbox"><input type="checkbox" name="dragLock" value="vertical"><span></span><em data-text="Lock Vertical Position">Lock Vertical Position</em></label>
								<label class="checkbox"><input type="checkbox" name="dragLock" value="horizontal"><span></span><em data-text="Lock Horizontal Position">Lock Horizontal Position</em></label>
							</div>
							<p><em data-text="UNITS">UNITS</em>: <em data-text-fn="getUnitsValue">cm</em></p>
						</div>
						<div class="viewer" data-id="frontViewSvg">
							<svg viewBox="0 0 600 400" class="front-viewer" id="front-svg" style="touch-action: none;"></svg>
						</div>
						<div class="zoom-range">
							<span data-text="Zoom Range">Zoom Range</span>
							<div>
								<span data-text="Telephoto">Telephoto</span>
								<span data-text="Wide Angle">Wide Angle</span>
							</div>
							<input name="zoomRange" type="range" class="slider" min="1" max="1.6" step="0.01" style="touch-action: none;">
							<div class="minMax">
								<span data-minmax="min">1x</span>
								<span data-minmax="max">1.6x</span>
							</div>
						</div>
					</div>
				</div>
				<div class="explain-section" data-text="Disclaimer"></div>
			</section>
		</div>
		</form>
	</div>
	`,
  sideSvg: `
	<rect id="side-room-inner-square" style="stroke: rgb(155, 155, 155); fill: none;"></rect>
	<rect id="side-room-outer-square" style="stroke: rgb(155, 155, 155); fill: none;"></rect>
	<rect id="side-room-screen" style="stroke: rgb(190, 86, 120); fill:#ea1917;"></rect>
	<g class="normalLine" id="side-room-top-lines" style="stroke: rgb(207, 207, 207); fill: none;">
		<line class="line"></line>
		<line class="line-start"></line>
		<line class="line-end"></line>
		<g class="g-txt" style="transform:translate(0,0)"><text id="side-room-top-size"></text></g>
	</g>
	<g class="normalLine" id="side-room-top-lines2" style="stroke: rgb(207, 207, 207); fill: none;">
		<line class="line"></line>
		<line class="line-start"></line>
		<line class="line-end"></line>
		<circle class="circle" r="5" style="stroke: none; fill:#ea1917;"></circle>
		<g class="g-txt1" style="transform:translate(0,0)"><text id="side-room-top-size1"></text></g>
		<g class="g-txt2" style="transform:translate(0,0)"><text id="side-room-top-size2"></text></g>
	</g>
	<g class="leftLine" id="side-room-left-lines" style="stroke: rgb(207, 207, 207); fill: none;">
		<line class="line"></line>
		<line class="line-start"></line>
		<line class="line-end"></line>
		<circle class="circle-1" r="5" style="stroke: none; fill:#ea1917;"></circle>
		<circle class="circle-2" r="5" style="stroke: none; fill:#ea1917;"></circle>
		<g class="g-txt1" style="transform:translate(0,0)"><text id="side-room-left-size1"></text></g>
		<g class="g-txt2" style="transform:translate(0,0)"><text id="side-room-left-size2"></text></g>
		<g class="g-txt3" style="transform:translate(0,0)"><text id="side-room-left-size3"></text></g>
	</g>
	<g class="rightLine" id="side-room-right-lines" style="stroke: rgb(207, 207, 207); fill: none;">
		<line class="line"></line>
		<line class="line-start"></line>
		<line class="line-end"></line>
		<g class="g-txt" style="transform:translate(0,0)"><text id="side-room-right-size"></text></g>
	</g>
	<g class="rightLine" id="side-room-right-lines2" style="stroke: rgb(207, 207, 207); fill: none;">
		<line class="line"></line>
		<line class="line-start"></line>
		<line class="line-end"></line>
		<circle class="circle" r="5" style="stroke: none; fill:#ea1917;"></circle>
		<g class="g-txt1" style="transform:translate(0,0)"><text id="side-room-right-size1"></text></g>
		<g class="g-txt2" style="transform:translate(0,0)"><text id="side-room-right-size2"></text></g>
	</g>
	<g class="bottomLine" id="side-room-bottom-lines" style="stroke: rgb(207, 207, 207); fill: none;">
		<line class="line"></line>
		<line class="line-start"></line>
		<line class="line-end"></line>
		<circle class="circle" r="5" style="stroke: none; fill:#ea1917;"></circle>
		<g class="g-txt1" style="transform:translate(0,0)"><text id="side-room-bottom-size1"></text></g>
		<g class="g-txt2" style="transform:translate(0,0)"><text id="side-room-bottom-size2"></text></g>
	</g>
	<g id="side-room-inner-lines">
		<line class="line lens-vertical" style="stroke: rgb(251, 77, 101); stroke-dasharray: 5, 5;"></line>
		<line class="line lens-horizontal" style="stroke: rgb(251, 77, 101); stroke-dasharray: 5, 5;"></line>
	</g>
	<polygon id="side-room-screen-triangle" style="fill: rgb(234 25 23 / 0.3); stroke: rgb(234 25 23 / 0.7); stroke-width: 1; stroke-dasharray: 2, 2;"></polygon>
	<image class="pjt-img" width="0" height="0" href="https://www.lg.com/_ncms/btb/projection-calculator-en/images/normal-projector-flip.png" id="prj-img-side" style="touch-action: none;"></image>
	<image class="human-img" width="0" height="0" href="https://www.lg.com/_ncms/btb/projection-calculator-en/images/silhouette_side.svg" id="human-img-side" style="touch-action: none;"></image>
	`,
  frontSvg: `
	<rect id="front-room-inner-square" style="stroke: rgb(155, 155, 155); fill: none;"></rect>
	<rect id="front-room-outer-square" style="stroke: rgb(155, 155, 155); fill: none;"></rect>
	<defs>
		<clipPath id="front-room-screen-def">
			<rect id="front-room-screen"></rect>
		</clipPath>
	</defs>
	<g style="clip-path: url(#front-room-screen-def); overflow:hidden;" id="g-front-room-screen">
		<rect id="front-room-screen2" style="stroke: rgb(190, 86, 120); fill:rgb(234 25 23 / 0.67)"></rect>
		<text text-anchor="middle" dominant-baseline="middle" style="fill: rgb(255, 255, 255); font-size: 0.9em;" id="screenText">Screen</text>
		<image class="human-shadow" width="0" height="0" href="https://www.lg.com/_ncms/btb/projection-calculator-en/images/silhouette_front.svg" id="human-img-shadow" style="touch-action: none;"></image>
	</g>
	
	<g class="normalLine" id="front-room-top-lines" style="stroke: rgb(207, 207, 207); fill: none;">
		<line class="line"></line>
		<line class="line-start"></line>
		<line class="line-end"></line>
		<circle r="5" style="stroke: none; fill:#ea1917;" class="circle-1"></circle>
		<circle r="5" style="stroke: none; fill:#ea1917;" class="circle-2"></circle>
		<g class="g-txt1" style="transform:translate(0,0)"><text id="front-room-top-size1"></text></g>
		<g class="g-txt2" style="transform:translate(0,0)"><text id="front-room-top-size2"></text></g>
		<g class="g-txt3" style="transform:translate(0,0)"><text id="front-room-top-size3"></text></g>
	</g>
	<g class="leftLine" id="front-room-left-lines" style="stroke: rgb(207, 207, 207); fill: none;">
		<line class="line"></line>
		<line class="line-start"></line>
		<line class="line-end"></line>
		<circle r="5" style="stroke: none; fill:#ea1917;" class="circle-1"></circle>
		<circle r="5" style="stroke: none; fill:#ea1917;" class="circle-2"></circle>
		<g class="g-txt1" style="transform:translate(0,0)"><text id="front-room-left-size1"></text></g>
		<g class="g-txt2" style="transform:translate(0,0)"><text id="front-room-left-size2"></text></g>
		<g class="g-txt3" style="transform:translate(0,0)"><text id="front-room-left-size3"></text></g>
	</g>
	<g class="rightLine" id="front-room-right-lines" style="stroke: rgb(207, 207, 207); fill: none;">
		<line class="line"></line>
		<line class="line-start"></line>
		<line class="line-end"></line>
		<g class="g-txt" style="transform:translate(0,0)"><text id="front-room-right-size"></text></g>
	</g>
	<g class="rightLine" id="front-room-right-lines2" style="stroke: rgb(207, 207, 207); fill: none;">
		<line class="line"></line>
		<line class="line-start"></line>
		<line class="line-end"></line>
		<circle class="circle" r="5" style="stroke: none; fill:#ea1917;"></circle>
		<g class="g-txt1" style="transform:translate(0,0)"><text id="front-room-right-size1"></text></g>
		<g class="g-txt2" style="transform:translate(0,0)"><text id="front-room-right-size2"></text></g>
	</g>
	<g class="bottomLine" id="front-room-bottom-lines" style="stroke: rgb(207, 207, 207); fill: none;">
		<line class="line"></line>
		<line class="line-start"></line>
		<line class="line-end"></line>
		<g class="g-txt" style="transform:translate(0,0)"><text id="front-room-bottom-size"></text></g>
	</g>
	<g class="bottomLine" id="front-room-bottom-lines2" style="stroke: rgb(207, 207, 207); fill: none;">
		<line class="line"></line>
		<line class="line-start"></line>
		<line class="line-end"></line>
		<circle class="circle" r="5" style="stroke: none; fill:#ea1917;"></circle>
		<g class="g-txt1" style="transform:translate(0,0)"><text id="front-room-bottom-size1"></text></g>
		<g class="g-txt2" style="transform:translate(0,0)"><text id="front-room-bottom-size2"></text></g>
	</g>
	<g id="front-room-inner-lines">
		<line class="line screen-top" style="stroke: rgb(251, 77, 101); stroke-dasharray: 5, 5;"></line>
		<line class="line screen-bottom" style="stroke: rgb(251, 77, 101); stroke-dasharray: 5, 5;"></line>
		<line class="line screen-left" style="stroke: rgb(251, 77, 101); stroke-dasharray: 5, 5;"></line>
		<line class="line screen-right" style="stroke: rgb(251, 77, 101); stroke-dasharray: 5, 5;"></line>
		<line class="line lens-vertical" style="stroke: rgb(251, 77, 101); stroke-dasharray: 5, 5;"></line>
		<line class="line lens-horizontal" style="stroke: rgb(251, 77, 101); stroke-dasharray: 5, 5;"></line>
	</g>
	<image class="pjt-img" width="0" height="0" href="https://www.lg.com/_ncms/btb/projection-calculator-en/images/back-projector.svg" id="prj-img-front" style="touch-action: none;"></image>
	<image class="human-img" width="0" height="0" href="https://www.lg.com/_ncms/btb/projection-calculator-en/images/silhouette_front.svg" id="human-img-front" style="touch-action: none;"></image>
	`,
  pdf: `
	<div class="pdf-page" id="pdf-wrapper">
		<div class="pdf-header">
			<h1><span data-text="Projection Calculator">Projection Calculator</span></h1>
			<time data-text-fn="getCurrentDateTime">2021.12.12 13:30:33</time>
		</div>
		<div class="pdf-body">
			<h2 data-target="modelName">LG ProBeam BU50</h2>
			<span class="units" data-target="units">UNITS: cm</span>
			<div class="control-result">
				<div>
					<div class="form-group">
						<span data-text="Available Lenses">Available Lenses</span>
						<span data-target="availableLenses"></span>
					</div>
					<div class="form-group">
						<span data-text="Installation Type">Installation Type</span>
						<span data-target="installType">Ceiling mount</span>
					</div>
					<div class="form-group">
						<span data-text="Aspect Ratio">Aspect Ratio</span>
						<span data-target="aspectRatio">16:10</span>
					</div>
					<div class="form-group">
						<span data-text="USERs HEIGHT">USER'S HEIGHT</span>
						<span data-target="userHeight"></span>
					</div>
					<div class="form-group">
						<span data-text="Throw Distance">Throw Distance</span>
						<span data-target="distance"></span>
					</div>
					<div class="form-group">
						<span data-text="LENS SHIFT">LENS SHIFT</span>
						<span>
							<em data-text="Vertical">Vertical</em> <em data-target="shiftVertical">0%</em>
							<br>
							<em data-text="Horizontal">Horizontal</em> <em data-target="shiftHorizontal">0%</em>
						</span>
					</div>
					<div class="form-group">
						<span data-text="Zoom Range">Zoom Range</span>
						<span data-target="zoomRange" style="font-weight:400">1x</span>
					</div>
				</div>
				<div>
					<div>
						<div class="form-group bold">
							<span data-text="SCREEN SIZE">SCREEN SIZE</span>
							<span data-target="diagonal1"></span>
						</div>
						<div class="form-group list">
							<span data-text="Diagonal">Diagonal</span>
							<span data-target="diagonal2"></span>
						</div>
						<div class="form-group list">
							<span data-text="Height">Height</span>
							<span data-target="screenHeight"></span>
						</div>
						<div class="form-group list">
							<span data-text="Width">Width</span>
							<span data-target="screenWidth"></span>
						</div>
					</div>
					<div>
						<div class="form-group bold">
							<span data-text="ROOM DIMENSIONS">ROOM DIMENSIONS</span>
						</div>
						<div class="form-group list">
							<span data-text="Height">Height</span>
							<span data-target="roomHeight"></span>
						</div>
						<div class="form-group list">
							<span data-text="Width">Width</span>
							<span data-target="roomWidth"></span>
						</div>
						<div class="form-group list">
							<span data-text="Depth">Depth</span>
							<span data-target="roomDepth"></span>
						</div>
					</div>
				</div>
				<div>
					<div class="form-group bold">
						<span data-text="SCREEN POSITION">SCREEN POSITION</span>
					</div>
					<div class="form-group list">
						<span data-text="From Top">From Top</span>
						<span data-target="fromTop"></span>
					</div>
					<div class="form-group list">
						<span data-text="From Bottom">From Bottom</span>
						<span data-target="fromBottom"></span>
					</div>
					<div class="form-group list">
						<span data-text="From Left">From Left</span>
						<span data-target="fromLeft"></span>
					</div>
					<div class="form-group list">
						<span data-text="From Right">From Right</span>
						<span data-target="fromRight"></span>
					</div>
				</div>
			</div>
			<div class="elevation-result">
				<div class="side-view">
					<h3 data-text="Side View">Side View</h3>
					<div class="svg-image" id="side-svg-image" data-target="side-svg"></div>
				</div>
				<div class="front-view">
					<h3 data-text="Front View">Front View</h3>
					<div class="svg-image" id="front-svg-image" data-target="front-svg"></div>
				</div>
				<div class="pdf-explain-section" data-text="Disclaimer"></div>
			</div>
		</div>
	</div>
	`,
  inquiry: `
	<div class="inquiry-form">
		<iframe data-src="https://b2bmkt.lge.com/IT_Global_PJT_Calculator_I2B" src="about:blank" id="inquiry-iframe" onLoad2="setIframeContentHeight">
			<p>Not available under your browser.</p>
		</iframe>
	</div>
	`,
  popup: `
	<div class="popup-layer" id="howto-popup">
		<div class="instruction-popup lay-inner">
			<div class="popup-header">
				<h2 data-text="How To Use">How To Use</h2>
			</div>
			<div class="use-step">
				<div class="only_pc pc-img">
					<img src="https://www.lg.com/_ncms/btb/projection-calculator-en/images/pc-popup-en.svg" class="popup-en">
					<img src="https://www.lg.com/_ncms/btb/projection-calculator-en/images/pc-popup-kr.svg" class="popup-kr">
				</div>
				
				<div class="step-group">
					<div class="step first">
						<div>
							<span>1</span>
							<p data-text="step first"> Select the projector model you would like to install.</p>
						</div>
						<div class="only_mo">
							<img src="https://www.lg.com/_ncms/btb/projection-calculator-en/images/mo-popup-en-first.svg" class="popup-en" alt="" />
							<img src="https://www.lg.com/_ncms/btb/projection-calculator-en/images/mo-popup-kr-first.svg" class="popup-kr" alt="" />
						</div>
					</div>
					<div class="step second">
						<div>
							<span>2</span>
							<p data-text="step second">Choose where to place the projector. (desktop or ceiling)</p>
						</div>
						<div class="only_mo">
							<img src="https://www.lg.com/_ncms/btb/projection-calculator-en/images/mo-popup-en-second.svg" class="popup-en" alt="" />
							<img src="https://www.lg.com/_ncms/btb/projection-calculator-en/images/mo-popup-kr-second.svg" class="popup-kr" alt="" />
						</div>
					</div>
					<div class="step second_n">
						<div>
							<span>3</span>
							<p data-text="step second_n">Choose where to place the projector. (desktop or ceiling)</p>
						</div>
						<div class="only_mo">
						<img src="https://www.lg.com/_ncms/btb/projection-calculator-en/images/mo-popup-en-third_n.svg" class="popup-en" alt="" />
						<img src="https://www.lg.com/_ncms/btb/projection-calculator-en/images/mo-popup-kr-third_n.svg" class="popup-kr" alt="" />
						</div>
					</div>
					<div class="step third">
						<div>
							<span>4</span>
							<p data-text="step third">Enter the distance between the screen and the projector directly with the key. Alternatively, you can adjust the product by dragging it from the side view or front view.</p>
						</div>
						<div class="only_mo">
							<img src="https://www.lg.com/_ncms/btb/projection-calculator-en/images/mo-popup-en-third.svg" class="popup-en" alt="" />
							<img src="https://www.lg.com/_ncms/btb/projection-calculator-en/images/mo-popup-kr-third.svg" class="popup-kr" alt="" />
						</div>
					</div>
					<div class="step fourth">
						<div>
							<span>5</span>
							<p data-text="step fourth">Enter the desired screen size with the key.</p>
						</div>
						<div class="only_mo">
							<img src="https://www.lg.com/_ncms/btb/projection-calculator-en/images/mo-popup-en-fourth.svg" class="popup-en" alt="" />
							<img src="https://www.lg.com/_ncms/btb/projection-calculator-en/images/mo-popup-kr-fourth.svg" class="popup-kr" alt="" />
						</div>
					</div>
					<div class="step fifth">
						<div>
							<span>6</span>
							<p data-text="step fifth">Enter the size of the place where the projector will be installed.</p>
						</div>
						<div class="only_mo">
							<img src="https://www.lg.com/_ncms/btb/projection-calculator-en/images/mo-popup-en-fifth.svg" class="popup-en" alt="" />
							<img src="https://www.lg.com/_ncms/btb/projection-calculator-en/images/mo-popup-kr-fifth.svg" class="popup-kr" alt="" />
						</div>
					</div>
					<div class="step sixth">
						<div>
							<span>7</span>
							<p data-text="step sixth">Advanced settings allow you to adjust the screen's position or lens shift function. (Only for models that support the lens shift function.)</p>
						</div>
						<div class="only_mo">
							<img src="https://www.lg.com/_ncms/btb/projection-calculator-en/images/mo-popup-en-sixth.svg" class="popup-en" alt="" />
							<img src="https://www.lg.com/_ncms/btb/projection-calculator-en/images/mo-popup-kr-sixth.svg" class="popup-kr" alt="" />
						</div>
					</div>
				</div>
				
			</div>
			<div class="explain-section" data-text="Disclaimer"></div>
			<button type="button" class="close-btn" data-text="close">close</button>
		</div>
	</div>
	<div class="popup-layer" id="reset-popup">
		<div class="reset-popup lay-inner">
			<div class="popup-header">
				<h2 data-text="RESET"> RESET</h2>
			</div>
			<div>
				<p>
					<em data-text="ResetMessage"></em>
					<br>
					<em data-text="Are you sure?"></em>
				</p>
				<div class="buttons">
					<button type="button" data-text="OK" id="reset-btn">OK</button>
					<button type="button" data-text="Cancel">Cancel</button>
				</div>
			</div>
		</div>
	</div>
	`,
  loading: `
		<div class="loading--area-wrap " role="alert" id="loading-div">
			<span class="sr-only">Loading</span>
			<div class="loading--area-inner">
				<div class="loading--img">
					<img src="https://www.lg.com/_ncms/btb/assets/images/icon/icon-loading.gif" alt="Loading">
				</div>
			</div>
		</div>
	`,
};
