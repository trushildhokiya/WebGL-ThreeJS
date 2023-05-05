import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GUI} from 'lil-gui'

/**
 * global variables
 */
const canvas = document.querySelector('.webgl')

const sizes={
    width: window.innerWidth,
    height: window.innerHeight
};

const gui = new GUI();


/**
 * Loaders
 */

const textureLoader = new THREE.TextureLoader();


/**
 * scene
 */
const scene = new THREE.Scene();

/**
 * objects
 */

// House (Group)

const house = new THREE.Group();
scene.add(house);

// house components

// walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(5,3,5,50,50,50),
    new THREE.MeshStandardMaterial({color:0x844c3b})
)

walls.position.y =  3 * 0.5;

house.add(walls)

// roof

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(4.7,1.5,4,50),
    new THREE.MeshStandardMaterial({color: 0xA44A4A})
)

roof.position.y = 3 + (1.5 * 0.5)
roof.rotation.y = Math.PI * 0.25;

house.add(roof)

// door

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5,2.05),
    new THREE.MeshStandardMaterial({color: 0x5d2906})
)

door.position.z = 2.5 + 0.001;
door.position.y = 2.05 * 0.5

house.add(door)

//bush

const bushGeometry = new THREE.IcosahedronGeometry(1,1);
const bushMaterial = new THREE.MeshStandardMaterial({color:0x29561F})

const bushOne = new THREE.Mesh(bushGeometry, bushMaterial);

bushOne.position.set(2.5+0.25 , 1*0.45 , 2.5+1);

house.add(bushOne);


const bushTwo = new THREE.Mesh(bushGeometry,bushMaterial);

bushTwo.scale.set(0.5,0.5,0.5)
bushTwo.position.set(2.5-0.90 , 0+0.25 , 2.5 +0.5);

house.add(bushTwo)


const bushThree = new THREE.Mesh(bushGeometry,bushMaterial);

bushThree.position.set(-2-0.5 , 1*0.45 , 2.5+0.85)

house.add(bushThree)


const bushFour = new THREE.Mesh(bushGeometry,bushMaterial);

bushFour.scale.set(0.5,0.5,0.5)
bushFour.position.set(-2.5+1.25 , 0+0.25 , 2.5 +0.5);

house.add(bushFour)

// graves (Group)

const graves = new THREE.Group();

scene.add(graves)

//grave

const graveGeometry = new THREE.BoxGeometry(0.8,1,0.25,10,10,10);
const graveMaterial = new THREE.MeshStandardMaterial({color: 0xB0B3C3})

for(let i=0 ; i<60 ; i++){

    const grave = new THREE.Mesh(graveGeometry, graveMaterial);

    const radius = 5 + Math.random() * 6;

    const angle = Math.random() * (Math.PI *2)
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    grave.position.set(x , 1 * 0.5 , z)

    grave.rotation.y = (Math.random() - 0.5) * 0.4;

    graves.add(grave)
}

// floor

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(25,25,15,15),
    new THREE.MeshStandardMaterial({color: 0x9EA26B})
)

floor.position.y =  0;
floor.rotation.x = - (Math.PI *0.5) // to make plane horizontal
scene.add(floor)

/**
 * camera
 */
const camera = new THREE.PerspectiveCamera(75 , sizes.width/sizes.height , 0.1,100);
camera.position.set(5,3,9)
scene.add(camera)

/**
 * Lights
 */

// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff,0.5);
scene.add(ambientLight)

// dircectional light

const moonLight = new THREE.DirectionalLight(0xffffff, 0.3);
moonLight.position.set(4,5,-2)
scene.add(moonLight);

/**
 * Helpers
 */

// light helper

const moonlightHelper = new THREE.DirectionalLightHelper(moonLight);
moonlightHelper.visible = false
scene.add(moonlightHelper)

/**
 * renderer
 */

const renderer = new THREE.WebGLRenderer({canvas:canvas});
renderer.setSize(sizes.width,sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

/**
 * Event listeners
 */

window.addEventListener('resize',()=>{

    //update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //update camera
    const apsectRatio = sizes.width/sizes.height;
    camera.aspect= apsectRatio;
    camera.updateProjectionMatrix();

    //update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio , 2));
})

/**
 * controls
 */

const controls = new OrbitControls(camera,canvas);
controls.enableDamping= true;

/**
 * GUI options
 */

// folders
const folderAmbientLight = gui.addFolder('AmbientLight')

const folderMoonLight = gui.addFolder('MoonLight')
// defaults for folders

folderAmbientLight.close()
folderMoonLight.close()

// ambient light controls
folderAmbientLight.add(ambientLight, 'intensity').max(1).min(0).step(0.001).name('Intensity')

// moonLight controls
folderMoonLight.add(moonLight,'intensity').max(1).min(0).step(0.001).name('Intensity')
folderMoonLight.add(moonLight.position,"x").max(5).min(-5).step(0.001)
folderMoonLight.add(moonLight.position,"y").max(5).min(-5).step(0.001)
folderMoonLight.add(moonLight.position,"z").max(5).min(-5).step(0.001)
folderMoonLight.add(moonlightHelper,'visible').name("MoonLight Helper")

/**
 * animation frame handle
 */

const clock = new THREE.Clock();

const tick = ()=>{
    
    //elapsed time
    const elapsedTime = clock.getElapsedTime();

    //update controls
    controls.update()

    //re render on each frame
    renderer.render(scene,camera);

    // call on each frame
    window.requestAnimationFrame(tick)
}

tick()