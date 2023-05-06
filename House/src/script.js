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
 * Loading Manager
 */

const loadingManager = new THREE.LoadingManager()

loadingManager.onError = ()=>{

    console.log("Error while loading ... ");

}

/**
 * Loaders
 */

const textureLoader = new THREE.TextureLoader( loadingManager );

// door textures

const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorColorTexture = textureLoader.load('textures/door/color.jpg')
const doorHeightTexture = textureLoader.load('textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg')


// bricks texture

const bricksAmbientOcclusionTexture = textureLoader.load('textures/bricks/ambientOcclusion.jpg')
const bricksColorTexture = textureLoader.load('textures/bricks/color.jpg')
const bricksRoughnessTexture = textureLoader.load('textures/bricks/roughness.jpg')
const bricksNormalTexture = textureLoader.load('textures/bricks/normal.jpg')


// grass texture

const grassAmbientOcclusionTexture = textureLoader.load('textures/grass/ambientOcclusion.jpg')
const grassColorTexture = textureLoader.load('textures/grass/color.jpg')
const grassRoughnessTexture = textureLoader.load('textures/grass/roughness.jpg')
const grassNormalTexture = textureLoader.load('textures/grass/normal.jpg')

// adjust size of grass texture

grassColorTexture.repeat.set(10,10)
grassAmbientOcclusionTexture.repeat.set(10,10)
grassRoughnessTexture.repeat.set(10,10)
grassNormalTexture.repeat.set(10,10)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping

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
    new THREE.MeshStandardMaterial({
        color: 0x520000,

        map: bricksColorTexture,

        aoMap: bricksAmbientOcclusionTexture,

        normalMap: bricksNormalTexture,

        roughnessMap: bricksRoughnessTexture,
    })
)

// create uv2 for walls (bricks)

walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array , 2));

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
    new THREE.PlaneGeometry(1.85,2.05, 100 , 100),
    new THREE.MeshStandardMaterial({
        color: 0x8a3324,

        map: doorColorTexture,

        transparent: true,
        alphaMap: doorAlphaTexture,

        aoMap: doorAmbientOcclusionTexture,

        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        
        normalMap: doorNormalTexture,

        metalnessMap: doorMetalnessTexture,

        roughnessMap: doorRoughnessTexture,
    })
)

// create uv2 coordinates

door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2))

door.position.z = 2.5 + 0.001;
door.position.y = 2.05 * 0.5 - 0.085

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

    const radius = 6 + Math.random() * 5;

    const angle = Math.random() * (Math.PI *2)
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    grave.position.set(x , 1 * 0.5 , z)

    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.rotation.z = (Math.random() - 0.5) * 0.2;

    grave.castShadow = true;

    graves.add(grave)
}

// ghosts (point Lights)

const ghost1 = new THREE.PointLight(0xffff00, 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight(0xff00ff, 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight(0x00ffff, 2, 3)
scene.add(ghost3)


// floor

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(25,25,15,15),
    new THREE.MeshStandardMaterial({
        // color: 0x9EA26B,

        map: grassColorTexture,

        aoMap: grassAmbientOcclusionTexture,

        normalMap: grassNormalTexture,

        roughnessMap: grassRoughnessTexture,
    })
)

// creating uv2 for floor

floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2));

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
const ambientLight = new THREE.AmbientLight(0xb9d5ff , 0.12);
scene.add(ambientLight)

// dircectional light

const moonLight = new THREE.DirectionalLight(0xb9d5ff , 0.12);
moonLight.position.set(4,5,-2)
scene.add(moonLight);

// door light (point light)

const doorLight = new THREE.PointLight(0xff7251 , 1.625 ,8)
doorLight.position.set(0 , 2.625 , 5 * 0.5 + 0.45);
house.add(doorLight);

/**
 * Helpers
 */

// light helper

const moonlightHelper = new THREE.DirectionalLightHelper(moonLight);
moonlightHelper.visible = false
scene.add(moonlightHelper)

// door light helper

const doorLightHelper = new THREE.PointLightHelper(doorLight, 0.2);
doorLightHelper.visible= false;
scene.add(doorLightHelper);


/**
 * Fogs
 */

const fog = new THREE.Fog(0x74747c, 1, 25);
scene.fog = fog;

/**
 * renderer
 */

const renderer = new THREE.WebGLRenderer({canvas:canvas});

renderer.setSize(sizes.width,sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

renderer.setClearColor(new THREE.Color(0x74747c))

/**
 *  shadows
 */

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.near = 1
moonLight.shadow.camera.far = 15;

doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.near = 1
doorLight.shadow.camera.far = 7;

ghost1.castShadow = true
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.near = 1
ghost1.shadow.camera.far = 7

ghost2.castShadow = true
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.near = 1
ghost2.shadow.camera.far = 7

ghost3.castShadow = true
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.near = 1
ghost3.shadow.camera.far = 7


bushOne.castShadow = true
bushTwo.castShadow = true
bushThree.castShadow = true
bushFour.castShadow = true

walls.castShadow = true;
roof.castShadow = true;



floor.receiveShadow= true

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

const folderDoorLight = gui.addFolder('DoorLight')

// defaults for folders

folderAmbientLight.close()
folderMoonLight.close()
folderDoorLight.close()

// ambient light controls
folderAmbientLight.add(ambientLight, 'intensity').max(1).min(0).step(0.001).name('Intensity')

// moonLight controls
folderMoonLight.add(moonLight,'intensity').max(1).min(0).step(0.001).name('Intensity')
folderMoonLight.add(moonLight.position,"x").max(5).min(-5).step(0.001)
folderMoonLight.add(moonLight.position,"y").max(5).min(-5).step(0.001)
folderMoonLight.add(moonLight.position,"z").max(5).min(-5).step(0.001)
folderMoonLight.add(moonlightHelper,'visible').name("MoonLight Helper")

// door light controls

folderDoorLight.add(doorLight , 'intensity').min(0).max(2).step(0.002).name('Intensity')
folderDoorLight.add(doorLight.position , 'x').min(-5).max(10).step(0.001)
folderDoorLight.add(doorLight.position , 'y').min(-5).max(10).step(0.001)
folderDoorLight.add(doorLight.position , 'z').min(-5).max(10).step(0.001)
folderDoorLight.add(doorLightHelper, 'visible').name('Door Light Helper')
/**
 * animation frame handle
 */

const clock = new THREE.Clock();

const tick = ()=>{
    
    //elapsed time
    const elapsedTime = clock.getElapsedTime();

    // animate ghosts

    const ghost1Angle = elapsedTime * 0.5 ;

    ghost1.position.x = Math.sin(ghost1Angle) * 5
    ghost1.position.z = Math.cos(ghost1Angle) * 5
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = -elapsedTime*0.32;

    ghost2.position.x = Math.sin(ghost2Angle) *6.35 
    ghost2.position.z = Math.cos(ghost2Angle) * 6.35
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    
    const ghost3Angle = -elapsedTime*0.18;

    ghost3.position.x = Math.sin(ghost3Angle) * (8.5 + Math.sin(elapsedTime * 0.45)) 
    ghost3.position.z = Math.cos(ghost3Angle) * (7.92+ Math.sin(elapsedTime *0.22))
    ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2)

    //update controls
    controls.update()

    //re render on each frame
    renderer.render(scene,camera);

    // call on each frame
    window.requestAnimationFrame(tick)
}

tick()