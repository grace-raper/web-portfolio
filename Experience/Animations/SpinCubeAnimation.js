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
                // Make body appear immediately with set instead of to
                .set(
                    this.roomChildren.body.scale,
                    {
                        x: this.config.body.scale.x,
                        y: this.config.body.scale.y,
                        z: this.config.body.scale.z
                    }
                )
                
                // Fix cube scaling with proper x, y, z properties
                .to(
                    this.roomChildren.cube.scale,
                    {
                        x: this.config.cube.finalScale.x,
                        y: this.config.cube.finalScale.y,
                        z: this.config.cube.finalScale.z,
                        duration: this.config.cube.finalScale.duration,
                        ease: this.config.cube.finalScale.ease || "power2.out",
                        onComplete: () => {
                            // Hide the cube immediately when scaling finishes
                            this.roomChildren.cube.visible = false;
                        }
                    },
                    "introtext"
                )
                
                // Final animation with immediate hiding of cube
                .eventCallback("onComplete", resolve);
                
            return this.timeline;
        });
    }
}
