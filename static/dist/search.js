function search() {
	$('#search-result').empty();
	var q = $("#searchName").val().replace(/\s*/g, "").toLowerCase();
	var data = {
		'污染源1': [100.221734, 25.820866],
		'监测站1': [100.23254066040596, 25.602449820898727],
		'监测站2': [100.21602797273846, 25.591107728803223],
		'监测站3': [100.20467419951558, 25.577042904692462],
		'监测站4': [100.1970810891799, 25.568329001959626],
		'监测站5': [100.17738428284582, 25.56886950420177]
	}
	let coordinates = data[q];
	if (coordinates) {
		map.flyTo({
			center: coordinates,
			zoom: 17
		});
		// console.log(coordinates);
	}
}
$(document).ready(function() {
	var currentSelection = -1;
	var currentProposals = [];
	$('#searchName').keydown(function(e) {
		switch(e.which) {
			case 38: // Up arrow
			e.preventDefault();
			$('#search-result li').removeClass('selected');
			if((currentSelection - 1) >= 0){
				currentSelection--;
				$( "#search-result li:eq(" + currentSelection + ")" )
					.addClass('selected');
			} else {
				currentSelection = -1;
			}
			break;
			case 40: // Down arrow
			e.preventDefault();
			if((currentSelection + 1) < currentProposals.length){
				$('#search-result li').removeClass('selected');
				currentSelection++;
				$( "#search-result li:eq(" + currentSelection + ")" )
					.addClass('selected');
			}
			break;
			case 13: // Enter
				if(currentSelection > -1){
					var text = $( "#search-result li:eq(" + currentSelection + ")" ).html();
					$('#searchName').val(text);
				}
				currentSelection = -1;
				$('#search-result').empty();
				// $('#searchName').val();
				search();
				break;
			case 27: // Esc button
				currentSelection = -1;
				$('#search-result').empty();
				$('#searchName').val('');
				break;
		}
	});
		
	$('#searchName').bind("keyup", function(e){
		if(e.which != 13 && e.which != 27 
				&& e.which != 38 && e.which != 40){				
			currentProposals = [];
			currentSelection = -1;
			$('#search-result').empty();
			if($('#searchName').val() != ''){
				var q = $("#searchName").val().replace(/\s*/g, "").toLowerCase();
				var {lng,lat} = map.getCenter(),zoom = map.getZoom();
				$.get('/getSearchPOIJson/', {'strSearch':q, 'coorX': lng.toFixed(6),'coorY':lat.toFixed(6),'zoom':zoom.toFixed(2)}, function (data) {
					data = JSON.parse(data);
					$('#search-result').empty();
					for(let val of data){
						currentProposals.push(val[2]);
						let coordinates = [val[0],val[1]]
						var element = $("<li></li>")
							.html(data[i])
							.addClass('list-group-item')
							.click(function(){
								$('#searchName').val($(this).html());
								$('#search-result').empty();
								// params.onSubmit($('#searchName').val());
								map.flyTo({
									center: coordinates
									// zoom: zoom
								});
							})
							.mouseenter(function() {
								$(this).addClass('selected');
							})
							.mouseleave(function() {
								$(this).removeClass('selected');
							});
						$('#search-result').append(element);
					}
					
				});			
// 				var data = ['污染源1 ', '监测站1', '监测站2', '监测站3', '监测站4', '监测站5']
// 				var patt1 = new RegExp(q);
// 				for(var i in data){
// 					if(patt1.test(data[i])){
// 						
// 						
// 					}
// 				}
			}
		}
	});
	$('#searchName').blur(function(e) {
		currentSelection = -1;

	});

});



/* 隐藏侧边栏 */
// $("body").toggleClass("sidebarCollapse");
			
				
//打印地图
function printMap(){

 // navControl._compass.hidden = true;
 $("#mapBox").addClass('bodyPrint');
 map.removeControl(draw);//点线面
 map.removeControl(miniMap);
 map.removeControl(navControl);
 window.print();
 if(window.matchMedia('print'))
 {
	map.addControl(navControl);
  map.addControl(draw);
  map.addControl(miniMap,'bottom-right');
	
  $("#mapBox").removeClass('bodyPrint');
 }
}
