import ExcelJS from 'exceljs';
import fs from 'fs';
import axios from 'axios';
import config from './src/config/kobo.config.js';

console.log('\n🧪 TESTING EXCELJS IMAGE POSITIONING\n');

// Create workbook
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Test');

// Set column widths
worksheet.getColumn(1).width = 5;
worksheet.getColumn(2).width = 20;
worksheet.getColumn(3).width = 20;

// Download a test image
const testUrl = 'https://kf.kobotoolbox.org/api/v2/assets/aj3WDbyQqWkw6qSrV2feVo/data/649067845/attachments/attG2isAYQEVzzrGQdYDLzcp/small/';

console.log('📥 Downloading test image...');
const response = await axios.get(testUrl, {
  headers: { 'Authorization': `Token ${config.apiToken}` },
  responseType: 'arraybuffer'
});
const imageBuffer = Buffer.from(response.data);
console.log(`✅ Downloaded: ${(imageBuffer.length / 1024).toFixed(2)} KB\n`);

// Add title
worksheet.getCell('A1').value = 'Image Test';
worksheet.getCell('A1').font = { size: 14, bold: true };

// Test 1: Using 0-indexed positioning (correct way)
console.log('Test 1: 0-indexed (col: 0, row: 2) - should appear at A3');
const imageId1 = workbook.addImage({
  buffer: imageBuffer,
  extension: 'jpeg'
});
worksheet.addImage(imageId1, {
  tl: { col: 0, row: 2 },  // 0-indexed: col 0 = A, row 2 = row 3
  ext: { width: 200, height: 150 }
});

// Add label
worksheet.getCell('B3').value = 'Test 1: col:0, row:2 (0-indexed)';

// Test 2: Using 1-indexed (incorrect)
console.log('Test 2: Incorrectly using 1-indexed (col: 1, row: 10) - might be wrong');
const imageId2 = workbook.addImage({
  buffer: imageBuffer,
  extension: 'jpeg'
});
worksheet.addImage(imageId2, {
  tl: { col: 1, row: 10 },  // If this is 0-indexed, it's col B row 11
  ext: { width: 200, height: 150 }
});
worksheet.getCell('C11').value = 'Test 2: col:1, row:10';

// Test 3: Corrected version (what our code should use)
console.log('Test 3: Correct way for row 20, col A (col: 0, row: 19)');
const imageId3 = workbook.addImage({
  buffer: imageBuffer,
  extension: 'jpeg'
});
worksheet.addImage(imageId3, {
  tl: { col: 0, row: 19 },  // 0-indexed: row 19 = display row 20
  ext: { width: 200, height: 150 }
});
worksheet.getCell('B20').value = 'Test 3: col:0, row:19 (correct 0-indexed)';

// Save
const buffer = await workbook.xlsx.writeBuffer();
fs.writeFileSync('./output/test-image-positioning.xlsx', buffer);

console.log('\n✅ Test file created: output/test-image-positioning.xlsx');
console.log('📖 Open this file to verify image positioning\n');
console.log('Expected results:');
console.log('  - Test 1 image should be at row 3 (A3)');
console.log('  - Test 2 image should be at row 11 (B11)');  
console.log('  - Test 3 image should be at row 20 (A20)');
