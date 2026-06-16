const commonFunc = {
	getRealValue: function(v,u) {
		u = u ? u : currentStatus.units;
		// get the unit value
		const unit = {
			m: {
				coefficient: 1000,
				decimal: 2,
			},
			cm: {
				coefficient: 10,
				decimal: 0,
			},
			inch: {
				coefficient: 25.4,
				decimal: 1
			},
			ft: {
				coefficient: 304.8,
				decimal: 1
			},
			mm: {
				coefficient: 10,
				decimal: 0,
			}
		};
		let un = unit[u].coefficient;
		return +v * un;
	},
	calculateUnits: function(v,u) {
		// get the unit value
		u = u ? u : currentStatus.units;
		const unit = {
			m: {
				coefficient: 1000,
				decimal: 2,
			},
			cm: {
				coefficient: 10,
				decimal: 0,
			},
			inch: {
				coefficient: 25.4,
				decimal: 1
			},
			ft: {
				coefficient: 304.8,
				decimal: 1
			},
			mm: {
				coefficient: 10,
				decimal: 0,
			}
		};
		let r = v / unit[u].coefficient;
		let ef = 1;
		for ( let i=0; i<unit[u].decimal; i++ ) {
			ef = ef * 10;
		}
		let r2 = Math.round( r * ef ) / ef;
		return {
			value: r2,
			realValue: r
		};
	},
	getLinearValue: function(v1, arr1, arr2, rev) {
		let a1 = typeof arr1.min != 'undefined' ? arr1.min : arr1[0];
		let a2 = typeof arr1.max != 'undefined' ? arr1.max : arr1[1];
		let b1 = typeof arr2.min != 'undefined' ? arr2.min : arr2[0];
		let b2 = typeof arr2.max != 'undefined' ? arr2.max : arr2[1];
		let v1p = a1==a2 ? v1 : (v1-a1) / (a2-a1);
		let v2 =  b1==b2 ? b1 : !!rev ?  v1p * (b1-b2) + b2 : v1p * (b2-b1) + b1;
		return v2;
	},
	getProjectorInfor: function(model) {
		let arr = productsDataArr;
		let d = null;
		for ( let i=0; i<arr.length; i++ ) {
			if ( arr[i].modelName == model ) {
				d = arr[i];
				break;
			}
		}
		return d;
	},
	sortJsonArray: function(arr) {
		arr.sort( function(a, b) {
			if (a.order < b.order) return -1;
			if (a.order > b.order) return 1;
			return 0;
		});
	},
	copyArray: function(a) {
		let rtn = [];
		if ( Array.isArray(a) ) {
			a.forEach( function(c) {
				if (c.order) {
					rtn.push(c);
				}
			});
		}
		commonFunc.sortJsonArray(rtn);
		return  rtn;
	},
	makeProdArr: function(tp) {
		let names = productNamesArray[tp];
		let prods = tp=='LG ProBeam' ? productsDataArray_probeam : productsDataArray_cinebeam;
		let rtn = [];
		names.forEach( function(c) {
			for (let i=0; i<prods.length; i++) {
				if ( prods[i].modelName == c ) {
					rtn.push( prods[i] );
				}
			}
		});
		return rtn;
	}
};











