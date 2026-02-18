/**
 * ============================================================
 * TEMPLATE FORM - Sheet Service Example
 * ============================================================
 * 
 * This is an EXAMPLE sheet service showing common patterns.
 * Copy this file and customize for each sheet in your Excel report.
 * 
 * AI Code Generation Instructions:
 * 
 * 1. COPY this file to:
 *    src/services/forms/{YOUR_FORM_NAME}/sheets/{sheet-name}.service.js
 * 
 * 2. IMPLEMENT the generate() function:
 *    - Use data from normalized structure
 *    - Use utilities for rendering (see imports below)
 *    - Return currentRow at the end
 * 
 * 3. COMMON PATTERNS:
 *    - Section headers with renderSectionHeader()
 *    - Label-value pairs with renderLabelValueRows()
 *    - Tables with renderTable() or renderRepeatGroupTable()
 *    - Images with renderImageSection() or renderRepeatGroupImages()
 * 
 * ============================================================
 */

// Excel utilities
import { writeRow, mergeAndWrite, setColumnWidths, applyStyle } from '../../../../utils/excel/helpers.js';
import { headerStyle, cellStyle, sectionHeaderStyle } from '../../../../utils/excel/styles.js';

// High-level rendering utilities
import { 
  renderSectionHeader, 
  renderLabelValueRows, 
  renderTable,
  renderRepeatGroupTable 
} from '../../../../utils/excel/sectionRenderer.js';

import { 
  renderImageSection, 
  renderRepeatGroupImages 
} from '../../../../utils/excel/imageRenderer.js';

// Checkbox utilities
import { setCheckboxForValue, setYesNoCheckbox } from '../../../../utils/excel/checkbox.js';

// Attachment utilities
import { buildRepeatXPath } from '../../../../utils/attachments.js';

/**
 * Generate sheet template example
 * 
 * @param {Object} worksheet - ExcelJS worksheet object
 * @param {Object} data - Normalized data from {form}.normalize.js
 * @param {Object} attachmentMaps - Attachment resolution maps
 * @param {Object} workbook - ExcelJS workbook (needed for images)
 * @returns {Promise<number>} - Final row number
 */
export async function generate(worksheet, data, attachmentMaps, workbook) {
  // Set column widths
  setColumnWidths(worksheet, [30, 50]); // Adjust as needed
  
  let currentRow = 1;
  
  // ============================================================
  // EXAMPLE 1: Section Header
  // ============================================================
  currentRow = renderSectionHeader(worksheet, currentRow, 'Section Title Here');
  currentRow++;
  
  // ============================================================
  // EXAMPLE 2: Label-Value Pairs (Simple Text Data)
  // ============================================================
  currentRow = renderLabelValueRows(worksheet, currentRow, [
    ['Label 1', data.basicInfo?.field1],
    ['Label 2', data.basicInfo?.field2],
    ['Label 3', data.basicInfo?.field3]
  ]);
  currentRow += 2; // Spacing
  
  // ============================================================
  // EXAMPLE 3: Table from Repeat Group
  // ============================================================
  if (data.items && data.items.length > 0) {
    currentRow = renderSectionHeader(worksheet, currentRow, 'Items Table');
    currentRow++;
    
    currentRow = renderRepeatGroupTable(
      worksheet,
      currentRow,
      ['#', 'Item Field 1', 'Item Field 2'], // Headers
      data.items,
      (item, index) => [
        index + 1,
        item.itemField1,
        item.itemField2
      ]
    );
    currentRow += 2;
  }
  
  // ============================================================
  // EXAMPLE 4: Checkbox Values
  // ============================================================
  currentRow = renderSectionHeader(worksheet, currentRow, 'Options');
  currentRow++;
  
  worksheet.getCell(currentRow, 1).value = 'Select Option:';
  setCheckboxForValue(worksheet, currentRow, 2, data.details?.field1, 'Option A');
  setCheckboxForValue(worksheet, currentRow, 3, data.details?.field1, 'Option B');
  currentRow++;
  
  worksheet.getCell(currentRow, 1).value = 'Yes/No Question:';
  setYesNoCheckbox(worksheet, currentRow, 2, data.details?.field2);
  currentRow += 2;
  
  // ============================================================
  // EXAMPLE 5: Single Image
  // ============================================================
  const imageField = data.details?.imageField;
  if (imageField) {
    currentRow = await renderImageSection(
      worksheet,
      workbook,
      currentRow,
      'Image Caption Here',
      imageField,
      'group_name/image_field_id', // Replace with actual xPath
      attachmentMaps,
      { imageWidth: 400, imageHeight: 300 }
    );
    currentRow += 2;
  }
  
  // ============================================================
  // EXAMPLE 6: Images from Repeat Group
  // ============================================================
  if (data.items && data.items.length > 0) {
    currentRow = renderSectionHeader(worksheet, currentRow, 'Item Images');
    currentRow++;
    
    currentRow = await renderRepeatGroupImages(
      worksheet,
      workbook,
      currentRow,
      data.items,
      {
        captionExtractor: (item) => `Item ${item.index + 1}: ${item.itemField1}`,
        xPathBuilder: (item) => buildRepeatXPath('group_repeat_name', item.index, 'image_field'),
        imageFieldExtractor: (item) => item.imageField
      },
      attachmentMaps,
      { imageWidth: 400, imageHeight: 300 }
    );
  }
  
  return currentRow;
}

/**
 * ============================================================
 * ALTERNATIVE: Manual Low-Level Approach
 * ============================================================
 * 
 * If you prefer more control, you can use low-level utilities:
 * 
 * // Write a single row
 * writeRow(worksheet, currentRow, ['Cell 1', 'Cell 2', 'Cell 3'], cellStyle());
 * currentRow++;
 * 
 * // Merge cells and write
 * mergeAndWrite(worksheet, startRow, startCol, endRow, endCol, 'Text', headerStyle());
 * 
 * // Apply style to a cell
 * const cell = worksheet.getCell(row, col);
 * cell.value = 'Value';
 * applyStyle(cell, cellStyle());
 * 
 * // Embed image manually
 * import { embedImageInCell, calculateRowsNeeded } from '../../../../utils/excel/images.js';
 * import { resolveAttachment } from '../../../../utils/attachments.js';
 * 
 * const attachment = resolveAttachment(imageFieldValue, 'xPath/to/image', attachmentMaps);
 * if (attachment) {
 *   const rowsNeeded = calculateRowsNeeded(300); // height
 *   await embedImageInCell(worksheet, workbook, currentRow, 2, attachment, 400, 300);
 *   currentRow += rowsNeeded;
 * }
 * 
 * ============================================================
 */
