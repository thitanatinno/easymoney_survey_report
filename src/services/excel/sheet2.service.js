import { mergeAndWrite, writeRow, setColumnWidths } from '../../utils/excel/helpers.js';
import { headerStyle, cellStyle, sectionHeaderStyle } from '../../utils/excel/styles.js';

/**
 * Renders Sheet 2: Cable Routeline & Combiner Box Installation Summary
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {Object} data - Normalized data
 */
export function renderSheet2(worksheet, data) {
  const { routeline } = data;

  // Set column widths
  setColumnWidths(worksheet, [10, 30]);

  let currentRow = 1;

  // ===== SECTION: CABLE ROUTELINE SUMMARY =====
  mergeAndWrite(worksheet, currentRow, 1, currentRow, 2, '3. ระยะเดินสายจากตู้ไฟไปพื้นที่การติดตั้ง (แต่ละห้อง)', sectionHeaderStyle());
  currentRow += 2;

  // Table header
  writeRow(worksheet, currentRow, ['3.1 Item', '3.2 ระยะเดินสายไฟโดยประมาณ ในการเดินสายไปขึ้นไปติดตั้งโซล่าห์ (m) แต่ละห้อง'], headerStyle());
  currentRow++;

  // Route line items
  if (routeline && routeline.length > 0) {
    routeline.forEach((item, index) => {
      const itemNum = index + 1;
      const distance = item.distance || 'N/A';
      
      writeRow(worksheet, currentRow, [itemNum, distance], cellStyle());
      currentRow++;
    });
  } else {
    writeRow(worksheet, currentRow, ['N/A', 'No data'], cellStyle());
    currentRow++;
  }

  currentRow += 2;

  // Summary
  mergeAndWrite(worksheet, currentRow, 1, currentRow, 2, `Total Items: ${routeline.length}`, sectionHeaderStyle());
  currentRow++;

  return currentRow;
}
