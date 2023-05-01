// Scene 
const scene = new THREE.Scene();

// Blue Cube
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color:0x0000ff});
const mesh = new THREE.Mesh(geometry,material);

scene.add(mesh)


// Sizes
const sizes = {
    width:800,
    height:600
};

// camera parameters (field of view , aspect ratio)
const camera = new THREE.PerspectiveCamera(55, sizes.width/sizes.height);
camera.position.z=3;
camera.position.x=1;
camera.position.y=0.21;
scene.add(camera);

// renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

renderer.setSize(sizes.width, sizes.height);

renderer.render(scene,camera);