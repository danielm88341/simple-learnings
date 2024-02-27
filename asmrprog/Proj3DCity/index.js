// Base Parameters
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

if(window.innerWidth > 800){
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.needsUpdate = true;
}
document.body.appendChild(renderer.domElement);

// Make it responsive
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    caches.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

let camera = new THREE.PerspectiveCamera(20,window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0,2,14);

let scene = new THREE.Scene();
let city = new THREE.Object3D();
let smoke = new THREE.Object3D();
let town = new THREE.Object3D();
let createCarPos = true;
let uSpeed = 0.001;

// Fog Background
let setColor = 0xF02050;
scene.background = new THREE.Color(setColor);
scene.fog = new THREE.Fog(setColor, 10, 16);

// Random Function
function mathRandom(num = 8) {
    return -Math.random() * num + Math.random() * num;
}

// Change Building Colors
let setTintNum = true;
function setTintColor() {
    if(setTintNum) {
        setTintNum = false;
        let setColor = 0x000000;
    } else {
        setTintNum = true;
        let setColor = 0x000000;
    }
    return setColor;
}

// Create City
function init() {
    let segments = 2;
    for(let i = 1; i < 100; i++) {
        let geometry = new THREE.CubeGeometry(1,0,0,segments, segments, segments);
        let material = new THREE.MeshStandardMaterial({
            color: setTintColor(),
            wireframe: false,
            shading: THREE.SmoothShading,
            side: THREE.DoubleSide
        });
        let wMaterial = new THREE.MeshLambertMaterial({
            color: 0xFFFFFFF,
            wireframe: true,
            transparent: true,
            opacity: 0.03,
            side: THREE.DoubleSide
        });

        let cube = new THREE.Mesh(geometry, material);
        let wire = new THREE.Mesh(geometry, material);
        let floor = new THREE.Mesh(geometry, material);
        let qwFloor = new THREE.Mesh(geometry, material);

        cube.add(wFloor);
        cube.setShadow = true;
        cube.receiveShadow = true;
        cube.rotationValue = 0.1 * Math.abs(mathRandom(8));

        floor.scale.y = 0.05;
        cube.scale.y = 0.1 + Math.abs(mathRandom(8));

        let cubeWidth = 0.9;
        cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth);
        cube.position.x = Math.round(mathRandom());
        cube.position.z = Math.round(mathRandom());

        floor.position.set(cube.position.x, 0, cube.position.z);

        town.add(floor);
        town.add(cube);
    }

    // Particulars
    let gMaterial = new THREE.MeshToonMaterial({
        color: 0xFFFF00,
        side: THREE.DoubleSide
    })
    let gParticular = new THREE.CircleGeometry(0.01, 3);
    let aParticular = 5;
    for (let h = 1; h < 300; h++) {
        let particular = new THREE.Mesh(gParticular, gMaterial);
        particular.position.set(mathRandom(aParticular), mathRandom(aParticular), mathRandom(aParticular));
        particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
        smoke.add(particular);
    }

    let pMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
        roughness: 10,
        metalness: 0.6,
        opacity: 0.9,
        transparent: true
    })
    let pGeometry = new THREE.PlaneGeometry(60,60);
    let pElement = new THREE.Mesh(pGeometry, pMaterial);
    pElement.rotation.x = -90 * Math.PI / 180;
    pElement.position.y = -0.001;
    pElement.receiveShadow = true;
    city.add(pElement);
}

// Mouse Functions
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2(), INTERSECTED;
let intersected;

function onMouseMove(e) {
    e.preventDefault();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}
function onDocumentTouchStart(e) {
    if(e.touches.length == 1) {
        e.preventDefault();
        mouse.x = e.touches[0].pageX - window.innerWidth / 2;
        mouse.y = e.touches[0].pageY - window.innerHeight / 2;
    }
}

function onDocumentTouchMove(e) {
    if(e.touches.length == 1) {
        e.preventDefault();
        mouse.x = e.touches[0].pageX - window.innerWidth / 2;
        mouse.y = e.touches[0].pageY - window.innerHeight / 2;
    }
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('touchstart', onDocumentTouchStart, false);
window.addEventListener('touchmove', onDocumentTouchMove, false);

// Create Lights
let ambientLight = new THREE.AmbientLight(0x111111, 5);
let lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10);
let lightBack = new THREE.PointLight(0xFFFFFF, 0.5);
let spotLightHelper = new THREE.SpotLightHelper(lightFront);

lightFront.rotation.x = 45 * Math.PI / 180;
lightFront.rotation.z = -45 * Math.PI / 180;
lightFront.position.set(5,5,5);
lightFront.castShadow = true;
lightFront.shadow.mapSize.width = 6000;
lightFront.shadow.mapSize.height = 6000;
lightFront.penumbra = 0.1;
lightBack.position.set(0,6,0);

smoke.position.y = 2;
scene.add(ambientLight);
city.add(lightFront);
scene.add(lightBack);
scene.add(city);
city.add(smoke);
city.add(town);

// Grid Helper
let gridHelper = new THREE.GridHelper(60,120, 0xFF0000, 0x000000);
city.add(gridHelper);

// Cars World
let createCars = function(cScale = 2, cPos = 20, cColor = 0xFFFF00){
    let cMat = new THREE.MeshToonMaterial({
        color: cColor,
        side: THREE.DoubleSide
    })
    let cGeo = new THREE.CubeGeometry(1,cScale / 40, cScale / 40);
    let cElem = new THREE.Mesh(cGeo, cMat);
    let cAmp = 3;
    if(createCarPos) {
        createCarPos = false;
        cElem.position.x = -cPos;
        cElem.position.z = mathRandom(cAmp);
        TweenMax.to(cElem.position, 3, { x: cPos, repeat: -1, yoyo: true, delay: mathRandom(3)})
    } else {
        createCarPos = true;
        cElem.position.x = mathRandom(cAmp);
        cElem.position.z = -cPos;
        cElem.rotation.y = 90* Math.PI / 180;

        TweenMax.to(cElem.position, 5, { z: cPos, repeat: -1, yoyo : true, delay : mathRandom(3), ease: Power1.easeInOut});
        cElem.receiveShadow = true;
        cElem.castShadow = true;
        cElem.position.y = Math.abs(mathRandom(5));
        city.add(cElem);
    }
}

let generateLines = function() {
    for(let i = 0; i < 60; i++) {
        createCars(0.1, 1, 20);
    }
}

// Camera POsition
let cameraSet = function() {
    createCars(0.1, 20, 0xFFFFFF)
}

// Animation functions
let animate = function() {
    let time = Date.now() * 0.00005;
    requestAnimationFrame(animate);

    city.rotation.y -= ((mouse.x * 8) - camera.rotation.y) * uSpeed;
    city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed;
    if(city.rotation.x < -0.05) {
        city.rotation.x = -0.05;
    } else if (city.rotation.x > 1) {
        city.rotation.x = 1;
    }
    let cityRotation = Math.sin(Date.now() / 5000) * 13;
    for(let i = 0, l = town.children.length; i < l; i++) {
        let object = town.children[i];
    }

    smoke.rotation.y += 0.01;
    smoke.rotation.x += 0.01;

    camera.lookAt(city.position);
    renderer.render(scene,camera);
}


// Calling Main Function
generateLines();
init();
animate();

