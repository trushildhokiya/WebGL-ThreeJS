import * as THREE from 'three';
import Experience from "./Experience";

export default class Renderer{

    constructor(){

        this.experience = new Experience();
        this.canvas = this.experience.canvas;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.sizes = this.experience.sizes;

        this.setInstance()
    }

    setInstance(){
        
        this.instance = new THREE.WebGLRenderer({canvas:this.canvas , antialias:true});
        
        //properties

        this.instance.setSize(this.sizes.width , this.sizes.heigth);
        this.instance.setPixelRatio(Math.min( window.devicePixelRatio , 2));
        this.instance.setClearColor(0x211d20);
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.5
        this.instance.outputEncoding = THREE.sRGBEncoding
        this.instance.physicallyCorrectLights = true
    }

    resize(){

        this.instance.setSize( this.sizes.width , this.sizes.heigth)
        this.instance.setPixelRatio(Math.min( window.devicePixelRatio , 2));
    }

    update(){
        
        this.instance.render(this.scene , this.camera.instance)
    }
}