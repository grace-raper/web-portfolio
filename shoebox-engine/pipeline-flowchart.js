function createPipelineFlowchart() {
    const container = document.getElementById('pipeline-flowchart');
    
    const svg = `
<svg viewBox="0 0 1400 3800" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#424242" />
        </marker>
    </defs>
    
    <!-- Title -->
    <text x="700" y="30" class="title" font-size="18" text-anchor="middle">Image Event Grouping Pipeline</text>
    
    <!-- Input Image -->
    <g class="interactive-element" data-section="input">
        <rect x="600" y="60" width="200" height="60" class="box" rx="5"/>
        <text x="700" y="85" class="title" text-anchor="middle">Input Image</text>
        <text x="700" y="105" class="text" text-anchor="middle">(New image to process)</text>
    </g>
    
    <path d="M 700 120 L 700 160" class="arrow"/>
    
    <!-- Pre-processing -->
    <g class="interactive-element" data-section="preprocessing">
        <rect x="500" y="160" width="400" height="120" class="process" rx="5"/>
        <text x="700" y="185" class="title" text-anchor="middle">Pre-Processing</text>
        <text x="700" y="205" class="small" text-anchor="middle">• Security scanning (validate image file)</text>
        <text x="700" y="220" class="small" text-anchor="middle">• Extract existing metadata (EXIF, IPTC, XMP)</text>
        <text x="700" y="235" class="small" text-anchor="middle">• Aspect ratio analysis (era detection)</text>
        <text x="700" y="250" class="small" text-anchor="middle">• Scale to appropriate size for ML models</text>
        <text x="700" y="265" class="small" text-anchor="middle">• Prepare for MLLM upload</text>
    </g>
    
    <path d="M 700 280 L 700 320" class="arrow"/>
    
    <!-- Feature Extraction Hub -->
    <g class="interactive-element" data-section="feature-extraction">
        <rect x="600" y="320" width="200" height="50" class="decision" rx="5"/>
        <text x="700" y="345" class="title" text-anchor="middle">Feature Extraction</text>
        <text x="700" y="360" class="text" text-anchor="middle">(Parallel Processes)</text>
    </g>
    
    <!-- Branch 1: Metadata -->
    <path d="M 400 345 L 250 345" class="arrow"/>
    <g class="interactive-element" data-section="metadata">
        <rect x="50" y="400" width="200" height="100" class="data" rx="5"/>
        <text x="150" y="425" class="title" text-anchor="middle">1. Existing Metadata</text>
        <text x="150" y="445" class="small" text-anchor="middle">• Named people</text>
        <text x="150" y="460" class="small" text-anchor="middle">• Image dates</text>
        <text x="150" y="475" class="small" text-anchor="middle">• GPS coordinates</text>
        <text x="150" y="490" class="small" text-anchor="middle">• Aspect ratio (era signal)</text>
    </g>
    
    <!-- Branch 2: Face Detection -->
    <path d="M 700 370 L 700 410" class="arrow"/>
    <g class="interactive-element" data-section="face-detection">
        <rect x="550" y="410" width="300" height="110" class="process" rx="5"/>
        <text x="700" y="435" class="title" text-anchor="middle">2. Face Detection & Analysis</text>
        <text x="700" y="453" class="small" text-anchor="middle">(AWS Rekognition)</text>
        <text x="700" y="470" class="small" text-anchor="middle">• Detect all faces in image</text>
        <text x="700" y="485" class="small" text-anchor="middle">• Generate face embeddings (512-dim)</text>
        <text x="700" y="500" class="small" text-anchor="middle">• Age prediction, facial expression</text>
        <text x="700" y="515" class="small" text-anchor="middle">• Face size & quality metrics</text>
    </g>
    
    <!-- Face Data Output -->
    <path d="M 700 520 L 700 550" class="arrow"/>
    <g class="interactive-element" data-section="face-data">
        <rect x="550" y="550" width="300" height="130" class="data" rx="5"/>
        <text x="700" y="575" class="title" text-anchor="middle">Face Data Structure</text>
        <text x="700" y="595" class="small" text-anchor="middle">• BoundingBox (Height, Width, Left, Top)</text>
        <text x="700" y="610" class="small" text-anchor="middle">• Confidence, FaceId, UserId</text>
        <text x="700" y="625" class="small" text-anchor="middle">• AgeRange, Gender, Emotions</text>
        <text x="700" y="640" class="small" text-anchor="middle">• Beard, Eyeglasses, Smile, Sunglasses</text>
        <text x="700" y="655" class="small" text-anchor="middle">• Pose (Pitch, Roll, Yaw), Quality</text>
        <text x="700" y="670" class="small" text-anchor="middle">• Landmarks, EyeDirection, etc.</text>
    </g>
    
    <!-- Branch 3: Person Segmentation -->
    <path d="M 1000 345 L 1150 345" class="arrow"/>
    <g class="interactive-element" data-section="person-segmentation">
        <rect x="1150" y="400" width="200" height="80" class="process" rx="5"/>
        <text x="1250" y="425" class="title" text-anchor="middle">3. Person Segmentation</text>
        <text x="1250" y="443" class="small" text-anchor="middle">(YOLO)</text>
        <text x="1250" y="460" class="small" text-anchor="middle">• Find FACE + BODY boxes</text>
        <text x="1250" y="475" class="small" text-anchor="middle">• Crop individual people</text>
    </g>
    
    <!-- Outfit Processing -->
    <path d="M 1250 480 L 1250 520" class="arrow"/>
    <g class="interactive-element" data-section="outfit-processing">
        <rect x="1100" y="520" width="300" height="80" class="process" rx="5"/>
        <text x="1250" y="545" class="title" text-anchor="middle">Outfit Crop Processing</text>
        <text x="1250" y="565" class="small" text-anchor="middle">Challenge: Matching across lighting,</text>
        <text x="1250" y="580" class="small" text-anchor="middle">occlusion, angles</text>
        <text x="1250" y="595" class="small" text-anchor="middle">→ Pre-trained embeddings insufficient</text>
    </g>
    
    <!-- MLLM Path 1: Structured Description -->
    <path d="M 1250 600 L 1250 640" class="arrow"/>
    <g class="interactive-element" data-section="mllm-structured">
        <rect x="1050" y="640" width="200" height="100" class="mllm" rx="5"/>
        <text x="1150" y="665" class="title" text-anchor="middle">MLLM Approach 1:</text>
        <text x="1150" y="683" class="title" text-anchor="middle">Structured Description</text>
        <text x="1150" y="703" class="small" text-anchor="middle">• Upload outfit crops</text>
        <text x="1150" y="718" class="small" text-anchor="middle">• Fixed fashion vocabulary</text>
        <text x="1150" y="733" class="small" text-anchor="middle">• Embed text descriptions</text>
    </g>
    
    <!-- MLLM Path 2: Multi-label Tags -->
    <g class="interactive-element" data-section="mllm-tags">
        <rect x="1270" y="640" width="200" height="130" class="mllm" rx="5"/>
        <text x="1370" y="665" class="title" text-anchor="middle">MLLM Approach 2:</text>
        <text x="1370" y="683" class="title" text-anchor="middle">Multi-Label Tags</text>
        <text x="1370" y="703" class="small" text-anchor="middle">• Generate structured tags</text>
        <text x="1370" y="718" class="small" text-anchor="middle">• Multi-label binarizer (MLB)</text>
        <text x="1370" y="733" class="small" text-anchor="middle">• Weight attribute importance</text>
        <text x="1370" y="748" class="small" text-anchor="middle">e.g., 'maroon_pocket_square'</text>
        <text x="1370" y="763" class="small" text-anchor="middle">vs 'white_tshirt'</text>
    </g>
    
    <!-- MLLM Validation Note -->
    <g class="interactive-element" data-section="mllm-validation">
        <rect x="1050" y="790" width="420" height="60" class="decision" rx="5"/>
        <text x="1260" y="812" class="title" text-anchor="middle">⚠ MLLM Output Validation</text>
        <text x="1260" y="830" class="small" text-anchor="middle">Critical: Verify structured data format (e.g., valid JSON)</text>
        <text x="1260" y="845" class="small" text-anchor="middle">Implement checks to ensure expected returns</text>
    </g>
    
    <!-- Branch 4: Image Embeddings -->
    <path d="M 600 345 L 450 345 L 450 900" class="arrow"/>
    <g class="interactive-element" data-section="image-embeddings">
        <rect x="300" y="900" width="300" height="90" class="process" rx="5"/>
        <text x="450" y="925" class="title" text-anchor="middle">4. Whole Image Embedding</text>
        <text x="450" y="945" class="small" text-anchor="middle">• Generate vector representation (CLIP)</text>
        <text x="450" y="960" class="small" text-anchor="middle">• Captures composition, colors, style</text>
        <text x="450" y="975" class="small" text-anchor="middle">• Useful for visually similar photos</text>
    </g>
    
    <!-- Branch 5: Semantic Descriptions -->
    <path d="M 800 345 L 950 345 L 950 900" class="arrow"/>
    <g class="interactive-element" data-section="semantic-descriptions">
        <rect x="750" y="900" width="400" height="150" class="mllm" rx="5"/>
        <text x="950" y="925" class="title" text-anchor="middle">5. LLM Semantic Descriptions</text>
        <text x="950" y="943" class="small" text-anchor="middle">(Multiple prompts → Multiple embeddings)</text>
        <text x="950" y="965" class="small" text-anchor="middle">• "Describe the occasion/holiday/celebration"</text>
        <text x="950" y="980" class="small" text-anchor="middle">  → event_embedding</text>
        <text x="950" y="1000" class="small" text-anchor="middle">• "Describe the background/setting/location"</text>
        <text x="950" y="1015" class="small" text-anchor="middle">  → background_embedding</text>
        <text x="950" y="1035" class="small" text-anchor="middle">• "Describe the photo itself"</text>
        <text x="950" y="1050" class="small" text-anchor="middle">  → description_embedding</text>
    </g>
    
    <!-- Branch 6: Text Extraction -->
    <g class="interactive-element" data-section="text-extraction">
        <rect x="50" y="550" width="200" height="100" class="process" rx="5"/>
        <text x="150" y="575" class="title" text-anchor="middle">6. Text Extraction</text>
        <text x="150" y="593" class="small" text-anchor="middle">(OCR)</text>
        <text x="150" y="610" class="small" text-anchor="middle">• Detect text in image</text>
        <text x="150" y="625" class="small" text-anchor="middle">• Timestamps/dates</text>
        <text x="150" y="640" class="small" text-anchor="middle">• Signs, captions</text>
    </g>
    
    <!-- Convergence to Graph Database -->
    <path d="M 150 500 L 150 1150 L 500 1150" class="arrow"/>
    <path d="M 150 650 L 150 1150" class="arrow"/>
    <path d="M 450 990 L 450 1150 L 550 1150" class="arrow"/>
    <path d="M 700 680 L 700 1150 L 650 1150" class="arrow"/>
    <path d="M 950 1050 L 950 1150 L 750 1150" class="arrow"/>
    <path d="M 1150 850 L 700 850 L 700 1150" class="arrow"/>
    
    <!-- Graph Database -->
    <g class="interactive-element" data-section="graph-database">
        <rect x="400" y="1150" width="600" height="180" class="graph" rx="5"/>
        <text x="700" y="1180" class="title" text-anchor="middle">Graph Database Organization (Neo4j)</text>
        <text x="700" y="1205" class="small" text-anchor="middle">Nodes: Image, Face, Person, Event, Group</text>
        <text x="700" y="1225" class="small" text-anchor="middle">Relationships: FROM_IMAGE, IS_PERSON, REPRESENTATIVE_FACE,</text>
        <text x="700" y="1240" class="small" text-anchor="middle">IN_GROUP, FROM_EVENT, SEMANTIC_SIMILAR_IMAGE,</text>
        <text x="700" y="1255" class="small" text-anchor="middle">SEMANTIC_SIMILAR_DESC, SEMANTIC_SIMILAR_BACKGROUND,</text>
        <text x="700" y="1270" class="small" text-anchor="middle">SEMANTIC_SIMILAR_EVENT, CLOTHING_MATCH, CLOTHING_MATCH_IMAGE</text>
        <text x="700" y="1295" class="small" text-anchor="middle">Store all features as node properties for complex queries</text>
        <text x="700" y="1315" class="small" text-anchor="middle">Enable relationship-based queries & community detection</text>
    </g>
    
    <path d="M 700 1330 L 700 1380" class="arrow"/>
    
    <!-- KNN Matching -->
    <g class="interactive-element" data-section="knn-matching">
        <rect x="350" y="1380" width="700" height="220" class="matching" rx="5"/>
        <text x="700" y="1410" class="title" text-anchor="middle">KNN Matching & Relationship Creation</text>
        <text x="700" y="1435" class="small" text-anchor="middle">As images are added, perform K-Nearest Neighbors searches across features:</text>
        <text x="700" y="1460" class="small" text-anchor="middle">• Outfit embeddings → Top N outfit matches (N=20-50)</text>
        <text x="700" y="1475" class="small" text-anchor="middle">• Background embeddings → Same location/setting</text>
        <text x="700" y="1490" class="small" text-anchor="middle">• Event embeddings → Same occasion/holiday</text>
        <text x="700" y="1505" class="small" text-anchor="middle">• Face embeddings → Same people present</text>
        <text x="700" y="1520" class="small" text-anchor="middle">• Image embeddings → Visually similar photos</text>
        <text x="700" y="1540" class="small" text-anchor="middle">Create weighted edges between matched images/faces</text>
        <text x="700" y="1560" class="small" text-anchor="middle">Weight = combined confidence from multiple features</text>
        <text x="700" y="1580" class="small" text-anchor="middle">Store relationships in graph database</text>
    </g>
    
    <path d="M 700 1600 L 700 1650" class="arrow"/>
    
    <!-- People Matching -->
    <g class="interactive-element" data-section="people-matching">
        <rect x="350" y="1650" width="700" height="180" class="matching" rx="5"/>
        <text x="700" y="1680" class="title" text-anchor="middle">People Set Matching (Age-Aware)</text>
        <text x="700" y="1705" class="small" text-anchor="middle">Compare sets of people across images with age consideration:</text>
        <text x="700" y="1730" class="small" text-anchor="middle">• Grace(5), Ava(2), Claire(4) ↔ Grace(4), Ava(2), Claire(4)</text>
        <text x="700" y="1745" class="small" text-anchor="middle">  → High match (ages within 1 year, same people)</text>
        <text x="700" y="1765" class="small" text-anchor="middle">• Grace(5), Ava(2), Claire(4) ↔ Grace(10), Hayden(12), Kobe(30)</text>
        <text x="700" y="1780" class="small" text-anchor="middle">  → Low match (Grace aged 5 years, different people)</text>
        <text x="700" y="1800" class="small" text-anchor="middle">Person popularity weighting: Rare people (aunt in 20 photos)</text>
        <text x="700" y="1815" class="small" text-anchor="middle">are stronger signals than common people (child in 1000s)</text>
    </g>
    
    <path d="M 700 1830 L 700 1880" class="arrow"/>
    
    <!-- Scaling Strategy -->
    <g class="interactive-element" data-section="scaling">
        <rect x="350" y="1880" width="700" height="180" class="decision" rx="5"/>
        <text x="700" y="1910" class="title" text-anchor="middle">⚡ Scaling Strategy for Large Collections</text>
        <text x="700" y="1935" class="small" text-anchor="middle">Cannot compare all embeddings when you have 100K+ images:</text>
        <text x="700" y="1955" class="small" text-anchor="middle">• Temporal pre-filtering: Only compare within ±2 years</text>
        <text x="700" y="1970" class="small" text-anchor="middle">• Aspect ratio bucketing: Group by era before comparison</text>
        <text x="700" y="1985" class="small" text-anchor="middle">• Person-based indexing: Search only images with same people</text>
        <text x="700" y="2000" class="small" text-anchor="middle">• Approximate KNN (FAISS/HNSW): Sub-linear search time</text>
        <text x="700" y="2015" class="small" text-anchor="middle">• Hierarchical clustering: Broad clusters first, then refine</text>
        <text x="700" y="2030" class="small" text-anchor="middle">• Collapsed vectors: Combine features for faster initial pass</text>
        <text x="700" y="2045" class="small" text-anchor="middle">• Progressive refinement: Cheap filters first, expensive last</text>
    </g>
    
    <path d="M 700 2060 L 700 2110" class="arrow"/>
    
    <!-- Leiden Community Detection -->
    <g class="interactive-element" data-section="leiden">
        <rect x="350" y="2110" width="700" height="160" class="decision" rx="5"/>
        <text x="700" y="2140" class="title" text-anchor="middle">Leiden Community Detection</text>
        <text x="700" y="2165" class="small" text-anchor="middle">Run Leiden algorithm on graph to detect event communities:</text>
        <text x="700" y="2185" class="small" text-anchor="middle">• Images/faces are nodes, KNN matches are weighted edges</text>
        <text x="700" y="2200" class="small" text-anchor="middle">• Edge weight = combined similarity from multiple features</text>
        <text x="700" y="2215" class="small" text-anchor="middle">• Leiden partitions graph into communities (likely events)</text>
        <text x="700" y="2230" class="small" text-anchor="middle">• Resolution parameter controls granularity</text>
        <text x="700" y="2250" class="small" text-anchor="middle">• Generate event metadata: date, caption, location, attendees</text>
    </g>
    
    <path d="M 700 2270 L 700 2320" class="arrow"/>
    
    <!-- Human in the Loop -->
    <g class="interactive-element" data-section="human-review">
        <rect x="350" y="2320" width="700" height="180" class="process" rx="5"/>
        <text x="700" y="2350" class="title" text-anchor="middle">Human-in-the-Loop Verification</text>
        <text x="700" y="2375" class="small" text-anchor="middle">Present suggested events to user for review:</text>
        <text x="700" y="2395" class="small" text-anchor="middle">• Show event with all metadata & confidence score</text>
        <text x="700" y="2410" class="small" text-anchor="middle">• Grid view of all images in community</text>
        <text x="700" y="2425" class="small" text-anchor="middle">• User actions: ✅ Confirm, ❌ Remove images, ➕ Add missing,</text>
        <text x="700" y="2440" class="small" text-anchor="middle">  📝 Edit metadata, 🔀 Split event, 🔗 Merge events</text>
        <text x="700" y="2460" class="small" text-anchor="middle">• User corrections update graph relationships</text>
        <text x="700" y="2475" class="small" text-anchor="middle">• Feedback loop: Adjust weights, retrain classifiers</text>
        <text x="700" y="2490" class="small" text-anchor="middle">• Continuous improvement with each correction</text>
    </g>
    
    <path d="M 700 2500 L 700 2550" class="arrow"/>
    
    <!-- Output -->
    <g class="interactive-element" data-section="output">
        <rect x="500" y="2550" width="400" height="80" class="box" rx="5"/>
        <text x="700" y="2580" class="title" text-anchor="middle">Grouped Events</text>
        <text x="700" y="2600" class="small" text-anchor="middle">Images organized by event with metadata</text>
        <text x="700" y="2615" class="small" text-anchor="middle">Ready for user interaction, sharing, export</text>
    </g>
    
    <!-- Legend -->
    <text x="100" y="2700" class="title">Legend:</text>
    <rect x="100" y="2710" width="80" height="30" class="box" rx="3"/>
    <text x="140" y="2730" class="small" text-anchor="middle">Input/Output</text>
    
    <rect x="200" y="2710" width="80" height="30" class="process" rx="3"/>
    <text x="240" y="2730" class="small" text-anchor="middle">Processing</text>
    
    <rect x="300" y="2710" width="80" height="30" class="decision" rx="3"/>
    <text x="340" y="2730" class="small" text-anchor="middle">Decision</text>
    
    <rect x="400" y="2710" width="80" height="30" class="data" rx="3"/>
    <text x="440" y="2730" class="small" text-anchor="middle">Data Store</text>
    
    <rect x="500" y="2710" width="80" height="30" class="mllm" rx="3"/>
    <text x="540" y="2730" class="small" text-anchor="middle">MLLM</text>
    
    <rect x="600" y="2710" width="80" height="30" class="graph" rx="3"/>
    <text x="640" y="2730" class="small" text-anchor="middle">Graph DB</text>
    
    <rect x="700" y="2710" width="80" height="30" class="matching" rx="3"/>
    <text x="740" y="2730" class="small" text-anchor="middle">Matching</text>
    
    <!-- Key Insights Box -->
    <g class="interactive-element" data-section="insights">
        <rect x="100" y="2770" width="1200" height="140" fill="#fafafa" stroke="#666" stroke-width="1" rx="5"/>
        <text x="700" y="2800" class="title" text-anchor="middle">Key Design Insights</text>
        <text x="110" y="2825" class="small">• Pre-trained outfit embeddings struggle with real-world variations (lighting, occlusion) → MLLM text descriptions work better</text>
        <text x="110" y="2845" class="small">• Multi-label tagging with MLB enables weighted attribute matching (rare features = stronger signals, like TF-IDF)</text>
        <text x="110" y="2865" class="small">• Multiple semantic embeddings (event, background, description) capture different aspects for orthogonal matching</text>
        <text x="110" y="2885" class="small">• Age-aware people matching prevents false positives (Grace at 5 vs Grace at 10 are different events)</text>
        <text x="110" y="2905" class="small">• Scaling requires smart pre-filtering and approximate KNN to handle 100K+ images efficiently</text>
    </g>
</svg>
    `;
    
    container.innerHTML = svg;
    attachInteractiveListeners();
}
