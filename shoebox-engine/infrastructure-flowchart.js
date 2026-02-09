function createInfrastructureFlowchart() {
    const container = document.getElementById('infrastructure-flowchart');
    
    const svg = `
<svg viewBox="0 0 1400 3200" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#424242" />
        </marker>
    </defs>
    
    <!-- Title -->
    <text x="700" y="30" class="title" font-size="18" text-anchor="middle">AWS Infrastructure Architecture</text>
    
    <!-- User Upload -->
    <g class="interactive-element" data-section="user-upload">
        <rect x="600" y="60" width="200" height="60" class="box" rx="5"/>
        <text x="700" y="85" class="title" text-anchor="middle">User Upload</text>
        <text x="700" y="105" class="text" text-anchor="middle">(Web/Mobile Client)</text>
    </g>
    
    <path d="M 700 120 L 700 160" class="arrow"/>
    
    <!-- API Gateway -->
    <g class="interactive-element" data-section="api-gateway">
        <rect x="550" y="160" width="300" height="100" class="process" rx="5"/>
        <text x="700" y="190" class="title" text-anchor="middle">API Gateway</text>
        <text x="700" y="210" class="small" text-anchor="middle">• RESTful API endpoints</text>
        <text x="700" y="225" class="small" text-anchor="middle">• Authentication with Cognito</text>
        <text x="700" y="240" class="small" text-anchor="middle">• Request/response transformation</text>
        <text x="700" y="255" class="small" text-anchor="middle">• Generate presigned S3 URLs</text>
    </g>
    
    <path d="M 700 260 L 700 300" class="arrow"/>
    
    <!-- Cognito -->
    <path d="M 850 210 L 1000 210" class="arrow"/>
    <g class="interactive-element" data-section="cognito">
        <rect x="1000" y="160" width="250" height="100" class="data" rx="5"/>
        <text x="1125" y="190" class="title" text-anchor="middle">Amazon Cognito</text>
        <text x="1125" y="210" class="small" text-anchor="middle">• User authentication</text>
        <text x="1125" y="225" class="small" text-anchor="middle">• JWT token generation</text>
        <text x="1125" y="240" class="small" text-anchor="middle">• Social identity providers</text>
        <text x="1125" y="255" class="small" text-anchor="middle">• MFA support</text>
    </g>
    
    <!-- S3 Storage -->
    <g class="interactive-element" data-section="s3">
        <rect x="500" y="300" width="400" height="140" class="data" rx="5"/>
        <text x="700" y="330" class="title" text-anchor="middle">Amazon S3 (Storage)</text>
        <text x="700" y="355" class="small" text-anchor="middle">Buckets:</text>
        <text x="700" y="375" class="small" text-anchor="middle">• images-raw/ - Original uploaded images</text>
        <text x="700" y="390" class="small" text-anchor="middle">• images-processed/ - Scaled/optimized versions</text>
        <text x="700" y="405" class="small" text-anchor="middle">• crops/ - Person and face crops</text>
        <text x="700" y="420" class="small" text-anchor="middle">• embeddings/ - Cached embedding vectors</text>
        <text x="700" y="435" class="small" text-anchor="middle">Versioning, lifecycle policies, encryption enabled</text>
    </g>
    
    <path d="M 700 440 L 700 480" class="arrow"/>
    
    <!-- EventBridge -->
    <g class="interactive-element" data-section="eventbridge">
        <rect x="550" y="480" width="300" height="100" class="process" rx="5"/>
        <text x="700" y="510" class="title" text-anchor="middle">Amazon EventBridge</text>
        <text x="700" y="530" class="small" text-anchor="middle">• S3 upload event triggers</text>
        <text x="700" y="545" class="small" text-anchor="middle">• Scheduled matching (every 5 min)</text>
        <text x="700" y="560" class="small" text-anchor="middle">• Nightly community detection</text>
        <text x="700" y="575" class="small" text-anchor="middle">• Route events to SQS queues</text>
    </g>
    
    <path d="M 700 580 L 700 620" class="arrow"/>
    
    <!-- SQS Queues -->
    <g class="interactive-element" data-section="sqs">
        <rect x="500" y="620" width="400" height="140" class="data" rx="5"/>
        <text x="700" y="650" class="title" text-anchor="middle">Amazon SQS (Message Queues)</text>
        <text x="700" y="675" class="small" text-anchor="middle">Queues:</text>
        <text x="700" y="695" class="small" text-anchor="middle">• preprocessing-queue - Image validation & scaling</text>
        <text x="700" y="710" class="small" text-anchor="middle">• face-detection-queue - AWS Rekognition jobs</text>
        <text x="700" y="725" class="small" text-anchor="middle">• outfit-analysis-queue - YOLO + MLLM processing</text>
        <text x="700" y="740" class="small" text-anchor="middle">• matching-queue - KNN search & relationship creation</text>
        <text x="700" y="755" class="small" text-anchor="middle">Dead letter queues (DLQ) for failed messages</text>
    </g>
    
    <path d="M 700 760 L 700 800" class="arrow"/>
    
    <!-- Lambda Functions Hub -->
    <g class="interactive-element" data-section="lambda-hub">
        <rect x="600" y="800" width="200" height="50" class="decision" rx="5"/>
        <text x="700" y="825" class="title" text-anchor="middle">Lambda Functions</text>
        <text x="700" y="840" class="text" text-anchor="middle">(Serverless Compute)</text>
    </g>
    
    <!-- Lambda 1: Preprocessor -->
    <path d="M 500 825 L 250 825 L 250 900" class="arrow"/>
    <g class="interactive-element" data-section="lambda-preprocessor">
        <rect x="100" y="900" width="300" height="120" class="process" rx="5"/>
        <text x="250" y="930" class="title" text-anchor="middle">image-preprocessor</text>
        <text x="250" y="950" class="small" text-anchor="middle">Runtime: Python 3.11</text>
        <text x="250" y="965" class="small" text-anchor="middle">Memory: 1024 MB, Timeout: 60s</text>
        <text x="250" y="985" class="small" text-anchor="middle">• Security scan, EXIF extraction</text>
        <text x="250" y="1000" class="small" text-anchor="middle">• Image scaling & optimization</text>
        <text x="250" y="1015" class="small" text-anchor="middle">• Send to downstream queues</text>
    </g>
    
    <!-- Lambda 2: Face Detector -->
    <path d="M 700 850 L 700 900" class="arrow"/>
    <g class="interactive-element" data-section="lambda-face">
        <rect x="550" y="900" width="300" height="120" class="process" rx="5"/>
        <text x="700" y="930" class="title" text-anchor="middle">face-detector</text>
        <text x="700" y="950" class="small" text-anchor="middle">Runtime: Python 3.11</text>
        <text x="700" y="965" class="small" text-anchor="middle">Memory: 2048 MB, Timeout: 300s</text>
        <text x="700" y="985" class="small" text-anchor="middle">• Call AWS Rekognition</text>
        <text x="700" y="1000" class="small" text-anchor="middle">• Store face data in Neo4j</text>
        <text x="700" y="1015" class="small" text-anchor="middle">• Create Face → Person relationships</text>
    </g>
    
    <!-- Lambda 3: Outfit Analyzer -->
    <path d="M 900 825 L 1150 825 L 1150 900" class="arrow"/>
    <g class="interactive-element" data-section="lambda-outfit">
        <rect x="1000" y="900" width="300" height="140" class="process" rx="5"/>
        <text x="1150" y="930" class="title" text-anchor="middle">outfit-analyzer</text>
        <text x="1150" y="950" class="small" text-anchor="middle">Runtime: Python 3.11</text>
        <text x="1150" y="965" class="small" text-anchor="middle">Memory: 3008 MB, Timeout: 900s</text>
        <text x="1150" y="985" class="small" text-anchor="middle">• Call SageMaker YOLO endpoint</text>
        <text x="1150" y="1000" class="small" text-anchor="middle">• Crop people from images</text>
        <text x="1150" y="1015" class="small" text-anchor="middle">• Call Bedrock for outfit description</text>
        <text x="1150" y="1030" class="small" text-anchor="middle">• Generate embeddings & MLB tags</text>
    </g>
    
    <!-- AWS Services Used by Lambdas -->
    <path d="M 700 1020 L 700 1080" class="arrow"/>
    
    <!-- AWS Rekognition -->
    <g class="interactive-element" data-section="rekognition">
        <rect x="100" y="1080" width="250" height="100" class="mllm" rx="5"/>
        <text x="225" y="1110" class="title" text-anchor="middle">AWS Rekognition</text>
        <text x="225" y="1130" class="small" text-anchor="middle">• Face detection & analysis</text>
        <text x="225" y="1145" class="small" text-anchor="middle">• Face embeddings (512-dim)</text>
        <text x="225" y="1160" class="small" text-anchor="middle">• Age, gender, emotions</text>
        <text x="225" y="1175" class="small" text-anchor="middle">Cost: $0.001 per image</text>
    </g>
    
    <!-- SageMaker -->
    <g class="interactive-element" data-section="sagemaker">
        <rect x="400" y="1080" width="250" height="120" class="mllm" rx="5"/>
        <text x="525" y="1110" class="title" text-anchor="middle">Amazon SageMaker</text>
        <text x="525" y="1130" class="small" text-anchor="middle">• YOLO person detection</text>
        <text x="525" y="1145" class="small" text-anchor="middle">• Sentence transformer embeddings</text>
        <text x="525" y="1160" class="small" text-anchor="middle">Endpoint: ml.g4dn.xlarge (GPU)</text>
        <text x="525" y="1175" class="small" text-anchor="middle">Auto-scaling: 0-5 instances</text>
        <text x="525" y="1190" class="small" text-anchor="middle">Cost: $0.526/hour</text>
    </g>
    
    <!-- Bedrock -->
    <g class="interactive-element" data-section="bedrock">
        <rect x="700" y="1080" width="250" height="140" class="mllm" rx="5"/>
        <text x="825" y="1110" class="title" text-anchor="middle">Amazon Bedrock</text>
        <text x="825" y="1130" class="small" text-anchor="middle">• Claude 3.5 Sonnet (outfits)</text>
        <text x="825" y="1145" class="small" text-anchor="middle">• Claude 3 Haiku (descriptions)</text>
        <text x="825" y="1160" class="small" text-anchor="middle">• Titan embeddings</text>
        <text x="825" y="1175" class="small" text-anchor="middle">Prompt caching for cost savings</text>
        <text x="825" y="1190" class="small" text-anchor="middle">Rate limits: 100 req/min</text>
        <text x="825" y="1205" class="small" text-anchor="middle">Cost: ~$0.005 per image</text>
    </g>
    
    <!-- Step Functions -->
    <g class="interactive-element" data-section="step-functions">
        <rect x="1000" y="1080" width="250" height="120" class="process" rx="5"/>
        <text x="1125" y="1110" class="title" text-anchor="middle">AWS Step Functions</text>
        <text x="1125" y="1130" class="small" text-anchor="middle">• Orchestrate multi-step workflows</text>
        <text x="1125" y="1145" class="small" text-anchor="middle">• Parallel Lambda execution</text>
        <text x="1125" y="1160" class="small" text-anchor="middle">• Error handling & retries</text>
        <text x="1125" y="1175" class="small" text-anchor="middle">• Visual workflow monitoring</text>
        <text x="1125" y="1190" class="small" text-anchor="middle">Cost: $0.025 per 1K transitions</text>
    </g>
    
    <path d="M 700 1220 L 700 1280" class="arrow"/>
    
    <!-- Database Layer -->
    <g class="interactive-element" data-section="databases">
        <rect x="600" y="1280" width="200" height="50" class="decision" rx="5"/>
        <text x="700" y="1305" class="title" text-anchor="middle">Database Layer</text>
        <text x="700" y="1320" class="text" text-anchor="middle">(Multi-database strategy)</text>
    </g>
    
    <!-- Neo4j -->
    <path d="M 500 1305 L 250 1305 L 250 1380" class="arrow"/>
    <g class="interactive-element" data-section="neo4j">
        <rect x="100" y="1380" width="300" height="140" class="graph" rx="5"/>
        <text x="250" y="1410" class="title" text-anchor="middle">Neo4j (Graph Database)</text>
        <text x="250" y="1435" class="small" text-anchor="middle">• Store Image, Face, Person nodes</text>
        <text x="250" y="1450" class="small" text-anchor="middle">• Relationships with weights</text>
        <text x="250" y="1465" class="small" text-anchor="middle">• Fast graph queries (Cypher)</text>
        <text x="250" y="1480" class="small" text-anchor="middle">• Community detection algorithms</text>
        <text x="250" y="1495" class="small" text-anchor="middle">Hosted: EC2 or Neo4j Aura</text>
        <text x="250" y="1510" class="small" text-anchor="middle">Cost: ~$200-500/month</text>
    </g>
    
    <!-- PostgreSQL -->
    <path d="M 700 1330 L 700 1380" class="arrow"/>
    <g class="interactive-element" data-section="rds">
        <rect x="550" y="1380" width="300" height="140" class="data" rx="5"/>
        <text x="700" y="1410" class="title" text-anchor="middle">RDS PostgreSQL</text>
        <text x="700" y="1435" class="small" text-anchor="middle">• User accounts & preferences</text>
        <text x="700" y="1450" class="small" text-anchor="middle">• Image metadata & job tracking</text>
        <text x="700" y="1465" class="small" text-anchor="middle">• User feedback & corrections</text>
        <text x="700" y="1480" class="small" text-anchor="middle">Instance: db.t3.medium</text>
        <text x="700" y="1495" class="small" text-anchor="middle">Multi-AZ, automated backups</text>
        <text x="700" y="1510" class="small" text-anchor="middle">Cost: ~$100/month</text>
    </g>
    
    <!-- Vector Database -->
    <path d="M 900 1305 L 1150 1305 L 1150 1380" class="arrow"/>
    <g class="interactive-element" data-section="vector-db">
        <rect x="1000" y="1380" width="300" height="160" class="data" rx="5"/>
        <text x="1150" y="1410" class="title" text-anchor="middle">Vector Database</text>
        <text x="1150" y="1430" class="small" text-anchor="middle">(Pinecone / Weaviate / pgvector)</text>
        <text x="1150" y="1455" class="small" text-anchor="middle">• Fast approximate KNN search</text>
        <text x="1150" y="1470" class="small" text-anchor="middle">• Image embeddings</text>
        <text x="1150" y="1485" class="small" text-anchor="middle">• Outfit description embeddings</text>
        <text x="1150" y="1500" class="small" text-anchor="middle">• Semantic embeddings (3 types)</text>
        <text x="1150" y="1515" class="small" text-anchor="middle">• Face embeddings</text>
        <text x="1150" y="1530" class="small" text-anchor="middle">Cost: ~$70-150/month</text>
    </g>
    
    <path d="M 700 1540 L 700 1600" class="arrow"/>
    
    <!-- Monitoring & Logging -->
    <g class="interactive-element" data-section="cloudwatch">
        <rect x="400" y="1600" width="600" height="140" class="process" rx="5"/>
        <text x="700" y="1630" class="title" text-anchor="middle">Amazon CloudWatch</text>
        <text x="700" y="1655" class="small" text-anchor="middle">Monitoring & Logging:</text>
        <text x="700" y="1675" class="small" text-anchor="middle">• Centralized logs from all Lambdas</text>
        <text x="700" y="1690" class="small" text-anchor="middle">• Metrics: invocations, duration, errors, queue depth</text>
        <text x="700" y="1705" class="small" text-anchor="middle">• Alarms: Error rate > 5%, Queue depth > 1000</text>
        <text x="700" y="1720" class="small" text-anchor="middle">• Dashboards: Visual monitoring of entire pipeline</text>
        <text x="700" y="1735" class="small" text-anchor="middle">• CloudWatch Insights for log analysis</text>
    </g>
    
    <path d="M 700 1740 L 700 1800" class="arrow"/>
    
    <!-- Frontend Hosting -->
    <g class="interactive-element" data-section="hosting">
        <rect x="400" y="1800" width="600" height="120" class="box" rx="5"/>
        <text x="700" y="1830" class="title" text-anchor="middle">Frontend Hosting</text>
        <text x="700" y="1855" class="small" text-anchor="middle">• CloudFront (CDN) - Global content delivery</text>
        <text x="700" y="1870" class="small" text-anchor="middle">• S3 Static Website Hosting - React/Vue/Angular app</text>
        <text x="700" y="1885" class="small" text-anchor="middle">• Route 53 - DNS management</text>
        <text x="700" y="1900" class="small" text-anchor="middle">• Certificate Manager - SSL/TLS certificates</text>
        <text x="700" y="1915" class="small" text-anchor="middle">Cost: ~$20-50/month</text>
    </g>
    
    <path d="M 700 1920 L 700 1980" class="arrow"/>
    
    <!-- Cost Summary -->
    <g class="interactive-element" data-section="cost-summary">
        <rect x="300" y="1980" width="800" height="200" class="decision" rx="5"/>
        <text x="700" y="2010" class="title" text-anchor="middle">💰 Monthly Cost Estimate (10K images/month)</text>
        <text x="320" y="2040" class="small">• S3 Storage (100GB): ~$2</text>
        <text x="320" y="2060" class="small">• Lambda Compute: ~$50</text>
        <text x="320" y="2080" class="small">• API Gateway: ~$3.50</text>
        <text x="320" y="2100" class="small">• SQS: ~$1</text>
        <text x="320" y="2120" class="small">• Rekognition: ~$10</text>
        <text x="320" y="2140" class="small">• Bedrock (Claude): ~$50</text>
        <text x="320" y="2160" class="small">• SageMaker: ~$380 (or $0 with serverless)</text>
        
        <text x="720" y="2040" class="small">• RDS PostgreSQL: ~$100</text>
        <text x="720" y="2060" class="small">• Neo4j: ~$300</text>
        <text x="720" y="2080" class="small">• Vector DB: ~$100</text>
        <text x="720" y="2100" class="small">• CloudWatch: ~$10</text>
        <text x="720" y="2120" class="small">• CloudFront + S3: ~$30</text>
        <text x="720" y="2140" class="small">• Step Functions: ~$2</text>
        <text x="720" y="2160" class="small">• Data Transfer: ~$20</text>
        
        <text x="700" y="2175" class="title" text-anchor="middle">────────────────────────────</text>
        <text x="700" y="2195" class="title" text-anchor="middle" font-size="16">Total: ~$1,058/month</text>
    </g>
    
    <path d="M 700 2180 L 700 2240" class="arrow"/>
    
    <!-- Architecture Diagram -->
    <g class="interactive-element" data-section="architecture-diagram">
        <rect x="200" y="2240" width="1000" height="180" class="box" rx="5"/>
        <text x="700" y="2270" class="title" text-anchor="middle">Complete Data Flow</text>
        <text x="220" y="2300" class="small">User → API Gateway → S3 Upload → EventBridge → SQS Queues</text>
        <text x="220" y="2320" class="small">  → Lambda (Preprocessor) → Lambda (Face Detection) → Rekognition → Neo4j</text>
        <text x="220" y="2340" class="small">  → Lambda (Outfit Analysis) → SageMaker (YOLO) → Bedrock (Claude) → Neo4j</text>
        <text x="220" y="2360" class="small">  → Lambda (Semantic Descriptions) → Bedrock → Vector DB</text>
        <text x="220" y="2380" class="small">  → Lambda (Matching Engine) → Vector DB KNN → Neo4j Relationships</text>
        <text x="220" y="2400" class="small">  → Scheduled Lambda (Community Detection) → Neo4j Leiden → RDS Events</text>
        <text x="220" y="2420" class="small">  → Frontend (CloudFront/S3) → API Gateway → User Review → Feedback Loop</text>
    </g>
    
    <!-- Key Architecture Principles -->
    <g class="interactive-element" data-section="architecture-principles">
        <rect x="100" y="2460" width="1200" height="160" fill="#fafafa" stroke="#666" stroke-width="1" rx="5"/>
        <text x="700" y="2490" class="title" text-anchor="middle">Key Architecture Principles</text>
        <text x="110" y="2515" class="small">• Serverless-first: Lambda functions scale automatically, pay only for compute time</text>
        <text x="110" y="2535" class="small">• Event-driven: S3 uploads trigger processing pipelines via EventBridge</text>
        <text x="110" y="2555" class="small">• Asynchronous processing: Queue-based architecture handles variable processing times</text>
        <text x="110" y="2575" class="small">• Separation of concerns: Different Lambdas for different stages (face detection, outfit analysis, matching)</text>
        <text x="110" y="2595" class="small">• Multi-database strategy: Right tool for the job (Neo4j for graphs, PostgreSQL for relational, Vector DB for embeddings)</text>
        <text x="110" y="2615" class="small">• Managed services: Leverage AWS-managed ML services (Rekognition, Bedrock) instead of managing models</text>
    </g>
    
    <!-- Legend -->
    <text x="100" y="2680" class="title">Legend:</text>
    <rect x="100" y="2690" width="80" height="30" class="box" rx="3"/>
    <text x="140" y="2710" class="small" text-anchor="middle">Client/Output</text>
    
    <rect x="200" y="2690" width="80" height="30" class="process" rx="3"/>
    <text x="240" y="2710" class="small" text-anchor="middle">Processing</text>
    
    <rect x="300" y="2690" width="80" height="30" class="decision" rx="3"/>
    <text x="340" y="2710" class="small" text-anchor="middle">Orchestration</text>
    
    <rect x="400" y="2690" width="80" height="30" class="data" rx="3"/>
    <text x="440" y="2710" class="small" text-anchor="middle">Data Store</text>
    
    <rect x="500" y="2690" width="80" height="30" class="mllm" rx="3"/>
    <text x="540" y="2710" class="small" text-anchor="middle">ML Service</text>
    
    <rect x="600" y="2690" width="80" height="30" class="graph" rx="3"/>
    <text x="640" y="2710" class="small" text-anchor="middle">Graph DB</text>
</svg>
    `;
    
    container.innerHTML = svg;
    attachInteractiveListeners();
}
