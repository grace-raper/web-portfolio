/**
 * RoomLoadAnimation.js
 * Handles the room loading animation sequence with all object reveals
 */

import GSAP from "gsap";
import config from "./configs/roomLoad.json";

export default class RoomLoadAnimation {
    /**
     * Initialize the animation
     * @param {Object} options - Animation options
     * @param {Object} options.roomChildren - Room child objects
     */
    constructor({ roomChildren }) {
        this.roomChildren = roomChildren;
        this.timeline = null;
        
        // Use the single config file
        this.config = config;
    }

    /**
     * Run the animation sequence
     * @returns {Promise} Resolves when animation completes
     */
    animate() {
        return new Promise((resolve) => {
            this.secondTimeline = new GSAP.timeline();

            // Dynamically add animations for all room elements from config
            const staggerTimings = this.config.roomElements.staggerTiming;
            
            // Loop through all the room elements defined in the config and scale them according to config timeline.
            Object.keys(staggerTimings).forEach(elementName => {
                // Check if the element exists in roomChildren
                if (this.roomChildren[elementName]) {
                    // Add animation for this element
                    this.secondTimeline.to(
                        this.roomChildren[elementName].scale,
                        this.config.roomElements.defaultScale,
                        staggerTimings[elementName]
                    );
                }
            });
            
            // Add chair rotation animation separately since it's a special case
            this.secondTimeline.to(
                this.roomChildren.chair_top.rotation,
                {
                    y: this.config.chairRotation.y,
                    ease: this.config.chairRotation.ease,
                    duration: this.config.chairRotation.duration,
                },
                this.config.chairRotation.delay
            ).eventCallback("onComplete", resolve);
            
        });
    }
}