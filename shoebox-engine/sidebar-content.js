// Sidebar content for both pipeline and infrastructure
const sidebarContent = {
    // Pipeline content (abbreviated - keeping key sections)
    input: { title: "📸 Input Image", content: "<h3>Pipeline Entry Point</h3><p>Images enter via API Gateway with presigned S3 URLs.</p>" },
    preprocessing: { title: "🔍 Pre-Processing", content: "<h3>Validation & Preparation</h3><p>Validate format, extract EXIF, generate thumbnails.</p>" },
    "feature-extraction": { title: "⚡ Feature Extraction", content: "<h3>6 Parallel Processes</h3><p>Metadata, faces, YOLO, embeddings, LLM, OCR run simultaneously.</p>" },
    metadata: { title: "📋 Metadata", content: "<h3>EXIF & GPS Data</h3><p>Extract dates, location, camera info, aspect ratio.</p>" },
    "face-detection": { title: "👤 Face Detection", content: "<h3>AWS Rekognition</h3><p>512-dim embeddings, age/gender estimation, emotion detection.</p>" },
    "yolo-detection": { title: "🎯 YOLO Detection", content: "<h3>Objects & People</h3><p>YOLOv8 detects 80 object classes and segments people.</p>" },
    "yolo-branches": { title: "🔀 Detection Split", content: "<h3>Two Branches</h3><p>General objects → keywords. People → outfit analysis.</p>" },
    "general-objects": { title: "📦 General Objects", content: "<h3>Event Indicators</h3><p>Cake, balloons, tree, etc. help classify event types.</p>" },
    "people-detection": { title: "🚶 Detected People", content: "<h3>Person Crops</h3><p>Extract full body crops for outfit analysis.</p>" },
    "outfit-analysis": { title: "👔 Outfit Analysis", content: "<h3>MLLM Processing</h3><p>Claude 3.5 analyzes clothing, generates structured descriptions, creates 768-dim embeddings.</p>" },
    "image-embed": { title: "🖼️ Image Embeddings", content: "<h3>CLIP Vectors</h3><p>512-dim embeddings capture whole-image composition and style.</p>" },
    "semantic-llm": { title: "💬 Semantic LLM", content: "<h3>3 Descriptions</h3><p>Event, background, and photo descriptions embedded separately.</p>" },
    "ocr-text": { title: "📝 OCR Text", content: "<h3>Text Extraction</h3><p>AWS Textract or Tesseract extract timestamps, captions, signs.</p>" },
    "neo4j-graph-1": { title: "🕸️ Neo4j Graph (Initial)", content: "<h3>Image & Face Nodes</h3><p>Store features as properties. [:IN_IMAGE] relationships.</p>" },
    "user-input": { title: "👤 User Input", content: "<h3>Family Tree & Labels</h3><p>20 labels → 95% automatic face identification.</p>" },
    "neo4j-graph-2": { title: "🕸️ Neo4j Graph (Person Nodes)", content: "<h3>Person Creation</h3><p>[:IS_PERSON] relationships link faces to people.</p>" },
    "relationship-finding": { title: "🔍 Relationship Finding", content: "<h3>Multi-Signal Matching</h3><p>Combine outfit, people, time, location signals.</p>" },
    "knn-matching": { title: "🔍 KNN Embedding", content: "<h3>Vector Similarity</h3><p>K-nearest neighbors across 6 embedding types.</p>" },
    "people-matching": { title: "👥 People Set", content: "<h3>Age-Aware Matching</h3><p>Compare people sets with popularity weighting.</p>" },
    "temporal-matching": { title: "📅 Temporal Clustering", content: "<h3>Time Proximity</h3><p>Date/time windows with aspect ratio bucketing.</p>" },
    "location-matching": { title: "📍 Location Matching", content: "<h3>GPS & Background</h3><p>Coordinate clustering and venue recognition.</p>" },
    "neo4j-graph-3": { title: "🕸️ Neo4j Graph (Enriched)", content: "<h3>Weighted Relationships</h3><p>Multiple relationship types with confidence scores.</p>" },
    leiden: { title: "🔬 Leiden Detection", content: "<h3>Community Detection</h3><p>Graph algorithm finds event clusters.</p>" },
    "human-review": { title: "👤 Human Review", content: "<h3>User Verification</h3><p>Confirm, edit, split, merge events. Feedback improves system.</p>" },
    "neo4j-graph-final": { title: "🕸️ Final Graph", content: "<h3>Event Nodes</h3><p>[:IN_EVENT] relationships. User-verified structure.</p>" },
    output: { title: "✅ Grouped Events", content: "<h3>Organized Collection</h3><p>Timeline, grid, map, people views. Export options.</p>" },

    // AWS Infrastructure content
    "auth-services": {
        title: "🔐 Authentication & User Management",
        content: `<h3>Amazon Cognito User Pools</h3>
            <p>Secure authentication with JWT tokens, MFA, social login.</p>
            <h3>User Preferences (DynamoDB)</h3>
            <p>Store settings, consent flags, subscription tier.</p>
`
    },
    "consent-tracking": {
        title: "📋 Consent & Audit Tracking",
        content: `<h3>Face Recognition Consent</h3>
            <p>DynamoDB table tracks consent timestamp, version, scope.</p>
            <h3>Status Tracking (DynamoDB)</h3>
            <p>Track processing status for all images: queued, processing, completed, failed.</p>
            <h3>CloudWatch Logs</h3>
            <p>Centralized logging for compliance and debugging.</p>
            <h3>GDPR Compliance</h3>
            <p>Right to delete, data export, consent withdrawal.</p>`
    },
    "infra-input": {
        title: "📸 Input Image (Infrastructure)",
        content: `<h3>API Gateway</h3>
            <p>REST API with Cognito authorizer. Generate presigned S3 URLs.</p>
            <h3>S3 Presigned URLs</h3>
            <p>Direct upload bypasses 10MB Lambda limit. Supports up to 5GB files.</p>
            <h3>S3 Events</h3>
            <p>Trigger EventBridge on object creation.</p>
`
    },
    "infra-preprocessing": {
        title: "🔍 Pre-Processing (Infrastructure)",
        content: `<h3>Lambda Function</h3>
            <p>Memory: 1GB, Timeout: 60s, Runtime: Python 3.11</p>
            <h3>Triggered By</h3>
            <p>EventBridge rule on S3 object creation.</p>
            <h3>Operations</h3>
            <ul>
                <li>Validate image format</li>
                <li>Extract EXIF metadata</li>
                <li>Generate thumbnails (256px, 1024px)</li>
                <li>Compute perceptual hash</li>
                <li>Send to SQS queue for feature extraction</li>
            </ul>
`
    },
    "step-functions": {
        title: "⚙️ Step Functions Orchestration",
        content: `<h3>Workflow Orchestration & Retry Logic</h3>
            <p>Coordinate parallel feature extraction. Parallel state waits for all 6 processes to complete before proceeding.</p>
            <pre><code>{
  "Type": "Parallel",
  "Branches": [
    {"StartAt": "Metadata"},
    {"StartAt": "FaceDetection"},
    {"StartAt": "YOLO"},
    {"StartAt": "ImageEmbed"},
    {"StartAt": "SemanticLLM"},
    {"StartAt": "OCR"}
  ],
  "Next": "AggregateResults"
}</code></pre>
            <h3>Automatic Retries</h3>
            <p>Exponential backoff for transient failures. Max 3 attempts per step.</p>
            <h3>Error Handling</h3>
            <p>Catch blocks for different error types. Route to DLQ or alternative paths.</p>
            <h3>State Management</h3>
            <p>Track execution history, input/output for each state. Resume from failure point.</p>`
    },
    "status-updates": {
        title: "📬 Status Updates (SQS + SNS)",
        content: `<h3>Processing Status Notifications</h3>
            <p>Keep users informed about image processing progress.</p>
            <h3>SQS Queues</h3>
            <p>Decouple processing stages. Buffer status messages. DLQs for failed deliveries.</p>
            <h3>SNS Topics</h3>
            <p>Fan-out notifications to multiple channels: email, SMS, push notifications, webhooks.</p>
            <h3>Status Types</h3>
            <ul>
                <li><strong>Queued:</strong> Image uploaded, waiting for processing</li>
                <li><strong>Processing:</strong> Feature extraction in progress</li>
                <li><strong>Completed:</strong> All features extracted, ready for grouping</li>
                <li><strong>Failed:</strong> Error occurred, retry or manual review needed</li>
            </ul>
            <h3>Real-time Updates</h3>
            <p>WebSocket connections for live progress bars in UI.</p>`
    },
    "analytics": {
        title: "📊 PostHog Analytics",
        content: `<h3>Product Analytics & User Behavior</h3>
            <p>Track how users interact with the Shoebox Engine application.</p>
            <h3>Event Tracking</h3>
            <ul>
                <li>Image uploads (count, size, format)</li>
                <li>Feature usage (face labeling, event editing, search)</li>
                <li>User flows (onboarding, first upload, first event created)</li>
                <li>Error rates and user friction points</li>
            </ul>
            <h3>Session Replay</h3>
            <p>Watch user sessions to understand UX issues and improve workflows.</p>
            <h3>Feature Flags</h3>
            <p>A/B test new features. Gradual rollouts. Kill switches for problematic features.</p>
            <h3>Retention & Engagement</h3>
            <p>Track DAU/MAU, retention cohorts, feature adoption rates.</p>
            <h3>Integration</h3>
            <p>JavaScript SDK in React frontend. Server-side events from Lambda functions.</p>`
    },
    "rest-api": {
        title: "🔌 REST API (CRUD Operations)",
        content: `<h3>User Data Management API</h3>
            <p>API Gateway + Lambda functions for all user-initiated data modifications.</p>
            <h3>Image Operations</h3>
            <ul>
                <li><strong>GET /images/{id}</strong> - Fetch image details</li>
                <li><strong>PATCH /images/{id}</strong> - Update metadata (caption, date, location)</li>
                <li><strong>DELETE /images/{id}</strong> - Soft delete or archive</li>
            </ul>
            <h3>Event Operations</h3>
            <ul>
                <li><strong>GET /events</strong> - List all events</li>
                <li><strong>POST /events</strong> - Create manual event</li>
                <li><strong>PATCH /events/{id}</strong> - Update name, date range, attendees</li>
                <li><strong>DELETE /events/{id}</strong> - Remove event, keep images</li>
            </ul>
            <h3>People Operations</h3>
            <ul>
                <li><strong>GET /people</strong> - List all recognized people</li>
                <li><strong>PATCH /people/{id}</strong> - Update name, relationship, birthdate</li>
                <li><strong>POST /people/{id}/merge</strong> - Merge duplicate people</li>
            </ul>
            <h3>Grouping Operations</h3>
            <ul>
                <li><strong>POST /events/{id}/images</strong> - Add images to event</li>
                <li><strong>DELETE /events/{id}/images/{imageId}</strong> - Remove from event</li>
                <li><strong>POST /events/{id}/split</strong> - Split event into multiple</li>
            </ul>
            <h3>Authentication</h3>
            <p>All endpoints require Cognito JWT token. Role-based access control.</p>
            <h3>Data Storage</h3>
            <p>DynamoDB for structured data. Neo4j for graph relationships. S3 for images.</p>`
    },
    "infra-feature-extraction": {
        title: "⚡ Feature Extraction (Infrastructure)",
        content: `<h3>Architecture</h3>
            <p>Step Functions Parallel state + 6 Lambda functions + SQS queues.</p>
            <h3>Parallel Execution</h3>
            <p>All 6 processes run simultaneously. Step Functions waits for completion before next stage.</p>
            <h3>Error Handling</h3>
            <p>Retry logic (3 attempts). Dead letter queues. CloudWatch alarms.</p>
            <h3>Scaling</h3>
            <p>Lambda concurrency: 1000 (adjustable). SQS buffers spikes.</p>`
    },
    "infra-metadata": {
        title: "📋 Metadata (Infrastructure)",
        content: `<h3>Lambda Function</h3>
            <p>Memory: 512MB, Timeout: 30s, Python 3.11</p>
            <h3>Libraries</h3>
            <p>Pillow (image processing), exiftool (EXIF extraction)</p>
            <h3>Storage</h3>
            <p>DynamoDB (status tracking), Neo4j (graph properties)</p>`
    },
    "infra-face-detection": {
        title: "👤 Face Detection (Infrastructure)",
        content: `<h3>Lambda Function</h3>
            <p>Memory: 2GB, Timeout: 300s (5 min)</p>
            <h3>AWS Rekognition</h3>
            <p>DetectFaces API: $1/1000 images. IndexFaces: $1/1000 faces.</p>
            <h3>Storage</h3>
            <p>Neo4j (face nodes), AWS OpenSearch (512-dim embeddings)</p>
            <h3>Consent Check</h3>
            <p>Query DynamoDB for user consent before processing.</p>
`
    },
    "infra-yolo": {
        title: "🎯 YOLO Detection (Infrastructure)",
        content: `<h3>Lambda Function</h3>
            <p>Memory: 3GB, Timeout: 900s (15 min)</p>
            <h3>SageMaker Endpoint</h3>
            <p>YOLOv8 model on ml.g4dn.xlarge GPU instance.</p>
            <h3>Auto-scaling</h3>
            <p>Min: 0 instances (serverless inference), Max: 5 instances</p>
            <h3>Storage</h3>
            <p>S3 (person crops), Neo4j (object keywords)</p>
`
    },
    "infra-image-embed": {
        title: "🖼️ Image Embeddings (Infrastructure)",
        content: `<h3>Lambda Function</h3>
            <p>Memory: 2GB, Timeout: 180s, Python 3.11</p>
            <h3>CLIP Model</h3>
            <p>OpenAI CLIP ViT-B/32. Run in Lambda or SageMaker.</p>
            <h3>Storage</h3>
            <p>AWS OpenSearch (vector search with k-NN plugin)</p>`
    },
    "infra-semantic": {
        title: "💬 Semantic LLM (Infrastructure)",
        content: `<h3>Lambda Function</h3>
            <p>Memory: 1GB, Timeout: 300s</p>
            <h3>AWS Bedrock (Claude 3.5 Sonnet)</h3>
            <p>$3/million input tokens, $15/million output tokens. Prompt caching: 90% discount.</p>
            <h3>3 Prompts</h3>
            <p>Event, background, photo descriptions. Each embedded separately.</p>
            <h3>Storage</h3>
            <p>AWS OpenSearch (768-dim embeddings)</p>`
    },
    "infra-ocr": {
        title: "📝 OCR Text (Infrastructure)",
        content: `<h3>Lambda Function</h3>
            <p>Memory: 1GB, Timeout: 120s</p>
            <h3>AWS Textract vs Tesseract</h3>
            <p>Textract: $1.50/1000 pages, high accuracy. Tesseract: Free, lower accuracy.</p>
            <h3>Storage</h3>
            <p>DynamoDB (extracted text with confidence scores)</p>`
    },
    "infra-yolo-split": {
        title: "🔀 YOLO Split (Infrastructure)",
        content: `<h3>Lambda Processing Logic</h3>
            <p>Parse YOLO output, route to appropriate handlers.</p>
            <h3>Branching</h3>
            <p>General objects → Neo4j. People → outfit analysis Lambda.</p>`
    },
    "infra-objects": {
        title: "📦 General Objects (Infrastructure)",
        content: `<h3>Storage</h3>
            <p>Neo4j as Image node properties: objects: ["cake", "balloons"]</p>
            <h3>Indexing</h3>
            <p>Full-text search index on object keywords.</p>`
    },
    "infra-people": {
        title: "🚶 Detected People (Infrastructure)",
        content: `<h3>Cropping Lambda</h3>
            <p>Extract person bounding boxes, save to S3.</p>
            <h3>Trigger</h3>
            <p>S3 event triggers outfit analysis Lambda.</p>`
    },
    "infra-outfit": {
        title: "👔 Outfit Analysis (Infrastructure)",
        content: `<h3>Lambda Function</h3>
            <p>Memory: 3GB, Timeout: 900s</p>
            <h3>Bedrock (Claude 3.5 Sonnet)</h3>
            <p>Structured prompts for clothing attributes.</p>
            <h3>SageMaker (Embeddings)</h3>
            <p>sentence-transformers for 768-dim vectors.</p>
            <h3>Storage</h3>
            <p>AWS OpenSearch (embeddings), Neo4j (structured data)</p>`
    },
    "infra-neo4j-1": {
        title: "🕸️ Neo4j Graph (Initial - Infrastructure)",
        content: `<h3>Hosting Options</h3>
            <p><strong>EC2:</strong> r6g.xlarge (4 vCPU, 32GB RAM) = $200/month</p>
            <p><strong>Neo4j Aura:</strong> Professional tier = $65-200/month</p>
            <h3>Backup</h3>
            <p>Automated snapshots to S3 every 6 hours. 30-day retention.</p>
            <h3>Performance</h3>
            <p>Cypher queries: <100ms. Graph algorithms: 1-10s.</p>`
    },
    "infra-user-input": {
        title: "👤 User Input (Infrastructure)",
        content: `<h3>Frontend</h3>
            <p>React SPA hosted on S3 + CloudFront CDN.</p>
            <h3>Initial Setup API</h3>
            <p>API Gateway + Lambda (user-input-handler) for family tree and face labeling.</p>
            <h3>Storage</h3>
            <p>DynamoDB (family tree), Neo4j (face labels)</p>
            <h3>Auth</h3>
            <p>Cognito JWT required for all API calls.</p>
            <h3>See Also</h3>
            <p>REST API section for ongoing CRUD operations on images, events, and people.</p>`
    },
    "infra-neo4j-2": {
        title: "🕸️ Neo4j Graph (Person Nodes - Infrastructure)",
        content: `<h3>Person Clustering Lambda</h3>
            <p>Memory: 2GB, Timeout: 600s. Triggered by user input.</p>
            <h3>Algorithm</h3>
            <p>DBSCAN clustering on face embeddings. User labels as ground truth.</p>
            <h3>Storage</h3>
            <p>Neo4j (Person nodes, [:IS_PERSON] relationships)</p>`
    },
    "infra-relationship-finding": {
        title: "🔍 Relationship Finding (Infrastructure)",
        content: `<h3>Step Functions Workflow</h3>
            <p>Parallel state with 4 Lambda functions.</p>
            <h3>Coordination</h3>
            <p>Wait for all matchers to complete. Aggregate results in final Lambda.</p>
`
    },
    "infra-knn": {
        title: "🔍 KNN Embedding (Infrastructure)",
        content: `<h3>Lambda Function</h3>
            <p>Memory: 2GB, Timeout: 300s</p>
            <h3>AWS OpenSearch</h3>
            <p>k-NN plugin for vector similarity search. K=50 nearest neighbors.</p>
            <h3>Approximate k-NN</h3>
            <p>100K+ images: Use approximate k-NN with HNSW algorithm (10x faster).</p>`
    },
    "infra-people-match": {
        title: "👥 People Set (Infrastructure)",
        content: `<h3>Lambda Function</h3>
            <p>Memory: 1GB, Timeout: 180s</p>
            <h3>Neo4j Queries</h3>
            <p>Cypher queries to find images with same people sets.</p>
            <h3>Age-Aware Logic</h3>
            <p>Filter by age ranges based on photo dates.</p>
`
    },
    "infra-temporal": {
        title: "📅 Temporal Clustering (Infrastructure)",
        content: `<h3>Lambda Function</h3>
            <p>Memory: 1GB, Timeout: 120s</p>
            <h3>DynamoDB Queries</h3>
            <p>Date range queries with aspect ratio filtering using GSI.</p>
            <h3>DynamoDB GSI</h3>
            <p>Global Secondary Index for fast date-based queries.</p>`
    },
    "infra-location": {
        title: "📍 Location Matching (Infrastructure)",
        content: `<h3>Lambda Function</h3>
            <p>Memory: 1GB, Timeout: 180s</p>
            <h3>Data Sources</h3>
            <p>DynamoDB (GPS data), AWS OpenSearch (background embeddings), Location Services API.</p>
            <h3>Haversine Distance</h3>
            <p>Calculate GPS distance for location clustering.</p>
`
    },
    "infra-neo4j-3": {
        title: "🕸️ Neo4j Graph (Enriched - Infrastructure)",
        content: `<h3>Relationship Aggregator Lambda</h3>
            <p>Memory: 2GB, Timeout: 600s. Combines all matching signals.</p>
            <h3>Weighted Edges</h3>
            <p>Create relationships with combined confidence scores.</p>
            <h3>CloudWatch Metrics</h3>
            <p>Track matching performance, accuracy, latency.</p>`
    },
    "infra-leiden": {
        title: "🔬 Leiden Detection (Infrastructure)",
        content: `<h3>Lambda Function</h3>
            <p>Memory: 10GB, Timeout: 900s (15 min)</p>
            <h3>Neo4j Graph Data Science</h3>
            <p>Leiden algorithm from GDS library.</p>
            <h3>Scheduled Execution</h3>
            <p>EventBridge rule: daily at 2 AM or on-demand trigger.</p>
            <h3>Storage</h3>
            <p>Results in DynamoDB + Neo4j Event nodes.</p>
`
    },
    "infra-human-review": {
        title: "👤 Human Review (Infrastructure)",
        content: `<h3>Frontend</h3>
            <p>React UI with real-time updates via WebSocket.</p>
            <h3>API</h3>
            <p>API Gateway + Lambda (review-handler)</p>
            <h3>Storage</h3>
            <p>DynamoDB (user actions), SQS (feedback queue)</p>
            <h3>Notifications</h3>
            <p>SNS for email/push notifications on review requests.</p>
            <h3>Feedback Loop</h3>
            <p>User corrections trigger retraining Lambda, update Neo4j weights.</p>
`
    },
    "infra-neo4j-final": {
        title: "🕸️ Final Neo4j Graph (Infrastructure)",
        content: `<h3>Event Finalizer Lambda</h3>
            <p>Memory: 1GB, Timeout: 300s. Creates Event nodes.</p>
            <h3>Storage</h3>
            <p>Neo4j (Event nodes, [:IN_EVENT] relationships)</p>
            <h3>Caching</h3>
            <p>DynamoDB with DAX for UI performance (event lists, image counts).</p>
            <h3>Backup</h3>
            <p>Daily snapshots to S3. 30-day retention. Cross-region replication.</p>`
    },
    "infra-output": {
        title: "✅ Grouped Events (Infrastructure)",
        content: `<h3>Frontend</h3>
            <p>React SPA on S3 + CloudFront CDN + Route 53 DNS.</p>
            <h3>API</h3>
            <p>API Gateway GraphQL + Lambda resolvers.</p>
            <h3>Caching</h3>
            <p>ElastiCache for fast queries. CloudFront edge caching.</p>
            <h3>Monitoring</h3>
            <p>CloudWatch RUM (Real User Monitoring) for frontend performance.</p>
`
    },
    "infra-monitoring": {
        title: "📊 Monitoring & Observability",
        content: `<h3>CloudWatch</h3>
            <p>Logs, metrics, alarms, dashboards, insights. Log retention: 30 days.</p>
            <h3>X-Ray</h3>
            <p>Distributed tracing across Lambda, API Gateway, databases.</p>
            <h3>Cost Explorer</h3>
            <p>Budget alerts, resource tagging, cost allocation.</p>
            <h3>Alarms</h3>
            <p>Lambda errors, API latency, database connections, queue depth.</p>
`
    },
    "infra-cost": {
        title: "💰 Monthly Cost Estimate",
        content: `<h3>Total: ~$1,020/month (10K images/month)</h3>
            <h3>Breakdown</h3>
            <ul>
                <li><strong>Compute:</strong> Lambda $50, SageMaker $380, EC2 (Neo4j) $200</li>
                <li><strong>Storage:</strong> S3 $2, RDS $100, Vector DB $100, ElastiCache $50</li>
                <li><strong>ML Services:</strong> Rekognition $10, Bedrock $50, Textract $5</li>
                <li><strong>Networking:</strong> CloudFront $20, API Gateway $10, Data Transfer $15</li>
                <li><strong>Other:</strong> Cognito $5, DynamoDB $10, SQS $2, EventBridge $1, CloudWatch $10</li>
            </ul>
            <h3>Optimization Strategies</h3>
            <ul>
                <li>Spot instances for SageMaker: -60% ($152 savings)</li>
                <li>Serverless inference: -40% ($152 savings)</li>
                <li>Reserved capacity for RDS/ElastiCache: -30% ($45 savings)</li>
                <li>Neo4j Aura instead of EC2: -$135 savings</li>
            </ul>
            <p><strong>Optimized Total: ~$536/month</strong></p>`
    }
};
