function createInfrastructureFlowchart() {
    const container = document.getElementById('infrastructure-flowchart');
    
    const svg = `
<svg viewBox="0 0 2000 3100" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#424242" />
        </marker>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
        </linearGradient>
    </defs>
    
    <!-- Title -->
    <text x="1000" y="40" class="title" font-size="28" text-anchor="middle" fill="url(#grad2)" font-weight="bold">AWS Services & Database Architecture</text>
    <text x="1000" y="70" class="small" text-anchor="middle" fill="#666" font-size="14">Lambda • DynamoDB • OpenSearch • Neo4j • S3 • SageMaker • Bedrock</text>
    
    <!-- Authentication & User Services (Left Side) -->
    <g class="interactive-element" data-section="auth-services">
        <rect x="50" y="120" width="280" height="120" fill="#e0f2fe" stroke="#0284c7" stroke-width="3" rx="8"/>
        <text x="190" y="150" class="title" text-anchor="middle" font-size="16" font-weight="bold">🔐 Authentication</text>
        <text x="190" y="175" class="small" text-anchor="middle" font-size="11">Amazon Cognito</text>
        <text x="190" y="190" class="small" text-anchor="middle" font-size="11">User Pools • JWT Tokens</text>
        <text x="190" y="205" class="small" text-anchor="middle" font-size="11">MFA • Social Login</text>
        <text x="190" y="220" class="small" text-anchor="middle" font-size="11">User Preferences (DynamoDB)</text>
    </g>
    
    <!-- Consent & Audit Tracking (Left Side) -->
    <g class="interactive-element" data-section="consent-tracking">
        <rect x="50" y="260" width="280" height="120" fill="#fef3c7" stroke="#d97706" stroke-width="3" rx="8"/>
        <text x="190" y="290" class="title" text-anchor="middle" font-size="16" font-weight="bold">📋 Consent & Audit</text>
        <text x="190" y="315" class="small" text-anchor="middle" font-size="11">Face Recognition Consent</text>
        <text x="190" y="330" class="small" text-anchor="middle" font-size="11">DynamoDB Consent Table</text>
        <text x="190" y="345" class="small" text-anchor="middle" font-size="11">CloudWatch Logs</text>
        <text x="190" y="360" class="small" text-anchor="middle" font-size="11">Status Tracking (DynamoDB)</text>
    </g>
    
    <!-- Input Image -->
    <g class="interactive-element" data-section="infra-input">
        <rect x="700" y="100" width="300" height="80" class="box" rx="8"/>
        <text x="850" y="135" class="title" text-anchor="middle" font-size="16">📸 Input Image</text>
        <text x="850" y="160" class="small" text-anchor="middle" font-size="11">API Gateway + S3 Presigned URLs</text>
    </g>
    
    <path d="M 850 180 L 850 230" class="arrow"/>
    
    <!-- Pre-processing -->
    <g class="interactive-element" data-section="infra-preprocessing">
        <rect x="650" y="230" width="400" height="80" class="process" rx="8"/>
        <text x="850" y="265" class="title" text-anchor="middle" font-size="16">🔍 Pre-Processing</text>
        <text x="850" y="290" class="small" text-anchor="middle" font-size="11">Lambda (preprocessor) • S3 Events • EventBridge</text>
    </g>
    
    <path d="M 850 310 L 850 360" class="arrow"/>
    
    <!-- Step Functions Orchestration -->
    <g class="interactive-element" data-section="step-functions">
        <rect x="1400" y="360" width="280" height="140" fill="#f3e8ff" stroke="#9333ea" stroke-width="3" rx="8"/>
        <text x="1540" y="390" class="title" text-anchor="middle" font-size="16" font-weight="bold">⚙️ Step Functions</text>
        <text x="1540" y="415" class="small" text-anchor="middle" font-size="11"><tspan font-weight="bold">Orchestration & Retry</tspan></text>
        <text x="1540" y="435" class="small" text-anchor="middle" font-size="10">Parallel state for 6</text>
        <text x="1540" y="450" class="small" text-anchor="middle" font-size="10">feature extractions</text>
        <text x="1540" y="465" class="small" text-anchor="middle" font-size="10">Wait for completion</text>
        <text x="1540" y="480" class="small" text-anchor="middle" font-size="10">Automatic retries</text>
    </g>
    
    <!-- SQS/SNS Status Updates -->
    <g class="interactive-element" data-section="status-updates">
        <rect x="1400" y="520" width="280" height="140" fill="#fef3c7" stroke="#d97706" stroke-width="3" rx="8"/>
        <text x="1540" y="550" class="title" text-anchor="middle" font-size="16" font-weight="bold">📬 Status Updates</text>
        <text x="1540" y="575" class="small" text-anchor="middle" font-size="11"><tspan font-weight="bold">SQS + SNS</tspan></text>
        <text x="1540" y="595" class="small" text-anchor="middle" font-size="10">Processing status</text>
        <text x="1540" y="610" class="small" text-anchor="middle" font-size="10">User notifications</text>
        <text x="1540" y="625" class="small" text-anchor="middle" font-size="10">Email/push alerts</text>
        <text x="1540" y="640" class="small" text-anchor="middle" font-size="10">DLQs for failures</text>
    </g>
    
    <!-- PostHog Analytics -->
    <g class="interactive-element" data-section="analytics">
        <rect x="1400" y="680" width="280" height="100" fill="#e0f2fe" stroke="#0284c7" stroke-width="3" rx="8"/>
        <text x="1540" y="710" class="title" text-anchor="middle" font-size="16" font-weight="bold">📊 PostHog Analytics</text>
        <text x="1540" y="735" class="small" text-anchor="middle" font-size="10">User behavior tracking</text>
        <text x="1540" y="750" class="small" text-anchor="middle" font-size="10">Feature usage metrics</text>
        <text x="1540" y="765" class="small" text-anchor="middle" font-size="10">Performance monitoring</text>
    </g>
    
    <!-- Feature Extraction Hub -->
    <g class="interactive-element" data-section="infra-feature-extraction">
        <rect x="300" y="360" width="1000" height="80" class="decision" rx="8"/>
        <text x="800" y="395" class="title" text-anchor="middle" font-size="18" font-weight="bold">⚡ Feature Extraction (Parallel)</text>
        <text x="800" y="420" class="small" text-anchor="middle" font-size="11">Step Functions Parallel State + 6 Lambda Functions + SQS Queues</text>
    </g>
    
    <!-- 6 Parallel Feature Extraction Boxes -->
    <path d="M 400 440 L 400 490" class="arrow"/>
    <path d="M 550 440 L 550 490" class="arrow"/>
    <path d="M 700 440 L 700 490" class="arrow"/>
    <path d="M 850 440 L 850 490" class="arrow"/>
    <path d="M 1000 440 L 1000 490" class="arrow"/>
    <path d="M 1150 440 L 1150 490" class="arrow"/>
    
    <!-- 1. Metadata -->
    <g class="interactive-element" data-section="infra-metadata">
        <rect x="300" y="490" width="200" height="120" class="data" rx="8"/>
        <text x="400" y="520" class="title" text-anchor="middle" font-size="14">📋 Metadata</text>
        <text x="400" y="540" class="small" text-anchor="middle" font-size="10">Lambda (Python)</text>
        <text x="400" y="555" class="small" text-anchor="middle" font-size="10">Pillow/exiftool</text>
        <text x="400" y="570" class="small" text-anchor="middle" font-size="10">→ DynamoDB (status)</text>
        <text x="400" y="585" class="small" text-anchor="middle" font-size="10">→ Neo4j</text>
    </g>
    
    <!-- 2. Face Detection -->
    <g class="interactive-element" data-section="infra-face-detection">
        <rect x="520" y="490" width="200" height="120" class="process" rx="8"/>
        <text x="620" y="520" class="title" text-anchor="middle" font-size="14">👤 Face Detection</text>
        <text x="620" y="540" class="small" text-anchor="middle" font-size="10">Lambda (2GB, 300s)</text>
        <text x="620" y="555" class="small" text-anchor="middle" font-size="10">AWS Rekognition</text>
        <text x="620" y="570" class="small" text-anchor="middle" font-size="10">→ Neo4j (faces)</text>
        <text x="620" y="585" class="small" text-anchor="middle" font-size="10">→ OpenSearch (vectors)</text>
    </g>
    
    <!-- 3. YOLO Detection -->
    <g class="interactive-element" data-section="infra-yolo">
        <rect x="740" y="490" width="200" height="120" class="process" rx="8"/>
        <text x="840" y="520" class="title" text-anchor="middle" font-size="14">🎯 YOLO Detection</text>
        <text x="840" y="540" class="small" text-anchor="middle" font-size="10">Lambda (3GB, 900s)</text>
        <text x="840" y="555" class="small" text-anchor="middle" font-size="10">SageMaker Endpoint</text>
        <text x="840" y="570" class="small" text-anchor="middle" font-size="10">ml.g4dn.xlarge GPU</text>
        <text x="840" y="585" class="small" text-anchor="middle" font-size="10">→ S3 crops</text>
    </g>
    
    <!-- 4. Image Embeddings -->
    <g class="interactive-element" data-section="infra-image-embed">
        <rect x="960" y="490" width="200" height="120" class="process" rx="8"/>
        <text x="1060" y="520" class="title" text-anchor="middle" font-size="14">🖼️ Image Embed</text>
        <text x="1060" y="540" class="small" text-anchor="middle" font-size="10">Lambda (2GB, 180s)</text>
        <text x="1060" y="555" class="small" text-anchor="middle" font-size="10">CLIP model</text>
        <text x="1060" y="570" class="small" text-anchor="middle" font-size="10">SageMaker (optional)</text>
        <text x="1060" y="585" class="small" text-anchor="middle" font-size="10">→ OpenSearch (vectors)</text>
    </g>
    
    <!-- 5. Semantic LLM -->
    <g class="interactive-element" data-section="infra-semantic">
        <rect x="1180" y="490" width="200" height="120" class="mllm" rx="8"/>
        <text x="1280" y="520" class="title" text-anchor="middle" font-size="14">💬 Semantic LLM</text>
        <text x="1280" y="540" class="small" text-anchor="middle" font-size="10">Lambda (1GB, 300s)</text>
        <text x="1280" y="555" class="small" text-anchor="middle" font-size="10">Bedrock (Claude)</text>
        <text x="1280" y="570" class="small" text-anchor="middle" font-size="10">Prompt caching</text>
        <text x="1280" y="585" class="small" text-anchor="middle" font-size="10">→ OpenSearch (vectors)</text>
    </g>
    
    <!-- 6. OCR Text -->
    <g class="interactive-element" data-section="infra-ocr">
        <rect x="1400" y="490" width="200" height="120" class="process" rx="8"/>
        <text x="1500" y="520" class="title" text-anchor="middle" font-size="14">📝 OCR Text</text>
        <text x="1500" y="540" class="small" text-anchor="middle" font-size="10">Lambda (1GB, 120s)</text>
        <text x="1500" y="555" class="small" text-anchor="middle" font-size="10">AWS Textract</text>
        <text x="1500" y="570" class="small" text-anchor="middle" font-size="10">or Tesseract</text>
        <text x="1500" y="585" class="small" text-anchor="middle" font-size="10">→ DynamoDB</text>
    </g>
    
    <!-- YOLO Branches -->
    <path d="M 840 610 L 840 660" class="arrow"/>
    
    <g class="interactive-element" data-section="infra-yolo-split">
        <rect x="690" y="660" width="300" height="60" class="decision" rx="8"/>
        <text x="840" y="690" class="title" text-anchor="middle" font-size="14">Split Detection Results</text>
        <text x="840" y="710" class="small" text-anchor="middle" font-size="10">Lambda processing logic</text>
    </g>
    
    <path d="M 740 720 L 640 770" class="arrow"/>
    <path d="M 940 720 L 1040 770" class="arrow"/>
    
    <!-- General Objects -->
    <g class="interactive-element" data-section="infra-objects">
        <rect x="490" y="770" width="300" height="80" class="data" rx="8"/>
        <text x="640" y="800" class="title" text-anchor="middle" font-size="14">📦 General Objects</text>
        <text x="640" y="820" class="small" text-anchor="middle" font-size="10">Store in Neo4j as properties</text>
        <text x="640" y="835" class="small" text-anchor="middle" font-size="10">Keywords for event classification</text>
    </g>
    
    <!-- People Detection -->
    <g class="interactive-element" data-section="infra-people">
        <rect x="890" y="770" width="300" height="80" class="process" rx="8"/>
        <text x="1040" y="800" class="title" text-anchor="middle" font-size="14">🚶 Detected People</text>
        <text x="1040" y="820" class="small" text-anchor="middle" font-size="10">Crop images → S3</text>
        <text x="1040" y="835" class="small" text-anchor="middle" font-size="10">Trigger outfit analysis Lambda</text>
    </g>
    
    <!-- Outfit Analysis -->
    <path d="M 1040 850 L 1040 900" class="arrow"/>
    
    <g class="interactive-element" data-section="infra-outfit">
        <rect x="840" y="900" width="400" height="100" class="mllm" rx="8"/>
        <text x="1040" y="930" class="title" text-anchor="middle" font-size="16">👔 Outfit Analysis</text>
        <text x="1040" y="955" class="small" text-anchor="middle" font-size="10">Lambda (3GB, 900s) • Bedrock (Claude 3.5) • SageMaker (embeddings)</text>
        <text x="1040" y="970" class="small" text-anchor="middle" font-size="10">MLB classifier • Validation • → OpenSearch + Neo4j</text>
    </g>
    
    <!-- Convergence to Neo4j Graph 1 -->
    <path d="M 400 610 L 400 1080 L 600 1080" class="arrow"/>
    <path d="M 620 610 L 620 1080 L 650 1080" class="arrow"/>
    <path d="M 640 850 L 640 1080 L 700 1080" class="arrow"/>
    <path d="M 1040 1000 L 1040 1080 L 900 1080" class="arrow"/>
    <path d="M 1060 610 L 1060 1080 L 950 1080" class="arrow"/>
    <path d="M 1280 610 L 1280 1080 L 1000 1080" class="arrow"/>
    <path d="M 1500 610 L 1500 1080 L 1050 1080" class="arrow"/>
    
    <!-- Neo4j Graph Database 1 -->
    <g class="interactive-element" data-section="infra-neo4j-1">
        <rect x="400" y="1080" width="800" height="200" class="graph" rx="8"/>
        <text x="800" y="1110" class="title" text-anchor="middle" font-size="18" font-weight="bold">🕸️ Neo4j Graph Database (Initial)</text>
        <text x="800" y="1135" class="small" text-anchor="middle" font-size="11">EC2 (r6g.xlarge) or Neo4j Aura • Cypher queries • Graph algorithms</text>
        <text x="800" y="1155" class="small" text-anchor="middle" font-size="11">Store: Image nodes, Face nodes, [:IN_IMAGE] relationships</text>
        <text x="800" y="1175" class="small" text-anchor="middle" font-size="11">All extracted features as node properties</text>
        <text x="800" y="1195" class="small" text-anchor="middle" font-size="11">Backup: Automated snapshots to S3 • Point-in-time recovery</text>
    </g>
    
    <path d="M 800 1280 L 800 1330" class="arrow"/>
    
    <!-- User Input -->
    <g class="interactive-element" data-section="infra-user-input">
        <rect x="550" y="1330" width="500" height="100" class="box" rx="8" stroke="#10b981" stroke-width="3"/>
        <text x="800" y="1360" class="title" text-anchor="middle" font-size="18" font-weight="bold">👤 User Input</text>
        <text x="800" y="1385" class="small" text-anchor="middle" font-size="11">Web UI (React) • API Gateway • Lambda (user-input-handler)</text>
        <text x="800" y="1405" class="small" text-anchor="middle" font-size="11">DynamoDB (family tree) • Neo4j (face labels) • S3 (UI assets)</text>
        <text x="800" y="1420" class="small" text-anchor="middle" font-size="11">CloudFront CDN • Cognito auth required</text>
    </g>
    
    <path d="M 800 1430 L 800 1480" class="arrow"/>
    
    <!-- REST API for CRUD Operations -->
    <g class="interactive-element" data-section="rest-api">
        <rect x="50" y="1480" width="280" height="180" fill="#dcfce7" stroke="#16a34a" stroke-width="3" rx="8"/>
        <text x="190" y="1510" class="title" text-anchor="middle" font-size="16" font-weight="bold">🔌 REST API</text>
        <text x="190" y="1535" class="small" text-anchor="middle" font-size="11"><tspan font-weight="bold">CRUD Operations</tspan></text>
        <text x="190" y="1555" class="small" text-anchor="middle" font-size="10">API Gateway + Lambda</text>
        <text x="190" y="1575" class="small" text-anchor="middle" font-size="10">• Update image metadata</text>
        <text x="190" y="1590" class="small" text-anchor="middle" font-size="10">• Modify event details</text>
        <text x="190" y="1605" class="small" text-anchor="middle" font-size="10">• Edit people info</text>
        <text x="190" y="1620" class="small" text-anchor="middle" font-size="10">• Manage groupings</text>
        <text x="190" y="1635" class="small" text-anchor="middle" font-size="10">• Delete/archive data</text>
        <text x="190" y="1650" class="small" text-anchor="middle" font-size="10">DynamoDB + Neo4j writes</text>
    </g>
    
    <!-- Neo4j Graph 2 -->
    <g class="interactive-element" data-section="infra-neo4j-2">
        <rect x="400" y="1480" width="800" height="180" class="graph" rx="8"/>
        <text x="800" y="1510" class="title" text-anchor="middle" font-size="18" font-weight="bold">🕸️ Neo4j Graph (Person Nodes)</text>
        <text x="800" y="1535" class="small" text-anchor="middle" font-size="11">Lambda (person-clustering) triggered by user input</text>
        <text x="800" y="1555" class="small" text-anchor="middle" font-size="11">Create Person nodes • [:IS_PERSON] relationships</text>
        <text x="800" y="1575" class="small" text-anchor="middle" font-size="11">Face clustering algorithm (DBSCAN) • User labels as ground truth</text>
        <text x="800" y="1595" class="small" text-anchor="middle" font-size="11">DynamoDB (family tree, status) • Neo4j (graph relationships)</text>
        <text x="800" y="1615" class="small" text-anchor="middle" font-size="11">Semi-supervised learning: 20 labels → 95%+ auto-identification</text>
    </g>
    
    <path d="M 800 1660 L 800 1710" class="arrow"/>
    
    <!-- Relationship Finding Header -->
    <g class="interactive-element" data-section="infra-relationship-finding">
        <rect x="300" y="1710" width="1000" height="70" class="decision" rx="8"/>
        <text x="800" y="1740" class="title" text-anchor="middle" font-size="18" font-weight="bold">🔍 Multi-Stage Relationship Finding</text>
        <text x="800" y="1765" class="small" text-anchor="middle" font-size="11">Step Functions workflow • 4 parallel Lambda functions • Vector DB KNN searches</text>
    </g>
    
    <path d="M 800 1780 L 800 1830" class="arrow"/>
    
    <!-- 4 Relationship Finding Boxes -->
    <path d="M 350 1830 L 350 1880" class="arrow"/>
    <path d="M 650 1830 L 650 1880" class="arrow"/>
    <path d="M 950 1830 L 950 1880" class="arrow"/>
    <path d="M 1250 1830 L 1250 1880" class="arrow"/>
    
    <g class="interactive-element" data-section="infra-knn">
        <rect x="200" y="1880" width="300" height="100" class="matching" rx="8"/>
        <text x="350" y="1910" class="title" text-anchor="middle" font-size="14" font-weight="bold">🔍 KNN Embedding</text>
        <text x="350" y="1930" class="small" text-anchor="middle" font-size="10">Lambda (knn-matcher)</text>
        <text x="350" y="1945" class="small" text-anchor="middle" font-size="10">Vector DB (Pinecone/</text>
        <text x="350" y="1960" class="small" text-anchor="middle" font-size="10">Weaviate/pgvector)</text>
        <text x="350" y="1975" class="small" text-anchor="middle" font-size="10">OpenSearch k-NN</text>
    </g>
    
    <g class="interactive-element" data-section="infra-people-match">
        <rect x="520" y="1880" width="300" height="100" class="matching" rx="8"/>
        <text x="670" y="1910" class="title" text-anchor="middle" font-size="14" font-weight="bold">👥 People Set</text>
        <text x="670" y="1930" class="small" text-anchor="middle" font-size="10">Lambda (people-matcher)</text>
        <text x="670" y="1945" class="small" text-anchor="middle" font-size="10">Neo4j Cypher queries</text>
        <text x="670" y="1960" class="small" text-anchor="middle" font-size="10">Age-aware logic</text>
        <text x="670" y="1975" class="small" text-anchor="middle" font-size="10">Popularity weighting</text>
    </g>
    
    <g class="interactive-element" data-section="infra-temporal">
        <rect x="840" y="1880" width="300" height="100" class="matching" rx="8"/>
        <text x="990" y="1910" class="title" text-anchor="middle" font-size="14" font-weight="bold">📅 Temporal</text>
        <text x="990" y="1930" class="small" text-anchor="middle" font-size="10">Lambda (temporal-cluster)</text>
        <text x="990" y="1945" class="small" text-anchor="middle" font-size="10">DynamoDB date queries</text>
        <text x="990" y="1960" class="small" text-anchor="middle" font-size="10">DynamoDB GSI</text>
        <text x="990" y="1975" class="small" text-anchor="middle" font-size="10">Indexed for speed</text>
    </g>
    
    <g class="interactive-element" data-section="infra-location">
        <rect x="1160" y="1880" width="300" height="100" class="matching" rx="8"/>
        <text x="1310" y="1910" class="title" text-anchor="middle" font-size="14" font-weight="bold">📍 Location</text>
        <text x="1310" y="1930" class="small" text-anchor="middle" font-size="10">Lambda (location-matcher)</text>
        <text x="1310" y="1945" class="small" text-anchor="middle" font-size="10">DynamoDB GPS data</text>
        <text x="1310" y="1960" class="small" text-anchor="middle" font-size="10">OpenSearch background</text>
        <text x="1310" y="1975" class="small" text-anchor="middle" font-size="10">Location Services API</text>
    </g>
    
    <!-- Convergence -->
    <path d="M 350 1980 L 600 2050" class="arrow"/>
    <path d="M 670 1980 L 750 2050" class="arrow"/>
    <path d="M 990 1980 L 850 2050" class="arrow"/>
    <path d="M 1310 1980 L 1000 2050" class="arrow"/>
    
    <!-- Neo4j Graph 3 -->
    <g class="interactive-element" data-section="infra-neo4j-3">
        <rect x="300" y="2050" width="1000" height="180" class="graph" rx="8"/>
        <text x="800" y="2080" class="title" text-anchor="middle" font-size="18" font-weight="bold">🕸️ Neo4j Graph (Enriched Relationships)</text>
        <text x="800" y="2105" class="small" text-anchor="middle" font-size="11">Lambda (relationship-aggregator) combines all matching signals</text>
        <text x="800" y="2125" class="small" text-anchor="middle" font-size="11">Create weighted relationships: SIMILAR_OUTFIT, SIMILAR_PEOPLE, SIMILAR_TIME, etc.</text>
        <text x="800" y="2145" class="small" text-anchor="middle" font-size="11">Edge weights (0.0-1.0) from combined confidence scores</text>
        <text x="800" y="2165" class="small" text-anchor="middle" font-size="11">Step Functions waits for all 4 matchers to complete before aggregation</text>
        <text x="800" y="2185" class="small" text-anchor="middle" font-size="11">CloudWatch metrics track matching performance and accuracy</text>
    </g>
    
    <path d="M 800 2230 L 800 2280" class="arrow"/>
    
    <!-- Leiden Community Detection -->
    <g class="interactive-element" data-section="infra-leiden">
        <rect x="500" y="2280" width="600" height="100" class="decision" rx="8"/>
        <text x="800" y="2310" class="title" text-anchor="middle" font-size="18" font-weight="bold">🔬 Leiden Community Detection</text>
        <text x="800" y="2335" class="small" text-anchor="middle" font-size="11">Lambda (community-detector, 10GB, 900s) • Neo4j Graph Data Science library</text>
        <text x="800" y="2355" class="small" text-anchor="middle" font-size="11">Scheduled EventBridge rule (daily or on-demand trigger)</text>
        <text x="800" y="2370" class="small" text-anchor="middle" font-size="11">Results stored in DynamoDB + Neo4j Event nodes</text>
    </g>
    
    <path d="M 800 2380 L 800 2430" class="arrow"/>
    
    <!-- Human Review -->
    <g class="interactive-element" data-section="infra-human-review">
        <rect x="450" y="2430" width="700" height="110" class="process" rx="8" stroke="#10b981" stroke-width="3"/>
        <text x="800" y="2460" class="title" text-anchor="middle" font-size="18" font-weight="bold">👤 Human-in-the-Loop Review</text>
        <text x="800" y="2485" class="small" text-anchor="middle" font-size="11">React UI • API Gateway • Lambda (review-handler) • WebSocket (real-time updates)</text>
        <text x="800" y="2505" class="small" text-anchor="middle" font-size="11">DynamoDB (user actions) • SQS (feedback queue) • SNS (notifications)</text>
        <text x="800" y="2525" class="small" text-anchor="middle" font-size="11">Feedback triggers retraining Lambda • Updates Neo4j weights • CloudWatch metrics</text>
    </g>
    
    <path d="M 800 2540 L 800 2590" class="arrow"/>
    
    <!-- Final Neo4j Graph -->
    <g class="interactive-element" data-section="infra-neo4j-final">
        <rect x="300" y="2590" width="1000" height="200" class="graph" rx="8" stroke="#10b981" stroke-width="3"/>
        <text x="800" y="2620" class="title" text-anchor="middle" font-size="18" font-weight="bold">🕸️ Final Neo4j Graph (Event Nodes)</text>
        <text x="800" y="2645" class="small" text-anchor="middle" font-size="11">Lambda (event-finalizer) creates Event nodes with [:IN_EVENT] relationships</text>
        <text x="800" y="2665" class="small" text-anchor="middle" font-size="11">Event metadata: name, date_range, location, attendees, caption, confidence</text>
        <text x="800" y="2685" class="small" text-anchor="middle" font-size="11">User-verified flag • Review history in DynamoDB</text>
        <text x="800" y="2705" class="small" text-anchor="middle" font-size="11">Indexed for fast queries • DynamoDB GSI for UI performance</text>
        <text x="800" y="2725" class="small" text-anchor="middle" font-size="11">Backup strategy: Daily snapshots to S3 • 30-day retention • Cross-region replication</text>
    </g>
    
    <path d="M 800 2790 L 800 2840" class="arrow"/>
    
    <!-- Output -->
    <g class="interactive-element" data-section="infra-output">
        <rect x="550" y="2840" width="500" height="90" class="box" rx="8" stroke="#10b981" stroke-width="3"/>
        <text x="800" y="2875" class="title" text-anchor="middle" font-size="18" font-weight="bold">✅ Grouped Events</text>
        <text x="800" y="2900" class="small" text-anchor="middle" font-size="11">React SPA • CloudFront CDN • S3 static hosting • Route 53 DNS</text>
        <text x="800" y="2920" class="small" text-anchor="middle" font-size="11">API Gateway GraphQL • Lambda resolvers • DynamoDB • CloudWatch RUM</text>
    </g>
    
    <!-- Legend -->
    <text x="200" y="3000" class="title" font-size="16" font-weight="bold">Legend:</text>
    <rect x="200" y="3015" width="120" height="40" class="box" rx="5"/>
    <text x="260" y="3040" class="small" text-anchor="middle" font-size="11">Input/Output</text>
    
    <rect x="340" y="3015" width="120" height="40" class="process" rx="5"/>
    <text x="400" y="3040" class="small" text-anchor="middle" font-size="11">Processing</text>
    
    <rect x="480" y="3015" width="120" height="40" class="decision" rx="5"/>
    <text x="540" y="3040" class="small" text-anchor="middle" font-size="11">Decision</text>
    
    <rect x="620" y="3015" width="120" height="40" class="data" rx="5"/>
    <text x="680" y="3040" class="small" text-anchor="middle" font-size="11">Data Store</text>
    
    <rect x="760" y="3015" width="120" height="40" class="mllm" rx="5"/>
    <text x="820" y="3040" class="small" text-anchor="middle" font-size="11">MLLM</text>
    
    <rect x="900" y="3015" width="120" height="40" class="graph" rx="5"/>
    <text x="960" y="3040" class="small" text-anchor="middle" font-size="11">Graph DB</text>
    
    <rect x="1040" y="3015" width="120" height="40" class="matching" rx="5"/>
    <text x="1100" y="3040" class="small" text-anchor="middle" font-size="11">Matching</text>
</svg>
    `;
    
    container.innerHTML = svg;
}
