/**
 * Example Test Script
 * 
 * This file demonstrates how to test the API endpoints
 * Run after starting the server with: npm run dev
 */

// Example 1: Health Check
console.log('\n=== Testing Health Check ===');
console.log('Command:');
console.log('curl http://localhost:3000/health\n');

// Example 2: Generate Report (you need real uid and id)
console.log('\n=== Testing Report Generation ===');
console.log('Replace YOUR_ASSET_UID and YOUR_SUBMISSION_ID with actual values from Kobo\n');
console.log('Command:');
console.log('curl http://localhost:3000/generate/YOUR_ASSET_UID/YOUR_SUBMISSION_ID --output report.xlsx\n');

// Example 3: How to find your Asset UID and Submission ID
console.log('\n=== How to Find IDs ===');
console.log('1. Asset UID:');
console.log('   - Go to your form in KoboToolbox');
console.log('   - Look at the URL: https://kf.kobotoolbox.org/#/forms/[ASSET_UID]');
console.log('   - Example: aBC123xyz456\n');

console.log('2. Submission ID:');
console.log('   - Open your form data');
console.log('   - Click on a submission');
console.log('   - Look for _id field in the JSON data');
console.log('   - Example: 649067845\n');

// Example 4: Using JavaScript fetch
console.log('\n=== JavaScript Example ===');
console.log(`
async function downloadReport(uid, id) {
  const response = await fetch(\`http://localhost:3000/generate/\${uid}/\${id}\`);
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Error:', error);
    return;
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = \`report_\${Date.now()}.xlsx\`;
  a.click();
  
  console.log('Report downloaded successfully!');
}

// Usage
downloadReport('YOUR_ASSET_UID', 'YOUR_SUBMISSION_ID');
`);

// Example 5: Testing with sample Kobo API
console.log('\n=== Direct Kobo API Test ===');
console.log('Test if your token works:\n');
console.log('curl -H "Authorization: Token YOUR_KOBO_TOKEN" \\');
console.log('  https://kf.kobotoolbox.org/api/v2/assets/\n');

export default {
  message: 'See console output for test examples'
};
