import * as THREE from "three";
import Experience from "../Experience.js";

export default class ScreenSpacePicker {
    constructor(room) {
        this.room = room;
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.perspectiveCamera;
        
        // Initialize properties
        this.mouse = new THREE.Vector2(-1, -1);
        this.interactiveObjects = [];
        this.objectScreenBounds = new Map(); // Map to store screen bounds of objects
        
        // Debug visualization
        this.debugMode = false;
        this.debugElements = {
            container: null,
            objectBoxes: [],
            mouseIndicator: null,
            positionLabel: null
        };
        
        // Create debug visualization container
        this.createDebugContainer();
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    createDebugContainer() {
        // Create container for debug elements
        this.debugElements.container = document.createElement('div');
        this.debugElements.container.style.position = 'absolute';
        this.debugElements.container.style.top = '0';
        this.debugElements.container.style.left = '0';
        this.debugElements.container.style.width = '100%';
        this.debugElements.container.style.height = '100%';
        this.debugElements.container.style.pointerEvents = 'none';
        this.debugElements.container.style.zIndex = '1000';
        this.debugElements.container.style.display = 'none';
        document.body.appendChild(this.debugElements.container);
        
        // Create mouse indicator
        this.debugElements.mouseIndicator = document.createElement('div');
        this.debugElements.mouseIndicator.style.position = 'absolute';
        this.debugElements.mouseIndicator.style.width = '10px';
        this.debugElements.mouseIndicator.style.height = '10px';
        this.debugElements.mouseIndicator.style.borderRadius = '50%';
        this.debugElements.mouseIndicator.style.backgroundColor = 'red';
        this.debugElements.mouseIndicator.style.transform = 'translate(-50%, -50%)';
        this.debugElements.container.appendChild(this.debugElements.mouseIndicator);
        
        // Create position label
        this.debugElements.positionLabel = document.createElement('div');
        this.debugElements.positionLabel.style.position = 'absolute';
        this.debugElements.positionLabel.style.bottom = '20px';
        this.debugElements.positionLabel.style.left = '20px';
        this.debugElements.positionLabel.style.background = 'rgba(0,0,0,0.7)';
        this.debugElements.positionLabel.style.color = 'white';
        this.debugElements.positionLabel.style.padding = '10px';
        this.debugElements.positionLabel.style.fontFamily = 'monospace';
        this.debugElements.positionLabel.style.fontSize = '14px';
        this.debugElements.positionLabel.style.borderRadius = '4px';
        document.body.appendChild(this.debugElements.positionLabel);
        this.debugElements.positionLabel.style.display = 'none';
    }
    
    setupEventListeners() {
        // Mouse move event
        window.addEventListener('mousemove', this.onMouseMove = (e) => {
            if (this.room.preventRaycasterUpdates) return;
            
            // Update mouse coordinates
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Update debug mouse indicator if debug mode is on
            if (this.debugMode) {
                this.debugElements.mouseIndicator.style.left = `${this.mouse.x}px`;
                this.debugElements.mouseIndicator.style.top = `${this.mouse.y}px`;
            }
            
            // Check for hover
            this.checkHover();
        });
        
        // Click event
        window.addEventListener('click', this.onClick = (e) => {
            // Skip if interaction is prevented
            if (this.room.preventRaycasterUpdates) return;
            
            // Update mouse position
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Check for click
            this.checkClick();
        });
        
        // Debug toggle
        window.addEventListener('keydown', this.onKeyDown = (e) => {
            if (e.key === 'd' || e.key === 'D') {
                this.toggleDebugMode();
            }
        });
    }
    
    setInteractiveObjects(objects) {
        this.interactiveObjects = objects;
        
        // Update screen bounds on next frame
        requestAnimationFrame(() => this.updateAllScreenBounds());
    }
    
    updateAllScreenBounds() {
        // Clear previous bounds
        this.objectScreenBounds.clear();
        
        // Calculate screen bounds for each object
        this.interactiveObjects.forEach(object => {
            this.updateObjectScreenBounds(object);
        });
        
        // Update debug visualization if enabled
        if (this.debugMode) {
            this.updateDebugVisualization();
        }
    }
    
    updateObjectScreenBounds(object) {
        // Create a bounding box for the object
        const boundingBox = new THREE.Box3().setFromObject(object);
        
        // Get the eight corners of the bounding box
        const corners = [
            new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z),
            new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.max.z),
            new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.min.z),
            new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.max.z),
            new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.min.z),
            new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.max.z),
            new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.min.z),
            new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z)
        ];
        
        // Project each corner to screen space
        const screenCorners = corners.map(corner => {
            const screenPosition = corner.clone().project(this.camera);
            return {
                x: (screenPosition.x * 0.5 + 0.5) * window.innerWidth,
                y: (-screenPosition.y * 0.5 + 0.5) * window.innerHeight,
                z: screenPosition.z // Keep z for depth testing
            };
        });
        
        // Find the min and max screen coordinates
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        let minZ = Infinity; // For depth testing
        
        screenCorners.forEach(corner => {
            minX = Math.min(minX, corner.x);
            minY = Math.min(minY, corner.y);
            maxX = Math.max(maxX, corner.x);
            maxY = Math.max(maxY, corner.y);
            minZ = Math.min(minZ, corner.z);
        });
        
        // Store the screen bounds
        this.objectScreenBounds.set(object, {
            minX, minY, maxX, maxY, minZ,
            width: maxX - minX,
            height: maxY - minY,
            center: {
                x: (minX + maxX) / 2,
                y: (minY + maxY) / 2
            },
            visible: minZ < 1 // Object is in front of the camera
        });
    }
    
    checkHover() {
        // Skip if no objects
        if (this.interactiveObjects.length === 0) {
            document.body.style.cursor = 'auto';
            return;
        }
        
        // Update all screen bounds
        this.updateAllScreenBounds();
        
        // Check if mouse is over any object
        let hoveredObject = null;
        let closestZ = Infinity;
        
        for (const [object, bounds] of this.objectScreenBounds.entries()) {
            // Skip if not visible
            if (!bounds.visible) continue;
            
            // Check if mouse is within bounds
            if (this.mouse.x >= bounds.minX && this.mouse.x <= bounds.maxX &&
                this.mouse.y >= bounds.minY && this.mouse.y <= bounds.maxY) {
                
                // Take the closest object (smallest Z)
                if (bounds.minZ < closestZ) {
                    hoveredObject = object;
                    closestZ = bounds.minZ;
                }
            }
        }
        
        // Update cursor style
        document.body.style.cursor = hoveredObject ? 'pointer' : 'auto';
        
        // Update debug info
        if (this.debugMode && hoveredObject) {
            const bounds = this.objectScreenBounds.get(hoveredObject);
            this.debugElements.positionLabel.textContent = 
                `Hover: ${hoveredObject.name || 'Unnamed'}\n` +
                `Bounds: ${Math.round(bounds.minX)},${Math.round(bounds.minY)} to ${Math.round(bounds.maxX)},${Math.round(bounds.maxY)}\n` +
                `Mouse: ${Math.round(this.mouse.x)},${Math.round(this.mouse.y)}`;
        }
    }
    
    checkClick() {
        // Skip if no objects
        if (this.interactiveObjects.length === 0) return;
        
        // Update all screen bounds
        this.updateAllScreenBounds();
        
        // Check if mouse is over any object
        let clickedObject = null;
        let closestZ = Infinity;
        
        for (const [object, bounds] of this.objectScreenBounds.entries()) {
            // Skip if not visible
            if (!bounds.visible) continue;
            
            // Check if mouse is within bounds
            if (this.mouse.x >= bounds.minX && this.mouse.x <= bounds.maxX &&
                this.mouse.y >= bounds.minY && this.mouse.y <= bounds.maxY) {
                
                // Take the closest object (smallest Z)
                if (bounds.minZ < closestZ) {
                    clickedObject = object;
                    closestZ = bounds.minZ;
                }
            }
        }
        
        // Handle click if object found
        if (clickedObject) {
            this.handleObjectClick(clickedObject);
        }
    }
    
    handleObjectClick(object) {
        if (!object) return;
        
        if (this.debugMode) {
            console.log(`Clicked on object: ${object.name}`);
        }
        
        // Handle specific object interactions
        switch (object.name.toLowerCase()) {
            case 'mailbox':
                window.open('mailto:grace@example.com', '_blank');
                break;
            case 'computer':
                window.open('https://github.com/graceraper', '_blank');
                break;
            case 'book':
                window.open('https://graceraper.com/blog', '_blank');
                break;
            default:
                if (this.debugMode) {
                    console.log(`No specific action for ${object.name}`);
                }
        }
    }
    
    update() {
        if (this.room.preventRaycasterUpdates) return;
        
        // Update screen bounds periodically (not every frame for performance)
        if (this.debugMode || Math.random() < 0.05) { // Update ~5% of frames or always in debug mode
            this.updateAllScreenBounds();
        }
        
        // Update debug visualization if enabled
        if (this.debugMode) {
            this.updateDebugVisualization();
        }
    }
    
    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        
        if (this.debugMode) {
            console.log('Screen Space Picker: Debug mode enabled');
            this.debugElements.container.style.display = 'block';
            this.debugElements.positionLabel.style.display = 'block';
            this.updateDebugVisualization();
        } else {
            console.log('Screen Space Picker: Debug mode disabled');
            this.debugElements.container.style.display = 'none';
            this.debugElements.positionLabel.style.display = 'none';
            this.clearDebugVisualization();
        }
    }
    
    updateDebugVisualization() {
        // Clear previous visualization
        this.clearDebugVisualization();
        
        // Create boxes for each object
        this.objectScreenBounds.forEach((bounds, object) => {
            // Skip if not visible
            if (!bounds.visible) return;
            
            // Create box element
            const box = document.createElement('div');
            box.style.position = 'absolute';
            box.style.left = `${bounds.minX}px`;
            box.style.top = `${bounds.minY}px`;
            box.style.width = `${bounds.width}px`;
            box.style.height = `${bounds.height}px`;
            box.style.border = '2px solid yellow';
            box.style.boxSizing = 'border-box';
            box.style.pointerEvents = 'none';
            
            // Create label
            const label = document.createElement('div');
            label.style.position = 'absolute';
            label.style.top = '-20px';
            label.style.left = '0';
            label.style.background = 'rgba(0,0,0,0.7)';
            label.style.color = 'white';
            label.style.padding = '2px 5px';
            label.style.fontSize = '12px';
            label.style.fontFamily = 'monospace';
            label.style.whiteSpace = 'nowrap';
            label.textContent = object.name || 'Unnamed';
            
            // Add label to box
            box.appendChild(label);
            
            // Add box to container
            this.debugElements.container.appendChild(box);
            this.debugElements.objectBoxes.push(box);
        });
    }
    
    clearDebugVisualization() {
        // Remove all object boxes
        this.debugElements.objectBoxes.forEach(box => {
            if (box.parentNode) {
                box.parentNode.removeChild(box);
            }
        });
        this.debugElements.objectBoxes = [];
    }
    
    dispose() {
        // Remove event listeners
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('click', this.onClick);
        window.removeEventListener('keydown', this.onKeyDown);
        
        // Remove debug elements
        if (this.debugElements.container && this.debugElements.container.parentNode) {
            this.debugElements.container.parentNode.removeChild(this.debugElements.container);
        }
        
        if (this.debugElements.positionLabel && this.debugElements.positionLabel.parentNode) {
            this.debugElements.positionLabel.parentNode.removeChild(this.debugElements.positionLabel);
        }
    }
}
