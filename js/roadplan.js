!function (win) {
    var infoWindow, map, level = 12,
        city = '三亚', clickListener,
        center = {lng: 109.526807, lat: 18.226025},
        selectFeature,
        STORE_KEY = "store_trip_point"
        features = [

/*            {
            type: "Marker",
            index: "1",
            id:"111",
            name: "三亚凤凰国际机场",
            addr:"ceshi",
            desc: "本次起点",
            color: "yellow",
            icon: "cir",
            offset: {x: -9, y: -31},
            lnglat: {lng: 109.415809, lat: 18.303965}
        }*/

        ];


    var that = this;
    // 加载本地数据
    getDataByLocal(features);

    // 加载远程数据
    getDataByRemote(features);





    String.prototype.format = function(args) {
        var result = this;
        if (arguments.length > 0) {
            if (arguments.length == 1 && typeof (args) == "object") {
                for (var key in args) {
                    if(args[key]!=undefined){
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            }
            else {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] != undefined) {
                        //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题
                        var reg = new RegExp("({)" + i + "(})", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
            }
        }
        return result;
    };

    Array.prototype.remove = function(val) {
        var from = this.indexOf(val);
        if (from > -1) {
            var rest = this.slice((from) + 1 || this.length);
            this.length = from < 0 ? this.length + from : from;
            return this.push.apply(this, rest);
        }

    };




    /**
     * 获取远程数据存储
     * @param features
     */
    function getDataByRemote(features) {
        if(features == null ){
            features = [];
        }
        $.getJSON("js/plan_strip.json",function (result) {
            if (result) {
                features = $.merge(features,result);
                features = $.unique(features);
                console.log(features);
                loadFeatures();
            }
        });
        AMap.plugin('AMap.Weather', function() {
            var weather = new AMap.Weather();
            //未来4天天气预报
            weather.getForecast(city, function(err, data) {
                if (err) {return;}
                var str = [];
                for (var i = 0,dayWeather; i < data.forecasts.length; i++) {
                    dayWeather = data.forecasts[i];
                    str.push(dayWeather.date+' <span class="weather">'+dayWeather.dayWeather+'</span> '+ dayWeather.nightTemp + '~' + dayWeather.dayTemp + '℃');
                }
                $("#forecast-title").append('<b>'+ data.province+''+ data.city +'最新天气预报&路径规划</b>');
                $('#forecast').html(str.join('<br>'));
            });
        });
    }



    /**
     * 获取本地存储
     * @param features
     */
    function getDataByLocal(features) {
        if(!window['localStorage']) return;
        var data = localStorage.getItem(STORE_KEY);
        if(data){
            features = JSON.parse(data);
        }
    }

    /**
     * 存储
     * @param features
     */
    function saveDataByLocal(features) {
        if(!window['localStorage']) return;
        clearLocal();
        if(features){
            var data = JSON.stringify(features);
            //设置：
            localStorage.setItem(STORE_KEY,data);
        }
    }

    function clearLocal() {
        if(!window['localStorage']) return;
        //删除
        localStorage.removeItem(STORE_KEY);
    }




    function loadFeatures(event) {
        if (!features) {
            alert("请添加行程结点");
            return;
        }
        var plan_trip_obj = $(".amap-trip-content").html('');
        var poi_box_tpl = "<li class=\"poibox\" data-id=\"{id}\">\n" +
            "                        <div class=\"amap_lib_placeSearch_poi poibox-icon\">{index}</div>\n" +
            "                        <h3 class=\"poi-title\"><span class=\"poi-name\">{name}</span></h3>\n" +
            "<div class=\"poi-input-item\"><a class=\"btn poi-del\" data-id=\"{id}\" >删除结点</a></div>\n"+
            "                        <div class=\"poi-info\">" +
            "<p class=\"poi-addr\">行程说明: {desc}</p>\n" +
            "<p class=\"poi-addr\">地址: {addr}</p>\n" +
            "<p class=\"poi-addr-period\">行程周期: {period}</p>\n" +
            "                            <p class=\"poi-tel\">电话: {tel}</p></div>\n" +
            "                        <div class=\"clear\"></div>\n" +
            "                    </li>";
        /*
        <li class="poibox">
                        <div class="amap_lib_placeSearch_poi poibox-icon">1</div>
                        <h3 class="poi-title"><span class="poi-name">三亚国际免税城</span><a class="poi-more"
                                                                                      title="详情">&gt;</a></h3>
                        <div class="poi-info"><p class="poi-addr">地址：海棠北路118号</p>
                            <p class="poi-tel">电话：4006996956</p></div>
                        <div class="clear"></div>
                    </li>
         */
        for (var feature, data, i = 0, len = features.length, j, jl, path; i < len; i++) {
            data = features[i];
            _drawFeature(feature,data);
            var _content = poi_box_tpl.format(data);
            plan_trip_obj.append(_content);
        }

        // 绑定事件
        $(".amap-trip-content li").on('click',function (event) {
            // debugger
            if(event && data && data.lnglat){

                var select_id =  $(this).attr("data-id");
                var obj = features.find(function(value) {
                    if(value && value.id == select_id) {
                        //则包含该元素
                        return true;
                    }
                });
                if (obj){
                    map.panTo([obj.lnglat['lng'], obj.lnglat['lat']]);
                    mapListClick(event,obj);
                }
            }

        });

        // 绑定事件
        $(".amap-trip-content a.poi-del").on('click',function (event) {
            // debugger
            if(data){
                if(event){
                    _delFeatures(event,features,data)
                }
            }

        });
    }

    function _delFeatures(event,features,data) {
        debugger;
        if(!event)return;
        if(features){
            var del_id = $(event.target).attr("data-id");
            var obj = features.find(function(value) {
                if(value && value.id == del_id) {
                    //则包含该元素
                    return true;
                }
            });
            if (obj){
                features.remove(obj);
            }
        }
        loadFeatures();
    }







    function _drawFeature(feature,data,icon){
        switch (data.type) {
            case "Marker":
                // 创建一个 Icon
                var icon = new AMap.Icon({
                    // 图标尺寸
                    size: new AMap.Size(35, 40),
                    // 图标的取图地址
                    image: data.iconmarker? data.iconmarker :"//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png",
                    // 图标所用图片大小
                    imageSize: new AMap.Size(135, 40),
                    // 图标取图偏移量
                    imageOffset: data.imageOffset? new AMap.Pixel(data.imageOffset.x, data.imageOffset.y) :new AMap.Pixel(-55, -3)
                });

                // // 创建一个 icon
                // var icon = new AMap.Icon({
                //     size: new AMap.Size(25, 34),
                //     image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
                //     imageSize: new AMap.Size(135, 40),
                //     imageOffset: new AMap.Pixel(-95, -3)
                // });


                feature = new AMap.Marker({
                    map: map,
                    position: new AMap.LngLat(data.lnglat.lng, data.lnglat.lat),
                    zIndex: 3,
                    extData: data,
                    offset: new AMap.Pixel(data.offset.x, data.offset.y),
                    icon: icon,
                    title: data.name,
                    // amap-lib-marker-mid
                    // content: '<div class="icon   icon-' + data.icon + ' icon-' + data.icon + '-' + data.color + '"></div>'
                });
                break;
            case "Polyline":
                for (j = 0, jl = data.lnglat.length, path = []; j < jl; j++) {
                    path.push(new AMap.LngLat(data.lnglat[j].lng, data.lnglat[j].lat));
                }
                feature = new AMap.Polyline({
                    map: map,
                    path: path,
                    extData: data,
                    zIndex: 2,
                    strokeWeight: data.strokeWeight,
                    strokeColor: data.strokeColor,
                    strokeOpacity: data.strokeOpacity
                });
                break;
            case "Polygon":
                for (j = 0, jl = data.lnglat.length, path = []; j < jl; j++) {
                    path.push(new AMap.LngLat(data.lnglat[j].lng, data.lnglat[j].lat));
                }
                feature = new AMap.Polygon({
                    map: map,
                    path: path,
                    extData: data,
                    zIndex: 1,
                    strokeWeight: data.strokeWeight,
                    strokeColor: data.strokeColor,
                    strokeOpacity: data.strokeOpacity,
                    fillColor: data.fillColor,
                    fillOpacity: data.fillOpacity
                });
                break;
            default:
                feature = null;
        }
        if (feature) {
            AMap.event.addListener(feature, "click", mapFeatureClick);
        }
    }


    /**
     * 点击列表
     * @param e
     */
    function mapListClick(e,data) {
        if (!infoWindow) {
            infoWindow = new AMap.AdvancedInfoWindow({autoMove: true});
        }
        var extData = data,
            content = "<h5>" + extData.name + "</h5>" +
                "<div>" + extData.desc + "</div>";
        infoWindow.setContent(content);
        infoWindow.open(map, data.lnglat);
    }



    function mapFeatureClick(e) {
        if (!infoWindow) {
            infoWindow = new AMap.AdvancedInfoWindow({autoMove: true});
        }
        var extData = e.target.getExtData(),
            content = "<h5>" + extData.name + "</h5>" +
                "<div>" + extData.desc + "</div>";

        infoWindow.setContent(content);
        infoWindow.open(map, e.lnglat);
    }


    function planTripForFeatures(map,autocomplete,placeSearch,event){
        // 规划行车
        map.plugin('AMap.Driving', function() {
            //构造路线导航类
            var driving = new AMap.Driving({
                // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
                policy: AMap.DrivingPolicy.LEAST_TIME,
                map: map,
                panel: "panel"
            })

            // var points = [
            //     { keyword: '北京市地震局（公交站）',city:'北京' },
            //     { keyword: '亦庄文化园（地铁站）',city:'北京' }
            // ]
            //
            // driving.search(points, function (status, result) {
            //     // 未出错时，result即是对应的路线规划方案
            // })
            // debugger
            var points = [];
            for (var feature, data, i = 0, len = features.length, j, jl, path; i < len; i++) {
                data = features[i];
                var lngLat =  new AMap.LngLat(data.lnglat.lng, data.lnglat.lat);
                points.push(lngLat);
            }

            // 根据起终点经纬度规划驾车导航路线
            // driving.search(points, function(status, result) {
            //     // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
            //     if (status === 'complete') {
            //         console.log('绘制驾车路线完成')
            //     } else {
            //         console.log('获取驾车数据失败：' + result)
            //     }
            // });

            // 根据起终点经纬度规划驾车导航路线
            driving.search(points[0], points[points.length-1],{
                waypoints:points.slice(0,points.length-1)
            }, function(status, result) {
                debugger;
                // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                if (status === 'complete') {
                    console.log('绘制驾车路线完成')
                } else {
                    console.log('获取驾车数据失败：' + result)
                }
            });
        });



    }

    /**
     * 添加到行程
     * @param event
     */
    function _add_trip_point(event,poiObj) {
        // debugger
        if(!event)return;
        if(poiObj && features){
            var feature = {
                type: "Marker",
                index: features.length+1,
                id:poiObj.id,
                name: poiObj.name,
                desc: poiObj.type,
                addr:  poiObj.address,
                tel: poiObj.tel,
                period: "暂无规划",
                color: "red",
                icon: "flag",
                offset: {x: 0, y: 0},
                lnglat: poiObj.location
            };
            var obj = features.find(function(value) {
                if(value && value.id == feature.id) {
                    //则包含该元素
                    return true;
                }
            })
            if (!obj){
                features.push(feature);
            }
        }
        loadFeatures();
    }


    /**
     * 规划行程
     */
    function planTrip(event){
        planTripForFeatures(map,that.autocomplete,that.placeSearch,event);
    }

    /**
     * 导出行程计划
     * @param event
     */
    function exportPlanTrip(event){
        if(event == null || features == null || features.length <= 1){
            alert("当前未规划任何行程！");
            return;
        }
        var saveJSON = function(data, filename){
            if(!data) {
                alert('保存的数据为空');
                return;
            }
            if(!filename)
                filename = 'json.json'
            if(typeof data === 'object'){
                data = JSON.stringify(data, undefined, 4)
            }
            var blob = new Blob([data], {type: 'text/json'}),
                e = document.createEvent('MouseEvents'),
                a = document.createElement('a')
            a.download = filename
            a.href = window.URL.createObjectURL(blob)
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            a.dispatchEvent(e)
        };
        saveDataByLocal(features);
        saveJSON(features,"plan_strip.json");
    }



    //回调函数
    function placeSearch_CallBack(data) { //infoWindow.open(map, result.lnglat);
        if (!infoWindow) {
            infoWindow = new AMap.AdvancedInfoWindow({autoMove: true});
        }
        var poiObj = data.data;
        var location = poiObj.location;
        infoWindow.on('open',function (result) {
            // var button = document.getElementById('info-add-trip');
            // if (!button) return;
            // var btnListener = AMap.event.addDomListener(button, 'click', add_trip_point_bind);//给div绑定单击事件
            var button = $('#info-add-trip');
            if (!button) return;
            button.unbind("click"); //移除click
            button.on('click',function (event) {
                _add_trip_point(event,poiObj);
            });
        });
        infoWindow.setContent(createContent(poiObj));
        infoWindow.open(map,location);
        // var btnListener = AMap.event.addDomListener(button, 'click', add_trip_point_bind);//给div绑定单击事件

        // AMap.event.addListener(infoWindow, 'open', function(result){
        //
        // });
    }

    function createContent(poi) {  //信息窗体内容
        var s = [];
        s.push('<div>');
        // s.push('<img src="http://'+ +'"" >');
        s.push('<div class="info-title">'+poi.name+'</div>');
        s.push('<button id="info-add-trip" class="btn" style="margin-right:1rem;">添加到行程</button>');
        s.push('<div class="info-content">'+"地址：" + poi.address);
        s.push("电话：" + poi.tel);
        s.push("类型：" + poi.type);
        s.push('<div>');
        s.push('</div>');
        return s.join("<br>");
    }

    map = new AMap.Map("mapContainer", {center: new AMap.LngLat(center.lng, center.lat), level: level});
    new AMap.TileLayer.RoadNet({map: map, zIndex: 2});
    new AMap.TileLayer.Traffic({map: map, zIndex: 3});
    // loadFeatures();
    var plan_trip_btn = document.getElementById('plan_trip');
    AMap.event.addDomListener(plan_trip_btn, 'click', planTrip);//给div绑定单击事件
    var export_trip_point = document.getElementById('export_trip_point');
    AMap.event.addDomListener(export_trip_point, 'click', exportPlanTrip);//导出元素




    map.on('complete', function () {
        // map.plugin(["AMap.ToolBar", "AMap.OverView", "AMap.Scale"], function () {
        //     map.addControl(new AMap.ToolBar({ruler: false, direction: false, locate: false}));
        //     map.addControl(new AMap.OverView);
        //     map.addControl(new AMap.Scale);
        // });

        var that = this;
        AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch','AMap.AdvancedInfoWindow'],function(){
            var autoOptions = {
                // 城市，默认全国
                city: city,
                // 使用联想输入的input的id
                input: "tipinput"
            }
            // 搜索结果
            var autocomplete= new AMap.Autocomplete(autoOptions)


            var placeSearch = new AMap.PlaceSearch({
                citylimit: false,  //是否强制限制在设置的城市内搜索
                city:city,
                map:map,
                pageSize: 5, // 单页显示结果条数
                pageIndex: 1, // 页码
                panel: "panel", // 结果列表将在此容器中进行展示。
                extensions : "all",
                autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
            });



            // 搜索成功时，result即是对应的匹配数据
            AMap.event.addListener(autocomplete, 'select', function(event){
                // 查询成功时，result即对应匹配的POI信息
                // placeSearch.getDetails(event.poi.name, function(status, result) {
                //
                // });

                // 清除搜索结果
                placeSearch.clear();
                placeSearch.search(event.poi.name, function (status, result) {
                    debugger;
                    // if(status!=='complete')return;
                    // var pois = result.poiList.pois;
                    // for(var i=0;i<pois.length;i+=1){
                    //     var marker = new AMap.Marker({
                    //         content:'<div class="marker" >'+i+'</div>',
                    //         position:pois[i].location,
                    //         map:map,
                    //         label: {
                    //             offset: new AMap.Pixel(20, 20),//修改label相对于maker的位置
                    //             content: pois[i].name
                    //         }
                    //     });
                    //     marker.id= pois[i].id;
                    //     marker.name = pois[i].name;
                    //     marker.on('click',function(){
                    //         map.poiOnAMAP({
                    //             name:this.name,
                    //             location:this.getPosition(),
                    //             id:this.id
                    //         })
                    //     });
                    //     marker.on('mouseover',function(e){
                    //         debugger;
                    //         var text = '鼠标移入覆盖物！'
                    //         document.querySelector("#text").innerText = text;
                    //     })
                    // }
                    // map.setFitView();

                });
            });

            // 搜索成功时，使用map、panel属性后，选中的POI改变时触发
            AMap.event.addListener(placeSearch, 'listElementClick', function(result){
                // planTripForFeatures(map,autocomplete,placeSearch,event);
                if (result && result.type === 'listElementClick' && result.data) {
                    placeSearch_CallBack(result);
                }
            });
            AMap.event.addListener(placeSearch, 'markerClick', function(result){
                // planTripForFeatures(map,autocomplete,placeSearch,event);
                if (result && result.type === 'markerClick' && result.data) {
                    placeSearch_CallBack(result);
                }
            });

            AMap.event.addListener(placeSearch, 'complete', function(result){

            });


            // 记录
            that.autocomplete = autocomplete;
            that.placeSearch = placeSearch;

        })
    })








}(window);
