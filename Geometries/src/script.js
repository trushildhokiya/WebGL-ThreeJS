import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

//canvas
const canvas = document.querySelector('.webgl');

// scene
const scene = new THREE.Scene()
//mesh 



const geometry = new THREE.BufferGeometry()

const count =50;
const positionArray = new Float32Array(count *3 *3);
for(let i=0 ; i<count *3 *3 ; i++){
    positionArray[i] = (Math.random()-0.5)*4
}

const positionAttribute = new THREE.BufferAttribute(positionArray,3);
geometry.setAttribute('position',positionAttribute);
const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x00ff00 , wireframe:true}))
scene.add(mesh)


//sizes
const sizes={
    width : window.innerWidth,
    height : window.innerHeight
}


// event listeners

window.addEventListener('resize',()=>{

    //update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //update canera
    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix()

    //update renderer
    renderer.setSize(sizes.width,sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

})
// camera 

const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height , 0.1,100);
camera.position.z =3;
scene.add(camera)

//animate 
const controls= new OrbitControls(camera,canvas)
controls.enableDamping=true

//renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const tick = ()=>{

    //update controls
    controls.update()

    //render scene on each frame
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
