var currentProposals = [];
function search() {
        $('#search-result').empty();
        currentProposals=[];
        if ($('#searchName').val() != '') {
            var q = $("#searchName").val().replace(/\s*/g, "").toLowerCase();
            var {lng, lat} = map.getCenter(), zoom = map.getZoom();
            $.get('/getSearchPOIJson', {'strSearch':q, 'coorX': lng.toFixed(6),'coorY':lat.toFixed(6),'zoom':zoom.toFixed(2)}, function (data) {
            // var data = '{"630549781": [100.188427, 25.919886, "金海岸客栈", "大理市双廊镇村北进村口50米(烟草公司对面)", 7479137.828742661], "630549778": [100.189429, 25.918171, "紫荆花客栈", "双廊村第三组450号", 7479306.771358878], "631684636": [100.192313, 25.915188, "萝莳曲客栈", "云南省大理白族自治州大理市双廊镇双廊村402号", 7479579.38856699], "630714826": [100.190783, 25.915027, "大理双廊海角云舒客栈", "云南省大理白族自治州大理市双廊村402号(菜市场一心堂药店对面巷子尽头海边)", 7479625.468413722], "630714727": [100.191555, 25.913527, "大理双廊梦之院", "云南省大理白族自治州大理市双廊村老协戏台正对面往海边100米", 7479775.173786853], "630087868": [100.191941, 25.913457, "大理双廊泰美丽海度假海景客栈", "大理市双廊镇双廊村350号", 7479775.647850496], "630087874": [100.193176, 25.909437, "大理双廊水芝半岛270度海景客栈", "大理市双廊镇双廊村", 7480192.376138864], "630549655": [100.193264, 25.906991, "依水云居客栈", "大理市双廊镇玉几岛入口20米(四川好吃嘴旁右转)", 7480458.2831074055], "631826032": [100.195651, 25.906222, "布衣阁羊肉火锅", "双廊镇康海路金岛客栈对面(近离码头50米左右)", 7480497.979053213], "630549976": [100.193734, 25.906156, "聚宝盘", "双廊镇海街一线南诏风情岛向北100米", 7480540.870008726], "630362350": [100.191014, 25.906517, "2013艺术酒店", "大理白族自治州双廊镇玉几岛", 7480551.997141266], "630088237": [100.191535, 25.906311, "大理双廊芝麻开花海景客栈", "大理双廊镇玉几岛天生营村10号", 7480564.834874367], "630549844": [100.191494, 25.906187, "赵氏宗祠", "云南省大理白族自治州大理市2013艺术酒店附近", 7480579.160976303], "630549856": [100.191212, 25.906222, "辛龙客栈", "云南省大理白族自治州大理市2013艺术酒店附近", 7480580.580054664], "630549859": [100.191654, 25.906119, "廊懒客栈", "云南省大理白族自治州大理市2013艺术酒店附近", 7480583.62160023], "630549997": [100.191595, 25.906109, "念心", "云南省大理白族自治州大理市2013艺术酒店附近", 7480585.813266614], "630549739": [100.191243, 25.906142, "双廊云客栈", "云南省大理白族自治州大理市2013艺术酒店附近", 7480588.753654341], "630549565": [100.190555, 25.906177, "玉矶岛自然村活动中心", "云南省大理白族自治州大理市2013艺术酒店附近", 7480597.727459614], "630549970": [100.190278, 25.906204, "金龙洞", "云南省大理白族自治州大理市2013艺术酒店附近", 7480599.92851345], "630549991": [100.190356, 25.906103, "青庐", "云南省大理白族自治州大理市2013艺术酒店附近", 7480609.5245486]}';
            var dataList = JSON.parse(data);
            $('#search-result').empty();
            let lil = ['in', 'recordid'];
            for (let key in dataList) {
                if (key == 'error') {
                    break;
                }
                lil.push(parseInt(key));
                let val = dataList[key];
                currentProposals.push(val[2]);
                let coordinates = [val[0], val[1]]
				var liAddre = $('<p class="address"></p >').html(val[3]);
                var element = $("<li></li>")
                    .html(val[2]).append(liAddre)
                    .addClass('list-group-item')
                    .click(function () {
                        $('#searchName').val(this.firstChild.data);
                        $('#search-result').empty();
                        // params.onSubmit($('#searchName').val());
                        map.flyTo({
                            center: coordinates
                            // zoom: zoom
                        });
                    })
                    .mouseenter(function () {
                        $(this).addClass('selected');
                    })
                    .mouseleave(function () {
                        $(this).removeClass('selected');
                    });
                $('#search-result').append(element);
            }
            map.setFilter("searchPOI", lil);
            });
        }

    }

$(document).ready(function () {
    var currentSelection = -1;
    $('#searchName').keydown(function (e) {
        var height = $("#search-result").scrollTop();
        switch (e.which) {
            case 38: // Up arrow
                e.preventDefault();
                $('#search-result li').removeClass('selected');
                if ((currentSelection - 1) >= 0) {
                    currentSelection--;
                    $("#search-result li:eq(" + currentSelection + ")")
                        .addClass('selected');
                } else {
                    currentSelection = -1;
                }
                var top = $("#search-result li:eq(" + currentSelection + ")").position().top;
                if (top < 45) {
                    height = height - 35;
                    $("#search-result").scrollTop(height);
                }
                break;
            case 40: // Down arrow
                e.preventDefault();
                if ((currentSelection + 1) < currentProposals.length) {
                    $('#search-result li').removeClass('selected');
                    currentSelection++;
                    $("#search-result li:eq(" + currentSelection + ")")
                        .addClass('selected');
                }
                var top = $("#search-result li:eq(" + currentSelection + ")").position().top;
                if (top > 200) {
                    height = height + 35;
                    $("#search-result").scrollTop(height);
                }
                break;
            case 13: // Enter
                if (currentSelection > -1) {
                    var text = $("#search-result li:eq(" + currentSelection + ")").click();
                    // $('#searchName').val(text);
                    currentSelection = -1;
                    $('#search-result').empty();
                }
                else {
                    search();
                }
                // $('#searchName').val();

                break;
            case 27: // Esc button
                currentSelection = -1;
                $('#search-result').empty();
                $('#searchName').val('');
                break;
        }
    })

});

//     $('#searchName').bind("keyup", function (e) {
//         if (e.which != 13 && e.which != 27
//             && e.which != 38 && e.which != 40) {
//             currentProposals = [];
//             currentSelection = -1;
//             $('#search-result').empty();
//             if ($('#searchName').val() != '') {
//                 var q = $("#searchName").val().replace(/\s*/g, "").toLowerCase();
//                 var {lng, lat} = map.getCenter(), zoom = map.getZoom();
//                 // $.get('/getSearchPOIJson', {'strSearch':q, 'coorX': lng.toFixed(6),'coorY':lat.toFixed(6),'zoom':zoom.toFixed(2)}, function (data) {
//                 var data = '{"630549781": [100.188427, 25.919886, "金海岸客栈", "大理市双廊镇村北进村口50米(烟草公司对面)", 7479137.828742661], "630549778": [100.189429, 25.918171, "紫荆花客栈", "双廊村第三组450号", 7479306.771358878], "631684636": [100.192313, 25.915188, "萝莳曲客栈", "云南省大理白族自治州大理市双廊镇双廊村402号", 7479579.38856699], "630714826": [100.190783, 25.915027, "大理双廊海角云舒客栈", "云南省大理白族自治州大理市双廊村402号(菜市场一心堂药店对面巷子尽头海边)", 7479625.468413722], "630714727": [100.191555, 25.913527, "大理双廊梦之院", "云南省大理白族自治州大理市双廊村老协戏台正对面往海边100米", 7479775.173786853], "630087868": [100.191941, 25.913457, "大理双廊泰美丽海度假海景客栈", "大理市双廊镇双廊村350号", 7479775.647850496], "630087874": [100.193176, 25.909437, "大理双廊水芝半岛270度海景客栈", "大理市双廊镇双廊村", 7480192.376138864], "630549655": [100.193264, 25.906991, "依水云居客栈", "大理市双廊镇玉几岛入口20米(四川好吃嘴旁右转)", 7480458.2831074055], "631826032": [100.195651, 25.906222, "布衣阁羊肉火锅", "双廊镇康海路金岛客栈对面(近离码头50米左右)", 7480497.979053213], "630549976": [100.193734, 25.906156, "聚宝盘", "双廊镇海街一线南诏风情岛向北100米", 7480540.870008726], "630362350": [100.191014, 25.906517, "2013艺术酒店", "大理白族自治州双廊镇玉几岛", 7480551.997141266], "630088237": [100.191535, 25.906311, "大理双廊芝麻开花海景客栈", "大理双廊镇玉几岛天生营村10号", 7480564.834874367], "630549844": [100.191494, 25.906187, "赵氏宗祠", "云南省大理白族自治州大理市2013艺术酒店附近", 7480579.160976303], "630549856": [100.191212, 25.906222, "辛龙客栈", "云南省大理白族自治州大理市2013艺术酒店附近", 7480580.580054664], "630549859": [100.191654, 25.906119, "廊懒客栈", "云南省大理白族自治州大理市2013艺术酒店附近", 7480583.62160023], "630549997": [100.191595, 25.906109, "念心", "云南省大理白族自治州大理市2013艺术酒店附近", 7480585.813266614], "630549739": [100.191243, 25.906142, "双廊云客栈", "云南省大理白族自治州大理市2013艺术酒店附近", 7480588.753654341], "630549565": [100.190555, 25.906177, "玉矶岛自然村活动中心", "云南省大理白族自治州大理市2013艺术酒店附近", 7480597.727459614], "630549970": [100.190278, 25.906204, "金龙洞", "云南省大理白族自治州大理市2013艺术酒店附近", 7480599.92851345], "630549991": [100.190356, 25.906103, "青庐", "云南省大理白族自治州大理市2013艺术酒店附近", 7480609.5245486]}';
//                 var dataList = JSON.parse(data);
//                 $('#search-result').empty();
//                 for (let key in dataList) {
//                     if (key == 'error') {
//                         break;
//                     }
//                     let val = dataList[key];
//                     currentProposals.push(val[2]);
//                     let coordinates = [val[0], val[1]]
//                     var element = $("<li></li>")
//                         .html(val[2])
//                         .addClass('list-group-item')
//                         .click(function () {
//                             $('#searchName').val($(this).html());
//                             $('#search-result').empty();
//                             // params.onSubmit($('#searchName').val());
//                             map.flyTo({
//                                 center: coordinates
//                                 // zoom: zoom
//                             });
//                         })
//                         .mouseenter(function () {
//                             $(this).addClass('selected');
//                         })
//                         .mouseleave(function () {
//                             $(this).removeClass('selected');
//                         });
//                     $('#search-result').append(element);
//                 }
//                 // });
//             }
//         }
//     });
//     $('#searchName').blur(function (e) {
//         currentSelection = -1;
//     });
//
// });


//打印地图
function printMap() {

    // navControl._compass.hidden = true;
    $("#mapBox").addClass('bodyPrint');
    map.removeControl(draw);//点线面
    map.removeControl(miniMap);
    map.removeControl(navControl);
    window.print();
    if (window.matchMedia('print')) {
        map.addControl(navControl);
        map.addControl(draw);
        map.addControl(miniMap, 'bottom-right');

        $("#mapBox").removeClass('bodyPrint');
    }
}
