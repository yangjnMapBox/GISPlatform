
var draw = new MapboxDraw({
	displayControlsDefault:false,
	controls:{
		point:true,
		line_string:true,
		polygon:true,
		trash:true,
		combine_features:false,
		uncombine_features:false,
	},
	//允许修改属性
	userProperties:true,
});
map.addControl(draw);
//map.on('draw.create', drawFunc);
map.on('draw.create', updateArea);
map.on('draw.delete', updateArea);
map.on('draw.update', updateArea);
//点击显示画的geojson的坐标/长度/面积
map.on('click',function(e){
	data = draw.getSelected();
	if(data.features.length!=0)
	{
		var answer = document.getElementById('calculated-area');
		switch(data.features[0]['geometry']['type']){
			case "Polygon":
				reValue = (turf.area(data.features[0])/1000000).toFixed(2).toString()+"km2";
				break;
			case "Point":
				reValue1 = data.features[0]['geometry']['coordinates'][0].toFixed(3);
				reValue2 = data.features[0]['geometry']['coordinates'][1].toFixed(3);
				reValue = reValue1+' '+reValue2
				break;
			case "LineString":
				reValue = turf.length(data.features[0]).toFixed(2).toString()+"km";
				break;
		}
		answer.innerHTML = '<p>' + reValue + '</p>';
	}
})
//添加用户自定义图层数据
var userNewData;
// let exampleData = {
// 	id:"abc",
// 	type:"Feature",
// 	properties:{
// 		color:"RGB(0,0,0)",
// 		name:"测试例子",
// 		size:15,
// 		type:"symbol"
// 	},
// 	geometry:{
// 		coordinates:[100.240574,25.598681],
// 		type:"Point",
// 	}
// }
function addLayerProperty(){
	let txtAddLayerName =  document.getElementById("addLayerText");
	let selAddLayerType = document.getElementById("addLayerType");
	let selAddLayerColor = document.getElementById("addLayerColor");
	let selAddLayerSize = document.getElementById("addLayerSize");
	let allLayers = map.getStyle().layers;
	let name = txtAddLayerName.value === ""? "我的标记":addLayerText.value ;
	let type = selAddLayerType.value;
	let color = selAddLayerColor.value;
	let size = selAddLayerSize.value === ""? 10:Number(selAddLayerSize.value);
	let drawFeatureCollection = draw.getAll();
	let indexLast = drawFeatureCollection.features.length-1;
	let id = drawFeatureCollection.features[indexLast].id;
	draw.setFeatureProperty(id,"name",name);
	draw.setFeatureProperty(id,"type",type);
	draw.setFeatureProperty(id,"color",color);
	draw.setFeatureProperty(id,"size",size);
	userNewData.features.push(draw.getAll().features[indexLast]);
	map.getSource('userNewData').setData(userNewData);
	let divAddLayerPage = document.getElementById("addLayerPage");
	divAddLayerPage.style.display ="";
	popupAttr.remove()
}
map.on('load',function(){
	userNewData = map.getSource('mapbox-gl-draw-cold')._data;
	// userNewData.features.push(exampleData);
	map.addSource('userNewData',{type:'geojson',data:userNewData});
// 	map.loadImage(getRootPath()+"hbproject/image/V.png",function(error,image){
// 		if(error) throw error;
// 		map.addImage('V',image);
		map.addLayer({
			'id':'testJson',
			'source':'userNewData',
			'type':'symbol',
			'filter':['==','type','symbol'],
			'layout':{
				'icon-image':"information-15",
				// 'icon-image':"V-15",
				"icon-anchor":"bottom",
				// "icon-size":0.3,
				"icon-offset":[0,20],
				'icon-allow-overlap':true,
				'icon-ignore-placement':true,
				'text-field':"{name}",
				'text-size':['get', 'size'],
				'text-font':['MicrosoftYaHeiRegular'],
				'text-anchor':'top'
			},
			'paint':{
				'text-color':['get','color'],
			}
		})
	// })
})