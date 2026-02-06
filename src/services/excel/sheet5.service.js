import { setColumnWidths, mergeAndWrite } from '../../utils/excel/helpers.js';
import { sectionHeaderStyle } from '../../utils/excel/styles.js';
import { addImageBlock, getImageExtension } from '../../utils/excel/images.js';
import { resolveAttachment } from '../../utils/attachments.js';
import { downloadImage } from '../kobo.service.js';

/**
 * Renders Sheet 6: Customer MDB/MDP Images + Electrical Room
 * Shows electrical room, SLD, CT, Tie-In, and Router images in bordered blocks
 * 
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {Object} workbook - ExcelJS workbook
 * @param {Object} data - Normalized data
 * @param {Object} attachmentMaps - Attachment maps
 */
export async function renderSheet5(worksheet, workbook, data, attachmentMaps) {
  const { customerMDP } = data;

  // Set column widths
  setColumnWidths(worksheet, [5, 15, 15, 15, 15, 15]);

  let currentRow = 1;

  // ===== SECTION HEADER =====
  mergeAndWrite(worksheet, currentRow, 1, currentRow, 6, '7. ห้องไฟ / MDB - เอกสารภาพ', sectionHeaderStyle());
  currentRow += 2;

  // ===== Electrical Room Image =====
  if (customerMDP.electricalRoomImage) {
    const attachment = resolveAttachment(customerMDP.electricalRoomImage, 'group_li3tn67/image_jz8sc99', attachmentMaps);
    let imageBuffer = null;
    let imageExt = 'jpeg';

    if (attachment && attachment.url) {
      try {
        imageBuffer = await downloadImage(attachment.url);
        imageExt = getImageExtension(attachment.filename);
      } catch (error) {
        console.error('Failed to download electrical room image:', error.message);
      }
    }

    currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, '7.1 ถ่ายภาพห้องไฟ (มุมกว้าง)', imageExt);
    currentRow += 1;
  }

  // ===== Breaker Image =====
  if (customerMDP.breakerImage) {
    const attachment = resolveAttachment(customerMDP.breakerImage, 'group_li3tn67/image_if5sx77', attachmentMaps);
    let imageBuffer = null;
    let imageExt = 'jpeg';

    if (attachment && attachment.url) {
      try {
        imageBuffer = await downloadImage(attachment.url);
        imageExt = getImageExtension(attachment.filename);
      } catch (error) {
        console.error('Failed to download breaker image:', error.message);
      }
    }

    currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, '7.2 ภาพถ่าย เบรคเกอร์ที่เห็นหนาดเเอมพ์ ', imageExt);
    currentRow += 2;
  }

  // ===== Single Line Diagram (SLD) =====
  if (customerMDP.sldImage) {
    const attachment = resolveAttachment(customerMDP.sldImage, 'group_li3tn67/_Single_line_diagram_SLD_', attachmentMaps);
    let imageBuffer = null;
    let imageExt = 'jpeg';

    if (attachment && attachment.url) {
      try {
        imageBuffer = await downloadImage(attachment.url);
        imageExt = getImageExtension(attachment.filename);
      } catch (error) {
        console.error('Failed to download SLD image:', error.message);
      }
    }

    currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, '7.3 มี Single line diagram (SLD)   (ถ้ามีเแนบภาพประกอบ)', imageExt);
    currentRow += 1;
  }

  // ===== CT Image =====
  if (customerMDP.ctImage) {
    const attachment = resolveAttachment(customerMDP.ctImage, 'group_li3tn67/_CT', attachmentMaps);
    let imageBuffer = null;
    let imageExt = 'jpeg';

    if (attachment && attachment.url) {
      try {
        imageBuffer = await downloadImage(attachment.url);
        imageExt = getImageExtension(attachment.filename);
      } catch (error) {
        console.error('Failed to download CT image:', error.message);
      }
    }

    currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, '7.4 จุดติดตั้ง CT', imageExt);
    currentRow += 1;
  }

  // ===== Tie-In Image =====
  if (customerMDP.tieInImage) {
    const attachment = resolveAttachment(customerMDP.tieInImage, 'group_gr7hn33/_Tie_In', attachmentMaps);
    let imageBuffer = null;
    let imageExt = 'jpeg';

    if (attachment && attachment.url) {
      try {
        imageBuffer = await downloadImage(attachment.url);
        imageExt = getImageExtension(attachment.filename);
      } catch (error) {
        console.error('Failed to download Tie-In image:', error.message);
      }
    }

    currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, '7.5 จุด Tie-In', imageExt);
    currentRow += 1;
  }

  // ===== Router/Internet Image =====
  if (customerMDP.routerImage) {
    const attachment = resolveAttachment(customerMDP.routerImage, 'group_gr7hn33/_rounter_intrernet_', attachmentMaps);
    let imageBuffer = null;
    let imageExt = 'jpeg';

    if (attachment && attachment.url) {
      try {
        imageBuffer = await downloadImage(attachment.url);
        imageExt = getImageExtension(attachment.filename);
      } catch (error) {
        console.error('Failed to download Router image:', error.message);
      }
    }

    const caption = customerMDP.routerNote 
      ? `7.6 จุด rounter intrernet (สามารถโยงมาที่ห้องไฟยังไงได้บ้าง)  - ${customerMDP.routerNote}`
      : '7.6 จุด rounter intrernet (สามารถโยงมาที่ห้องไฟยังไงได้บ้าง) ';

    currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, caption, imageExt);
    currentRow += 1;
  }

  return currentRow;
}
