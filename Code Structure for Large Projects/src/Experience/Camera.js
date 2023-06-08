import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Experience from "./Experience";

export default class Camera{

    constructor(){

        // create singleton of Experience class
        this.experience = new Experience()

        // properties

        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.canvas = this.experience.canvas;

        this.setInstance();
        this.setOrbitControls();
    }

    setInstance(){

        this.instance  = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.heigth , 1,100);
        this.instance.position.set(6,2,6);
        this.scene.add(this.instance)
    }

    setOrbitControls(){
        
        this.controls = new OrbitControls(this.instance , this.canvas);
        this.controls.enableDamping = true
    }

    resize(){

        this.instance.aspect = this.sizes.width / this.sizes.heigth;
        this.instance.updateProjectionMatrix();

    }

    update(){
        this.controls.update()
    }
}