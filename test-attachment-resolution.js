import fs from 'fs';
import { buildAttachmentMaps, resolveAttachment } from './src/utils/attachments.js';
import { downloadImage } from './src/services/kobo.service.js';

// Load example submission
const rawData = JSON.parse(fs.readFileSync('./example/response_1770345467512.json', 'utf-8'));
const submission = rawData.results[0];

console.log('\n🔍 DETAILED IMAGE ATTACHMENT ANALYSIS');
console.log('═══════════════════════════════════════════\n');

// Build attachment maps
const attachmentMaps = buildAttachmentMaps(submission._attachments);

console.log('📊 Attachment Maps Built:');
console.log(`  - byXPath entries: ${Object.keys(attachmentMaps.byXPath).length}`);
console.log(`  - byFilename entries: ${Object.keys(attachmentMaps.byFilename).length}`);
console.log(`  - byBasename entries: ${Object.keys(attachmentMaps.byBasename).length}`);

// Test specific image fields
const testCases = [
  {
    name: 'Main Combiner Image',
    fieldValue: submission['group_ib9gq22/image_eu9in14'],
    xpath: 'group_ib9gq22/image_eu9in14'
  },
  {
    name: 'CT Image',
    fieldValue: submission['group_li3tn67/_CT'],
    xpath: 'group_li3tn67/_CT'
  },
  {
    name: 'Tie-In Image',
    fieldValue: submission['group_gr7hn33/_Tie_In'],
    xpath: 'group_gr7hn33/_Tie_In'
  },
  {
    name: 'Router Image',
    fieldValue: submission['group_gr7hn33/_rounter_intrernet_'],
    xpath: 'group_gr7hn33/_rounter_intrernet_'
  }
];

console.log('\n🧪 Testing Image Resolution and Download:\n');

for (const test of testCases) {
  console.log(`\n📷 ${test.name}`);
  console.log(`   Field Value: ${test.fieldValue}`);
  console.log(`   XPath: ${test.xpath}`);
  
  const attachment = resolveAttachment(test.fieldValue, test.xpath, attachmentMaps);
  
  if (!attachment) {
    console.log('   ❌ NOT RESOLVED');
    console.log('   Checking maps:');
    console.log(`     - XPath match: ${!!attachmentMaps.byXPath[test.xpath]}`);
    console.log(`     - Filename match: ${!!attachmentMaps.byFilename[test.fieldValue]}`);
    console.log(`     - Basename match: ${!!attachmentMaps.byBasename[test.fieldValue]}`);
    continue;
  }
  
  console.log(`   ✅ RESOLVED`);
  console.log(`   URL: ${attachment.url}`);
  console.log(`   Filename: ${attachment.filename}`);
  
  // Try to download
  try {
    console.log('   📥 Downloading...');
    const buffer = await downloadImage(attachment.url);
    console.log(`   ✅ Downloaded: ${(buffer.length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.log(`   ❌ Download failed: ${error.message}`);
  }
}

console.log('\n\n📋 All XPath Mappings:');
for (const [xpath, att] of Object.entries(attachmentMaps.byXPath)) {
  console.log(`  ${xpath}`);
  console.log(`    → ${att.filename}`);
}
