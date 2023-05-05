import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
// textures

const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('textures/matcaps/1.png')
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')


//cube texture loader

const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentTexture = cubeTextureLoader.load([
    'textures/environmentMaps/4/px.png',
    'textures/environmentMaps/4/nx.png',
    'textures/environmentMaps/4/py.png',
    'textures/environmentMaps/4/ny.png',
    'textures/environmentMaps/4/pz.png',
    'textures/environmentMaps/4/nz.png',
])
//GUI
const gui = new GUI()
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// mesh

// mesh Basic material
// const material = new THREE.MeshBasicMaterial()

//material properties

// material.map = doorColorTexture
// material.color = new THREE.Color(0xff00ff)
// material.wireframe = true
// material.opacity = 0.8;
// material.transparent= true
// material.alphaMap =doorAlphaTexture
// material.side = THREE.DoubleSide


//Mesh Normal Material

// const material = new THREE.MeshNormalMaterial()

// material.flatShading = true

// mesh MathCap material
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

//mesh Depth  material

// const material = new THREE.MeshDepthMaterial()

// mesh Lambert material
// const material = new THREE.MeshLambertMaterial()

// mesh Phong material
// const material = new THREE.MeshPhongMaterial()
// material.shininess=1000
// material.specular = new THREE.Color(0xff0000)

// mesh Toon material
// const material = new THREE.MeshToonMaterial()
// material.gradientMap =  gradientTexture

// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false

// mesh standard material

// const material = new THREE.MeshStandardMaterial()
// material.map= doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.displacementMap = doorHeightTexture
// material.displacementScale=0.1154
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.alphaMap = doorAlphaTexture;
// material.transparent = true

const material = new THREE.MeshStandardMaterial();
material.envMap = environmentTexture


const sphere  = new THREE.Mesh(new THREE.SphereGeometry(0.5,100,100),material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1,1,100,100), material);
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2))
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3,0.2,100,100), material);
torus.position.x=1.5;


scene.add(sphere,plane,torus)


// lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff,0.5);
pointLight.position.x=2
pointLight.position.y=3
pointLight.position.z=4
scene.add(pointLight)


//gui options
gui.add(material,'metalness').max(1).min(0).step(0.0001).name('metalness')
gui.add(material,'roughness').max(1).min(0).step(0.0001).name('roughness')
gui.add(material,'aoMapIntensity').max(10).min(0).step(0.0001).name('occlusion Intensity')
gui.add(material, 'displacementScale').max(1).min(0).step(0.0001).name('displacement Scale')
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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // animate
    sphere.rotation.y =0.1 * elapsedTime
    plane.rotation.y =0.1 * elapsedTime
    torus.rotation.y =0.1 * elapsedTime

    sphere.rotation.y =0.15 * elapsedTime;
    plane.rotation.y =0.15 * elapsedTime;
    torus.rotation.y =0.15 * elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()