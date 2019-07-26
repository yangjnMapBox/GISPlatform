var influenceLayers = ['influence_11000','heliu1','shuiku1'];
var basinsLayers = ['basins','water'];
var arrPattern = ['广东东江流域图','水系影响因子图'];
for (var i = 0;i<arrPattern.length;i++)
{
	var link = document.createElement('a');
	link.href = '#';
	link.className = 'active';
	link.textContent = arrPattern[i];
	var zooms = document.getElementById('menu');
	zooms.appendChild(link);
	link.onclick = function(e){
		var zoomText = this.textContent;
		e.preventDefault();
		e.stopPropagation();
		if(zoomText =='广东东江流域图')
		{
			for(var j = 0;j<basinsLayers.length;j++)
			{
				map.setLayoutProperty(basinsLayers[j], 'visibility', 'visible');
			}
			for(var j = 0;j<influenceLayers.length;j++)
			{
				map.setLayoutProperty(influenceLayers[j], 'visibility', 'none');
			}
			map.setMaxZoom (20);
			document.getElementById('demImg').style.display='inline';
			document.getElementById('inImg').style.display='none';
			document.getElementById('maptext').textContent='广东东江流域图';
			map.flyTo({
			    center:wyhCenter,
			    zoom:7,
			    speed:0.2,
			    curve:1,
			    easing:function(t){return t;}
			});
		}
		else if(zoomText =='水系影响因子图')
		{
			for(var j = 0;j<basinsLayers.length;j++)
			{
				map.setLayoutProperty(basinsLayers[j], 'visibility', 'none');
			}
			for(var j = 0;j<influenceLayers.length;j++)
			{
				map.setLayoutProperty(influenceLayers[j], 'visibility', 'visible');
			}
			map.setMaxZoom (9.5);
			document.getElementById('demImg').style.display='none';
			document.getElementById('inImg').style.display='inline';
			document.getElementById('maptext').textContent='水系影响因子图';
			map.flyTo({
			    center:wyhCenter,
			    zoom:7,
			    speed:0.2,
			    curve:1,
			    easing:function(t){return t;}
			});
		}
		
	}
}