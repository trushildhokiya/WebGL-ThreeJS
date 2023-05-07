import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon';


/**
 * Debug
 */
const gui = new dat.GUI()

const debugObject = {}

debugObject.createSphere = ()=>{
    createSphere(
        Math.random()* 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3 ,
            z: (Math.random() - 0.5) * 2
        }
    )
}

debugObject.createBox = ()=>{
    createBox(
        Math.random()* 0.5,
        Math.random()* 0.5,
        Math.random()* 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3 ,
            z: (Math.random() - 0.5) * 2
        }
    )
}


gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * sounds
 */



/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])



/**
 * Physics
 */

// world
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0,-9.82,0);

// materials

const defaultMaterial = new CANNON.Material('default')


const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.02,
        restitution: 0.7,
    }
)

world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial
//objects 


const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()

floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1,0,0,),Math.PI * 0.5)
world.add(floorBody);

/**
 * bodies
 */
const objectsToUpdate = []
const geometry = new THREE.SphereGeometry(1, 50,50);
const material =  new THREE.MeshStandardMaterial({
    metalness: 1,
    roughness: 0,
    envMap: environmentMapTexture
})

const createSphere = (radius,position)=>{
    // Three js world
    const mesh = new THREE.Mesh(
        geometry,
        material
    )

    mesh.castShadow = true  
    mesh.scale.set(radius,radius, radius)
    mesh.position.copy(position)
    scene.add(mesh)

    // physics world

    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass:1,
        shape: shape,
        material: defaultMaterial,
    })

    body.position.copy(position)
    world.addBody(body)

    // add to array
    objectsToUpdate.push({
        mesh: mesh,
        body:body
    })
}

// box

const geometryBox = new THREE.BoxGeometry(1,1,1,10,10,10);

const createBox = (width, heigth , depth , position)=>{
    // Three js world
    const mesh = new THREE.Mesh(
        geometryBox,
        material
    )

    mesh.castShadow = true  
    mesh.scale.set(width , heigth , depth)
    mesh.position.copy(position)
    scene.add(mesh)

    // physics world

    const shape = new CANNON.Box(new CANNON.Vec3(width*0.5, heigth *0.5 , depth*0.5))
    const body = new CANNON.Body({
        mass:1,
        shape: shape,
        material: defaultMaterial,
    })

    body.position.copy(position)
    // body.addEventListener('collide',playhitSound)
    world.addBody(body)

    // add to array
    objectsToUpdate.push({
        mesh: mesh,
        body:body
    })
}
// createSphere(1,{x:1,y:3,z:1})

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0 ;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime-oldElapsedTime
    oldElapsedTime = elapsedTime

    // update physics world
    world.step(1/60 , deltaTime , 3)

    // update bodies position ( phy -> three)
    for( const obj of objectsToUpdate){
        obj.mesh.position.copy(obj.body.position)
        obj.mesh.quaternion.copy(obj.body.quaternion)
    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()