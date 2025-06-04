import GSAP from "gsap";
import config from "./configs/spinCube.json";

export default class SpinCubeAnimation {
    /**
     * Initialize the cube spinning animation
     * @param {Object} options - Animation options
     * @param {Object} options.roomChildren - Room child objects
     * @param {Object} options.room - Room object
     * @param {Object} options.camera - Camera object with orthographicCamera
     */
    constructor({ roomChildren, room, camera }) {
        this.roomChildren = roomChildren;
        this.room = room;
        this.camera = camera;
        this.timeline = null;
        
        // Use the single config file
        this.config = config;
    }

    animate() {
        return new Promise((resolve) => {
            this.timeline = new GSAP.timeline();
            
            // Cube spinning and positioning animation using config values
            this.timeline
                .to(
                    this.room.position,
                    this.config.room.position,
                    "same"
                )
                .to(
                    this.roomChildren.cube.rotation,
                    this.config.cube.rotation,
                    "same"
                )
                .to(
                    this.roomChildren.cube.scale,
                    this.config.cube.scale,
                    "same"
                )
                .to(
                    this.camera.orthographicCamera.position,
                    this.config.camera.position,
                    "same"
                )
                .to(
                    this.roomChildren.cube.position,
                    this.config.cube.position,
                    "same"
                )
                .set(this.roomChildren.body.scale, this.config.body.scale)
                .to(
                    this.roomChildren.cube.scale,
                    this.config.cube.finalScale,
                    "introtext"
                )
                .eventCallback("onComplete", resolve);
                
            return this.timeline;
        });
    }
}
