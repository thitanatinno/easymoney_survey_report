import fs from 'fs';
import { generateExcelReport } from './src/services/report.service.js';

// Load example submission
const rawData = JSON.parse(fs.readFileSync('./example/response_1770345467512.json', 'utf-8'));
const submission = rawData.results[0]; // Get first submission

console.log('\n🧪 TESTING IMAGE RENDERING');
console.log('═══════════════════════════════════════════\n');

console.log('📋 Submission ID:', submission._id);
console.log('📎 Attachments count:', submission._attachments?.length || 0);

// Log first few attachments for inspection
if (submission._attachments && submission._attachments.length > 0) {
  console.log('\n📷 Sample Attachments:');
  submission._attachments.slice(0, 3).forEach((att, i) => {
    console.log(`  ${i + 1}. ${att.media_file_basename}`);
    console.log(`     URL: ${att.download_small_url}`);
    console.log(`     XPath: ${att.question_xpath}`);
  });
}

// Check image fields in submission
console.log('\n🖼️  Image Fields in Submission:');
console.log('  Orientation Image:', submission['group_gs9vj55/image_bn2pa18']);
console.log('  PEA/MEA Meter:', submission['group_gs9vj55/group_iz7ky31/PEA_MEA_Meter']);
console.log('  Parking Image:', submission['group_gs9vj55/image_ao2ed61']);
console.log('  SLD Image:', submission['group_li3tn67/image_jz8sc99']);
console.log('  CT Image:', submission['group_li3tn67/_CT']);
console.log('  Tie-In:', submission['group_gr7hn33/_Tie_In']);
console.log('  Main Combiner:', submission['group_ib9gq22/image_eu9in14']);

console.log('\n🏃 Generating Excel Report...\n');

try {
  const buffer = await generateExcelReport(submission);
  
  const outputPath = './output/test-debug-report.xlsx';
  fs.writeFileSync(outputPath, buffer);
  
  console.log('\n✅ SUCCESS!');
  console.log(`📄 Report saved to: ${outputPath}`);
  console.log(`📦 File size: ${(buffer.length / 1024).toFixed(2)} KB`);
} catch (error) {
  console.error('\n❌ ERROR:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
