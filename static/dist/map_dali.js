var map = new mapboxgl.Map({
	// attributionControl: true,
	container: 'map',
	// center: [114.15316467, 22.67357826],
    center:daliCityCenter,
    pitch:0,
    // pitchWithRotate:false,
    // dragRotate:false,
//	center:wyhCenter,
	zoom: 14,
	// maxBounds: daliBound,
	// fadeDuration:2000,
	minZoom: 2,
	maxZoom: 19,
	// style:daliStyle
	//scrollZoom:false,
	//doubleClickZoom:false,
	style: {
		"version": 8,
		"sprite": getRootPath()+"static/sprite/sprite",
		"glyphs": 'static/ziti/{fontstack}/{range}.pbf',
		"sources": {
			"raster": {
				"type": "raster",
				"tiles": [
					"http://192.168.82.38:8080/geoserver/water/wms?bbox={bbox-epsg-3857}&styles=&transparent=true&format=image/png&" +
					"service=WMS&version=1.1.1&request=GetMap&srs=EPSG:900913&width=256&height=256&layers=water:dali_resize_4_cj"
				],
				"tilesize":256,
			}
		},
		"layers": [
			{
				"id": "background",
				"type": "background",
				"paint": {
					"background-color": 'RGB(242,239,232)',
				}
			},
			{
				'id':'dali_resize',
				'type':'raster',
				'source':'raster',
				'layout':{
					'visibility':'none'
				},
			}
		]
	},
});
map.on('load', function () {
	map.addSource('dali_cj',{
		'type':'raster',
		'tiles':[
			"http://192.168.82.38:8080/geoserver/water/wms?bbox={bbox-epsg-3857}&styles=&transparent=true&format=image/png&" +
			"service=WMS&version=1.1.1&request=GetMap&srs=EPSG:900913&width=256&height=256&layers=water:dali_cj"
		],
		'tilesize':256
	});
	
	map.addLayer({
		'id':'dali_cj',
		'type':'raster',
		'source':'dali_cj',
		'layout':{
			'visibility':'none'
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
//	map.addSource('dali_vector2', {
//		'type': 'vector',
//		// 'scheme': 'tms',
//		'tiles': [
//			'http://192.168.82.38:8764/data/text/{z}/{x}/{y}.pbf'
//			// 'http://192.168.82.38:8080/geoserver/gwc/service/tms/1.0.0/water%3Awater_dali@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf',
//			// 'http://localhost:8070/geoserver/gwc/service/tms/1.0.0/water%3Awater0610@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
//			]
//	});
	map.addLayer({
		'id':'district_dali',
		'type':'line',
		'source':'dali_vector',
		'source-layer':'district_dali',
//		'maxzoom':6.5,
		'paint':{
			'line-color':'RGB(81,87,89)',
			'line-width':2,
			'line-opacity':.8
		}
	});
    for(var i = 0;i<arrDaliBGDOrderid.length;i++)
    {
        map.addLayer({
            'id':'bgd'+arrDaliBGDOrderid[i].toString(),
            'type':'fill',
            'source':'dali_vector',
            'source-layer':'bgd',
            "filter":["==","orderid",arrDaliBGDOrderid[i]],
            "minzoom": 8,
            'paint':{
                'fill-color':arrDaliBGDColor[i],
            },
            'layout':{
                // 'visibility':'none'
            }
        });
    }

	//辅助道路
    for(let i = 0;i<arrRoadLevel.length;i++)
    {
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
                    'line-color':'rgb(155,155,155)',
                    'line-width':{
                        'stops':[[8,2],[19,4]]
                    }
            }
        });
    }
    for(let i = 0;i<arrRoadLevel.length;i++)
    {
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
            }
        });
    }
    //次要道路
    for(let i = 0;i<arrRoadLevel.length;i++)
    {
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
            }
        });
    }
    for(let i = 0;i<arrRoadLevel.length;i++)
    {
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
                    }
            }
        });
    }
    //主要道路
    for(let i = 0;i<arrRoadLevel.length;i++)
    {
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
                    }
            }
        });
    }
    for(let i = 0;i<arrRoadLevel.length;i++)
    {
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
            }
        });
    }

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
	
	for(var i =0;i<arrTextLevel.length;i++)
	{
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
	map.addSource('flowLine' ,{
		"type":"geojson",
		"data":"static/json/draw_line.geojson",
	})
	map.addLayer({
		'id':'flowLine',
		'type':'line',
		'source':'flowLine',
		// 'source-layer':'road',
		// "filter":["==","showgrade",i+1],
		// "minzoom": arrRoadLevel[i],
		'paint':{
			'line-color':'RGB(0,0,0)',
			// 'line-pattern':"airfield-15",

		},
		'layout':{
			'visibility':'visible'
		}
	})



//	map.addSource("skimg", {
//	type: "image",
//	url: "/hbproject/image/shuiku_132.jpg",
//	coordinates: [
//	[114.334615718,23.9991899009],
//	[114.748875063, 23.9991899009],
//	[114.748875063, 23.6981045009],
//	[114.334615718, 23.6981045009]
//	]
//	});
//	map.addLayer({
//	    'id': "shuiku1",
//        "type": "raster",
//        "source": "skimg",
//        "minzoom": 7,
//        "paint": {
//            "raster-fade-duration": 0
//        },
//        'layout':{
//            'visibility':'none'
//        }
//	});

// 	map.addLayer({
// 		'id':'pointsymbol',
// 		'source':'CLDSource',
// 		'source-layer':'point',
// 		'type':'symbol',
// 		"minzoom": 7,
// 		"layout": {
// 			'text-field':"{name}",
// 			'text-size':{'stops':[[8,10],[18,18]]},
// 			'text-offset':[0,-1.7],
// 			'text-font':["MicrosoftYaHeiRegular"],
// 			'text-anchor':'top'
// 		},
// 		'paint': {
// 			'text-color':'rgb(0,0,0)',
// 			'text-halo-color':'rgb(0,0,0)',
// 			'text-halo-width':0.15,
// 			'text-halo-blur':0,
// 		},
// 	});
});
// //添加全国监测站数据源及图层
// map.on('load',function(){
//     map.addSource("RIMS",{
//         "type":"geojson",
// //        "buffer":0,
// //        "tolerance":0.375,//简化容限(更高意味着更简单的几何结构和更快的性能)。
//         "cluster":true,//聚类
//         "clusterRadius":15,
// //        "clusterMaxZoom":11,
//         //"clusterProperties": //根据属性聚类
//         "data":'json/allGeojson4.geojson'
//     });
//     map.loadImage("http://127.0.0.1:8848/hbproject/image/I.png",function(error,image){
//         if(error) throw error;
//         map.addImage('I',image);
//         map.addLayer({
//             'id':'rims_I',
//             'source':'RIMS',
//             'type':'symbol',
//             "filter":["==","phquality","I"],
//             "maxzoom":19,
//             "layout":{
//                 "icon-image":"I",
//                 "icon-anchor":"bottom",
//                 "icon-size":0.1,
//                 'icon-allow-overlap':true,
//                 'icon-ignore-placement':true,
//                 // 'icon-rotation-alignment':'map',
//                 // 'icon-pitch-alignment':"map",
//             }
//         })
//     });
//     map.loadImage("http://127.0.0.1:8848/hbproject/image/II.png",function(error,image){
//         if(error) throw error;
//         map.addImage('II',image);
//         map.addLayer({
//             'id':'rims_II',
//             'source':'RIMS',
//             'type':'symbol',
//             "filter":["==","phquality","II"],
//             "maxzoom":19,
//             "layout":{
//                 "icon-image":"II",
//                 "icon-size":0.3,
//                 "icon-anchor":"bottom",
//                 'icon-allow-overlap':true,
//                 'icon-ignore-placement':true,
//                 // 'icon-rotation-alignment':'map',
//                 // 'icon-pitch-alignment':"map",
//             }
//         })
//     });
//     map.loadImage("http://127.0.0.1:8848/hbproject/image/III.png",function(error,image){
//         if(error) throw error;
//         map.addImage('III',image);
//         map.addLayer({
//             'id':'rims_III',
//             'source':'RIMS',
//             'type':'symbol',
//             "filter":["==","phquality","III"],
//             "maxzoom":19,
//             "layout":{
//                 "icon-image":"III",
//                 "icon-size":0.3,
//                 "icon-anchor":"bottom",
//                 'icon-allow-overlap':true,
//                 'icon-ignore-placement':true,
//                 // 'icon-rotation-alignment':'map',
//                 // 'icon-pitch-alignment':"map",
//             }
//         })
//     });
//     map.loadImage("http://127.0.0.1:8848/hbproject/image/IV.png",function(error,image){
//         if(error) throw error;
//         map.addImage('IV',image);
//         map.addLayer({
//             'id':'rims_IV',
//             'source':'RIMS',
//             'type':'symbol',
//             "filter":["==","phquality","IV"],
//             "maxzoom":19,
//             "layout":{
//                 "icon-image":"IV",
//                 "icon-size":0.3,
//                 "icon-anchor":"bottom",
//                 'icon-allow-overlap':true,
//                 'icon-ignore-placement':true,
//                 // 'icon-rotation-alignment':'map',
//                 // 'icon-pitch-alignment':"map",
//             }
//         })
//     });
//     map.loadImage("http://127.0.0.1:8848/hbproject/image/V.png",function(error,image){
//         if(error) throw error;
//         map.addImage('V',image);
//         map.addLayer({
//             'id':'rims_V',
//             'source':'RIMS',
//             'type':'symbol',
//             "icon-anchor":"bottom",
//             "filter":["==","phquality","V"],
//             "maxzoom":19,
//             "layout":{
//                 "icon-image":"V",
//                 "icon-size":0.3,
//                 'icon-allow-overlap':true,
//                 'icon-ignore-placement':true,
//                 // 'icon-rotation-alignment':'map',
//                 // 'icon-pitch-alignment':"map",
//             }
//         })
//     });
// })

//map.addControl(new mapboxgl.AttributionControl({
//	compact: true
//}));
