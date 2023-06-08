import EventEmitter from './EventEmitter.js';

export default class Sizes extends EventEmitter{

    constructor(){

        // parent 

        super()

        // options

        this.width = window.innerWidth;
        this.heigth = window.innerHeight;
        this.pixelRatio = Math.min( window.devicePixelRatio , 2 );

        // resize event 
        window.addEventListener('resize', ()=>{

            this.width = window.innerWidth;
            this.heigth = window.innerHeight;
            this.pixelRatio = Math.min( window.devicePixelRatio , 2 );

            this.trigger('resize')
        })
    }
}