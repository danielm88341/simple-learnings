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
            wireframe: false,
            transparent: true,
            opacity: 0.03,
            side: THREE.DoubleSide
        });

        let cube = new THREE.Mesh(geometry, material);
        let wire = new THREE.Mesh(geometry, material);
        let floor = new THREE.Mesh(geometry, material);
        let wFloor = new THREE.Mesh(geometry, material);

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
    for (let h = 0; h < 300; h++) {
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

// Calling Main Function
generateLines();
init();
animate();

