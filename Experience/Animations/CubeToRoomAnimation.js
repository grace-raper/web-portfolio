/**
 * CubeToRoomAnimation.js
 * Handles the initial cube-to-room animation sequence
 * Uses configuration from JSON files for desktop and mobile animations
 */

import GSAP from "gsap";

// Import animation configuration
import desktopConfig from './configs/cubeToRoomDesktop.json';
import mobileConfig from './configs/cubeToRoomMobile.json';

export default class CubeToRoomAnimation {
    /**
     * Initialize the animation
     * @param {Object} options - Animation options
     * @param {Object} options.roomChildren - Room child objects
     * @param {Object} options.room - Room object
     * @param {String} options.device - Device type (desktop/mobile)
     */
    constructor({ roomChildren, room, device }) {
        this.roomChildren = roomChildren;
        this.room = room;
        this.device = device;
        this.timeline = null;
        
        // Load the appropriate configuration based on device
        this.config = this.device === "desktop" ? desktopConfig : mobileConfig;
    }

    /**
     * Run the animation sequence
     * @returns {Promise} Resolves when animation completes
     */
    animate() {
        return new Promise((resolve) => {
            this.timeline = new GSAP.timeline();
            
            // Apply common configurations
            this.timeline.set(".animatedis", this.config.animatedis);
            
            // Preloader animation
            this.timeline.to(".preloader", {
                ...this.config.preloader,
                onComplete: () => {
                    document
                        .querySelector(".preloader")
                        .classList.add("hidden");
                },
            });
            
            // Apply device-specific animations
            this.timeline
                .to(this.roomChildren.cube.scale, this.config.cube.scale)
                .to(this.room.position, this.config.room.position);
            
            // Common final animations
            this.timeline
                .to(".intro-text .animatedis", this.config.introText)
                .eventCallback("onComplete", resolve);

        });
    }
}