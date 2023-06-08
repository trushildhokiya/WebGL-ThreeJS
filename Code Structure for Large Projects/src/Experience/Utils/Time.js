import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter{

    constructor(){

        super()

        // setup

        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0
        this.delta = 16 // default for 60Hz display

        window.requestAnimationFrame(()=>{
            this.tick();
        })
    }

    tick(){
        
        // calculate delta on each frame

        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        
        this.elapsed = this.current - this.start

        // call tick on each frame

        window.requestAnimationFrame(()=>{
            this.tick()
        })

        // Event Emitter

        this.trigger('tick');
    }
}