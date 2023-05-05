import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */

// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff,0.5)
scene.add(ambientLight)

// directional light
const directionalLight = new THREE.DirectionalLight(0xf7fc60 , 0.3);
scene.add(directionalLight)

// hemisphere light
const hemisphereLight = new THREE.HemisphereLight(0x54beff , 0x009e32 , 0.3);
// scene.add(hemisphereLight);

// point light
const pointLight = new THREE.PointLight(0xff9000, 0.7,3,2);
scene.add(pointLight)

// rectArea ligth
const rectAreaLight = new THREE.RectAreaLight(0x03eaff , 2, 3,1);
scene.add(rectAreaLight)

// spot light

const spotLight = new THREE.SpotLight(0xfa590f , 2,10,Math.PI*0.1 , 1,1);
spotLight.position.set(0,2,3);

scene.add(spotLight);


/**
 * Light Helpers
 */

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight);
// scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,0.2);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight,0.2);
scene.add(pointLightHelper)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
/**
 * gui
 */

const folderAmbientLight = gui.addFolder('Ambient Light')
const folderDirectionalLight = gui.addFolder('Directional Light')
const folderPointLight = gui.addFolder('Point Light')
const folderRectAreaLight = gui.addFolder('Rect Area Light')
const folderSpotLight = gui.addFolder('SpotLight')

folderAmbientLight.close()
folderPointLight.close()
folderDirectionalLight.close()
folderRectAreaLight.close()
folderSpotLight.close()

folderAmbientLight.add(ambientLight,'intensity').min(0).max(1).step(0.001).name('Intensity')

folderDirectionalLight.add(directionalLight,'intensity').min(0).max(1).step(0.001).name('Intensity')
folderDirectionalLight.add(directionalLight.position,'x').min(-10).max(10).step(0.001).name('x')
folderDirectionalLight.add(directionalLight.position,'y').min(-10).max(10).step(0.001).name('y')
folderDirectionalLight.add(directionalLight.position,'z').min(-10).max(10).step(0.001).name('z')

folderPointLight.add(pointLight,'intensity').min(0).max(1).step(0.001).name('Intensity')
folderPointLight.add(pointLight.position,'x').min(-10).max(10).step(0.001).name('x')
folderPointLight.add(pointLight.position,'y').min(-10).max(10).step(0.001).name('y')
folderPointLight.add(pointLight.position,'z').min(-10).max(10).step(0.001).name('z')
folderPointLight.add(pointLight,'distance').min(0).max(10).step(0.001).name('Distance')
folderPointLight.add(pointLight,'decay').min(0).max(10).step(0.001).name('Decay')

folderRectAreaLight.add(rectAreaLight,'intensity').max('5').min(0).step(0.005).name('Intensity')
folderRectAreaLight.add(rectAreaLight,'width').max('10').min(-10).step(0.005).name('width')
folderRectAreaLight.add(rectAreaLight,'height').max('10').min(-10).step(0.005).name('height')
folderRectAreaLight.add(rectAreaLight.position,'x').min(-10).max(10).step(0.001).name('x')
folderRectAreaLight.add(rectAreaLight.position,'y').min(-10).max(10).step(0.001).name('y')
folderRectAreaLight.add(rectAreaLight.position,'z').min(-10).max(10).step(0.001).name('z')

folderSpotLight.add(spotLight,'intensity').min(0).max(5).step(0.001);
folderSpotLight.add(spotLight,'angle').min(-Math.PI *2).max(Math.PI *2).step(0.001);
folderSpotLight.add(spotLight,'penumbra').min(0).max(1).step(0.001);
folderSpotLight.add(spotLight,'distance').min(0).max(10).step(0.001);
folderSpotLight.add(spotLight,'decay').min(0).max(10).step(0.001);
folderSpotLight.add(spotLight.position,'x').min(-10).max(10).step(0.001);
folderSpotLight.add(spotLight.position,'y').min(-10).max(10).step(0.001);
folderSpotLight.add(spotLight.position,'z').min(-10).max(10).step(0.001);
/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()