import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()


// debug obj

const debugObject ={}
debugObject.envMapIntensity = 1.6

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// apply env Map on all materials && tweak its intensity
const updateAllMaterials = ()=>{
    scene.traverse((child)=>{
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Loaders
 */

// cube tetxure loader

const cubeTextureLoader  = new THREE.CubeTextureLoader()

const environmentMap = cubeTextureLoader.load(
    [
        'textures/environmentMaps/3/px.jpg',
        'textures/environmentMaps/3/nx.jpg',
        'textures/environmentMaps/3/py.jpg',
        'textures/environmentMaps/3/ny.jpg',
        'textures/environmentMaps/3/pz.jpg',
        'textures/environmentMaps/3/nz.jpg',
    ]
)

environmentMap.encoding = THREE.sRGBEncoding

// add enivornment map to scene
scene.background = environmentMap
scene.environment = environmentMap  //apply env Map on all objects in scene !! Meshes

// gltf loader

const gltfLoader = new GLTFLoader()

gltfLoader.load(
    'models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf)=>{

        gltf.scene.scale.set(10,10,10)
        gltf.scene.position.set(0,-4,0)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        // function call 

        updateAllMaterials()
        // adding rotation to lil gui

        const folderObjects  = gui.addFolder('Objects')

        folderObjects.close()
        
        folderObjects.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotate on Y')
        folderObjects.add(gltf.scene.position, 'y').min(-10).max(10).step(0.001)
    
        folderObjects.add(debugObject, 'envMapIntensity').min(0).max(15).step(0.01).name('Environment Map Intensity').onFinishChange(updateAllMaterials)
    }
)
/**
 * Lights
 */

// directional light

const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.position.set(-0.32,9.51,8.77)
directionalLight.castShadow = true
scene.add(directionalLight);

/**
 * Helpers
 */


// directional light
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
directionalLightHelper.visible = false
scene.add(directionalLightHelper)

directionalLight.shadow.mapSize.set(1024,1024)
directionalLight.shadow.camera.far = 20
directionalLight.shadow.camera.near = 7
directionalLight.shadow.normalBias = 0.05

// directional light camera
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)

/**
 * GUI
 */


// folders 

const folderDirectionalLight = gui.addFolder('Directional Light')

// folder defaults

folderDirectionalLight.close()

// folder items

folderDirectionalLight.add(directionalLight, 'intensity').min(0).max(5).step(0.001)
folderDirectionalLight.add(directionalLight.position, 'x').min(-10).max(10).step(0.01)
folderDirectionalLight.add(directionalLight.position, 'y').min(-10).max(10).step(0.01)
folderDirectionalLight.add(directionalLight.position, 'z').min(-10).max(10).step(0.01)
folderDirectionalLight.add(directionalLightHelper, 'visible').name('Light Helper')
folderDirectionalLight.add(directionalLightCameraHelper, 'visible').name('Camera Helper')


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.225

// shadows
renderer.shadowMap.enabled  = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// gui

const folderRenderer = gui.addFolder('Renderer')

folderRenderer.close()

folderRenderer.add(renderer, 'toneMapping',{
    None : THREE.NoToneMapping,
    ACSFilmic: THREE.ACESFilmicToneMapping,
    Cineon: THREE.CineonToneMapping,
    Reinhard : THREE.ReinhardToneMapping,
    Linear : THREE.LinearToneMapping,
    Custom : THREE.CustomToneMapping,
})
folderRenderer.add(renderer,'toneMappingExposure').min(0).max(10).step(0.001).name('Tone Mapping Exposure')
/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()