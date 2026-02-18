import { mergeAndWrite, writeRow, applyStyle } from './helpers.js';
import { sectionHeaderStyle, headerStyle, cellStyle } from './styles.js';

/**
 * Section rendering utilities for Excel sheets
 * Provides common patterns for rendering sections, tables, and label-value pairs
 */

/**
 * Render section header with merge
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {number} row - Row number
 * @param {string} text - Header text
 * @param {number} startCol - Start column (default 1)
 * @param {number} endCol - End column (default 2)
 * @returns {number} - Next row number
 */
export function renderSectionHeader(worksheet, row, text, startCol = 1, endCol = 2) {
  mergeAndWrite(worksheet, row, startCol, row, endCol, text, sectionHeaderStyle());
  return row + 1;
}

/**
 * Render label-value pairs as rows
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {number} startRow - Starting row
 * @param {Array} pairs - Array of [label, value] pairs
 * @param {number} labelCol - Label column (default 1)
 * @param {number} valueCol - Value column (default 2)
 * @returns {number} - Next row number
 */
export function renderLabelValueRows(worksheet, startRow, pairs, labelCol = 1, valueCol = 2) {
  let currentRow = startRow;
  
  for (const [label, value] of pairs) {
    worksheet.getCell(currentRow, labelCol).value = label;
    worksheet.getCell(currentRow, valueCol).value = value || 'N/A';
    applyStyle(worksheet.getCell(currentRow, labelCol), cellStyle());
    applyStyle(worksheet.getCell(currentRow, valueCol), cellStyle());
    currentRow++;
  }
  
  return currentRow;
}

/**
 * Render table from array data
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {number} startRow - Starting row
 * @param {Array} headers - Header labels
 * @param {Array} dataRows - Array of row data arrays
 * @param {number} startCol - Starting column (default 1)
 * @returns {number} - Next row number
 */
export function renderTable(worksheet, startRow, headers, dataRows, startCol = 1) {
  let currentRow = startRow;
  
  // Header row
  writeRow(worksheet, currentRow, headers, headerStyle());
  currentRow++;
  
  // Data rows
  for (const row of dataRows) {
    writeRow(worksheet, currentRow, row, cellStyle());
    currentRow++;
  }
  
  return currentRow;
}

/**
 * Render repeat group as table
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {number} startRow - Starting row
 * @param {Array} headers - Header labels
 * @param {Array} repeatData - Repeat group array
 * @param {Function} fieldExtractor - Function to extract row data (item, index) => [col1, col2, ...]
 * @returns {number} - Next row number
 */
export function renderRepeatGroupTable(worksheet, startRow, headers, repeatData, fieldExtractor) {
  const dataRows = repeatData.map((item, index) => fieldExtractor(item, index));
  return renderTable(worksheet, startRow, headers, dataRows);
}
