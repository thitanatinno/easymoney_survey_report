import { BORDERS, ALIGNMENT } from './styles.js';

/**
 * Merges cells and writes value with styling
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {number} startRow - Starting row (1-based)
 * @param {number} startCol - Starting column (1-based)
 * @param {number} endRow - Ending row (1-based)
 * @param {number} endCol - Ending column (1-based)
 * @param {any} value - Value to write
 * @param {Object} style - Style object
 */
export function mergeAndWrite(worksheet, startRow, startCol, endRow, endCol, value, style = {}) {
  // Get column letters
  const startColLetter = getColumnLetter(startCol);
  const endColLetter = getColumnLetter(endCol);
  
  // Merge cells
  worksheet.mergeCells(`${startColLetter}${startRow}:${endColLetter}${endRow}`);
  
  // Write to first cell
  const cell = worksheet.getCell(startRow, startCol);
  cell.value = value;
  
  // Apply style
  Object.assign(cell, style);
}

/**
 * Draws a bordered box (rectangle) by merging cells
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {number} startRow - Starting row
 * @param {number} startCol - Starting column
 * @param {number} endRow - Ending row
 * @param {number} endCol - Ending column
 * @param {string} borderStyle - 'thick' or 'thin'
 * @returns {Object} - Cell reference of merged area
 */
export function drawBox(worksheet, startRow, startCol, endRow, endCol, borderStyle = 'thick') {
  const startColLetter = getColumnLetter(startCol);
  const endColLetter = getColumnLetter(endCol);
  
  worksheet.mergeCells(`${startColLetter}${startRow}:${endColLetter}${endRow}`);
  
  const cell = worksheet.getCell(startRow, startCol);
  cell.border = BORDERS[borderStyle];
  cell.alignment = ALIGNMENT.centerMiddle;
  
  return cell;
}

/**
 * Draws a table grid with borders
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {number} startRow - Starting row
 * @param {number} startCol - Starting column
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @param {string} borderStyle - Border style
 */
export function drawTableGrid(worksheet, startRow, startCol, rows, cols, borderStyle = 'thin') {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = worksheet.getCell(startRow + r, startCol + c);
      cell.border = BORDERS[borderStyle];
    }
  }
}

/**
 * Converts column number to letter (1 => A, 2 => B, 27 => AA, etc.)
 * @param {number} col - Column number (1-based)
 * @returns {string} - Column letter
 */
export function getColumnLetter(col) {
  let letter = '';
  while (col > 0) {
    const remainder = (col - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    col = Math.floor((col - 1) / 26);
  }
  return letter;
}

/**
 * Sets column widths for a worksheet
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {Array} widths - Array of widths for each column
 */
export function setColumnWidths(worksheet, widths) {
  widths.forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });
}

/**
 * Writes a row of data with optional styling
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {number} row - Row number
 * @param {Array} values - Array of cell values
 * @param {Object} style - Style to apply to all cells
 */
export function writeRow(worksheet, row, values, style = {}) {
  values.forEach((value, index) => {
    const cell = worksheet.getCell(row, index + 1);
    cell.value = value;
    Object.assign(cell, style);
  });
}

/**
 * Inserts empty rows at a specific position
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {number} startRow - Row to insert at
 * @param {number} count - Number of rows to insert
 */
export function insertRows(worksheet, startRow, count) {
  worksheet.spliceRows(startRow, 0, ...Array(count).fill([]));
}

/**
 * Sets row height
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {number} row - Row number
 * @param {number} height - Height in points
 */
export function setRowHeight(worksheet, row, height) {
  worksheet.getRow(row).height = height;
}

/**
 * Gets or creates a worksheet by name
 * @param {Object} workbook - ExcelJS workbook
 * @param {string} name - Sheet name
 * @returns {Object} - Worksheet
 */
export function getOrCreateSheet(workbook, name) {
  let worksheet = workbook.getWorksheet(name);
  if (!worksheet) {
    worksheet = workbook.addWorksheet(name);
  }
  return worksheet;
}
