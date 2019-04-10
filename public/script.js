// Author: Jesse Kuntz
// Date: 4/12/19

// Alien flower using three.js!

// window.alert("Press R to rotate!");

var camera, scene, renderer, controls, light;
var stem, cover, flower, petalCount;
var isRotating = false;
var growing = true;
var clock = new THREE.Clock();

init();
animate();

function init() {
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xcccccc);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Camera
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 1, 1000);
    camera.position.z = 500;
    scene.add(camera);

    // Trackball
    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 3.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.addEventListener('change', render);

    // Light
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-200, 200, 500);
    camera.add(light);

    var ambLight = new THREE.AmbientLight(0x333333);
    scene.add(ambLight);

    // Geometry
    // var skybox = new THREE.CubeGeometry(10000, 10000, 10000);
    // var boxMaterials = [
    //     new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("skybox/front.png"), side: THREE.DoubleSide}),
    //     new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("skybox/back.png"), side: THREE.DoubleSide}),
    //     new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("skybox/up.png"), side: THREE.DoubleSide}),
    //     new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("skybox/down.png"), side: THREE.DoubleSide}),
    //     new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("skybox/left.png"), side: THREE.DoubleSide}),
    //     new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("skybox/right.png"), side: THREE.DoubleSide})
    // ];

    // var boxMaterial = new THREE.MeshFaceMaterial(boxMaterials);
    // var box = new THREE.Mesh(skybox, boxMaterial);
    // scene.add(box);

    var r = "skybox/"
    var urls = [
        r + "front.png",
        r + "back.png",
        r + "up.png",
        r + "down.png",
        r + "right.png",
        r + "left.png"
    ]
    var skyBox = new THREE.CubeTextureLoader().load(urls);
    scene.background = skyBox;

    stem = new THREE.CylinderGeometry(20, 20, 300);

    stemCover = new THREE.MeshPhongMaterial({ color: 0x8700a1, refractionRatio: 0.98, reflectivity: 0.9,});
    bulbCover = new THREE.MeshPhongMaterial({ color: 0x001941, refractionRatio: 0.98, reflectivity: 0.9 });
    petalCover = new THREE.MeshPhongMaterial({ color: 0x48829A, refractionRatio: 0.98, reflectivity: 0.9 });

    flower = new THREE.Mesh(stem, stemCover);
    flower.position.set(0, -170, 0);
    scene.add(flower);

    var bulbShape = new THREE.TorusGeometry(75, 25, 8, 50);
    var bulb = new THREE.Mesh(bulbShape, bulbCover);
    bulb.position.set(0, 243, 0);
    flower.add(bulb);

    createPetal(0, 370, 180);
    createPetal(-115, 180, 295);
    createPetal(115, 180, 65);
    createPetal(-110, 310, 240);
    createPetal(110, 310, 120);
    petalCount = 5;

    window.addEventListener('resize', onWindowResize, false);

    document.addEventListener('keydown', function (event) {
        var code = event.keyCode;
        if (code == 82) isRotating = !isRotating    //r
    });

    render();
}

// From https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_trackball.html
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
    render();
}

function createPetal(x, y, angle) {
    var petal_shape = new THREE.CylinderGeometry(10, 50, 70);
    var petal = new THREE.Mesh(petal_shape, petalCover);
    petal.rotation.z = THREE.Math.degToRad(angle);
    petal.position.set(x, y, 0)
    flower.add(petal);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    // if (isRotating) flower.rotation.y = flower.rotation.y + 0.03;
    flower.rotation.y = flower.rotation.y + 0.02;

    renderer.render(scene, camera);

    if (flower.children[1].scale.x > 1.6) {
        growing = false;
    }
    else if (flower.children[1].scale.x < 1) {
        growing = true;
    }

    if (growing) {
        for (let i = 1; i < petalCount + 1; i++) {
            flower.children[i].scale.x += .01;
            flower.children[i].scale.y += .01;
            flower.children[i].scale.z += .01;
        }

    } else {
        for (let i = 1; i < petalCount + 1; i++) {
            flower.children[i].scale.x -= .01;
            flower.children[i].scale.y -= .01;
            flower.children[i].scale.z -= .01;
        }
    }
}

function render() {
    renderer.render(scene, camera);
}