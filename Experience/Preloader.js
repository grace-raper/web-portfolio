import { EventEmitter } from "events";
import Experience from "./Experience.js";
import GSAP from "gsap";
import convert from "./Utils/covertDivsToSpans.js";
import CubeToRoomAnimation from "./Animations/CubeToRoomAnimation.js";
import RoomLoadAnimation from "./Animations/RoomLoadAnimation.js";
import SpinCubeAnimation from "./Animations/SpinCubeAnimation.js";

export default class Preloader extends EventEmitter {
    constructor() {
        super();
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.camera = this.experience.camera;
        this.world = this.experience.world;
        this.device = this.sizes.device;

        this.sizes.on("switchdevice", (device) => {
            this.device = device;
        });

        this.world.on("worldready", () => {
            this.setAssets();
            this.playIntro();
        });
    }

    setAssets() {
        convert(document.querySelector(".intro-text"));
        convert(document.querySelector(".hero-main-title"));
        convert(document.querySelector(".hero-main-description"));
        convert(document.querySelector(".hero-second-subheading"));
        convert(document.querySelector(".second-sub"));

        this.room = this.experience.world.room.actualRoom;
        this.roomChildren = this.experience.world.room.roomChildren;
        console.log(this.roomChildren);
    }

    firstIntro() {
        // Create and use the CubeToRoomAnimation class
        const cubeToRoomAnimation = new CubeToRoomAnimation({
            roomChildren: this.roomChildren,
            room: this.room,
            device: this.device
        });
        
        // Return the promise from the animation
        return cubeToRoomAnimation.animate();
    }

    fadeOutIntro() {
        return new Promise((resolve) => {
            const timeline = new GSAP.timeline();
            timeline
                .to(
                    ".intro-text .animatedis",
                    {
                        yPercent: 100,
                        stagger: 0.05,
                        ease: "back.in(1.7)",
                    },
                    "fadeout"
                )
                .to(
                    ".arrow-svg-wrapper",
                    {
                        opacity: 0,
                    },
                    "fadeout"
                )
                .eventCallback("onComplete", resolve);
        });
    }
    
    spinCube() {
        // Create and use the SpinCubeAnimation class
        const spinCubeAnimation = new SpinCubeAnimation({
            roomChildren: this.roomChildren,
            room: this.room,
            camera: this.camera
        });
        
        // Return the promise from the animation
        return spinCubeAnimation.animate();
    }
    
    loadRoom() {
        // Create and use the RoomLoadAnimation class
        const roomLoadAnimation = new RoomLoadAnimation({
            roomChildren: this.roomChildren
        });
        
        // Return the promise from the animation
        return roomLoadAnimation.animate();
    }

    // Event listener methods removed as we're now auto-transitioning between animations

    async playIntro() {
        this.scaleFlag = true;
        await this.firstIntro();
        this.moveFlag = true;
        
        // Automatically proceed to second intro after a short delay
        // instead of waiting for scroll event
        setTimeout(() => {
            this.playSecondIntro();
        }, 1000); // 1 second delay before auto-transitioning
    }
    async playSecondIntro() {
        this.moveFlag = false;
        
        // First fade out intro elements
        await this.fadeOutIntro();
        
        // Then spin the cube
        await this.spinCube();
        
        // Finally load the room
        await this.loadRoom();
        
        this.scaleFlag = false;
        this.emit("enablecontrols");
    }

    move() {
        if (this.device === "desktop") {
            this.room.position.set(-1, 0, 0);
        } else {
            this.room.position.set(0, 0, -1);
        }
    }

    scale() {
        this.roomChildren.rectLight.width = 0;
        this.roomChildren.rectLight.height = 0;

        if (this.device === "desktop") {
            this.room.scale.set(0.11, 0.11, 0.11);
        } else {
            this.room.scale.set(0.07, 0.07, 0.07);
        }
    }

    update() {
        if (this.moveFlag) {
            this.move();
        }

        if (this.scaleFlag) {
            this.scale();
        }
    }
}
