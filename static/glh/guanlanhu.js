function getRootPath() {
    var pathName = window.location.pathname.substring(1);
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    return window.location.protocol + '//' + window.location.host  + '/';
}
var map = new mapboxgl.Map({
	// attributionControl: true,
	container: 'map',
	// center: [114.15316467, 22.67357826],
    center:[114.09,22.73],
    pitch:0,
    // pitchWithRotate:false,
    // dragRotate:false,
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
					"background-color": 'RGB(37,75,111)',
				}
			},

		]
	},
});
var modelData = {
    'shiwai':[114.080939560688,22.720613],
    'shinei':[114.09,22.73]
    }
var fromLL = function (lon, lat) {
    // derived from https://gist.github.com/springmeyer/871897
    var extent = 20037508.34;
    var x = lon * extent / 180;
    var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
    y = y * extent / 180;

    return [(x + extent) / (2 * extent), 1 - ((y + extent) / (2 * extent))];
}
class CustomLayer {
    constructor(iDIndex, lng) {
        this.lng = lng;
        this.minzoom = 4;
        this.id = 'custom_layer_building' + iDIndex;
        this.type = 'custom';
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();
        var ambientLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambientLight);
        var object;
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath(getRootPath() + 'static/model/glh/' + iDIndex + '/');
        mtlLoader.load(iDIndex + '.mtl', (function (materials) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath(getRootPath() + 'static/model/glh/' + iDIndex + '/');
            objLoader.load(iDIndex + '.obj', (function (obj) {
                obj.scale.set(0.006, 0.005, 0.005);
                this.scene.add(obj);
            }).bind(this));
        }).bind(this));
    }

    onAdd(map, gl) {
        this.map = map;
        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl
        });
        this.renderer.autoClear = false;
    }

    render(gl, matrix) {
        this.translate = fromLL(this.lng[0], this.lng[1]);
        this.transform = {
            translateX: this.translate[0],
            translateY: this.translate[1],
            translateZ: 0,
            rotateX: Math.PI / 2,
            rotateY: 0,
            rotateZ: 0,
            scale: 50.41843220338983e-7 //设置模型大小
        }
        const rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), this.transform.rotateX);
        const rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), this.transform.rotateY);
        const rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), this.transform.rotateZ);

        const m = new THREE.Matrix4().fromArray(matrix);
        const l = new THREE.Matrix4().makeTranslation(this.transform.translateX, this.transform.translateY, this.transform.translateZ)
            .scale(new THREE.Vector3(this.transform.scale, -this.transform.scale, this.transform.scale))
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ);

        this.camera.projectionMatrix.elements = matrix;
        this.camera.projectionMatrix = m.multiply(l);
        this.renderer.state.reset();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
    }
}

class CustomLayer2 {
    constructor(iDIndex, lng) {
        this.lng = lng;
        this.minzoom = 4;
        this.id = 'custom_layer_building' + iDIndex;
        this.type = 'custom';
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();
        var ambientLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambientLight);
        var object;
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath(getRootPath() + 'static/model/3Ddemo/' + iDIndex + '/');
        mtlLoader.load(iDIndex + '.mtl', (function (materials) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath(getRootPath() + 'static/model/3Ddemo/' + iDIndex + '/');
            objLoader.load(iDIndex + '.obj', (function (obj) {
                obj.scale.set(0.006, 0.005, 0.005);
                this.scene.add(obj);
            }).bind(this));
        }).bind(this));
    }

    onAdd(map, gl) {
        this.map = map;
        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl
        });
        this.renderer.autoClear = false;
    }

    render(gl, matrix) {
        this.translate = fromLL(this.lng[0], this.lng[1]);
        this.transform = {
            translateX: this.translate[0],
            translateY: this.translate[1],
            translateZ: 0,
            rotateX: Math.PI / 2,
            rotateY: 0,
            rotateZ: 0,
            scale: 50.41843220338983e-7 //设置模型大小
        }
        const rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), this.transform.rotateX);
        const rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), this.transform.rotateY);
        const rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), this.transform.rotateZ);

        const m = new THREE.Matrix4().fromArray(matrix);
        const l = new THREE.Matrix4().makeTranslation(this.transform.translateX, this.transform.translateY, this.transform.translateZ)
            .scale(new THREE.Vector3(this.transform.scale, -this.transform.scale, this.transform.scale))
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ);

        this.camera.projectionMatrix.elements = matrix;
        this.camera.projectionMatrix = m.multiply(l);
        this.renderer.state.reset();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
    }
}
map.on('load',function(){
    map.addLayer(new CustomLayer('shiwai',[114.080939560688,22.720613]));
    map.addLayer(new CustomLayer2('74403013',[114.09,22.73]));
})


//添加比例尺
var scale = new mapboxgl.ScaleControl({
	maxWidth: 80,
	unit: 'imperial'
});
map.addControl(scale);
scale.setUnit('metric');
//map.addControl(new mapboxgl.AttributionControl({
//	compact: true
//}));
