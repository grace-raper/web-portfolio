import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Room {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;
        this.roomChildren = {};
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.camera = this.experience.camera.perspectiveCamera;
        
        // Debug visualization properties
        this.debugMode = false;
        this.objectHelpers = {};
        this.labelDivs = {};

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };

        this.setModel();
        this.setAnimation();
        this.onMouseMove();
        // Disabled click events to allow form interaction
        // this.setupClickEvents();
        
        // Log all room children with their positions
        this.logRoomChildren();
        
        // Add key listener for debug mode toggle
        this.setupDebugToggle();
    }

    setModel() {
        this.actualRoom.children.forEach((child) => {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child instanceof THREE.Group) {
                child.children.forEach((groupchild) => {
                    // console.log(groupchild.material);
                    groupchild.castShadow = true;
                    groupchild.receiveShadow = true;
                });
            }

            // console.log(child);

            // if (child.name === "Aquarium") {
            //     // console.log(child);
            //     child.children[0].material = new THREE.MeshPhysicalMaterial();
            //     child.children[0].material.roughness = 0;
            //     child.children[0].material.color.set(0x549dd2);
            //     child.children[0].material.ior = 3;
            //     child.children[0].material.transmission = 1;
            //     child.children[0].material.opacity = 1;
            //     child.children[0].material.depthWrite = false;
            //     child.children[0].material.depthTest = false;
            // }

            if (child.name === "Computer") {
                child.children[1].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen,
                });
            }

            if (child.name === "Mini_Floor") {
                child.position.x = -0.289521;
                child.position.z = 8.83572;
            }

            // if (
            //     child.name === "Mailbox" ||
            //     child.name === "Lamp" ||
            //     child.name === "FloorFirst" ||
            //     child.name === "FloorSecond" ||
            //     child.name === "FloorThird" ||
            //     child.name === "Dirt" ||
            //     child.name === "Flower1" ||
            //     child.name === "Flower2"
            // ) {
            //     child.scale.set(0, 0, 0);
            // }

            // Initially hide all objects until animation starts
            child.scale.set(0, 0, 0);
            
            // // Log important objects for debugging
            // if (['Phone', 'Husky', 'Cessna', 'Computer', 'Frame'].includes(child.name)) {
            //     console.log(`Found important object: ${child.name}`);
            //     console.log(`  Position: x=${child.position.x.toFixed(3)}, y=${child.position.y.toFixed(3)}, z=${child.position.z.toFixed(3)}`);
            // }
            if (child.name === "Cube") {
                // child.scale.set(1, 1, 1);
                child.position.set(0, -1, 0);
                child.rotation.y = Math.PI / 4;
            }

            this.roomChildren[child.name.toLowerCase()] = child;
        });

        const width = 0.5;
        const height = 0.7;
        const intensity = 1;
        const rectLight = new THREE.RectAreaLight(
            0xffffff,
            intensity,
            width,
            height
        );
        rectLight.position.set(7.68244, 7, 0.5);
        rectLight.rotation.x = -Math.PI / 2;
        rectLight.rotation.z = Math.PI / 4;
        this.actualRoom.add(rectLight);

        //this.actualRoom.add(this.resources.items.computer.scene)

        this.roomChildren["rectLight"] = rectLight;

        // const rectLightHelper = new RectAreaLightHelper(rectLight);
        // rectLight.add(rectLightHelper);
        // console.log(this.room);

        this.scene.add(this.actualRoom);
        // Set initial room scale small but not zero
        this.actualRoom.scale.set(0.11, 0.11, 0.11);
    }

    setAnimation() {
        this.mixer = new THREE.AnimationMixer(this.actualRoom);
        // this.swim = this.mixer.clipAction(this.room.animations[0]);
        // this.swim.play();
    }

    onMouseMove() {
        window.addEventListener("mousemove", (e) => {
            this.rotation =
                ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
            this.lerp.target = this.rotation * 0.05;
            
            // Update mouse position for raycaster
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
        });
    }

    resize() {}

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );

        this.actualRoom.rotation.y = this.lerp.current;

        this.mixer.update(this.time.delta * 0.0009);
        
        // Update raycaster for interactive elements
        this.updateRaycaster();
        
        // Update debug visualization if enabled
        if (this.debugMode) {
            this.updateDebugVisualization();
        }
    }
    
    // New method to log all room children with their positions
    logRoomChildren() {
        console.log("=== Room Children with Positions ===");
        Object.keys(this.roomChildren).forEach(key => {
            const child = this.roomChildren[key];
            console.log(`Name: ${child.name}`);
            console.log(`  Position: x=${child.position.x.toFixed(3)}, y=${child.position.y.toFixed(3)}, z=${child.position.z.toFixed(3)}`);
            console.log(`  World Position: ${this.getWorldPosition(child)}`);
        });
        console.log("=== End of Room Children List ===");
    }
    
    // Helper method to get world position of an object
    getWorldPosition(object) {
        const worldPosition = new THREE.Vector3();
        object.getWorldPosition(worldPosition);
        return `x=${worldPosition.x.toFixed(3)}, y=${worldPosition.y.toFixed(3)}, z=${worldPosition.z.toFixed(3)}`;
    }
    
    // Setup click events for interactive elements
    setupClickEvents() {
        window.addEventListener("click", (event) => {
            // Update mouse position
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            console.log(`Mouse position: x=${this.mouse.x.toFixed(3)}, y=${this.mouse.y.toFixed(3)}`);
            
            
        // Click events are disabled to allow form interaction
        // This method is intentionally empty to prevent click handling
        // that would interfere with the contact form
        return;
    }
            console.log(`Checking ${interactiveObjects.length} objects for intersection`);
            
            // Check for intersections with recursive flag set to true to check children
            const intersects = this.raycaster.intersectObjects(interactiveObjects, true);
            
            console.log(`Found ${intersects.length} intersections`);
            
            if (intersects.length > 0) {
                // Log all intersections for debugging
                intersects.forEach((intersection, index) => {
                    console.log(`Intersection ${index}:`, intersection.object.name || 'unnamed object');
                });
                
                // Get the first intersected object
                const object = this.getClickedObject(intersects[0].object);
                console.log("Clicked on:", object.name);
                
                // Handle the click event based on the object name
                this.handleObjectClick(object);
            } else {
                console.log("No intersections found");
                
                // Debug: Check distances and screen ranges for objects
                interactiveObjects.forEach(obj => {
                    const worldPos = new THREE.Vector3();
                    obj.getWorldPosition(worldPos);
                    
                    // Create a box3 to get the object's dimensions
                    const box = new THREE.Box3().setFromObject(obj);
                    
                    // Get min and max points in world space
                    const min = box.min;
                    const max = box.max;
                    
                    // Project min and max points to screen space
                    const screenMin = min.clone().project(this.camera);
                    const screenMax = max.clone().project(this.camera);
                    
                    // Convert to screen coordinates (0 to window width/height)
                    const screenMinX = (screenMin.x * 0.5 + 0.5) * window.innerWidth;
                    const screenMinY = (-screenMin.y * 0.5 + 0.5) * window.innerHeight;
                    const screenMaxX = (screenMax.x * 0.5 + 0.5) * window.innerWidth;
                    const screenMaxY = (-screenMax.y * 0.5 + 0.5) * window.innerHeight;
                    
                    // Calculate width and height on screen
                    const screenWidth = Math.abs(screenMaxX - screenMinX);
                    const screenHeight = Math.abs(screenMaxY - screenMinY);
                    
                    console.log(`${obj.name} world position: x=${worldPos.x.toFixed(3)}, y=${worldPos.y.toFixed(3)}, z=${worldPos.z.toFixed(3)}`);
                    console.log(`${obj.name} world dimensions: width=${(max.x-min.x).toFixed(3)}, height=${(max.y-min.y).toFixed(3)}, depth=${(max.z-min.z).toFixed(3)}`);
                    console.log(`${obj.name} screen range: x=[${screenMinX.toFixed(0)}-${screenMaxX.toFixed(0)}], y=[${screenMinY.toFixed(0)}-${screenMaxY.toFixed(0)}]`);
                    console.log(`${obj.name} screen size: width=${screenWidth.toFixed(0)}px, height=${screenHeight.toFixed(0)}px`);
                });
            }
        });
    }
    
    // Helper method to get the parent object with a name (if the clicked mesh is part of a group)
    getClickedObject(object) {
        console.log(`Finding named parent for: ${object.name || 'unnamed object'}`);
        
        // If the object has a name, return it
        if (object.name && object.name !== '') {
            console.log(`Found named object: ${object.name}`);
            return object;
        }
        
        // Otherwise, check if it has a parent with a name
        if (object.parent) {
            console.log(`Checking parent: ${object.parent.name || 'unnamed parent'}`);
            return this.getClickedObject(object.parent);
        }
        
        // If no named parent is found, return the original object
        console.log(`No named parent found, returning original object`);
        return object;
    }
    
    // Handle click events on objects
    handleObjectClick(object) {
        // Log all clicks to make sure the click detection is working
        console.log(`DEBUG: Object clicked: ${object.name}`);
        
        // You can add specific behavior for different objects here
        switch(object.name.toLowerCase()) {
            case 'computer':
                console.log('Computer clicked! Opening my portfolio website...');
                break;
            case 'cessna':
                console.log('Cessna clicked! I love aviation and flying!');
                break;
            case 'coffee':
                console.log('Coffee clicked! The fuel that powers my coding sessions.');
                break;
            case 'ghost_pacer':
                console.log('Ghost Pacer clicked! My AR running project.');
                break;
            case 'husky':
                console.log('Husky clicked! Go UW Huskies!');
                break;
            case 'phone':
                console.log('Phone clicked! Want to contact me?');
                break;
            case 'frame':
                console.log('Seattle Map clicked! This is where I live and work.');
                console.log('Map coordinates: 47.6062° N, 122.3321° W');
                break;
            case 'aquarium':
                console.log('Aquarium clicked! Maybe show some fish animation?');
                break;
            default:
                console.log(`Clicked on ${object.name}. No specific action defined yet.`);
        }
    }
    
    // Update raycaster for hover effects (optional)
    updateRaycaster() {
        // Set the raycaster from the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Create a list of specific objects we want to check
        const targetNames = ['phone', 'husky', 'cessna', 'computer', 'frame'];
        const interactiveObjects = [];
        
        // Find these objects in the room children
        targetNames.forEach(name => {
            const obj = this.roomChildren[name.toLowerCase()];
            if (obj) interactiveObjects.push(obj);
        });
        
        // Check for intersections with recursive flag set to true to check children
        const intersects = this.raycaster.intersectObjects(interactiveObjects, true);
        
        // Reset cursor
        document.body.style.cursor = 'default';
        
        // Change cursor if hovering over an interactive object
        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer';
        }
    }
    
    // Setup debug mode toggle with keyboard
    setupDebugToggle() {
        window.addEventListener("keydown", (event) => {
            // Toggle debug mode with 'D' key
            if (event.key === 'd' || event.key === 'D') {
                this.toggleDebugMode();
            }
        });
    }
    
    // Toggle debug visualization mode
    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        console.log(`Debug mode: ${this.debugMode ? 'ON' : 'OFF'}`);
        
        if (this.debugMode) {
            this.createDebugVisualization();
        } else {
            this.removeDebugVisualization();
        }
    }
    
    // Create debug visualization for specific interactive objects
    createDebugVisualization() {
        // Remove any existing helpers first
        this.removeDebugVisualization();
        
        // Create container for labels if it doesn't exist
        if (!this.labelsContainer) {
            this.labelsContainer = document.createElement('div');
            this.labelsContainer.style.position = 'absolute';
            this.labelsContainer.style.top = '0';
            this.labelsContainer.style.left = '0';
            this.labelsContainer.style.pointerEvents = 'none';
            this.labelsContainer.style.zIndex = '1000';
            document.body.appendChild(this.labelsContainer);
        }
        
        // List of specific objects to highlight
        const targetObjects = ['phone', 'husky', 'cessna', 'computer', 'frame'];
        
        // Create helpers only for target objects
        targetObjects.forEach(targetKey => {
            // Convert to lowercase to match the keys in roomChildren
            const key = targetKey.toLowerCase();
            const object = this.roomChildren[key];
            
            if (!object) {
                console.log(`Object not found: ${targetKey}`);
                return;
            }
            
            // Create a bounding box helper with a distinct color
            const box = new THREE.Box3().setFromObject(object);
            let color;
            
            // Assign different colors to different objects
            switch(key) {
                case 'phone': color = new THREE.Color(0xff0000); break; // Red
                case 'husky': color = new THREE.Color(0x00ff00); break; // Green
                case 'cessna': color = new THREE.Color(0x0000ff); break; // Blue
                case 'computer': color = new THREE.Color(0xffff00); break; // Yellow
                case 'frame': color = new THREE.Color(0xff00ff); break; // Purple
                default: color = new THREE.Color(0xffffff); // White
            }
            
            const helper = new THREE.Box3Helper(box, color);
            this.scene.add(helper);
            this.objectHelpers[key] = helper;
            
            // Create a more prominent label div for this object
            const labelDiv = document.createElement('div');
            labelDiv.textContent = object.name;
            labelDiv.style.position = 'absolute';
            labelDiv.style.backgroundColor = `rgba(${color.r*255}, ${color.g*255}, ${color.b*255}, 0.7)`;
            labelDiv.style.color = this.getContrastColor(color);
            labelDiv.style.padding = '8px';
            labelDiv.style.borderRadius = '5px';
            labelDiv.style.fontSize = '14px';
            labelDiv.style.fontWeight = 'bold';
            labelDiv.style.pointerEvents = 'none';
            labelDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
            this.labelsContainer.appendChild(labelDiv);
            this.labelDivs[key] = labelDiv;
        });
        
        console.log('Debug visualization created for specific objects. Press D to toggle off.');
    }
    
    // Update positions of debug visualization elements
    updateDebugVisualization() {
        // Update label positions
        Object.keys(this.labelDivs).forEach(key => {
            const object = this.roomChildren[key];
            if (!object) return;
            
            // Create a box3 to get the object's dimensions
            const box = new THREE.Box3().setFromObject(object);
            
            // Get world position
            const worldPos = new THREE.Vector3();
            object.getWorldPosition(worldPos);
            
            // Project 3D position to 2D screen coordinates
            const screenPos = worldPos.clone().project(this.camera);
            
            // Convert to CSS coordinates
            const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
            const y = (- screenPos.y * 0.5 + 0.5) * window.innerHeight;
            
            // Project min and max points to screen space
            const screenMin = box.min.clone().project(this.camera);
            const screenMax = box.max.clone().project(this.camera);
            
            // Convert to screen coordinates
            const screenMinX = (screenMin.x * 0.5 + 0.5) * window.innerWidth;
            const screenMinY = (-screenMin.y * 0.5 + 0.5) * window.innerHeight;
            const screenMaxX = (screenMax.x * 0.5 + 0.5) * window.innerWidth;
            const screenMaxY = (-screenMax.y * 0.5 + 0.5) * window.innerHeight;
            
            // Calculate width and height on screen
            const screenWidth = Math.abs(screenMaxX - screenMinX);
            const screenHeight = Math.abs(screenMaxY - screenMinY);
            
            // Update label position
            const labelDiv = this.labelDivs[key];
            labelDiv.style.transform = `translate(-50%, -50%)`;
            labelDiv.style.left = `${x}px`;
            labelDiv.style.top = `${y}px`;
            
            // Hide labels that are behind the camera
            if (screenPos.z > 1) {
                labelDiv.style.display = 'none';
            } else {
                labelDiv.style.display = 'block';
                
                // Add distance and size information to help with debugging
                const distance = worldPos.distanceTo(this.camera.position).toFixed(2);
                labelDiv.textContent = `${object.name}\nDist: ${distance}\nW: ${screenWidth.toFixed(0)}px\nH: ${screenHeight.toFixed(0)}px`;
            }
        });
    }
    
    // Remove all debug visualization elements
    removeDebugVisualization() {
        // Remove helpers
        Object.values(this.objectHelpers).forEach(helper => {
            this.scene.remove(helper);
        });
        this.objectHelpers = {};
        
        // Remove labels
        if (this.labelsContainer) {
            while (this.labelsContainer.firstChild) {
                this.labelsContainer.removeChild(this.labelsContainer.firstChild);
            }
            this.labelDivs = {};
        }
    }
    
    // todo: is this needed?
    // Helper method to determine text color based on background color
    getContrastColor(color) {
        // Calculate luminance - a measure of brightness
        const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
        
        // Use white text on dark backgrounds and black text on light backgrounds
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }
    
    /**
     * Creates a bounce animation for a specific object in the room
     * @param {string} objectName - Name of the object to animate (lowercase key in roomChildren)
     * @param {Object} options - Animation options
     * @returns {gsap.timeline} The animation timeline
     */
    bounceObject(objectName, options = {}) {
        const object = this.roomChildren[objectName];
        if (!object) {
            console.warn(`Object ${objectName} not found in roomChildren`);
            return null;
        }
        
        // Default options
        const defaults = {
            duration: 1.5,
            bounceHeight: 0.3,
            bounceTimes: 2,
            ease: "elastic.out(1, 0.3)",
            delay: 0.2,
            onComplete: null
        };
        
        // Merge defaults with provided options
        const config = {...defaults, ...options};
        
        // Store original position
        const originalY = object.position.y;
        
        // Create timeline
        const timeline = GSAP.timeline({
            onComplete: config.onComplete
        });
        
        // Add bounce animation
        timeline.to(object.position, {
            y: originalY + config.bounceHeight,
            duration: config.duration / 2,
            ease: "power2.out",
            delay: config.delay
        }).to(object.position, {
            y: originalY,
            duration: config.duration / 2,
            ease: config.ease
        });
        
        // Add additional bounces if needed
        for (let i = 1; i < config.bounceTimes; i++) {
            const scaleFactor = 1 - (i * 0.3); // Each bounce gets smaller
            timeline.to(object.position, {
                y: originalY + (config.bounceHeight * scaleFactor),
                duration: (config.duration / 2) * scaleFactor,
                ease: "power2.out"
            }).to(object.position, {
                y: originalY,
                duration: (config.duration / 2) * scaleFactor,
                ease: config.ease
            });
        }
        
        return timeline;
    }
    
    /**
     * Creates a looping bounce animation for a specific object that continues while in a section
     * @param {string} objectName - Name of the object to animate
     * @param {Object} options - Animation options
     * @returns {Object} Control object with start and stop methods
     */
    createLoopingBounce(objectName, options = {}) {
        // Default options
        const defaults = {
            duration: 1.5,
            bounceHeight: 0.3,
            bounceTimes: 2,
            ease: "elastic.out(1, 0.3)",
            delay: 0.2,
            loopInterval: 4 // Time between bounce sequences in seconds
        };
        
        // Merge defaults with provided options
        const config = {...defaults, ...options};
        
        // Create a control object to manage the loop
        const controller = {
            isActive: false,
            intervalId: null,
            
            // Start the looping animation
            start: () => {
                if (controller.isActive) return;
                
                controller.isActive = true;
                
                // Do an initial bounce immediately
                this.bounceObject(objectName, {
                    duration: config.duration,
                    bounceHeight: config.bounceHeight,
                    bounceTimes: config.bounceTimes,
                    ease: config.ease,
                    delay: 0 // No delay for first bounce
                });
                
                // Set up the interval for repeated bounces
                controller.intervalId = setInterval(() => {
                    if (!controller.isActive) return;
                    
                    this.bounceObject(objectName, {
                        duration: config.duration,
                        bounceHeight: config.bounceHeight,
                        bounceTimes: config.bounceTimes,
                        ease: config.ease,
                        delay: 0 // No delay for looped bounces
                    });
                }, config.loopInterval * 1000);
            },
            
            // Stop the looping animation
            stop: () => {
                if (!controller.isActive) return;
                
                controller.isActive = false;
                
                if (controller.intervalId) {
                    clearInterval(controller.intervalId);
                    controller.intervalId = null;
                }
            }
        };
        
        return controller;
    }
}
