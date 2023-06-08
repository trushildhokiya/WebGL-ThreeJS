import * as THREE from "three" 
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import EventEmitter from "./EventEmitter";

export default class Resources extends EventEmitter{

    constructor(sources){

        super()

        
        this.sources = sources
        
        // setup

        this.items= {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoader()
        this.setLoading()
    }


    setLoader(){

        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
    }

    setLoading(){

        // for each item

        for( const source of this.sources){
            
            if( source.type === "gltfModel"){
                
                this.loaders.gltfLoader.load(
                    source.path,
                    (file)=>{
                        this.sourceLoaded(file,source);
                    }
                )
            }

            else if (source.type === "texture"){

                this.loaders.textureLoader.load(
                    source.path,
                    (file)=>{
                        this.sourceLoaded(file,source);
                    }
                )
            }

            else if (source.type === "cubeTexture"){

                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file)=>{
                        this.sourceLoaded(file,source);
                    }
                )
            }
        }
    }


    sourceLoaded(file,source){

        this.items[source.name] = file
        this.loaded++

        if(this.loaded === this.toLoad){
            
            this.trigger('ready')
        }
    }
}