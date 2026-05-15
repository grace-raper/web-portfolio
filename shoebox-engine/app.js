const CORRECT_PASSWORD = "shoeboxlabs";

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    
    if (password === CORRECT_PASSWORD) {
        sessionStorage.setItem('authenticated', 'true');
        showApp();
    } else {
        document.getElementById('errorMessage').classList.add('show');
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
});

function showApp() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('appContainer').classList.add('active');
    initializeApp();
}

function logout() {
    sessionStorage.removeItem('authenticated');
    document.getElementById('appContainer').classList.remove('active');
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('password').value = '';
    document.getElementById('errorMessage').classList.remove('show');
}

function initializeApp() {
    // Initialize both flowcharts
    createPipelineFlowchart();
    createInfrastructureFlowchart();
    
    // Attach click handlers to interactive elements
    attachInteractiveListeners();
    
    // Set up page navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const pages = document.querySelectorAll('.page-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetPage = this.dataset.page;
            
            // Update active tab
            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update active page
            pages.forEach(p => p.classList.remove('active'));
            document.getElementById(`${targetPage}-page`).classList.add('active');
            
            // Reset sidebar
            const sidebar = document.getElementById('sidebar');
            sidebar.innerHTML = `
                <h2>Welcome</h2>
                <p>Click on any element in the flowchart to see detailed information about that stage of the ${targetPage === 'pipeline' ? 'data pipeline' : 'AWS infrastructure'}.</p>
                <div class="highlight">
                    <strong>💡 Tip:</strong> Each colored box represents a different type of operation.
                </div>
            `;
        });
    });
}

function attachInteractiveListeners() {
    const interactiveElements = document.querySelectorAll('.interactive-element');
    const sidebar = document.getElementById('sidebar');
    
    interactiveElements.forEach(element => {
        element.addEventListener('click', function() {
            const section = this.dataset.section;
            
            // Remove active class from all elements
            interactiveElements.forEach(el => el.classList.remove('active'));
            
            // Add active class to clicked element
            this.classList.add('active');
            
            // Update sidebar content
            if (sidebarContent[section]) {
                sidebar.innerHTML = `
                    <h2>${sidebarContent[section].title}</h2>
                    ${sidebarContent[section].content}
                `;
                sidebar.classList.remove('collapsed');
                sidebar.scrollTop = 0;
            }
        });
    });
}

// Check if already authenticated
if (sessionStorage.getItem('authenticated') === 'true') {
    showApp();
}
