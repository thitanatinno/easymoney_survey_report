import ExcelJS from 'exceljs';
import { normalizeSubmission } from '../utils/normalizeSubmission.js';
import { buildAttachmentMaps } from '../utils/attachments.js';
import { renderCoverSheet } from './excel/coverSheet.service.js';
import { renderContentSheet } from './excel/contentSheet.service.js';
import { renderSheet1 } from './excel/sheet1.service.js';
import { renderSheet2 } from './excel/sheet2.service.js';
import { renderSheet3 } from './excel/sheet3.service.js';
import { renderSheet4 } from './excel/sheet4.service.js';
import { renderSheet5 } from './excel/sheet5.service.js';
import { renderSheet6 } from './excel/sheet6.service.js';

/**
 * Orchestrates the Excel report generation from normalized Kobo submission
 * @param {Object} rawSubmission - Raw submission data from Kobo API
 * @returns {Promise<Buffer>} - Excel file buffer
 */
export async function generateExcelReport(rawSubmission) {
  // Step 1: Normalize submission data
  const normalizedData = normalizeSubmission(rawSubmission);
  
  // Step 2: Build attachment maps
  const attachmentMaps = buildAttachmentMaps(normalizedData.attachments);

  // Step 3: Create workbook
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Kobo Excel Report Generator';
  workbook.created = new Date();

  // Step 4: Create worksheets
  const coverSheet = workbook.addWorksheet('Cover');
  const contentSheet = workbook.addWorksheet('Contents');
  const sheet1 = workbook.addWorksheet('Content 1-2');
  const sheet2 = workbook.addWorksheet('Content 3');
  const sheet3 = workbook.addWorksheet('Content 4');
  const sheet4 = workbook.addWorksheet('Content 5');
  const sheet5 = workbook.addWorksheet('Content 6');
  const sheet6 = workbook.addWorksheet('Content 7');

  // Step 5: Render each sheet
  console.log('Rendering Cover Sheet...');
  await renderCoverSheet(coverSheet, workbook, normalizedData);

  console.log('Rendering Content Sheet...');
  renderContentSheet(contentSheet, normalizedData);

  console.log('Rendering Sheet 1: Content 1-2 (General & Building Data)...');
  renderSheet1(sheet1, normalizedData);

  console.log('Rendering Sheet 2: Content 3 (Routeline Summary)...');
  renderSheet2(sheet2, normalizedData);

  console.log('Rendering Sheet 3: Content 4 (Customer MDP/LP)...');
  renderSheet3(sheet3, normalizedData);

  console.log('Rendering Sheet 4: Content 5 (Building Images)...');
  await renderSheet6(sheet4, workbook, normalizedData, attachmentMaps);

  console.log('Rendering Sheet 5: Content 6 (Routeline & Roof Images)...');
  await renderSheet4(sheet5, workbook, normalizedData, attachmentMaps);

  console.log('Rendering Sheet 6: Content 7 (MDP Images)...');
  await renderSheet5(sheet6, workbook, normalizedData, attachmentMaps);

  // Step 6: Generate buffer
  console.log('Generating Excel buffer...');
  const buffer = await workbook.xlsx.writeBuffer();

  return buffer;
}
