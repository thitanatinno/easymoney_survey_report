import ExcelJS from 'exceljs';
import { fetchSubmission } from '../services/kobo.service.js';
import { buildAttachmentMaps } from './attachments.js';

/**
 * Generic report orchestration - handles common workflow
 * Reduces boilerplate in form-specific report services
 * 
 * @param {string} uid - Kobo asset UID
 * @param {string} submissionId - Submission ID
 * @param {Object} config - Form configuration
 * @param {Function} config.normalize - Normalization function
 * @param {Array} config.sheets - Sheet configurations
 * @param {string} config.formName - Form display name (optional)
 * @returns {Promise<Buffer>} - Excel file buffer
 */
export async function orchestrateReport(uid, submissionId, config) {
  console.log(`\n📋 Orchestrating report for form: ${config.formName || 'Unknown'}`);
  
  // Step 1: Fetch data from Kobo
  console.log('⏳ Step 1: Fetching submission from KoboToolbox...');
  const submission = await fetchSubmission(uid, submissionId);
  
  // Step 2: Normalize using form-specific normalizer
  console.log('⏳ Step 2: Normalizing submission data...');
  const data = config.normalize(submission);
  const attachmentMaps = buildAttachmentMaps(submission._attachments || []);
  
  // Step 3: Create workbook
  console.log('⏳ Step 3: Creating Excel workbook...');
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Kobo Excel Report Generator';
  workbook.created = new Date();
  
  // Step 4: Generate sheets using form-specific sheet generators
  console.log('⏳ Step 4: Generating worksheets...');
  for (const sheetConfig of config.sheets) {
    console.log(`  - Creating sheet: ${sheetConfig.name}`);
    const worksheet = workbook.addWorksheet(sheetConfig.name);
    await sheetConfig.generator(worksheet, data, attachmentMaps, workbook);
  }
  
  // Step 5: Return buffer
  console.log('⏳ Step 5: Generating Excel buffer...');
  const buffer = await workbook.xlsx.writeBuffer();
  
  console.log(`✅ Report generated successfully! Size: ${(buffer.length / 1024).toFixed(2)} KB\n`);
  return buffer;
}
