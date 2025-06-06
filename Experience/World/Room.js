import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";

export default class Room {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;
        this.roomChildren = {};
        this.camera = this.experience.camera.perspectiveCamera;
        
        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };

        this.setModel();
        this.setAnimation();
        

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
            
            // Track mouse position for screen space picker
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Check for hover with screen space pickers
            this.checkScreenSpacePickerHover(this.mouseX, this.mouseY);
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

        // Update screen space pickers
        this.updateScreenSpacePickers();

        // Update debug visualization if enabled
        if (this.debugMode) {
            this.updateDebugVisualization();
            this.updateScreenSpaceDebugVisualization();
        }

        this.mixer.update(this.time.delta * 0.0009);
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
    
    // Setup screen space pickers for interactive objects
    setupScreenSpacePickers() {
        // Initialize mouse tracking
        this.mouseX = 0;
        this.mouseY = 0;
        this.onMouseMove();
        
        // Create screen space pickers for interactive objects
        this.createScreenSpacePickers();
        
        // Add click event listener
        window.addEventListener("click", (event) => {
            this.handleScreenSpaceClick(event.clientX, event.clientY);
        });
    }
    
    // Create screen space pickers for interactive objects
    createScreenSpacePickers() {
        // Clear any existing pickers
        this.screenSpacePickers = {};
        
        // Create pickers for each interactive object
        this.interactiveObjects.forEach(objectName => {
            const object = this.roomChildren[objectName.toLowerCase()];
            if (!object) {
                console.warn(`Object ${objectName} not found in roomChildren`);
                return;
            }
            
            // Create a screen space picker for this object
            this.createScreenSpacePicker(objectName.toLowerCase(), object);
        });
        
        console.log(`Created ${Object.keys(this.screenSpacePickers).length} screen space pickers`);
    }
    
    // Create a screen space picker for a specific object
    createScreenSpacePicker(key, object) {
        // Create a bounding box for the object
        const box = new THREE.Box3().setFromObject(object);
        
        // Assign different colors to different objects
        let color;
        switch(key) {
            case 'husky': color = new THREE.Color(0x00ff00); break; // Green
            case 'cessna': color = new THREE.Color(0x0000ff); break; // Blue
            case 'dslr': color = new THREE.Color(0xff0000); break; // Red
            case 'computer': color = new THREE.Color(0xffff00); break; // Yellow
            default: color = new THREE.Color(0xffffff); // White
        }
        
        // Store the picker data
        this.screenSpacePickers[key] = {
            object: object,
            box: box,
            color: color,
            isHovered: false
        };
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
    
    // Check if mouse is hovering over any screen space picker
    checkScreenSpacePickerHover(mouseX, mouseY) {
        // Reset cursor
        document.body.style.cursor = 'default';
        
        // Reset all hover states
        Object.keys(this.screenSpacePickers).forEach(key => {
            this.screenSpacePickers[key].isHovered = false;
        });
        
        // Check each picker
        for (const key in this.screenSpacePickers) {
            const picker = this.screenSpacePickers[key];
            const bounds = picker.bounds || this.getScreenSpaceBounds(picker.object);
            const isInside = this.isPointInScreenSpaceBounds(mouseX, mouseY, bounds);
            
            if (isInside) {
                // Set hover state
                picker.isHovered = true;
                document.body.style.cursor = 'pointer';
                break; // Only hover one object at a time
            }
        }
    }
    
    // Handle click on screen space pickers
    handleScreenSpaceClick(mouseX, mouseY) {
        for (const key in this.screenSpacePickers) {
            const picker = this.screenSpacePickers[key];
            const bounds = picker.bounds || this.getScreenSpaceBounds(picker.object);
            const isInside = this.isPointInScreenSpaceBounds(mouseX, mouseY, bounds);
            
            if (isInside) {
                // Handle the click event based on the object name
                this.handleObjectClick(picker.object);
                return;
            }
        }
    }
    
    // Update screen space pickers
    updateScreenSpacePickers() {
        // Update the bounds of each picker
        for (const key in this.screenSpacePickers) {
            const picker = this.screenSpacePickers[key];
            picker.bounds = this.getScreenSpaceBounds(picker.object);
        }
    }
    
    // Check if a point is inside the screen space bounds of an object
    isPointInScreenSpaceBounds(x, y, boundsOrObject) {
        // Get the screen space bounds of the object if an object is passed
        const bounds = boundsOrObject.minX !== undefined ? 
            boundsOrObject : this.getScreenSpaceBounds(boundsOrObject);
        
        // Check if the point is inside the bounds
        return (x >= bounds.minX && x <= bounds.maxX && 
                y >= bounds.minY && y <= bounds.maxY &&
                bounds.visible);
    }
    
    // Get screen space bounds of an object
    getScreenSpaceBounds(object) {
        // Create a box3 to get the object's dimensions
        const box = new THREE.Box3().setFromObject(object);
        
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
        
        // Check if object is behind the camera
        const isBehindCamera = screenMin.z > 1 || screenMax.z > 1;
        
        return {
            minX: Math.min(screenMinX, screenMaxX),
            minY: Math.min(screenMinY, screenMaxY),
            maxX: Math.max(screenMinX, screenMaxX),
            maxY: Math.max(screenMinY, screenMaxY),
            width: Math.abs(screenMaxX - screenMinX),
            height: Math.abs(screenMaxY - screenMinY),
            visible: !isBehindCamera
        };
    }
    
    // Setup debug mode toggle with keyboard
    setupDebugToggle() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'd' || event.key === 'D') {
                this.debugMode = !this.debugMode;
                console.log(`Debug mode ${this.debugMode ? 'enabled' : 'disabled'}`);
                
                if (this.debugMode) {
                    this.createDebugVisualization();
                } else {
                    this.removeDebugVisualization();
                }
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

    // Update positions of debug visualization elements
    updateDebugVisualization() {
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

    // Create debug visualization elements
    createDebugVisualization() {
        // Create a container for labels
        this.labelsContainer = document.createElement('div');
        this.labelsContainer.style.position = 'absolute';
        this.labelsContainer.style.top = '0px';
        this.labelsContainer.style.left = '0px';
        this.labelsContainer.style.width = '100%';
        this.labelsContainer.style.height = '100%';
        this.labelsContainer.style.pointerEvents = 'none';
        document.body.appendChild(this.labelsContainer);

        // Create debug elements for each object with a screen space picker
        this.screenSpaceDebugElements = {};

        // Create labels for each object
        Object.keys(this.screenSpacePickers).forEach(key => {
            const picker = this.screenSpacePickers[key];
            const object = picker.object;
            const labelDiv = document.createElement('div');
            labelDiv.style.position = 'absolute';
            labelDiv.style.color = '#ffffff';
            labelDiv.style.fontSize = '12px';
            labelDiv.style.fontFamily = 'monospace';
            labelDiv.style.textAlign = 'center';
            labelDiv.style.pointerEvents = 'none';
            labelDiv.textContent = `${object.name}`;
            this.labelsContainer.appendChild(labelDiv);
            this.labelDivs[key] = labelDiv;

            // Create debug element
            const debugElement = document.createElement('div');
            debugElement.style.position = 'absolute';
            debugElement.style.pointerEvents = 'auto'; // Enable click events
            debugElement.style.border = '1px solid red'; // Initial border
            debugElement.addEventListener('click', () => {
                console.log(`Clicked on ${object.name}`);
            });
            this.labelsContainer.appendChild(debugElement);
            this.screenSpaceDebugElements[key] = debugElement;
        });
    }

    // Update positions of screen space debug visualization elements
    updateScreenSpaceDebugVisualization() {
        Object.keys(this.screenSpaceDebugElements).forEach(key => {
            const picker = this.screenSpacePickers[key];
            if (!picker) {
                console.warn(`No picker found for ${key}`);
                return;
            }
            const bounds = picker.bounds || this.getScreenSpaceBounds(picker.object);
            const debugElement = this.screenSpaceDebugElements[key];
            debugElement.style.left = `${bounds.minX}px`;
            debugElement.style.top = `${bounds.minY}px`;
            debugElement.style.width = `${bounds.width}px`;
            debugElement.style.height = `${bounds.height}px`;
            debugElement.style.border = `1px solid ${picker.color.getStyle()}`;
            debugElement.style.display = bounds.visible ? 'block' : 'none';
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
