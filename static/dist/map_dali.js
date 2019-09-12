// 添加3D
var modelOrigin = [100.147582, 25.705589];
var modelAltitude = 0;
var modelRotate = [Math.PI / 2, 0, 0];
 
var modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);
 
// transformation parameters to position, rotate and scale the 3D model onto the map
var modelTransform = {
	translateX: modelAsMercatorCoordinate.x,
	translateY: modelAsMercatorCoordinate.y,
	translateZ: modelAsMercatorCoordinate.z,
	rotateX: modelRotate[0],
	rotateY: modelRotate[1],
	rotateZ: modelRotate[2],
	/* Since our 3D model is in real world meters, a scale transform needs to be
	* applied since the CustomLayerInterface expects units in MercatorCoordinates.
	*/
	scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
	// scale:8*10e-8
	};
	 
	var THREE = window.THREE;
	 
	// configuration of the custom layer for a 3D model per the CustomLayerInterface
	var customLayer = {
	id: '3d-model',
	type: 'custom',
	renderingMode: '3d',
	onAdd: function(map, gl) {
	this.camera = new THREE.Camera();
	this.scene = new THREE.Scene();
	 
	// create two three.js lights to illuminate the model
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(0, -70, 100).normalize();
	this.scene.add(directionalLight);
	 
	var directionalLight2 = new THREE.DirectionalLight(0xffffff);
	directionalLight2.position.set(0, 70, 100).normalize();
	this.scene.add(directionalLight2);
	 
	// use the three.js GLTF loader to add the 3D model to the three.js scene
	var loader = new THREE.GLTFLoader();
	loader.load(getRootPath()+"static/model/miniature_pagoda/scene.gltf", (function (gltf) {
	this.scene.add(gltf.scene);
	}).bind(this));
	this.map = map;
	 
	// use the Mapbox GL JS map canvas for three.js
	this.renderer = new THREE.WebGLRenderer({
	canvas: map.getCanvas(),
	context: gl,
	antialias: true
	});
	 
	this.renderer.autoClear = false;
	},
	render: function(gl, matrix) {
	var rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), modelTransform.rotateX);
	var rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), modelTransform.rotateY);
	var rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), modelTransform.rotateZ);
	 
	var m = new THREE.Matrix4().fromArray(matrix);
	var l = new THREE.Matrix4().makeTranslation(modelTransform.translateX, modelTransform.translateY, modelTransform.translateZ)
	.scale(new THREE.Vector3(modelTransform.scale, -modelTransform.scale, modelTransform.scale))
	.multiply(rotationX)
	.multiply(rotationY)
	.multiply(rotationZ);
	 
	this.camera.projectionMatrix.elements = matrix;
	this.camera.projectionMatrix = m.multiply(l);
	this.renderer.state.reset();
	this.renderer.render(this.scene, this.camera);
	this.map.triggerRepaint();
	}
};
//地图初始化
var map = new mapboxgl.Map({
	// attributionControl: true,
	container: 'map',
	// center: [114.15316467, 22.67357826],
    center:daliCityCenter,
    pitch:0,
    // pitchWithRotate:false,
    // dragRotate:false,
//	center:wyhCenter,
	zoom: 13.5,
	// maxBounds: daliBound,
	// fadeDuration:2000,
// 	minZoom: 2,
// 	maxZoom: 19,
	// style:daliStyle
	//scrollZoom:false,
	//doubleClickZoom:false,
	style: {
		"version": 8,
		"sprite": getRootPath()+"static/sprite/sprite",
		"glyphs": 'static/ziti/{fontstack}/{range}.pbf',
		"sources": {
			'dali_special1':{
                'type':'raster',
                'tiles':[
                    "http://192.168.82.38:8080/geoserver/water/wms?bbox={bbox-epsg-3857}&styles=&transparent=true&format=image/png&" +
                    "service=WMS&version=1.1.1&request=GetMap&srs=EPSG:900913&width=256&height=256&layers=water:special1"
                ],
                'tilesize':256
            }
        },
		"layers": [
			{
				"id": "background",
				"type": "background",
				"paint": {
//					"background-color": 'RGB(242,239,232)',
					"background-color": 'RGB(245,244,251)',
				},
				"layout":{
				    'visibility':'visible'
				}
			},
			{
                'id':'dali_special1',
                'type':'raster',
                'source':'dali_special1',
                'layout':{
                    'visibility':'none'
                }
            }
		]
	},
});
map.on('load', function () {
	map.addSource('raster',{
		'type':'raster',
		'tiles':[
			"http://192.168.82.38:8080/geoserver/water/wms?bbox={bbox-epsg-3857}&styles=&transparent=true&format=image/png&" +
			"service=WMS&version=1.1.1&request=GetMap&srs=EPSG:900913&width=256&height=256&layers=water:dali_resize_4_cj"
		],
		'tilesize':256
	});
	map.addSource('dali_dem_3d',{
		'type':'raster',
		'tiles':[
			"http://192.168.82.38:8080/geoserver/water/wms?bbox={bbox-epsg-3857}&styles=&transparent=true&format=image/png&" +
			"service=WMS&version=1.1.1&request=GetMap&srs=EPSG:900913&width=256&height=256&layers=water:dali_dem_3d"
		],
		'tilesize':256
	});
	map.addSource('wstation',{
		'type':'geojson',
		'data':'http://192.168.82.38:8080/geoserver/water/wms?service=WMS&version=1.1.0&request=GetMap&layers=water%3Awstation&bbox=100.022651672363%2C25.544261932373%2C100.287124633789%2C25.9625053405762&width=485&height=768&srs=EPSG%3A4326&format=application%2Fjson%3Btype%3Dgeojson',

	});
	map.addSource('dali_cj',{
		'type':'raster',
		'tiles':[
			"http://192.168.82.38:8080/geoserver/water/wms?bbox={bbox-epsg-3857}&styles=&transparent=true&format=image/png&" +
			"service=WMS&version=1.1.1&request=GetMap&srs=EPSG:900913&width=256&height=256&layers=water:dali_cj"
		],
		'tilesize':256
	});
	map.addSource('dali_river',{
		'type':'geojson',
		'data':'static/json/dali_river.geojson',
		"lineMetrics": true
	});

// 	objLayerIDs["影像"].push("dali_resize");
// 	map.addLayer({
//         'id':'dali_resize',
//         'type':'raster',
//         'source':'raster',
//         'paint':{
//             'raster-opacity':.5
//         },
//         'layout':{
//             'visibility':'none'
//         },
//     });
//     objLayerIDs["影像"].push("dali_cj");
// 	map.addLayer({
// 		'id':'dali_cj',
// 		'type':'raster',
// 		'source':'dali_cj',
// 		'paint':{
//             'raster-opacity':.5
//         },
// 		'layout':{
// 			'visibility':'none'
// 		}
// 	});
	objLayerIDs["地形图"].push("dali_dem_3d");
	map.addLayer({
		'id':'dali_dem_3d',
		'type':'raster',
		'source':'dali_dem_3d',
// 		'minzoom':8,
// 		'maxzoom':13,
		'layout':{
				'visibility':'none',
		}
	});
    map.addSource('dali_vector', {
        'type': 'vector',
         'scheme': 'tms',
        'tiles': [
//            'http://192.168.82.38:8765/data/dali_water/{z}/{x}/{y}.pbf'
			 'http://192.168.82.38:8080/geoserver/gwc/service/tms/1.0.0/water%3Awater_dali@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf',
			// 'http://localhost:8070/geoserver/gwc/service/tms/1.0.0/water%3Awater0610@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
		]
    });
    map.addSource('dali_dem',{
        'type':'raster-dem',
        'tiles':[
            "http://192.168.82.38:8080/geoserver/water/wms?bbox={bbox-epsg-3857}&styles=&transparent=true&format=image/png&" +
            "service=WMS&version=1.1.1&request=GetMap&srs=EPSG:900913&width=256&height=256&layers=water:dali_dem",

        ],
        'tilesize':256
    });
    map.addLayer({
        'id':'dali_dem',
        'type':'hillshade',
        'source':'dali_dem',
        'paint':{
            'hillshade-highlight-color':'RGB(255,255,0)',
            'hillshade-shadow-color':'RGB(5,113,10)',
            'hillshade-accent-color':'RGB(156,210,0)',
        },
        'layout':{
            'visibility':'none',
        }

    });
//	map.addSource('dali_vector2', {
//		'type': 'vector',
//		// 'scheme': 'tms',
//		'tiles': [
//			'http://192.168.82.38:8764/data/text/{z}/{x}/{y}.pbf'
//			// 'http://192.168.82.38:8080/geoserver/gwc/service/tms/1.0.0/water%3Awater_dali@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf',
//			// 'http://localhost:8070/geoserver/gwc/service/tms/1.0.0/water%3Awater0610@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
//			]
//	});
    // objLayerIDs["行政区"].push("district_dali");
	map.addLayer({
		'id':'district_dali',
		'type':'line',
		'source':'dali_vector',
		'source-layer':'district_dali_line',
//		'maxzoom':6.5,
		'paint':{
			'line-color':'RGB(81,87,89)',
			'line-width':2,
			'line-opacity':.8
		},
		"layout":{
            'visibility':'visible'
				}
	});
	// map.setLayoutProperty('district_dali','visibility','none');
    for(var i = 0;i<arrDaliBGDOrderid.length;i++)
    {
        objLayerIDs["背景"].push('bgd'+arrDaliBGDOrderid[i].toString());
        map.addLayer({
            'id':'bgd'+arrDaliBGDOrderid[i].toString(),
            'type':'fill',
            'source':'dali_vector',
            'source-layer':'bgd',
            "filter":["==","orderid",arrDaliBGDOrderid[i]],
            "minzoom": 8,
            'paint':{
//                'fill-translate':[30,30],
                'fill-color':arrDaliBGDColor[i],
            },
            'layout':{
                'visibility':'visible'
            }
        });
    }
	objLayerIDs["水系"].push('dali_river');
	map.addLayer({
	'id':'dali_river',
		'type':'line',
		'source':'dali_river',
		'paint':{
				'line-color':'RGB(161,197,252)',
				'line-width':6,
				// 'line-opacity':.2,
		},
		"layout":{
				'visibility':'visible',
				'line-cap':'round',
				'line-join':'round'
				}
	});
	objLayerIDs["水系"].push('water');
	map.addLayer({
		'id':'water',
		'type':'fill',
		'source':'dali_vector',
		'source-layer':'bgd',
		"filter":["in","orderid",111,126],
		"minzoom": 7,
		'paint':{
			'fill-color':'RGB(161,197,252)',
		},
		'layout':{
			'visibility':'visible'
		}
	});

	//辅助道路
    for(let i = 0;i<arrRoadLevel.length;i++)
    {
        objLayerIDs["道路"].push('roadSup_'+arrRoadLevel[i][0]);
        map.addLayer({
            'id':'roadSup_'+arrRoadLevel[i][0],
            'type':'line',
            'source':'dali_vector',
            'source-layer':'road',
            "filter":[
                'all',
                ["==","showgrade",arrRoadLevel[i][0]],
                ['in','roadclass',arrRoadClassSup[0]]
            ],
            "minzoom": arrRoadLevel[i][1],
            'paint':{
//                    'line-gap-width':1,
                    'line-color':'rgb(155,155,155)',
                    'line-width':{
                        'stops':[[8,2],[19,4]]
                    }
            },
            "layout":{
                    'line-cap':'round',
                    'line-join':'round',
                    'line-round-limit':1.5,
                    'visibility':'visible'
				}
        });
    }
    for(let i = 0;i<arrRoadLevel.length;i++)
    {
        objLayerIDs["道路"].push('roadSup'+arrRoadLevel[i][0]);
        map.addLayer({
            'id':'roadSup'+arrRoadLevel[i][0],
            'type':'line',
            'source':'dali_vector',
            'source-layer':'road',
            "filter":[
                'all',
                ["==","showgrade",arrRoadLevel[i][0]],
                ['in','roadclass',arrRoadClassSup[0]]
            ],
            "minzoom": arrRoadLevel[i][1],
            'paint':{
                    'line-color':arrRoadColorSup[0][1],
                    'line-width':{
                        'stops':[[8,1.5],[19,3.5]]
                    }
            },
            "layout":{
                    'line-cap':'round',
                    'line-join':'round',
                    'visibility':'visible'
				}
        });
    }
    //次要道路
    for(let i = 0;i<arrRoadLevel.length;i++)
    {
        objLayerIDs["道路"].push('roadMinor_'+arrRoadLevel[i][0]);
        map.addLayer({
            'id':'roadMinor_'+arrRoadLevel[i][0],
            'type':'line',
            'source':'dali_vector',
            'source-layer':'road',
            "filter":[
                'all',
                ["==","showgrade",arrRoadLevel[i][0]],
                ['!in','roadclass',arrRoadClassMain[0],arrRoadClassMain[1],arrRoadClassMain[2],arrRoadClassMain[3],arrRoadClassSup[0]]
            ],
            "minzoom": arrRoadLevel[i][1],
            'paint':{

                'line-color':'rgb(155,155,155)',
                'line-width':{
                    'stops':[[8,2],[19,10]]
                }
            },
            "layout":{
                    'line-cap':'round',
                    'line-join':'round',
                    'visibility':'visible'
				}
        });
    }
    for(let i = 0;i<arrRoadLevel.length;i++)
    {
        objLayerIDs["道路"].push('roadMinor'+arrRoadLevel[i][0]);
        map.addLayer({
            'id':'roadMinor'+arrRoadLevel[i][0],
            'type':'line',
            'source':'dali_vector',
            'source-layer':'road',
            "filter":[
                'all',
                ["==","showgrade",arrRoadLevel[i][0]],
                ['!in','roadclass',arrRoadClassMain[0],arrRoadClassMain[1],arrRoadClassMain[2],arrRoadClassMain[3],arrRoadClassSup[0]]
            ],
            "minzoom": arrRoadLevel[i][1],
            'paint':{

                'line-color':'rgb(245,245,245)',
                'line-width':{
                    'stops':[[8,1.5],[19,9]]
                },
            },
            "layout":{
                'line-cap':'round',
                'line-join':'round',
                'visibility':'visible'
            }
        });
    }
    //主要道路
    for(let i = 0;i<arrRoadLevel.length;i++)
    {
        objLayerIDs["道路"].push('roadMain_'+arrRoadLevel[i][0]);
        map.addLayer({
            'id':'roadMain_'+arrRoadLevel[i][0],
            'type':'line',
            'source':'dali_vector',
            'source-layer':'road',
            "filter":[
                'all',
                ["==","showgrade",arrRoadLevel[i][0]],
                ['in','roadclass',arrRoadClassMain[0],arrRoadClassMain[1],arrRoadClassMain[2],arrRoadClassMain[3]]
            ],
            "minzoom": arrRoadLevel[i][1],
            'paint':{

                'line-color':'rgb(155,155,155)',
                'line-width':{
                    'stops':[[8,2],[19,14]]
                },

            },
            "layout":{
                    'line-cap':'round',
                    'line-join':'round',
                    'visibility':'visible'
				}
        });
    }
    for(let i = 0;i<arrRoadLevel.length;i++)
    {
        objLayerIDs["道路"].push('roadMain'+arrRoadLevel[i][0]);
        map.addLayer({
            'id':'roadMain'+arrRoadLevel[i][0],
            'type':'line',
            'source':'dali_vector',
            'source-layer':'road',
            "filter":[
                'all',
                ["==","showgrade",arrRoadLevel[i][0]],
                ['in','roadclass',arrRoadClassMain[0],arrRoadClassMain[1],arrRoadClassMain[2],arrRoadClassMain[3]]
            ],
            "minzoom": arrRoadLevel[i][1],
            'paint':{

                'line-color':['match',['get','roadclass'],
                    arrRoadColorMain[0][0],arrRoadColorMain[0][1],
                    arrRoadColorMain[1][0],arrRoadColorMain[1][1],
                    arrRoadColorMain[2][0],arrRoadColorMain[2][1],
                    arrRoadColorMain[3][0],arrRoadColorMain[3][1],
                    'rgb(255,255,255)'
                ],
                'line-width':{
                    'stops':[[8,1.5],[19,13]]
                }
            },
            "layout":{
                    'line-cap':'round',
                    'line-join':'round',
                    'visibility':'visible'
				}
        });
    }
	objLayerIDs["建筑"].push('buildin');
	map.addLayer({
		'id': 'buildin',
		'source': 'dali_vector',
		'source-layer': 'building',
		'type': 'fill',
		'minzoom': 15,
		'paint': {
			"fill-color": 'RGB(237,236,242)',
		},
		"layout":{
			'visibility':'visible'
		},
		"interactive": true
	})
    objLayerIDs["建筑"].push('building_ex');
	map.addLayer({
		'id': 'building_ex',
		'source': 'dali_vector',
		'source-layer': 'building',
		'type': 'fill-extrusion',
		'minzoom': 16,
		'paint': {
			"fill-extrusion-color": 'RGB(225,225,223)',
			'fill-extrusion-height': ['get', 'height'],
//			'fill-extrusion-opacity': {
//				"stops": [[15.5, 0], [16, 1]],
//			},
            'fill-extrusion-opacity':0.8,
		},
		"layout":{
            'visibility':'visible'
        },
		"interactive": true
	})
	
// 	'fill-color': [
// 		'interpolate',
// 		['linear'],
// 		['get', 'population'],
// 		0, '#F2F12D',
// 		100, '#EED322',
// 		1000, '#E6B71E',
// 		5000, '#DA9C20',
// 		10000, '#CA8323',
// 		50000, '#B86B25',
// 		100000, '#A25626',
// 		500000, '#8B4225',
// 		1000000, '#723122'
// 	],
		//显示道路名称
	for(let i = 0;i<arrRoadLevel.length;i++)
	{
		objLayerIDs["文本"].push('roadtext'+arrRoadLevel[i][0]);
		map.addLayer({
			'id':'roadtext'+arrRoadLevel[i][0],
			'type':'symbol',
			'source':'dali_vector',
			'source-layer':'road',
			"filter":["==","showgrade",arrRoadLevel[i][0]],
			"minzoom": arrRoadLevel[i][1],
			'paint':{
					'text-color':'RGB(0,0,0)',
					'text-halo-color':'RGB(253,253,254)',
					'text-halo-width':1,
			},
			"layout":{
				'symbol-placement':'line',
				'text-field':"{roadname}",
				'text-size':10,
				'text-font':['MicrosoftYaHeiRegular'],
				// 'text-anchor':'bottom'
			}
		});
	}
	for(var i =0;i<arrTextLevel.length;i++)
	{
	    objLayerIDs["文本"].push('text'+i.toString());
	    let filter = ['in','level']
	    for (let ii = 1;ii<arrTextLevel[i].length;ii++){
	        filter.push(arrTextLevel[i][ii])
	    }
		map.addLayer({
			'id':'text'+i.toString(),
			'source':'dali_vector',
			'source-layer':'text',
			'type':'symbol',
			'minzoom':arrTextLevel[i][0],
			'filter':filter,
			'layout':{
			    'visibility':'visible',
				"icon-image":[
					"match",
					['get','typecode'],
					11010000,"restaurant-noodle-15",//中餐馆
					14990000,"suitcase-15",//购物设施
					24990000,"town-hall-11",//其它企事业单位
					14060000,"shop-15",//家具、家装、建材
					12050000,"lodging-15",//招待所
					11030000,"restaurant-pizza-15",//小吃快餐
					12990000,"lodging-11",//酒店
					23010000,"residence_1",//住宅
					17040000,"yaodian_1",//药店
					20130000,"car-repair-11",//汽车维修店
					23160000,"residence_1",//村，社区
					14040000,"convenience-15",//超市便利店
					12010000,"lodging-11",//星级酒店
					14050000,"prison-11",//电子电器
					20180000,"car-repair-11",//轮胎维修店
					22010000,"bank-15",//银行
					20040000,"parking-15",//停车场
					18070400,"town-hall-11",//村级政府
					20160000,"car-15",//品牌汽车服务店
					20140000,"car-rental-11",//汽车美容店
					"border-dot-13"//黑点
				],
				// "icon-offset":[0,0],
				"icon-size":1,
				// 'symbol-placement':"line",
				'text-field':"{stext}",
				'text-size':11,
				"text-offset":[0,2],
				'text-font':['MicrosoftYaHeiRegular'],
				'text-anchor':'bottom'
			},
			'paint':{
				'text-color':'RGB(0,0,0)',
 				'text-halo-color':'RGB(253,253,254)',
 				'text-halo-width':0.7,
 				'text-halo-blur':0.7,
			}
		})
	}
	
//	map.loadImage(getRootPath()+"GIS/static/image/water_drop1.png", function(error, water_drop2) {
	map.loadImage("static/image/water_drop1.png", function(error, water_drop2) {
		if (error) throw error;
		map.addImage('water_drop2', water_drop2);
		// objLayerIDs["监测站"].push('wstation');
		map.addLayer({
			'id': 'wstation',
			'source': 'wstation',
			'type': 'symbol',
			"layout": {
				"icon-image": "water_drop2",
				'symbol-avoid-edges':true,
				"icon-rotation-alignment":"viewport",
				'icon-padding':0,
				'icon-ignore-placement':true,
				'icon-allow-overlap':true,
				"icon-size": {
					'stops':[[18.5,0.1],[22,0.1]]
				},
				'visibility':'none',
			},
			"interactive":true
		})
		// objLayerIDs["监测站"].push('stationText');
		map.addLayer({
			'id':'stationText',
			'type':'symbol',
			'source':'wstation',
			'paint':{
				'text-color':'RGB(62,69,76)',
// 				'text-halo-color':'RGB(253,253,254)',
// 				'text-halo-width':1,
			},
			"layout":{
				// 'symbol-placement':'line',
				'text-field':"{name}",
				'text-size':10,
				"text-offset":[0,2],
				'text-font':['MicrosoftYaHeiRegular'],
				'visibility':'none',
				// 'text-anchor':'bottom'
			}
		});
	});
    map.addLayer({
        'id':'searchPOI',
        'source':'dali_vector',
        'source-layer':'poi',
        'type':'symbol',
        'filter':['==','recordid',''],
        'layout':{
            'visibility':'visible',
            "icon-image":"location_1",
            // "icon-offset":[0,0],
            "icon-size":1,
            // 'symbol-placement':"line",
            'text-field':"{name}",
            'text-size':11,
            "text-offset":[0,2],
            'text-font':['MicrosoftYaHeiRegular'],
            'text-anchor':'bottom'
        },
        'paint':{
            'text-color':'RGB(0,0,0)',
            'text-halo-color':'RGB(253,253,254)',
            'text-halo-width':0.7,
            'text-halo-blur':0.7,
        }
    })
	objLayerIDs["3D模型"].push('3d-model');
	map.addLayer(customLayer);
	d3.json('static/json/dali_river.geojson',function(err,data){
		if(err) throw err;
//        let timer = window.
		// objLayerIDs["河流"].push('dali_river_ani');
		var coordinates = data.features[0].geometry.coordinates;
		data.features[0].geometry.coordinates = [coordinates[0]];
		map.addSource('dali_river_ani',{type:'geojson',data:data,"lineMetrics": true});
		map.addLayer({
			'id':'dali_river_ani',
			'type':'line',
			'source':'dali_river_ani',
			'paint':{
				'line-color':'rgb(255,255,255)',
				'line-width':5,
				'line-gradient': [
					'interpolate',
					['linear'],
					['line-progress'],
					0, "RGB(69,113,171)",
					0.5,"RGB(151,190,159)",
					1, "RGB(255,255,255)"
				]
			},
			'layout':{
				'visibility':'none'
			}
		})
		function sleep(ms){
		  return new Promise((resolve)=>setTimeout(resolve,ms));
		}
		async function test(s){
		  var temple=await sleep(s);
		  return temple
		}
		setInterval(riverAni(),2800);
		function riverAni(){
			let i = 0;
			let timer = window.setInterval(function(){
				if(i<coordinates.length){
					data.features[0].geometry.coordinates.push(coordinates[i]);
					map.getSource('dali_river_ani').setData(data);
					i++;
				}else{
					i = 0;
					data.features[0].geometry.coordinates = [coordinates[0]];
					map.getSource('dali_river_ani').setData(data);
				}
			},1.5)
		}

	})
});
//搜索结果点击事件，后台显示坐标
map.on('click','searchPOI',function(e){
	let coordinates = [e.lngLat["lng"],e.lngLat["lat"]];
	console.log(coordinates);
})

//污染源点击事件
map.on('click','erhaiPollute',function(e){
	let videoEle = window.document.createElement('video');
	videoEle.style.width = '320px';
	videoEle.style.height = '240px';
	videoEle.style.controls = 'controls';
	videoEle.src = "static/video/drone.mp4";
	videoEle.style.type="video/mp4";
	let info = e.features[0].properties;
	let coordinates = [e.lngLat["lng"],e.lngLat["lat"]];
	new mapboxgl.Popup().setLngLat(coordinates)
			.setDOMContent(videoEle)
			.addTo(map);
	videoEle.play();
})


//监测站点点击显示表格
map.on('click','wstation',function(e){
    let info = e.features[0].properties;
    let coordinates = [e.lngLat["lng"],e.lngLat["lat"]];
    let algae =  info.algae.split(',').map(Number);
    let biodiversity =  info.biodiversity.split(',').map(Number);
    let pollution =  info.pollution.split(',').map(Number);
    let xAxis = [];
		for (let i = 0; i<algae.length;i++){
			xAxis.push(2000+i);
		}
		let echartDiv = window.document.createElement('div');
		echartDiv.style.width = '380px';
		echartDiv.style.height = '260px';
		// let echartDiv = window.document.getElementById('formEchart');
// 		let initWidHigh = function(){
// 			echartDiv.style.width = '380 px';
// 			echartDiv.style.height = '260 px';
// 		}
// 		initWidHigh();
		let myChart = echarts.init(echartDiv);
		let option = {
			title: {
					text: '统计'
			},
			tooltip: {
					trigger: 'axis'
			},
			legend: {
					data:['藻类丰富度','物种丰富度','污染投入量']
			},
			grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
			},
			toolbox: {
					feature: {
							saveAsImage: {}
					}
			},
			xAxis: {
					type: 'category',
					boundaryGap: false,
					data: xAxis
			},
			yAxis: {
					type: 'value'
			},
			series: [
					{
							name:'藻类丰富度',
							type:'line',
							stack: '总量',
							data:algae
					},
					{
							name:'物种丰富度',
							type:'line',
							stack: '总量',
							data:biodiversity
					},
					{
							name:'污染投入量',
							type:'line',
							stack: '总量',
							data:pollution
					}
				]
		};
		myChart.setOption(option);
		// div.innerHTML = echartDiv;
    new mapboxgl.Popup().setLngLat(coordinates)
        .setDOMContent(echartDiv)
        .addTo(map);
})
map.on('mousemove','wstation',function(){
	map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave','wstation',function(){
	map.getCanvas().style.cursor = '';
});

//设置图层显示、隐藏
function funVisible(layerid){
	var visibility = map.getLayoutProperty(layerid, 'visibility');
	if (visibility === 'visible') {
		map.setLayoutProperty(layerid, 'visibility', 'none');
	} else {
		map.setLayoutProperty(layerid, 'visibility', 'visible');
	}
}
//fly 通用函数
function funFly (data){
	if(animationFrameID !== undefined)
	{
		window.cancelAnimationFrame(animationFrameID);
		animationFrameID = undefined;
	}
	map.flyTo({
		// These options control the ending camera position: centered at
		// the target, at zoom level 9, and north up.
		center: data.center,
		zoom: data.zoom,
		bearing: 0,
		pitch:data.pitch,
		 
		// These options control the flight curve, making it move
		// slowly and zoom out almost completely before starting
		// to pan.
		speed: 1, // make the flying slow
		curve: 1, // change the speed at which it zooms out
		 
		// This can be any easing function: it takes a number between
		// 0 and 1 and returns another number between 0 and 1.
		easing: function (t) { return t; },
	});
}
var water_diffuseFun;
var water_flow;
//水污染扩散模拟开始
function waterDiffuse2(intervalTime){
    if (map.getLayer('erhai') === undefined)
	{
		let currentImage = 90;
		let imageIndex = 0
		function getErhaiPath(){
			return "/static/image/erhairgba/erhai_"+currentImage+".png";
		}
		map.addSource("erhai", {
			type: "image",
			url: getErhaiPath(),
			coordinates: [
				[100.09215611,25.9621225249],
				[100.30372011,25.9621225249],
				[100.30372011,25.5957445249],
				[100.09215611,25.5957445249]
			]
		});
		map.addLayer({
			id: "erhai",
			"type": "raster",
			"source": "erhai",
			// "minzoom": 7,
			"paint": {
				"raster-fade-duration": 0
			},
			'layout':{
				// 'visibility':'none'
			}
		},'erhaiPollute');
		function water_diffuse(){
			imageIndex = imageIndex+1;
			currentImage = imageIndex%55 +90;
			map.getSource("erhai").updateImage({url:getErhaiPath()});
		}
		water_diffuseFun=setInterval(water_diffuse,intervalTime);
	}
	else
	{
		
	}
}
//污染模拟结束
function WaterDiffuse2End(){
	clearInterval(water_diffuseFun);
	// water_diffuseFun = 0;
	map.removeLayer("erhai");
	map.removeSource("erhai");
}
//保存geojson
var btnSaveGeoJson = document.getElementById("saveGeojson");
btnSaveGeoJson.addEventListener("click",saveHandler,false);
//geojson保存到本地
function saveHandler(){
	var data = draw.getAll();
	reJson = JSON.stringify(data);
	var blob = new Blob([reJson],{type:"text/plain;charset=utf-8"});
	saveAs(blob,"draw.geojson");
}
//读取geojson
var inputGeojson = document.getElementById('inputGeojson');
inputGeojson.addEventListener("change",handleFiles,false);
function handleFiles(){
	var selectFile = document.getElementById("inputGeojson").files[0];//获取读取的File对象
	var name  = selectFile.name;
	var size = selectFile.size;
	console.log("文件名："+name+"大小："+size);
	var reader = new FileReader();
	reader.readAsText(selectFile);

	reader.onload = function(){
		if(!isJSON(this.result))
		{
			return null;
		}
		let inputJson = JSON.parse(this.result);
		draw.add(inputJson);
		console.log(inputJson);
	}
}

