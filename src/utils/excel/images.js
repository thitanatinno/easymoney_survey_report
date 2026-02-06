import sizeOf from 'image-size';
import { drawBox, insertRows, getColumnLetter } from './helpers.js';
import { BORDERS } from './styles.js';

/**
 * Calculates how many Excel rows are needed for an image
 * @param {Buffer} imageBuffer - Image buffer
 * @param {number} maxWidth - Max width in pixels (default 800)
 * @param {number} rowHeightPx - Pixels per row height (default 20)
 * @returns {Object} - { rows, width, height }
 */
export function calculateImageDimensions(imageBuffer, maxWidth = 800, rowHeightPx = 20) {
  try {
    const dimensions = sizeOf(imageBuffer);
    let width = dimensions.width;
    let height = dimensions.height;

    // Scale down if too large
    if (width > maxWidth) {
      const scale = maxWidth / width;
      width = maxWidth;
      height = Math.floor(height * scale);
    }

    // Calculate required rows (minimum 5 rows for small images)
    const rows = Math.max(5, Math.ceil(height / rowHeightPx));

    return { rows, width, height };
  } catch (error) {
    console.error('Error calculating image dimensions:', error);
    // Return defaults if image size detection fails
    return { rows: 10, width: 400, height: 200 };
  }
}

/**
 * Adds an image to a range of cells with dynamic row expansion
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {Object} workbook - ExcelJS workbook (for adding images)
 * @param {Buffer} imageBuffer - Image buffer
 * @param {number} startRow - Starting row
 * @param {number} startCol - Starting column
 * @param {number} endCol - Ending column
 * @param {string} imageExt - Image extension (jpg, png, etc.)
 * @returns {number} - Next available row after image
 */
export function addImageToRange(worksheet, workbook, imageBuffer, startRow, startCol, endCol, imageExt = 'jpeg') {
  if (!imageBuffer) {
    // No image, just draw empty box
    const endRow = startRow + 5;
    drawBox(worksheet, startRow, startCol, endRow, endCol, 'thick');
    return endRow + 1;
  }

  try {
    // Calculate required dimensions
    const { rows, width, height } = calculateImageDimensions(imageBuffer);
    const endRow = startRow + rows - 1;

    // Insert additional rows if needed
    if (rows > 5) {
      insertRows(worksheet, startRow + 5, rows - 5);
    }

    // Draw bordered box
    drawBox(worksheet, startRow, startCol, endRow, endCol, 'thick');

    // Add image to workbook
    const imageId = workbook.addImage({
      buffer: imageBuffer,
      extension: imageExt
    });

    // Calculate position within merged cells
    // ExcelJS uses 0-indexed positioning, convert from 1-indexed
    const startColLetter = getColumnLetter(startCol);
    const endColLetter = getColumnLetter(endCol);

    worksheet.addImage(imageId, {
      tl: { col: startCol - 1, row: startRow - 1 },
      ext: { width, height },
      editAs: 'oneCell'
    });

    return endRow + 1;
  } catch (error) {
    console.error('Error adding image:', error);
    // Fallback: draw empty box
    const endRow = startRow + 5;
    drawBox(worksheet, startRow, startCol, endRow, endCol, 'thick');
    return endRow + 1;
  }
}

/**
 * Adds an image block with caption
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {Object} workbook - ExcelJS workbook
 * @param {Buffer} imageBuffer - Image buffer
 * @param {number} startRow - Starting row
 * @param {number} startCol - Starting column
 * @param {number} endCol - Ending column
 * @param {string} caption - Caption text
 * @param {string} imageExt - Image extension
 * @returns {number} - Next available row
 */
export function addImageBlock(worksheet, workbook, imageBuffer, startRow, startCol, endCol, caption, imageExt = 'jpeg') {
  // Write caption row
  const startColLetter = getColumnLetter(startCol);
  const endColLetter = getColumnLetter(endCol);
  
  worksheet.mergeCells(`${startColLetter}${startRow}:${endColLetter}${startRow}`);
  const captionCell = worksheet.getCell(startRow, startCol);
  captionCell.value = caption;
  captionCell.font = { size: 11, bold: true };
  captionCell.border = BORDERS.thin;
  captionCell.alignment = { vertical: 'middle', horizontal: 'left' };
  captionCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF2F2F2' }
  };

  // Add image in next rows
  const nextRow = addImageToRange(worksheet, workbook, imageBuffer, startRow + 1, startCol, endCol, imageExt);
  
  return nextRow;
}

/**
 * Extracts file extension from filename
 * @param {string} filename - Filename
 * @returns {string} - Extension without dot
 */
export function getImageExtension(filename) {
  if (!filename) return 'jpeg';
  const ext = filename.split('.').pop().toLowerCase();
  // Map common extensions
  const extMap = {
    'jpg': 'jpeg',
    'jpeg': 'jpeg',
    'png': 'png',
    'gif': 'gif',
    'bmp': 'bmp'
  };
  return extMap[ext] || 'jpeg';
}
