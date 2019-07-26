map.on('load',function(){
	var daliPopulation1 = ["<",['get','count'],46];
	var daliPopulation2 = ["all",[">=",['get','count'],46],["<",['get','count'],92]];
	var daliPopulation3 = ["all",[">=",['get','count'],92],["<",['get','count'],138]];
	var daliPopulation4 = ["all",[">=",['get','count'],138],["<",['get','count'],184]];
	var daliPopulation5 = [">",['get','count'],184];
	map.addSource("daliPopulation",{
		"type":"geojson",
		"data":"static/json/daliPopulationFilter.geojson",
// 		"cluster":true,
// 		"clusterRadius":10,
// 		"clusterProperties":{
// 			"mag1": ["+", ["case", daliPopulation1, 1, 0]],
// 			"mag2": ["+", ["case", daliPopulation2, 1, 0]],
// 			"mag3": ["+", ["case", daliPopulation3, 1, 0]],
// 			"mag4": ["+", ["case", daliPopulation4, 1, 0]],
// 			"mag5": ["+", ["case", daliPopulation5, 1, 0]]
// 		}
	})
// 	map.addLayer({
// 		"id":"daliPopulation",
// 		"type":"circle",
// 		"source":"daliPopulation",
// 		"filter":["!=","cluster",true],
// 		"paint":{
// 			"circle-color":["case",
// 			daliPopulation1,'#fed976',
// 			daliPopulation2,'#feb24c',
// 			daliPopulation3,'#fd8d3c',
// 			daliPopulation4,'#fc4e2a',
// 			'#e31a1c'
// 			],
// 			'circle-opacity':0.6,
// 			'circle-radius':10
// 		}
// 	})
// 	map.addLayer({
// 		"id": "daliPopulation_label",
// 		"type": "symbol",
// 		"source": "daliPopulation",
// 		"filter": ["!=", "cluster", true],
// 		"layout": {
// 			"text-field": ["number-format", ["get", "count"], {"min-fraction-digits": 1, "max-fraction-digits": 9}],
// 			"text-font": ["MicrosoftYaHeiRegular"],
// 			"text-size": 10
// 		},
// 		"paint": {
// 		"text-color": ["case", ["<", ["get", "count"], 115], "black", "white"]
// 		}
// 	});
	
	//热力图
	map.addLayer({
		"id": "population-heat",
		"type": "heatmap",
		"source": "daliPopulation",
		"maxzoom": 16,
		"paint": {
		// Increase the heatmap weight based on frequency and property magnitude
		"heatmap-weight": ["interpolate",
				["linear"],
				["get", "count"],
				0, 0,
				500, 50,],
		// Increase the heatmap color weight weight by zoom level
		// heatmap-intensity is a multiplier on top of heatmap-weight
		"heatmap-intensity": [
			"interpolate",
			["linear"],
			["zoom"],
			4, 1,
			16, 3
		],
		// Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
		// Begin color ramp at 0-stop with a 0-transparancy color
		// to create a blur-like effect.
		"heatmap-color": [
			"interpolate",
			["linear"],
			["heatmap-density"],
			0, "rgba(33,102,172,0)",
			0.2, "rgb(103,169,207)",
			0.4, "rgb(209,229,240)",
			0.6, "rgb(253,219,199)",
			0.8, "rgb(239,138,98)",
			1, "rgb(178,24,43)"
		],
		// Adjust the heatmap radius by zoom level
		"heatmap-radius": [
		"interpolate",
		["linear"],
		["zoom"],
		4, 2,
		15, 50
		],
		// Transition from heatmap to circle layer by zoom level
// 		"heatmap-opacity": [
// 		"interpolate",
// 		["linear"],
// 		["zoom"],
// 		7, 1,
// 		9, 0
// 		],
		}
	});
		 
	map.addLayer({
		"id": "population-point",
		"type": "circle",
		"source": "daliPopulation",
		"minzoom": 4,
		"paint": {
		// Size circle radius by earthquake magnitude and zoom level
		"circle-radius": [
			"interpolate",
			["linear"],
			["zoom"],
			7, [
			"interpolate",
			["linear"],
			["get", "count"],
			1, 1,
			230, 4
			],
			19, [
			"interpolate",
			["linear"],
			["get", "count"],
			1, 5,
			230, 50
			]
		],
		// Color circle by earthquake magnitude
		"circle-color": [
		"interpolate",
		["linear"],
		["get", "count"],
		1, "rgba(33,102,172,0)",
		48, "rgb(103,169,207)",
		96, "rgb(209,229,240)",
		144, "rgb(253,219,199)",
		192, "rgb(239,138,98)",
		230, "rgb(178,24,43)"
		],
		"circle-stroke-color": "white",
		"circle-stroke-width": 1,
		// Transition from heatmap to circle layer by zoom level
		"circle-opacity": [
		"interpolate",
		["linear"],
		["zoom"],
		7, 0,
		8, 1
		]
		}
	});
})