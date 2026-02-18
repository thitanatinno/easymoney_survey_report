import { resolveAttachment } from '../attachments.js';
import { embedImageInCell, calculateRowsNeeded } from './images.js';
import { applyStyle } from './helpers.js';
import { cellStyle } from './styles.js';

/**
 * Image rendering utilities for Excel sheets
 * Provides common patterns for rendering single and repeating images
 */

/**
 * Render single image with caption
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {Object} workbook - ExcelJS workbook
 * @param {number} row - Row number
 * @param {string} caption - Caption text
 * @param {string} imagePath - Image field value
 * @param {string} xPath - xPath for attachment resolution
 * @param {Object} attachmentMaps - Attachment maps
 * @param {Object} options - Rendering options
 * @returns {Promise<number>} - Next row number
 */
export async function renderImageSection(worksheet, workbook, row, caption, imagePath, xPath, attachmentMaps, options = {}) {
  const {
    captionCol = 1,
    imageCol = 2,
    captionStyle = cellStyle(),
    imageWidth = 400,
    imageHeight = 300
  } = options;
  
  // Caption
  worksheet.getCell(row, captionCol).value = caption;
  applyStyle(worksheet.getCell(row, captionCol), captionStyle);
  
  // Resolve and embed image
  const attachment = resolveAttachment(imagePath, xPath, attachmentMaps);
  if (attachment) {
    const rowsNeeded = calculateRowsNeeded(imageHeight);
    await embedImageInCell(worksheet, workbook, row, imageCol, attachment, imageWidth, imageHeight);
    return row + rowsNeeded;
  }
  
  worksheet.getCell(row, imageCol).value = 'No image';
  applyStyle(worksheet.getCell(row, imageCol), cellStyle());
  return row + 1;
}

/**
 * Render multiple images from repeat group
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {Object} workbook - ExcelJS workbook
 * @param {number} startRow - Starting row
 * @param {Array} repeatData - Repeat group array
 * @param {Object} config - Configuration
 * @param {Function} config.captionExtractor - Extract caption from item
 * @param {Function} config.xPathBuilder - Build xPath from item
 * @param {Function} config.imageFieldExtractor - Extract image field from item
 * @param {Object} attachmentMaps - Attachment maps
 * @param {Object} options - Rendering options (passed to renderImageSection)
 * @returns {Promise<number>} - Next row number
 */
export async function renderRepeatGroupImages(worksheet, workbook, startRow, repeatData, config, attachmentMaps, options = {}) {
  let currentRow = startRow;
  
  for (const item of repeatData) {
    const caption = config.captionExtractor(item);
    const xPath = config.xPathBuilder(item);
    const imagePath = config.imageFieldExtractor(item);
    
    currentRow = await renderImageSection(
      worksheet,
      workbook,
      currentRow,
      caption,
      imagePath,
      xPath,
      attachmentMaps,
      options
    );
    
    currentRow++; // Spacing between images
  }
  
  return currentRow;
}
