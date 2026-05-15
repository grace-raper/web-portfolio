function createPipelineFlowchart() {
    const container = document.getElementById('pipeline-flowchart');
    
    const svg = `
<svg viewBox="0 0 2000 3700" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#424242" />
        </marker>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
    </defs>
    
    <!-- Title -->
    <text x="1000" y="40" class="title" font-size="28" text-anchor="middle" fill="url(#grad1)" font-weight="bold">Image Event Grouping Pipeline</text>
    <text x="1000" y="70" class="small" text-anchor="middle" fill="#666" font-size="14">Click any stage to learn more</text>
    
    <!-- Input Image -->
    <g class="interactive-element" data-section="input">
        <rect x="850" y="100" width="300" height="80" class="box" rx="8"/>
        <text x="1000" y="135" class="title" text-anchor="middle" font-size="16">📸 Input Image</text>
        <text x="1000" y="160" class="small" text-anchor="middle">New photo to process</text>
    </g>
    
    <path d="M 1000 180 L 1000 230" class="arrow"/>
    
    <!-- Pre-processing -->
    <g class="interactive-element" data-section="preprocessing">
        <rect x="800" y="230" width="400" height="80" class="process" rx="8"/>
        <text x="1000" y="265" class="title" text-anchor="middle" font-size="16">🔍 Pre-Processing</text>
        <text x="1000" y="290" class="small" text-anchor="middle">Validation • Metadata • Scaling</text>
    </g>
    
    <path d="M 1000 310 L 1000 360" class="arrow"/>
    
    <!-- Feature Extraction Hub -->
    <g class="interactive-element" data-section="feature-extraction">
        <rect x="300" y="360" width="1400" height="80" class="decision" rx="8"/>
        <text x="1000" y="395" class="title" text-anchor="middle" font-size="18" font-weight="bold">⚡ Feature Extraction (Parallel Processes)</text>
        <text x="1000" y="420" class="small" text-anchor="middle">All 6 processes run simultaneously</text>
    </g>
    
    <!-- 6 Parallel Feature Extraction Boxes (Same Row) -->
    <path d="M 400 440 L 400 490" class="arrow"/>
    <path d="M 600 440 L 600 490" class="arrow"/>
    <path d="M 800 440 L 800 490" class="arrow"/>
    <path d="M 1000 440 L 1000 490" class="arrow"/>
    <path d="M 1200 440 L 1200 490" class="arrow"/>
    <path d="M 1400 440 L 1400 490" class="arrow"/>
    
    <!-- 1. Metadata -->
    <g class="interactive-element" data-section="metadata">
        <rect x="300" y="490" width="200" height="120" class="data" rx="8"/>
        <text x="400" y="520" class="title" text-anchor="middle" font-size="14">📋 Metadata</text>
        <text x="400" y="540" class="small" text-anchor="middle" font-size="11">EXIF • Dates</text>
        <text x="400" y="555" class="small" text-anchor="middle" font-size="11">GPS • Names</text>
        <text x="400" y="570" class="small" text-anchor="middle" font-size="11">Aspect Ratio</text>
        <text x="400" y="585" class="small" text-anchor="middle" font-size="11">Camera Info</text>
    </g>
    
    <!-- 2. Face Detection -->
    <g class="interactive-element" data-section="face-detection">
        <rect x="520" y="490" width="200" height="120" class="process" rx="8"/>
        <text x="620" y="520" class="title" text-anchor="middle" font-size="14">👤 Face Detection</text>
        <text x="620" y="540" class="small" text-anchor="middle" font-size="11">AWS Rekognition</text>
        <text x="620" y="555" class="small" text-anchor="middle" font-size="11">512-dim embeddings</text>
        <text x="620" y="570" class="small" text-anchor="middle" font-size="11">Age • Emotions</text>
        <text x="620" y="585" class="small" text-anchor="middle" font-size="11">Quality Metrics</text>
    </g>
    
    <!-- 3. YOLO Object/Person Detection -->
    <g class="interactive-element" data-section="yolo-detection">
        <rect x="740" y="490" width="200" height="120" class="process" rx="8"/>
        <text x="840" y="520" class="title" text-anchor="middle" font-size="14">🎯 YOLO Detection</text>
        <text x="840" y="540" class="small" text-anchor="middle" font-size="11">Object Detection</text>
        <text x="840" y="555" class="small" text-anchor="middle" font-size="11">Person Detection</text>
        <text x="840" y="570" class="small" text-anchor="middle" font-size="11">Bounding Boxes</text>
        <text x="840" y="585" class="small" text-anchor="middle" font-size="11">Segmentation</text>
    </g>
    
    <!-- 4. Image Embeddings -->
    <g class="interactive-element" data-section="image-embeddings">
        <rect x="960" y="490" width="200" height="120" class="process" rx="8"/>
        <text x="1060" y="520" class="title" text-anchor="middle" font-size="14">🖼️ Image Embed</text>
        <text x="1060" y="540" class="small" text-anchor="middle" font-size="11">CLIP Vectors</text>
        <text x="1060" y="555" class="small" text-anchor="middle" font-size="11">Whole Image</text>
        <text x="1060" y="570" class="small" text-anchor="middle" font-size="11">512-dim</text>
        <text x="1060" y="585" class="small" text-anchor="middle" font-size="11">Composition</text>
    </g>
    
    <!-- 5. Semantic LLM -->
    <g class="interactive-element" data-section="semantic-descriptions">
        <rect x="1180" y="490" width="200" height="120" class="mllm" rx="8"/>
        <text x="1280" y="520" class="title" text-anchor="middle" font-size="14">💬 Semantic LLM</text>
        <text x="1280" y="540" class="small" text-anchor="middle" font-size="11">Event Desc</text>
        <text x="1280" y="555" class="small" text-anchor="middle" font-size="11">Background Desc</text>
        <text x="1280" y="570" class="small" text-anchor="middle" font-size="11">Photo Desc</text>
        <text x="1280" y="585" class="small" text-anchor="middle" font-size="11">→ 3 embeddings</text>
    </g>
    
    <!-- 6. OCR Text -->
    <g class="interactive-element" data-section="text-extraction">
        <rect x="1400" y="490" width="200" height="120" class="process" rx="8"/>
        <text x="1500" y="520" class="title" text-anchor="middle" font-size="14">📝 OCR Text</text>
        <text x="1500" y="540" class="small" text-anchor="middle" font-size="11">Timestamps</text>
        <text x="1500" y="555" class="small" text-anchor="middle" font-size="11">Captions</text>
        <text x="1500" y="570" class="small" text-anchor="middle" font-size="11">Signs</text>
        <text x="1500" y="585" class="small" text-anchor="middle" font-size="11">Handwriting</text>
    </g>
    
    <!-- YOLO Branches -->
    <path d="M 840 610 L 840 660" class="arrow"/>
    
    <g class="interactive-element" data-section="yolo-branches">
        <rect x="690" y="660" width="300" height="60" class="decision" rx="8"/>
        <text x="840" y="690" class="title" text-anchor="middle" font-size="14">Split Detection Results</text>
    </g>
    
    <path d="M 740 720 L 640 770" class="arrow"/>
    <path d="M 940 720 L 1040 770" class="arrow"/>
    
    <!-- General Objects Branch -->
    <g class="interactive-element" data-section="general-objects">
        <rect x="490" y="770" width="300" height="80" class="data" rx="8"/>
        <text x="640" y="800" class="title" text-anchor="middle" font-size="14">📦 General Objects</text>
        <text x="640" y="820" class="small" text-anchor="middle" font-size="11">Keywords: car, tree, cake, etc</text>
        <text x="640" y="835" class="small" text-anchor="middle" font-size="11">Bounding boxes stored</text>
    </g>
    
    <!-- People Detection Branch -->
    <g class="interactive-element" data-section="people-detection">
        <rect x="890" y="770" width="300" height="80" class="process" rx="8"/>
        <text x="1040" y="800" class="title" text-anchor="middle" font-size="14">🚶 Detected People</text>
        <text x="1040" y="820" class="small" text-anchor="middle" font-size="11">Body bounding boxes</text>
        <text x="1040" y="835" class="small" text-anchor="middle" font-size="11">Crop for outfit analysis</text>
    </g>
    
    <!-- Outfit Analysis -->
    <path d="M 1040 850 L 1040 900" class="arrow"/>
    
    <g class="interactive-element" data-section="outfit-analysis">
        <rect x="840" y="900" width="400" height="100" class="mllm" rx="8"/>
        <text x="1040" y="930" class="title" text-anchor="middle" font-size="16">👔 Outfit Analysis (MLLM)</text>
        <text x="1040" y="955" class="small" text-anchor="middle" font-size="11">Structured descriptions • Multi-label tags • Text embeddings</text>
        <text x="1040" y="970" class="small" text-anchor="middle" font-size="11">Weighted MLB matching • Validation</text>
        <text x="1040" y="985" class="small" text-anchor="middle" font-size="11">768-dim vectors from clothing descriptions</text>
    </g>
    
    <!-- Convergence to Neo4j Graph 1 -->
    <path d="M 400 610 L 400 1080 L 600 1080" class="arrow"/>
    <path d="M 620 610 L 620 1080 L 650 1080" class="arrow"/>
    <path d="M 640 850 L 640 1080 L 700 1080" class="arrow"/>
    <path d="M 1040 1000 L 1040 1080 L 900 1080" class="arrow"/>
    <path d="M 1060 610 L 1060 1080 L 950 1080" class="arrow"/>
    <path d="M 1280 610 L 1280 1080 L 1000 1080" class="arrow"/>
    <path d="M 1500 610 L 1500 1080 L 1050 1080" class="arrow"/>
    
    <!-- Neo4j Graph Database 1 (with visual graph) -->
    <g class="interactive-element" data-section="neo4j-graph-1">
        <rect x="400" y="1080" width="800" height="280" class="graph" rx="8"/>
        <text x="800" y="1110" class="title" text-anchor="middle" font-size="18" font-weight="bold">🕸️ Neo4j Graph Database (Initial)</text>
        <text x="800" y="1135" class="small" text-anchor="middle" font-size="12">Store extracted features and create initial relationships</text>
        
        <!-- Visual Graph Structure -->
        <!-- Image Node -->
        <circle cx="550" cy="1200" r="35" fill="#667eea" stroke="#333" stroke-width="2"/>
        <text x="550" y="1205" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Image</text>
        
        <!-- Face Nodes -->
        <circle cx="750" cy="1160" r="30" fill="#f59e0b" stroke="#333" stroke-width="2"/>
        <text x="750" y="1165" text-anchor="middle" fill="white" font-size="11" font-weight="bold">Face</text>
        
        <circle cx="750" cy="1240" r="30" fill="#f59e0b" stroke="#333" stroke-width="2"/>
        <text x="750" y="1245" text-anchor="middle" fill="white" font-size="11" font-weight="bold">Face</text>
        
        <!-- Relationships -->
        <path d="M 585 1195 L 720 1165" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
        <text x="650" y="1175" font-size="10" fill="#333">[:IN_IMAGE]</text>
        
        <path d="M 585 1205 L 720 1235" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
        <text x="650" y="1230" font-size="10" fill="#333">[:IN_IMAGE]</text>
        
        <!-- Properties Box -->
        <rect x="850" y="1150" width="320" height="180" fill="#f8f9fa" stroke="#667eea" stroke-width="1" rx="4"/>
        <text x="1010" y="1170" text-anchor="middle" font-size="12" font-weight="bold" fill="#667eea">Node Properties</text>
        
        <text x="860" y="1190" font-size="10" fill="#333"><tspan font-weight="bold">Image:</tspan> path, date, GPS, aspect_ratio,</text>
        <text x="860" y="1205" font-size="10" fill="#333">camera_make, keywords, embeddings</text>
        
        <text x="860" y="1225" font-size="10" fill="#333"><tspan font-weight="bold">Face:</tspan> bbox, embedding[512], age_range,</text>
        <text x="860" y="1240" font-size="10" fill="#333">gender, emotions, quality, landmarks</text>
        
        <text x="860" y="1260" font-size="10" fill="#333"><tspan font-weight="bold">Object:</tspan> type, bbox, confidence</text>
        
        <text x="860" y="1280" font-size="10" fill="#333"><tspan font-weight="bold">Outfit:</tspan> description, tags, embedding[768]</text>
        
        <text x="420" y="1300" font-size="11" fill="#333" font-style="italic">At this stage: Images linked to Faces, but no Person nodes yet</text>
    </g>
    
    <path d="M 800 1360 L 800 1410" class="arrow"/>
    
    <!-- User Input -->
    <g class="interactive-element" data-section="user-input">
        <rect x="550" y="1410" width="500" height="100" class="box" rx="8" stroke="#10b981" stroke-width="3"/>
        <text x="800" y="1440" class="title" text-anchor="middle" font-size="18" font-weight="bold">👤 User Input</text>
        <text x="800" y="1465" class="small" text-anchor="middle" font-size="12">Family tree & relationships</text>
        <text x="800" y="1485" class="small" text-anchor="middle" font-size="12">Manual face labeling: "This is Grace", "This is Ava"</text>
        <text x="800" y="1500" class="small" text-anchor="middle" font-size="12">Bootstrap person identification</text>
    </g>
    
    <path d="M 800 1510 L 800 1560" class="arrow"/>
    
    <!-- Neo4j Graph 2 (Person Nodes Added) -->
    <g class="interactive-element" data-section="neo4j-graph-2">
        <rect x="400" y="1560" width="800" height="280" class="graph" rx="8"/>
        <text x="800" y="1590" class="title" text-anchor="middle" font-size="18" font-weight="bold">🕸️ Neo4j Graph (Person Nodes Created)</text>
        <text x="800" y="1615" class="small" text-anchor="middle" font-size="12">Face clustering + user labels → Person nodes</text>
        
        <!-- Visual Graph Structure with Person -->
        <!-- Image Node -->
        <circle cx="500" cy="1700" r="35" fill="#667eea" stroke="#333" stroke-width="2"/>
        <text x="500" y="1705" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Image</text>
        
        <!-- Face Nodes -->
        <circle cx="700" cy="1660" r="30" fill="#f59e0b" stroke="#333" stroke-width="2"/>
        <text x="700" y="1665" text-anchor="middle" fill="white" font-size="11" font-weight="bold">Face</text>
        
        <circle cx="700" cy="1740" r="30" fill="#f59e0b" stroke="#333" stroke-width="2"/>
        <text x="700" y="1745" text-anchor="middle" fill="white" font-size="11" font-weight="bold">Face</text>
        
        <!-- Person Nodes -->
        <circle cx="950" cy="1660" r="35" fill="#10b981" stroke="#333" stroke-width="2"/>
        <text x="950" y="1660" text-anchor="middle" fill="white" font-size="10" font-weight="bold">Person</text>
        <text x="950" y="1673" text-anchor="middle" fill="white" font-size="9">"Grace"</text>
        
        <circle cx="950" cy="1740" r="35" fill="#10b981" stroke="#333" stroke-width="2"/>
        <text x="950" y="1740" text-anchor="middle" fill="white" font-size="10" font-weight="bold">Person</text>
        <text x="950" y="1753" text-anchor="middle" fill="white" font-size="9">"Ava"</text>
        
        <!-- Relationships -->
        <path d="M 535 1695 L 670 1665" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
        <text x="600" y="1675" font-size="10" fill="#333">[:IN_IMAGE]</text>
        
        <path d="M 535 1705 L 670 1735" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
        <text x="600" y="1730" font-size="10" fill="#333">[:IN_IMAGE]</text>
        
        <path d="M 730 1660 L 915 1660" stroke="#10b981" stroke-width="3" marker-end="url(#arrowhead)"/>
        <text x="820" y="1655" font-size="11" fill="#10b981" font-weight="bold">[:IS_PERSON]</text>
        
        <path d="M 730 1740 L 915 1740" stroke="#10b981" stroke-width="3" marker-end="url(#arrowhead)"/>
        <text x="820" y="1735" font-size="11" fill="#10b981" font-weight="bold">[:IS_PERSON]</text>
        
        <!-- Properties Box -->
        <rect x="450" y="1780" width="700" height="45" fill="#f8f9fa" stroke="#10b981" stroke-width="1" rx="4"/>
        <text x="800" y="1798" text-anchor="middle" font-size="11" fill="#333"><tspan font-weight="bold">Person:</tspan> name, birth_date, family_relations, representative_face_id</text>
        <text x="800" y="1813" text-anchor="middle" font-size="11" fill="#333">Aggregated from multiple Face nodes via clustering + user labels</text>
    </g>
    
    <path d="M 800 1840 L 800 1890" class="arrow"/>
    
    <!-- Relationship Finding Header -->
    <g class="interactive-element" data-section="relationship-finding">
        <rect x="300" y="1890" width="1000" height="70" class="decision" rx="8"/>
        <text x="800" y="1920" class="title" text-anchor="middle" font-size="18" font-weight="bold">🔍 Multi-Stage Relationship Finding</text>
        <text x="800" y="1945" class="small" text-anchor="middle" font-size="12">Create weighted edges between images using multiple signals</text>
    </g>
    
    <path d="M 800 1960 L 800 2010" class="arrow"/>
    
    <!-- Relationship Finding Steps (4 boxes in 1 row) -->
    <path d="M 350 2010 L 350 2060" class="arrow"/>
    <path d="M 650 2010 L 650 2060" class="arrow"/>
    <path d="M 950 2010 L 950 2060" class="arrow"/>
    <path d="M 1250 2010 L 1250 2060" class="arrow"/>
    
    <!-- All 4 boxes on same horizontal level -->
    <g class="interactive-element" data-section="knn-matching">
        <rect x="200" y="2060" width="300" height="100" class="matching" rx="8"/>
        <text x="350" y="2090" class="title" text-anchor="middle" font-size="14" font-weight="bold">🔍 KNN Embedding</text>
        <text x="350" y="2110" class="small" text-anchor="middle" font-size="10">K-Nearest Neighbors:</text>
        <text x="350" y="2125" class="small" text-anchor="middle" font-size="10">Outfit • Face • Image</text>
        <text x="350" y="2140" class="small" text-anchor="middle" font-size="10">Event • Background</text>
        <text x="350" y="2155" class="small" text-anchor="middle" font-size="10">Description embeddings</text>
    </g>
    
    <g class="interactive-element" data-section="people-matching">
        <rect x="520" y="2060" width="300" height="100" class="matching" rx="8"/>
        <text x="670" y="2090" class="title" text-anchor="middle" font-size="14" font-weight="bold">👥 People Set</text>
        <text x="670" y="2110" class="small" text-anchor="middle" font-size="10">Age-aware comparison</text>
        <text x="670" y="2125" class="small" text-anchor="middle" font-size="10">Person popularity</text>
        <text x="670" y="2140" class="small" text-anchor="middle" font-size="10">weighting</text>
        <text x="670" y="2155" class="small" text-anchor="middle" font-size="10">Prevent aging FPs</text>
    </g>
    
    <g class="interactive-element" data-section="temporal-matching">
        <rect x="840" y="2060" width="300" height="100" class="matching" rx="8"/>
        <text x="990" y="2090" class="title" text-anchor="middle" font-size="14" font-weight="bold">📅 Temporal</text>
        <text x="990" y="2110" class="small" text-anchor="middle" font-size="10">Date/time proximity</text>
        <text x="990" y="2125" class="small" text-anchor="middle" font-size="10">Aspect ratio</text>
        <text x="990" y="2140" class="small" text-anchor="middle" font-size="10">bucketing</text>
        <text x="990" y="2155" class="small" text-anchor="middle" font-size="10">Era pre-filtering</text>
    </g>
    
    <g class="interactive-element" data-section="location-matching">
        <rect x="1160" y="2060" width="300" height="100" class="matching" rx="8"/>
        <text x="1310" y="2090" class="title" text-anchor="middle" font-size="14" font-weight="bold">📍 Location</text>
        <text x="1310" y="2110" class="small" text-anchor="middle" font-size="10">GPS coordinate</text>
        <text x="1310" y="2125" class="small" text-anchor="middle" font-size="10">clustering</text>
        <text x="1310" y="2140" class="small" text-anchor="middle" font-size="10">Background similarity</text>
        <text x="1310" y="2155" class="small" text-anchor="middle" font-size="10">Venue recognition</text>
    </g>
    
    <!-- Convergence -->
    <path d="M 350 2160 L 600 2230" class="arrow"/>
    <path d="M 670 2160 L 750 2230" class="arrow"/>
    <path d="M 990 2160 L 850 2230" class="arrow"/>
    <path d="M 1310 2160 L 1000 2230" class="arrow"/>
    
    <!-- Neo4j Graph 3 (Enriched Relationships) -->
    <g class="interactive-element" data-section="neo4j-graph-3">
        <rect x="300" y="2230" width="1000" height="280" class="graph" rx="8"/>
        <text x="800" y="2260" class="title" text-anchor="middle" font-size="18" font-weight="bold">🕸️ Neo4j Graph (Enriched Relationships)</text>
        <text x="800" y="2285" class="small" text-anchor="middle" font-size="12">Weighted edges from multiple matching signals</text>
        
        <!-- Complex graph visualization -->
        <circle cx="500" cy="2370" r="30" fill="#667eea" stroke="#333" stroke-width="2"/>
        <text x="500" y="2375" text-anchor="middle" fill="white" font-size="10">Img 1</text>
        
        <circle cx="700" cy="2330" r="30" fill="#667eea" stroke="#333" stroke-width="2"/>
        <text x="700" y="2335" text-anchor="middle" fill="white" font-size="10">Img 2</text>
        
        <circle cx="700" cy="2410" r="30" fill="#667eea" stroke="#333" stroke-width="2"/>
        <text x="700" y="2415" text-anchor="middle" fill="white" font-size="10">Img 3</text>
        
        <circle cx="900" cy="2370" r="30" fill="#667eea" stroke="#333" stroke-width="2"/>
        <text x="900" y="2375" text-anchor="middle" fill="white" font-size="10">Img 4</text>
        
        <circle cx="1100" cy="2370" r="30" fill="#667eea" stroke="#333" stroke-width="2"/>
        <text x="1100" y="2375" text-anchor="middle" fill="white" font-size="10">Img 5</text>
        
        <!-- Weighted edges -->
        <path d="M 530 2365 L 670 2335" stroke="#ef4444" stroke-width="4" opacity="0.7"/>
        <text x="600" y="2345" font-size="9" fill="#ef4444" font-weight="bold">0.92</text>
        
        <path d="M 530 2375 L 670 2405" stroke="#f59e0b" stroke-width="3" opacity="0.7"/>
        <text x="600" y="2395" font-size="9" fill="#f59e0b" font-weight="bold">0.78</text>
        
        <path d="M 730 2335 L 870 2365" stroke="#ef4444" stroke-width="4" opacity="0.7"/>
        <text x="800" y="2345" font-size="9" fill="#ef4444" font-weight="bold">0.89</text>
        
        <path d="M 730 2405 L 870 2375" stroke="#10b981" stroke-width="2" opacity="0.7"/>
        <text x="800" y="2395" font-size="9" fill="#10b981" font-weight="bold">0.65</text>
        
        <path d="M 930 2370 L 1070 2370" stroke="#f59e0b" stroke-width="3" opacity="0.7"/>
        <text x="1000" y="2365" font-size="9" fill="#f59e0b" font-weight="bold">0.81</text>
        
        <!-- Legend -->
        <rect x="320" y="2440" width="960" height="55" fill="#f8f9fa" stroke="#667eea" stroke-width="1" rx="4"/>
        <text x="800" y="2458" text-anchor="middle" font-size="11" fill="#333"><tspan font-weight="bold">Relationship Types:</tspan> SIMILAR_OUTFIT, SIMILAR_PEOPLE, SIMILAR_LOCATION, SIMILAR_TIME,</text>
        <text x="800" y="2473" text-anchor="middle" font-size="11" fill="#333">SIMILAR_EVENT, SIMILAR_BACKGROUND, SIMILAR_IMAGE (all with weight property 0.0-1.0)</text>
        <text x="800" y="2488" text-anchor="middle" font-size="11" fill="#333"><tspan font-weight="bold">Edge Weight:</tspan> Combined confidence from multiple signals</text>
    </g>
    
    <path d="M 800 2510 L 800 2560" class="arrow"/>
    
    <!-- Leiden Community Detection -->
    <g class="interactive-element" data-section="leiden">
        <rect x="500" y="2560" width="600" height="100" class="decision" rx="8"/>
        <text x="800" y="2590" class="title" text-anchor="middle" font-size="18" font-weight="bold">🔬 Leiden Community Detection</text>
        <text x="800" y="2615" class="small" text-anchor="middle" font-size="12">Graph algorithm finds densely connected clusters</text>
        <text x="800" y="2635" class="small" text-anchor="middle" font-size="12">Each community = likely event</text>
        <text x="800" y="2650" class="small" text-anchor="middle" font-size="12">Generate: date range, location, attendees, caption</text>
    </g>
    
    <path d="M 800 2660 L 800 2710" class="arrow"/>
    
    <!-- Human in the Loop -->
    <g class="interactive-element" data-section="human-review">
        <rect x="450" y="2710" width="700" height="110" class="process" rx="8" stroke="#10b981" stroke-width="3"/>
        <text x="800" y="2740" class="title" text-anchor="middle" font-size="18" font-weight="bold">👤 Human-in-the-Loop Review</text>
        <text x="800" y="2765" class="small" text-anchor="middle" font-size="12">Present suggested events to user for verification</text>
        <text x="800" y="2785" class="small" text-anchor="middle" font-size="12">Actions: ✅ Confirm • ❌ Remove • ➕ Add • 📝 Edit • 🔀 Split • 🔗 Merge</text>
        <text x="800" y="2805" class="small" text-anchor="middle" font-size="12">Feedback loop: corrections → update graph → retrain → improve</text>
    </g>
    
    <path d="M 800 2820 L 800 2870" class="arrow"/>
    
    <!-- Final Neo4j Graph with Events -->
    <g class="interactive-element" data-section="neo4j-graph-final">
        <rect x="300" y="2870" width="1000" height="300" class="graph" rx="8" stroke="#10b981" stroke-width="3"/>
        <text x="800" y="2900" class="title" text-anchor="middle" font-size="18" font-weight="bold">🕸️ Final Neo4j Graph (Event Nodes)</text>
        <text x="800" y="2925" class="small" text-anchor="middle" font-size="12">Images organized into confirmed events</text>
        
        <!-- Event-based graph -->
        <!-- Event 1 -->
        <circle cx="450" cy="3010" r="40" fill="#10b981" stroke="#333" stroke-width="3"/>
        <text x="450" y="3005" text-anchor="middle" fill="white" font-size="11" font-weight="bold">Event</text>
        <text x="450" y="3020" text-anchor="middle" fill="white" font-size="9">Christmas</text>
        
        <circle cx="350" cy="3090" r="25" fill="#667eea" stroke="#333" stroke-width="2"/>
        <text x="350" y="3095" text-anchor="middle" fill="white" font-size="9">Img</text>
        
        <circle cx="450" cy="3090" r="25" fill="#667eea" stroke="#333" stroke-width="2"/>
        <text x="450" y="3095" text-anchor="middle" fill="white" font-size="9">Img</text>
        
        <circle cx="550" cy="3090" r="25" fill="#667eea" stroke="#333" stroke-width="2"/>
        <text x="550" y="3095" text-anchor="middle" fill="white" font-size="9">Img</text>
        
        <path d="M 360 3070 L 430 3040" stroke="#10b981" stroke-width="3" marker-end="url(#arrowhead)"/>
        <path d="M 450 3070 L 450 3050" stroke="#10b981" stroke-width="3" marker-end="url(#arrowhead)"/>
        <path d="M 540 3070 L 470 3040" stroke="#10b981" stroke-width="3" marker-end="url(#arrowhead)"/>
        
        <!-- Event 2 -->
        <circle cx="800" cy="3010" r="40" fill="#10b981" stroke="#333" stroke-width="3"/>
        <text x="800" y="3005" text-anchor="middle" fill="white" font-size="11" font-weight="bold">Event</text>
        <text x="800" y="3020" text-anchor="middle" fill="white" font-size="9">Birthday</text>
        
        <circle cx="700" cy="3090" r="25" fill="#667eea" stroke="#333" stroke-width="2"/>
        <text x="700" y="3095" text-anchor="middle" fill="white" font-size="9">Img</text>
        
        <circle cx="800" cy="3090" r="25" fill="#667eea" stroke="#333" stroke-width="2"/>
        <text x="800" y="3095" text-anchor="middle" fill="white" font-size="9">Img</text>
        
        <circle cx="900" cy="3090" r="25" fill="#667eea" stroke="#333" stroke-width="2"/>
        <text x="900" y="3095" text-anchor="middle" fill="white" font-size="9">Img</text>
        
        <path d="M 710 3070 L 780 3040" stroke="#10b981" stroke-width="3" marker-end="url(#arrowhead)"/>
        <path d="M 800 3070 L 800 3050" stroke="#10b981" stroke-width="3" marker-end="url(#arrowhead)"/>
        <path d="M 890 3070 L 820 3040" stroke="#10b981" stroke-width="3" marker-end="url(#arrowhead)"/>
        
        <!-- Event 3 -->
        <circle cx="1150" cy="3010" r="40" fill="#10b981" stroke="#333" stroke-width="3"/>
        <text x="1150" y="3005" text-anchor="middle" fill="white" font-size="11" font-weight="bold">Event</text>
        <text x="1150" y="3020" text-anchor="middle" fill="white" font-size="9">Vacation</text>
        
        <circle cx="1050" cy="3090" r="25" fill="#667eea" stroke="#333" stroke-width="2"/>
        <text x="1050" y="3095" text-anchor="middle" fill="white" font-size="9">Img</text>
        
        <circle cx="1150" cy="3090" r="25" fill="#667eea" stroke="#333" stroke-width="2"/>
        <text x="1150" y="3095" text-anchor="middle" fill="white" font-size="9">Img</text>
        
        <circle cx="1250" cy="3090" r="25" fill="#667eea" stroke="#333" stroke-width="2"/>
        <text x="1250" y="3095" text-anchor="middle" fill="white" font-size="9">Img</text>
        
        <path d="M 1060 3070 L 1130 3040" stroke="#10b981" stroke-width="3" marker-end="url(#arrowhead)"/>
        <path d="M 1150 3070 L 1150 3050" stroke="#10b981" stroke-width="3" marker-end="url(#arrowhead)"/>
        <path d="M 1240 3070 L 1170 3040" stroke="#10b981" stroke-width="3" marker-end="url(#arrowhead)"/>
        
        <text x="800" y="2980" text-anchor="middle" font-size="10" fill="#333">[:IN_EVENT] relationships</text>
        
        <!-- Properties -->
        <rect x="320" y="3120" width="960" height="35" fill="#f8f9fa" stroke="#10b981" stroke-width="1" rx="4"/>
        <text x="800" y="3138" text-anchor="middle" font-size="11" fill="#333"><tspan font-weight="bold">Event:</tspan> name, date_range, location, attendees[], caption, confidence_score</text>
        <text x="800" y="3150" text-anchor="middle" font-size="10" fill="#333" font-style="italic">User-verified and refined through human-in-the-loop process</text>
    </g>
    
    <path d="M 800 3170 L 800 3220" class="arrow"/>
    
    <!-- Output -->
    <g class="interactive-element" data-section="output">
        <rect x="550" y="3220" width="500" height="90" class="box" rx="8" stroke="#10b981" stroke-width="3"/>
        <text x="800" y="3255" class="title" text-anchor="middle" font-size="18" font-weight="bold">✅ Grouped Events</text>
        <text x="800" y="3280" class="small" text-anchor="middle" font-size="12">Organized image collections by event</text>
        <text x="800" y="3300" class="small" text-anchor="middle" font-size="12">Timeline view • Grid view • People filter • Export options</text>
    </g>
    
    <!-- Legend -->
    <text x="200" y="3550" class="title" font-size="16" font-weight="bold">Legend:</text>
    <rect x="200" y="3565" width="120" height="40" class="box" rx="5"/>
    <text x="260" y="3590" class="small" text-anchor="middle" font-size="11">Input/Output</text>
    
    <rect x="340" y="3565" width="120" height="40" class="process" rx="5"/>
    <text x="400" y="3590" class="small" text-anchor="middle" font-size="11">Processing</text>
    
    <rect x="480" y="3565" width="120" height="40" class="decision" rx="5"/>
    <text x="540" y="3590" class="small" text-anchor="middle" font-size="11">Decision</text>
    
    <rect x="620" y="3565" width="120" height="40" class="data" rx="5"/>
    <text x="680" y="3590" class="small" text-anchor="middle" font-size="11">Data Store</text>
    
    <rect x="760" y="3565" width="120" height="40" class="mllm" rx="5"/>
    <text x="820" y="3590" class="small" text-anchor="middle" font-size="11">MLLM</text>
    
    <rect x="900" y="3565" width="120" height="40" class="graph" rx="5"/>
    <text x="960" y="3590" class="small" text-anchor="middle" font-size="11">Graph DB</text>
    
    <rect x="1040" y="3565" width="120" height="40" class="matching" rx="5"/>
    <text x="1100" y="3590" class="small" text-anchor="middle" font-size="11">Matching</text>
</svg>
    `;
    
    container.innerHTML = svg;
}
