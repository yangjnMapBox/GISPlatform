var bounds = [
	[110.490727, 20.420933], // Southwest coordinates
	[119.742071, 27.113881] // Northeast coordinates
];
wyhCenter= [114.976529,23.889782];
arrLand = [311,411,506,602,604,702,704];
arrOrderID3 = [301,304,305,306,307,311,320];
arrOrderID4 = [401,404,405,407,408,411];
arrOrderID5 = [501,505,506];
arrOrderID6 = [601,602,603,604];
arrOrderID7 = [701,702,703,704];
var map = new mapboxgl.Map({
	// attributionControl: true,
	container: 'map',
	// center: [114.15316467, 22.67357826],
    center: [109.248,32.34],
    pitch:0,
    pitchWithRotate:false,
    dragRotate:false,
//	center:wyhCenter,
	zoom: 3,
//	maxBounds: bounds,
	minZoom: 2,
	maxZoom: 19,
	//scrollZoom:false,
	//doubleClickZoom:false,
	style: {
		"version": 8,
		"glyphs": 'static/ziti/{fontstack}/{range}.pbf',
		"sources": {
			"raster": {
				"type": "raster",
				"tiles": [
					"http://192.168.85.38:8080/geoserver/water/wms?bbox={bbox-epsg-3857}&styles=&transparent=true&format=image/jpeg&" +
					"service=WMS&version=1.1.1&request=GetMap&srs=EPSG:900913&width=256&height=256&layers=water:dem"
				],
				'tileSize': 256
			}
		},
		"layers": [
			{
				"id": "background",
				"type": "background",
				"paint": {
					"background-color": 'RGB(242,239,233)',
				}
			},
		]
	},
});
map.on('load', function () {
            map.addSource('CLDSource', {
                'type': 'vector',
                'scheme': 'tms',
                'tiles': [
                    'http://192.168.85.38:8080/geoserver/gwc/service/tms/1.0.0/water%3Awater_0429@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf']
            });
	map.addSource('influence_11000',{
		'type':'raster',
		'tiles':[
			"http://192.168.85.38:8080/geoserver/water/wms?bbox={bbox-epsg-3857}&styles=&transparent=true&format=image/jpeg&" +
			"service=WMS&version=1.1.1&request=GetMap&srs=EPSG:900913&width=256&height=256&layers=water:influence_11000"
		],
		'tileSize':256
	});
	map.addSource('basins',{
		'type':'raster',
		'tiles':[
			"http://192.168.85.38:8080/geoserver/water/wms?bbox={bbox-epsg-3857}&styles=&transparent=true&format=image/jpeg&" +
			"service=WMS&version=1.1.1&request=GetMap&srs=EPSG:900913&width=256&height=256&layers=water:basins"
		],
		'tileSize':256
	});
	map.addSource('water_0527',{
	    'type':'vector',
	    'scheme':'tms',
	    'tiles':['http://192.168.85.38:8080/geoserver/gwc/service/tms/1.0.0/water%3Awater_0527@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf']
	})
	map.addLayer({
		"id": "influence_11000",
		"type": "raster",
		"source": "influence_11000",
		"minzoom": 7,
		'layout':{
			'visibility':'none',
		}
	})
	map.addLayer({
		"id": "basins",
		"type": "raster",
		"source": "basins",
		"minzoom": 7,
		'layout':{
			'visibility':'visible',
		}
	})
	map.addLayer({
		'id':'china_gcj_6',
		'type':'fill',
		'source':'water_0527',
		'source-layer':'china_gcj_6',
		'maxzoom':6.5,
		'paint':{
			'fill-color':'RGB(242,239,233)',
		},
		'layout':{
			'visibility':'visible'
		}
	});
	map.addLayer({
		'id':'china_gcj_6_line',
		'type':'line',
		'source':'water_0527',
		'source-layer':'china_gcj_6',
		'maxzoom':6.5,
		'paint':{
			'line-color':'RGB(228,202,221)',
		},
		'layout':{
			'visibility':'visible'
		}
	});
	map.addLayer({
		'id':'district_gcj_6',
		'type':'fill',
		'source':'water_0527',
		'minzoom':6,
		'source-layer':'district_gcj_6',
		'paint':{
			'fill-color':'RGB(242,239,233)',
		},
		'layout':{
			'visibility':'visible'
		}
	});
	map.addLayer({
		'id':'district_gcj_6_line',
		'type':'line',
		'source':'water_0527',
		'minzoom':6,
		'source-layer':'district_gcj_6',
		'paint':{
			'line-color':'RGB(228,202,221)',
		},
		'layout':{
			'visibility':'visible'
		}
	});
	for (var i = 0;i<arrOrderID3.length;i++)
	{
	    if (arrLand.indexOf(arrOrderID3[i])>-1)
	    {
	        map.addLayer({
                'id':'land'+arrOrderID3[i].toString(),
                'type':'fill',
                'source':'water_0527',
                'source-layer':'bgd_10w_water',
                "filter":[
                    "all",
                    ["==","levelid",3],
                    ["==","orderid",arrOrderID3[i]]
                ],
                "minzoom": 15.5,
                'paint':{
                    'fill-color':'RGB(245,244,250)',
                },
                'layout':{
                    'visibility':'visible'
                }
            });
	    }
	    else
	    {
	        map.addLayer({
                'id':'water'+arrOrderID3[i].toString(),
                'type':'fill',
                'source':'water_0527',
                'source-layer':'bgd_10w_water',
                "filter":[
                    "all",
                    ["==","levelid",3],
                    ["==","orderid",arrOrderID3[i]]
                ],
                "minzoom": 15.5,
                'paint':{
                    'fill-color':'RGB(0,169,230)',
                },
                'layout':{
                    'visibility':'visible'
                }
            });
	    }
	}
	for (var i = 0;i<arrOrderID4.length;i++)
	{
	    if (arrLand.indexOf(arrOrderID4[i])>-1)
	    {
	        map.addLayer({
                'id':'land'+arrOrderID4[i].toString(),
                'type':'fill',
                'source':'water_0527',
                'source-layer':'bgd_10w_water',
                "filter":[
                    "all",
                    ["==","levelid",4],
                    ["==","orderid",arrOrderID4[i]]
                ],
                "minzoom": 14.5,
                "maxzoom":18,
                'paint':{
                    'fill-color':'RGB(245,244,250)',
                },
                'layout':{
                    'visibility':'visible'
                }
            });
	    }
	    else
	    {
	        map.addLayer({
                'id':'water'+arrOrderID4[i].toString(),
                'type':'fill',
                'source':'water_0527',
                'source-layer':'bgd_10w_water',
                "filter":[
                    "all",
                    ["==","levelid",4],
                    ["==","orderid",arrOrderID4[i]]
                ],
                "minzoom": 14.5,
                "maxzoom":18,
                'paint':{
                    'fill-color':'RGB(0,169,230)',
                },
                'layout':{
                    'visibility':'visible'
                }
            });
	    }
	}
	for (var i = 0;i<arrOrderID5.length;i++)
	{
	    if (arrLand.indexOf(arrOrderID5[i])>-1)
	    {
	        map.addLayer({
                'id':'land'+arrOrderID5[i].toString(),
                'type':'fill',
                'source':'water_0527',
                'source-layer':'bgd_100w_water',
                "filter":[
                    "all",
                    ["==","levelid",5],
                    ["==","orderid",arrOrderID5[i]]
                ],
                "minzoom": 12,
                "maxzoom":14,
                'paint':{
                    'fill-color':'RGB(245,244,250)',
                },
                'layout':{
                    'visibility':'visible'
                }
            });
	    }
	    else
	    {
	        map.addLayer({
                'id':'water'+arrOrderID5[i].toString(),
                'type':'fill',
                'source':'water_0527',
                'source-layer':'bgd_100w_water',
                "filter":[
                    "all",
                    ["==","levelid",5],
                    ["==","orderid",arrOrderID5[i]]
                ],
                "minzoom": 12,
                "maxzoom":14,
                'paint':{
                    'fill-color':'RGB(0,169,230)',
                },
                'layout':{
                    'visibility':'visible'
                }
            });
	    }
	}
	for (var i = 0;i<arrOrderID6.length;i++)
	{
	    if (arrLand.indexOf(arrOrderID6[i])>-1)
	    {
	        map.addLayer({
                'id':'land'+arrOrderID6[i].toString(),
                'type':'fill',
                'source':'water_0527',
                'source-layer':'bgd_100w_water',
                "filter":[
                    "all",
                    ["==","levelid",6],
                    ["==","orderid",arrOrderID6[i]]
                ],
                "minzoom": 7,
                "maxzoom":12,
                'paint':{
                    'fill-color':'RGB(245,244,250)',
                },
                'layout':{
                    'visibility':'visible'
                }
            });
	    }
	    else
	    {
	        map.addLayer({
                'id':'water'+arrOrderID6[i].toString(),
                'type':'fill',
                'source':'water_0527',
                'source-layer':'bgd_100w_water',
                "filter":[
                    "all",
                    ["==","levelid",6],
                    ["==","orderid",arrOrderID6[i]]
                ],
                "minzoom": 7,
                "maxzoom":12,
                'paint':{
                    'fill-color':'RGB(0,169,230)',
                },
                'layout':{
                    'visibility':'visible'
                }
            });
	    }
	}
	for (var i = 0;i<arrOrderID7.length;i++)
	{
	    if (arrLand.indexOf(arrOrderID7[i])>-1)
	    {
	        map.addLayer({
                'id':'land'+arrOrderID7[i].toString(),
                'type':'fill',
                'source':'water_0527',
                'source-layer':'bgd_100w_water',
                "filter":[
                    "all",
                    ["==","levelid",7],
                    ["==","orderid",arrOrderID7[i]]
                ],
                "minzoom": 2,
                "maxzoom":7,
                'paint':{
                    'fill-color':'RGB(245,244,250)',
                },
                'layout':{
                    'visibility':'visible'
                }
            });
	    }
	    else
	    {
	        map.addLayer({
                'id':'water'+arrOrderID7[i].toString(),
                'type':'fill',
                'source':'water_0527',
                'source-layer':'bgd_100w_water',
                "filter":[
                    "all",
                    ["==","levelid",7],
                    ["==","orderid",arrOrderID7[i]]
                ],
                "minzoom": 2,
                "maxzoom":7,
                'paint':{
                    'fill-color':'RGB(0,169,230)',
                },
                'layout':{
                    'visibility':'visible'
                }
            });
	    }
	}
	map.addLayer({
		'id':'water_3',
		'type':'fill',
		'source':'water_0527',
		'source-layer':'bgd_10w_water',
		"minzoom": 7,
		'paint':{
			'fill-color':'RGB(0,169,230)',
		},
		'layout':{
			'visibility':'visible'
		}
	});
	map.addLayer({
		'id':'water',
		'type':'fill',
		'source':'CLDSource',
		'source-layer':'water',
		"minzoom": 7,
		'paint':{
			'fill-color':'RGB(0,169,230)',
		},
		'layout':{
			'visibility':'visible'
		}
	});
	map.addLayer({
		'id':'river',
		'type':'line',
		'source':'CLDSource',
		'source-layer':'river',
		"minzoom": 7,
		'maxzoom':10,
		'paint':{
			'line-color':'RGB(0,169,230)',
			'line-width':1,
		}
	});
	map.addLayer({
		'id':'point',
		'source':'CLDSource',
		'source-layer':'point',
		"minzoom": 7,
		'type':'circle',
		'paint':{
			'circle-radius':{
				'stops':[[7,3],[24,18]]
			},
			'circle-color':'RGB(0,255,0)',
			// 'circle-opacity':.8,
			'circle-stroke-width':1,
			'circle-stroke-color':'RGB(11,58,0)'
		},
// 			'layout':{
// 				'visibility':'visible'//visible
// 			}
	});
	map.addLayer({
		'id':'djhydrographicnet_line',
		'source':'CLDSource',
		'source-layer':'djhydrographicnet_line',
		"minzoom": 7,
		'type':'line',
		'paint':{
			'line-color':'RGB(105,58,58)',
			'line-width':1.6,
		},
		
	})
	map.addSource("hlimg", {
	type: "image",
	url: "/static/image/heliu_600.jpg",
	coordinates: [
	[114.6528426,24.3158400786],
	[115.2940414, 24.3158400786],
	[115.2940414, 23.6106399196],
	[114.6528426, 23.6106399196]
	]
	});
	map.addLayer({
	id: "heliu1",
	"type": "raster",
	"source": "hlimg",
	"minzoom": 7,
	"paint": {
	"raster-fade-duration": 0
	},
	'layout':{
		'visibility':'none'
	}
	});
	map.addSource("skimg", {
	type: "image",
	url: "/static/image/shuiku_132.jpg",
	coordinates: [
	[114.334615718,23.9991899009],
	[114.748875063, 23.9991899009],
	[114.748875063, 23.6981045009],
	[114.334615718, 23.6981045009]
	]
	});
	map.addLayer({
	    'id': "shuiku1",
        "type": "raster",
        "source": "skimg",
        "minzoom": 7,
        "paint": {
            "raster-fade-duration": 0
        },
        'layout':{
            'visibility':'none'
        }
	});
	map.addLayer({
		'id':'reservoir',
		'source':'CLDSource',
		'source-layer':'reservoir',
		'type':'symbol',
		"minzoom": 7,
		"layout": {
			'text-field':"{name}",
			'text-size':{'stops':[[9,10],[18,18]]},
			'text-font':["MicrosoftYaHeiRegular"],
			'text-anchor':'top',
			'text-max-width':0,
			'text-padding':0,
		},
		'paint': {
// 					'text-color':'RGB(0,111,255)',
// 					'text-halo-color':'RGB(0,111,255)',
			'text-color':'rgb(0,0,0)',
			'text-halo-color':'rgb(0,0,0)',
			'text-halo-width':0.05,
			'text-halo-blur':0,
		},
	});
	map.addLayer({
		'id':'pointsymbol',
		'source':'CLDSource',
		'source-layer':'point',
		'type':'symbol',
		"minzoom": 7,
		"layout": {
			'text-field':"{name}",
			'text-size':{'stops':[[8,10],[18,18]]},
			'text-offset':[0,-1.7],
			'text-font':["MicrosoftYaHeiRegular"],
			'text-anchor':'top'
		},
		'paint': {
			'text-color':'rgb(0,0,0)',
			'text-halo-color':'rgb(0,0,0)',
			'text-halo-width':0.15,
			'text-halo-blur':0,
		},
	});
});

//添加监测站数据源及图层
map.on('load',function(){
    map.addSource("RIMS",{
        "type":"geojson",
//        "buffer":0,
//        "tolerance":0.375,//简化容限(更高意味着更简单的几何结构和更快的性能)。
        "cluster":true,//聚类
        "clusterRadius":15,
//        "clusterMaxZoom":11,
        //"clusterProperties": //根据属性聚类
        "data":'static/json/allGeojson3.geojson'
    });
    map.loadImage("http://127.0.0.1:5005/static/image/I.png",function(error,image){
        if(error) throw error;
        map.addImage('I',image);
        map.addLayer({
            'id':'rims_I',
            'source':'RIMS',
            'type':'symbol',
            "filter":["==","phquality","I"],
            "maxzoom":19,
            "layout":{
                "icon-image":"I",
                "icon-anchor":"bottom",
                "icon-size":0.1,
                'icon-allow-overlap':true,
                'icon-ignore-placement':true,
                'icon-rotation-alignment':'map',
                'icon-pitch-alignment':"map",

            }
        })
    });
    map.loadImage("http://127.0.0.1:5005/static/image/II.png",function(error,image){
        if(error) throw error;
        map.addImage('II',image);
        map.addLayer({
            'id':'rims_II',
            'source':'RIMS',
            'type':'symbol',
            "filter":["==","phquality","II"],
            "maxzoom":19,
            "layout":{
                "icon-image":"II",
                "icon-size":0.3,
                "icon-anchor":"bottom",
                'icon-allow-overlap':true,
                'icon-ignore-placement':true,
                'icon-rotation-alignment':'map',
                'icon-pitch-alignment':"map",
            }
        })
    });
    map.loadImage("http://127.0.0.1:5005/static/image/III.png",function(error,image){
        if(error) throw error;
        map.addImage('III',image);
        map.addLayer({
            'id':'rims_III',
            'source':'RIMS',
            'type':'symbol',
            "filter":["==","phquality","III"],
            "maxzoom":19,
            "layout":{
                "icon-image":"III",
                "icon-size":0.3,
                "icon-anchor":"bottom",
                'icon-allow-overlap':true,
                'icon-ignore-placement':true,
                'icon-rotation-alignment':'map',
                'icon-pitch-alignment':"map",
            }
        })
    });
    map.loadImage("http://127.0.0.1:5005/static/image/IV.png",function(error,image){
        if(error) throw error;
        map.addImage('IV',image);
        map.addLayer({
            'id':'rims_IV',
            'source':'RIMS',
            'type':'symbol',
            "filter":["==","phquality","IV"],
            "maxzoom":19,
            "layout":{
                "icon-image":"IV",
                "icon-size":0.3,
                "icon-anchor":"bottom",
                'icon-allow-overlap':true,
                'icon-ignore-placement':true,
                'icon-rotation-alignment':'map',
                'icon-pitch-alignment':"map",
            }
        })
    });
    map.loadImage("http://127.0.0.1:5005/static/image/V.png",function(error,image){
        if(error) throw error;
        map.addImage('V',image);
        map.addLayer({
            'id':'rims_V',
            'source':'RIMS',
            'type':'symbol',
            "icon-anchor":"bottom",
            "filter":["==","phquality","V"],
            "maxzoom":19,
            "layout":{
                "icon-image":"V",
                "icon-size":0.3,
                'icon-allow-overlap':true,
                'icon-ignore-placement':true,
                'icon-rotation-alignment':'map',
                'icon-pitch-alignment':"map",
            }
        })
    });
})
//添加比例尺
var scale = new mapboxgl.ScaleControl({
	maxWidth: 80,
	unit: 'imperial'
});
map.addControl(scale);
scale.setUnit('metric');
		
		//获取鼠标的坐标
// 		map.on('mousemove', function (e) {
// 			document.getElementById('info').innerHTML = JSON.stringify(e.point) + '<br />'
// 				+ JSON.stringify(e.lngLat)
// 		});
map.addControl(new mapboxgl.AttributionControl({
	compact: true
}));