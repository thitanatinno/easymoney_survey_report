// UI Elements
const siteSelect = document.getElementById('siteSelect');
const generateBtn = document.getElementById('generateBtn');
const loading = document.getElementById('loading');
const message = document.getElementById('message');
const form = document.getElementById('reportForm');

// Fetch sites on page load
async function loadSites() {
    try {
        const response = await fetch(`/generate/sites/${uid}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch sites');
        }

        const sites = await response.json();
        
        // Clear loading option
        siteSelect.innerHTML = '<option value="">-- Select a site --</option>';
        
        // Add sites to dropdown
        sites.forEach(site => {
            const option = document.createElement('option');
            option.value = site.siteid;
            option.textContent = site.sitename;
            siteSelect.appendChild(option);
        });

        // Enable dropdown
        siteSelect.disabled = false;
        
        // Enable button when site is selected
        siteSelect.addEventListener('change', () => {
            generateBtn.disabled = !siteSelect.value;
        });

    } catch (error) {
        console.error('Error loading sites:', error);
        siteSelect.innerHTML = '<option value="">Error loading sites</option>';
        showMessage('Failed to load sites. Please refresh the page.', 'error');
    }
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const siteId = siteSelect.value;
    
    if (!siteId) {
        showMessage('Please select a site', 'error');
        return;
    }

    // Show loading
    loading.classList.add('active');
    generateBtn.disabled = true;
    message.classList.remove('active');

    try {
        const response = await fetch(`/generate/${uid}/${siteId}`);
        
        if (!response.ok) {
            throw new Error('Failed to generate report');
        }

        // Get filename from Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'report.xlsx';
        if (contentDisposition) {
            const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        // Download the file
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        showMessage('Report generated successfully!', 'success');

    } catch (error) {
        console.error('Error generating report:', error);
        showMessage('Failed to generate report. Please try again.', 'error');
    } finally {
        loading.classList.remove('active');
        generateBtn.disabled = false;
    }
});

function showMessage(text, type) {
    message.textContent = text;
    message.className = 'message active ' + type;
    
    if (type === 'success') {
        setTimeout(() => {
            message.classList.remove('active');
        }, 5000);
    }
}

// Load sites when page loads
loadSites();
