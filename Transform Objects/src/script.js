import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)

// /*
// Positions
// */
// // mesh.position.x=0.7;
// // mesh.position.y=-0.5;
// // mesh.position.z=1;
// mesh.position.set(0.3,-0.5,1);
// // mesh.position.normalize()  //normalize object i.e length 1

// console.log(mesh.position.length());


// /*
// Scale
// */ 

// mesh.scale.set(2,0.55,0.5)
// scene.add(mesh)


// /*
// Rotation*/
// mesh.rotation.reorder('YXZ')
// mesh.rotation.y = Math.PI/4
// mesh.rotation.x = Math.PI/4




/*Groups */
const group = new THREE.Group()

scene.add(group);

const box1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0x0000ff})
);

const box2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0x00ff00})
);
box2.position.x=2;

const box3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0xff0000})
);
box3.position.x=-2;

group.add(box1,box2,box3)

group.position.y=1.2
group.rotation.y = Math.PI/2
/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z=3;
// camera.position.set(0.6,2,10)
// console.log(mesh.position.distanceTo(camera.position))
scene.add(camera)

// camera.lookAt(mesh.position)


// Axes Helper
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)