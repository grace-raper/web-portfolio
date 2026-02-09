// Comprehensive sidebar content for both pipeline and infrastructure pages
const sidebarContent = {
    // Pipeline page content
    input: { title: "Input Image", content: `<h3>Overview</h3><p>The pipeline begins when a new image is uploaded to the system.</p><h3>Supported Formats</h3><ul><li>JPEG/JPG, PNG, HEIC/HEIF, TIFF, RAW formats</li></ul>` },
    
    preprocessing: { title: "Pre-Processing", content: `<h3>Security & Metadata</h3><p>Validate file, extract EXIF/IPTC/XMP data, analyze aspect ratio for era detection.</p><div class="highlight"><strong>Aspect Ratio Signal:</strong> 1:1 = Polaroid (1970s-90s), 3:2 = Film 4x6, 4:3 = Early digital, 16:9 = Modern smartphone</div>` },
    
    "feature-extraction": { title: "Feature Extraction Hub", content: `<h3>Six Parallel Processes</h3><ol><li>Existing Metadata - EXIF, dates, GPS</li><li>Face Detection - AWS Rekognition</li><li>Person Segmentation - YOLO + outfits</li><li>Image Embeddings - CLIP vectors</li><li>Semantic Descriptions - LLM text embeddings</li><li>Text Extraction - OCR timestamps</li></ol>` },
    
    metadata: { title: "Existing Metadata", content: `<h3>Key Fields</h3><p>People names, dates, GPS, camera info, aspect ratio</p><div class="highlight"><strong>Aspect Ratio Importance:</strong> Pre-filter by era before expensive ML comparisons. Reduces search space by 75%.</div>` },
    
    "face-detection": { title: "Face Detection", content: `<h3>AWS Rekognition</h3><p>512-dim face embeddings, age prediction (crucial for temporal matching), emotions, quality metrics</p><div class="code-block">if similarity > 0.85:\n    same_person = True</div>` },
    
    "face-data": { title: "Face Data Structure", content: `<h3>50+ Properties</h3><p>BoundingBox, age range, gender, emotions, pose, quality, accessories (glasses, beard, smile), YOLO body box</p>` },
    
    "person-segmentation": { title: "Person Segmentation (YOLO)", content: `<h3>Why YOLO?</h3><p>Face detection only gives face region. Need full body for outfit analysis. YOLO provides body bounding boxes, matches face to body.</p>` },
    
    "outfit-processing": { title: "Outfit Challenge", content: `<h3>Why Pre-trained Embeddings Fail</h3><p>Same outfit in different lighting produces different embeddings (similarity as low as 0.4). Solution: MLLM text descriptions are more stable.</p>` },
    
    "mllm-structured": { title: "MLLM Structured Descriptions", content: `<h3>Fixed Vocabulary</h3><p>Provide controlled fashion terms to MLLM. Output: "Navy solid button-down shirt, khaki slacks"</p><p>Embed text → 768-dim vector. Text embeddings more consistent than image embeddings across lighting.</p>` },
    
    "mllm-tags": { title: "Multi-Label Binarizer (MLB)", content: `<h3>What is MLB?</h3><p>Multi-Label Binarizer converts tags to binary vectors for weighted matching.</p><div class="code-block">tags = ["navy_shirt", "maroon_pocket_square"]\nmlb.transform(tags) → [1,0,1,0,0,...]</div><h3>Weighted Matching</h3><p>Rare attributes (maroon_pocket_square) get higher weights than common ones (white_tshirt). Like TF-IDF for clothing!</p><div class="code-block">weight = 1 / log(frequency + 1)\nrare_item: 0.91\ncommon_item: 0.15</div>` },
    
    "mllm-validation": { title: "MLLM Validation", content: `<h3>Why Critical?</h3><p>MLLMs can hallucinate, return invalid JSON, miss fields, wrong types.</p><h3>Validation Steps</h3><ol><li>Check valid JSON</li><li>Verify required fields</li><li>Validate types</li><li>Check vocabulary compliance</li></ol><div class="warning"><strong>Always:</strong> Timeout (30s), retry logic (3x), fallback strategies</div>` },
    
    "image-embeddings": { title: "Image Embeddings", content: `<h3>CLIP Whole Image</h3><p>512-dim vector captures composition, colors, style. Useful for sequential photos, similar locations, visual duplicates.</p>` },
    
    "semantic-descriptions": { title: "Semantic Descriptions", content: `<h3>Three Prompts → Three Embeddings</h3><ol><li><strong>Event:</strong> "Describe occasion/holiday" → event_embedding</li><li><strong>Background:</strong> "Describe setting/location" → background_embedding</li><li><strong>Description:</strong> "Describe photo itself" → description_embedding</li></ol><div class="highlight"><strong>Orthogonal Matching:</strong> Same location different events, same event different locations - both valid relationships!</div>` },
    
    "text-extraction": { title: "Text Extraction (OCR)", content: `<h3>Extract Text from Images</h3><p>Timestamps (camera/lab stamps), captions, signs, handwritten notes. Critical for scanned photos without EXIF data.</p><p>Example: "DEC 25 1995" on photo border</p>` },
    
    "graph-database": { title: "Neo4j Graph Database", content: `<h3>Nodes</h3><p>Image, Face, Person, Event, Group</p><h3>Relationships</h3><p>FROM_IMAGE, IS_PERSON, CLOTHING_MATCH, SEMANTIC_SIMILAR_IMAGE, SEMANTIC_SIMILAR_DESC, SEMANTIC_SIMILAR_BACKGROUND, SEMANTIC_SIMILAR_EVENT, FROM_EVENT, IN_GROUP</p><div class="success"><strong>Performance:</strong> Graph traversal 10-100x faster than SQL joins for multi-hop queries</div>` },
    
    "knn-matching": { title: "KNN Matching", content: `<h3>Multi-Feature KNN</h3><p>For each image, find top N matches across features:</p><ul><li>Outfit embeddings → Top 50</li><li>Background → Top 30</li><li>Event → Top 30</li><li>Faces → Top 50 per face</li><li>Image → Top 20</li></ul><p>Create weighted relationships in graph. Combined confidence from multiple signals.</p>` },
    
    "people-matching": { title: "Age-Aware People Matching", content: `<h3>Core Insight</h3><p>Same people = likely same event, BUT people age!</p><div class="code-block">Grace(5), Ava(2), Claire(4) ↔\nGrace(4), Ava(2), Claire(4)\n→ High match (ages within 1 year)\n\nGrace(5), Ava(2), Claire(4) ↔\nGrace(10), Hayden(12), Kobe(30)\n→ Low match (Grace aged 5 years)</div><h3>Person Popularity</h3><p>Rare people (aunt in 20 photos) are stronger signals than common people (child in 1000s).</p>` },
    
    scaling: { title: "Scaling Strategy", content: `<h3>The Problem</h3><p>100K images = 10 billion comparisons = 115 days!</p><h3>Solutions</h3><ol><li><strong>Temporal filter:</strong> Only ±2 years (95% reduction)</li><li><strong>Aspect ratio buckets:</strong> Group by era (75% reduction)</li><li><strong>Person indexing:</strong> Only images with same people (90% reduction)</li><li><strong>FAISS HNSW:</strong> Approximate KNN, O(log n) instead of O(n)</li><li><strong>Hierarchical clustering:</strong> Broad then refine</li><li><strong>Collapsed vectors:</strong> Combine features for faster initial pass</li><li><strong>Progressive refinement:</strong> Cheap filters first, expensive last</li></ol><div class="success"><strong>Result:</strong> 100K images in 2-3 hours instead of 115 days (1000x speedup)</div>` },
    
    leiden: { title: "Leiden Community Detection", content: `<h3>What is Leiden?</h3><p>Graph algorithm that finds densely connected clusters (communities). Faster and more accurate than Louvain.</p><h3>Process</h3><ol><li>Graph with weighted edges from KNN matches</li><li>Run Leiden algorithm</li><li>Each community = likely event</li><li>Generate metadata: date, caption, location, attendees</li></ol><div class="code-block">resolution = 0.5  // Larger events\nresolution = 1.0  // Balanced\nresolution = 2.0  // Granular events</div>` },
    
    "human-review": { title: "Human-in-the-Loop", content: `<h3>User Actions</h3><ul><li>✅ Confirm event</li><li>❌ Remove images</li><li>➕ Add missing images</li><li>📝 Edit metadata</li><li>🔀 Split event</li><li>🔗 Merge events</li></ul><h3>Feedback Loop</h3><p>User corrections update graph relationships, adjust feature weights, retrain classifiers.</p><div class="success"><strong>Continuous Improvement:</strong> After 1000 reviews, accuracy improves from 85% to 92-95%</div>` },
    
    output: { title: "Grouped Events", content: `<h3>Final Output</h3><p>Organized events with metadata, ready for user interaction.</p><h3>Features</h3><ul><li>Timeline & grid views</li><li>People filter</li><li>Confidence badges</li><li>Edit tools</li><li>Export options (ZIP, JSON, PDF)</li></ul>` },
    
    insights: { title: "Key Insights", content: `<h3>Design Lessons</h3><ol><li><strong>Pre-trained embeddings fail</strong> for outfits due to lighting variations</li><li><strong>MLLM + text embeddings win</strong> - more stable than image embeddings</li><li><strong>Weighted MLB matching</strong> - rare attributes are stronger signals (TF-IDF for clothing)</li><li><strong>Multiple semantic embeddings</strong> capture orthogonal relationships</li><li><strong>Age-aware people matching</strong> prevents false positives</li><li><strong>Smart pre-filtering</strong> essential for scaling to 100K+ images</li></ol>` },
    
    // Infrastructure page content
    "user-upload": { title: "User Upload", content: `<h3>Client Upload</h3><p>Web or mobile client uploads images via presigned S3 URLs from API Gateway.</p>` },
    
    "api-gateway": { title: "API Gateway", content: `<h3>AWS API Gateway</h3><p>RESTful API endpoints, Cognito authentication, request/response transformation, generate presigned S3 URLs for direct upload.</p>` },
    
    cognito: { title: "Amazon Cognito", content: `<h3>Authentication Service</h3><p>User authentication, JWT tokens, social identity providers (Google, Facebook), MFA support.</p>` },
    
    s3: { title: "Amazon S3", content: `<h3>Storage Buckets</h3><ul><li>images-raw/ - Originals</li><li>images-processed/ - Scaled versions</li><li>crops/ - Person/face crops</li><li>embeddings/ - Cached vectors</li></ul><p>Versioning, lifecycle policies, encryption enabled. Cost: ~$2/month for 100GB</p>` },
    
    eventbridge: { title: "EventBridge", content: `<h3>Event Orchestration</h3><p>S3 upload triggers, scheduled matching (every 5 min), nightly community detection, route events to SQS queues.</p>` },
    
    sqs: { title: "Amazon SQS", content: `<h3>Message Queues</h3><ul><li>preprocessing-queue</li><li>face-detection-queue</li><li>outfit-analysis-queue</li><li>matching-queue</li></ul><p>Dead letter queues (DLQ) for failed messages. Decouples processing stages.</p>` },
    
    "lambda-hub": { title: "Lambda Functions", content: `<h3>Serverless Compute</h3><p>Multiple Lambda functions for different stages. Scale automatically, pay only for compute time.</p>` },
    
    "lambda-preprocessor": { title: "Preprocessor Lambda", content: `<h3>image-preprocessor</h3><p>Python 3.11, 1024 MB, 60s timeout</p><p>Security scan, EXIF extraction, image scaling, send to downstream queues.</p>` },
    
    "lambda-face": { title: "Face Detection Lambda", content: `<h3>face-detector</h3><p>Python 3.11, 2048 MB, 300s timeout</p><p>Call AWS Rekognition, store face data in Neo4j, create Face→Person relationships.</p>` },
    
    "lambda-outfit": { title: "Outfit Analysis Lambda", content: `<h3>outfit-analyzer</h3><p>Python 3.11, 3008 MB, 900s timeout</p><p>Call SageMaker YOLO, crop people, call Bedrock for descriptions, generate embeddings & MLB tags.</p>` },
    
    rekognition: { title: "AWS Rekognition", content: `<h3>Face Analysis Service</h3><p>Face detection, 512-dim embeddings, age/gender/emotions. Cost: $0.001 per image.</p>` },
    
    sagemaker: { title: "Amazon SageMaker", content: `<h3>ML Model Hosting</h3><p>YOLO person detection, sentence transformer embeddings. Endpoint: ml.g4dn.xlarge (GPU), auto-scaling 0-5 instances. Cost: $0.526/hour.</p>` },
    
    bedrock: { title: "Amazon Bedrock", content: `<h3>LLM Service</h3><p>Claude 3.5 Sonnet (outfits), Claude 3 Haiku (descriptions), Titan embeddings. Prompt caching for cost savings. Rate limits: 100 req/min. Cost: ~$0.005 per image.</p>` },
    
    "step-functions": { title: "Step Functions", content: `<h3>Workflow Orchestration</h3><p>Multi-step workflows, parallel Lambda execution, error handling & retries, visual monitoring. Cost: $0.025 per 1K transitions.</p>` },
    
    databases: { title: "Database Layer", content: `<h3>Multi-Database Strategy</h3><p>Right tool for each job: Neo4j for graphs, PostgreSQL for relational, Vector DB for embeddings.</p>` },
    
    neo4j: { title: "Neo4j Graph Database", content: `<h3>Graph Storage</h3><p>Image, Face, Person nodes with relationships. Fast graph queries (Cypher), community detection algorithms. Hosted: EC2 or Neo4j Aura. Cost: ~$200-500/month.</p>` },
    
    rds: { title: "RDS PostgreSQL", content: `<h3>Relational Database</h3><p>User accounts, image metadata, job tracking, user feedback. Instance: db.t3.medium, Multi-AZ, automated backups. Cost: ~$100/month.</p>` },
    
    "vector-db": { title: "Vector Database", content: `<h3>Embedding Storage</h3><p>Pinecone / Weaviate / pgvector. Fast approximate KNN search for image, outfit, semantic embeddings. Cost: ~$70-150/month.</p>` },
    
    cloudwatch: { title: "CloudWatch", content: `<h3>Monitoring & Logging</h3><p>Centralized logs from all Lambdas, metrics (invocations, duration, errors), alarms, dashboards, CloudWatch Insights for log analysis.</p>` },
    
    hosting: { title: "Frontend Hosting", content: `<h3>Web Hosting</h3><p>CloudFront (CDN), S3 static website, Route 53 (DNS), Certificate Manager (SSL/TLS). Cost: ~$20-50/month.</p>` },
    
    "cost-summary": { title: "Cost Summary", content: `<h3>Monthly Cost (10K images/month)</h3><ul><li>S3: $2</li><li>Lambda: $50</li><li>Rekognition: $10</li><li>Bedrock: $50</li><li>SageMaker: $380</li><li>RDS: $100</li><li>Neo4j: $300</li><li>Vector DB: $100</li><li>Other: $66</li></ul><div class="highlight"><strong>Total: ~$1,058/month</strong></div><p>Can reduce SageMaker cost with serverless inference or spot instances.</p>` },
    
    "architecture-diagram": { title: "Complete Data Flow", content: `<h3>End-to-End Flow</h3><p>User → API Gateway → S3 → EventBridge → SQS → Lambda (parallel processing) → Rekognition/SageMaker/Bedrock → Neo4j/Vector DB → Matching Engine → Community Detection → User Review → Feedback Loop</p>` },
    
    "architecture-principles": { title: "Architecture Principles", content: `<h3>Key Principles</h3><ol><li><strong>Serverless-first:</strong> Auto-scaling, pay per use</li><li><strong>Event-driven:</strong> S3 triggers processing pipelines</li><li><strong>Asynchronous:</strong> Queue-based for variable processing times</li><li><strong>Separation of concerns:</strong> Different Lambdas for different stages</li><li><strong>Multi-database:</strong> Right tool for each job</li><li><strong>Managed services:</strong> Leverage AWS ML services vs managing models</li></ol>` }
};
