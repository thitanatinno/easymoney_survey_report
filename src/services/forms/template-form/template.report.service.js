/**
 * ============================================================
 * TEMPLATE FORM - Report Generation Service
 * ============================================================
 * 
 * This is a TEMPLATE FILE for creating new forms.
 * AI Code Generation Instructions:
 * 
 * 1. COPY this file to:
 *    src/services/forms/{YOUR_FORM_NAME}/{your-form}.report.service.js
 * 
 * 2. UPDATE the import paths at the top
 * 
 * 3. DEFINE your Excel sheets in the sheets array:
 *    - Each sheet has a name and a generator function
 *    - Generator functions are in src/services/forms/{YOUR_FORM_NAME}/sheets/
 * 
 * 4. CREATE sheet service files:
 *    - One file per sheet (e.g., sheet1.service.js, sheet2.service.js)
 *    - Each exports a function: export async function generate(worksheet, data, attachmentMaps, workbook)
 *    - Use utilities from src/utils/excel/ for rendering
 * 
 * ============================================================
 */

import { orchestrateReport } from '../../../utils/reportOrchestrator.js';
import { normalize } from './template.normalize.js';

/**
 * ============================================================
 * AI INSTRUCTION: Import your sheet service files here
 * ============================================================
 * 
 * Example:
 * import { generate as generateSheet1 } from './sheets/template.sheet1.service.js';
 * import { generate as generateSheet2 } from './sheets/template.sheet2.service.js';
 * import { generate as generateSheet3 } from './sheets/template.sheet3.service.js';
 */

// Placeholder: Remove this when you add real sheet services
const generatePlaceholderSheet = async (worksheet, data) => {
  worksheet.getCell('A1').value = 'TEMPLATE FORM - Please implement sheet services';
  worksheet.getCell('A2').value = 'Data sections available:';
  worksheet.getCell('A3').value = JSON.stringify(Object.keys(data), null, 2);
};

/**
 * Generate template form report
 * 
 * @param {string} uid - Kobo asset UID
 * @param {string} submissionId - Submission ID
 * @returns {Promise<Buffer>} - Excel file buffer
 * 
 * AI INSTRUCTION: Update the sheets array below to match your form's Excel structure
 */
export async function generateReport(uid, submissionId) {
  return await orchestrateReport(uid, submissionId, {
    formName: 'Template Form',
    normalize: normalize,
    
    /**
     * ============================================================
     * AI INSTRUCTION: Define your Excel sheets here
     * ============================================================
     * 
     * Each sheet object has:
     * - name: Sheet tab name (string)
     * - generator: Function that renders the sheet
     * 
     * Sheet generator signature:
     * async function(worksheet, data, attachmentMaps, workbook) {
     *   // Your rendering logic here
     * }
     * 
     * Example sheet structure:
     * 
     * sheets: [
     *   {
     *     name: 'Summary',
     *     generator: generateSheet1
     *   },
     *   {
     *     name: 'Details',
     *     generator: generateSheet2
     *   },
     *   {
     *     name: 'Images',
     *     generator: generateSheet3
     *   }
     * ]
     */
    sheets: [
      {
        name: 'Placeholder Sheet 1',
        generator: generatePlaceholderSheet
      },
      {
        name: 'Placeholder Sheet 2',
        generator: generatePlaceholderSheet
      }
      // ADD MORE SHEETS HERE
    ]
  });
}

/**
 * ============================================================
 * HELPER NOTES FOR SHEET SERVICE IMPLEMENTATION
 * ============================================================
 * 
 * When creating sheet service files, you can use these utilities:
 * 
 * TEXT/DATA RENDERING:
 * - import { writeRow, mergeAndWrite, setColumnWidths } from '../../../../utils/excel/helpers.js';
 * - import { renderSectionHeader, renderLabelValueRows, renderTable } from '../../../../utils/excel/sectionRenderer.js';
 * 
 * IMAGE RENDERING:
 * - import { renderImageSection, renderRepeatGroupImages } from '../../../../utils/excel/imageRenderer.js';
 * - import { buildRepeatXPath } from '../../../../utils/attachments.js';
 * 
 * STYLING:
 * - import { headerStyle, cellStyle, sectionHeaderStyle } from '../../../../utils/excel/styles.js';
 * 
 * CHECKBOXES:
 * - import { setCheckboxForValue, setYesNoCheckbox } from '../../../../utils/excel/checkbox.js';
 * 
 * See solar-survey form sheets for working examples:
 * - src/services/excel/sheet1.service.js (text data layout example)
 * - src/services/excel/sheet2.service.js (table example)
 * - src/services/excel/sheet4.service.js (images example)
 * 
 * ============================================================
 */
