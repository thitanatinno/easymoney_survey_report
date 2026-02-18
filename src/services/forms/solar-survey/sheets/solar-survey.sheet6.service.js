import { setColumnWidths, mergeAndWrite } from '../../../../utils/excel/helpers.js';
import { sectionHeaderStyle } from '../../../../utils/excel/styles.js';
import { addImageBlock, getImageExtension } from '../../../../utils/excel/images.js';
import { resolveAttachment } from '../../../../utils/attachments.js';
import { downloadImage } from '../../../kobo.service.js';

/**
 * Renders Sheet 6: Building Exterior & Grid Connection Images
 * Shows building facade, parking, orientation, and PEA/MEA meter images
 * 
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {Object} data - Normalized data
 * @param {Object} attachmentMaps - Attachment maps
 * @param {Object} workbook - ExcelJS workbook
 */
export async function renderSheet6(worksheet, data, attachmentMaps, workbook) {
  const { building } = data;

  // Set column widths
  setColumnWidths(worksheet, [5, 15, 15, 15, 15, 15]);

  let currentRow = 1;

  // ===== SECTION HEADER =====
  mergeAndWrite(worksheet, currentRow, 1, currentRow, 6, '5. สำรวจภายนอกอาคาร/ทางเข้า - เอกสารภาพ', sectionHeaderStyle());
  currentRow += 2;

  // ===== Orientation Image =====
  if (building.orientationImage) {
    const attachment = resolveAttachment(building.orientationImage, 'group_gs9vj55/image_bn2pa18', attachmentMaps);
    let imageBuffer = null;
    let imageExt = 'jpeg';

    if (attachment && attachment.url) {
      try {
        imageBuffer = await downloadImage(attachment.url);
        imageExt = getImageExtension(attachment.filename);
      } catch (error) {
        console.error('Failed to download orientation image:', error.message);
      }
    }

    currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, '5.1 ถ่ายรูปถนนทางเข้าโครงการ/หน้างาน', imageExt);
    currentRow += 1;
  }

  // ===== Parking/Lot Image =====
  if (building.parkingImage) {
    const attachment = resolveAttachment(building.parkingImage, 'group_gs9vj55/image_ao2ed61', attachmentMaps);
    let imageBuffer = null;
    let imageExt = 'jpeg';

    if (attachment && attachment.url) {
      try {
        imageBuffer = await downloadImage(attachment.url);
        imageExt = getImageExtension(attachment.filename);
      } catch (error) {
        console.error('Failed to download parking image:', error.message);
      }
    }

    currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, '5.2 ถ่ายรูปพื้นที่วางของ/ลานจอดรถ', imageExt);
    currentRow += 1;
  }

  // ===== Facade Front Image =====
  if (building.facadeFrontImage) {
    const attachment = resolveAttachment(building.facadeFrontImage, 'group_gs9vj55/image_rc7iz33', attachmentMaps);
    let imageBuffer = null;
    let imageExt = 'jpeg';

    if (attachment && attachment.url) {
      try {
        imageBuffer = await downloadImage(attachment.url);
        imageExt = getImageExtension(attachment.filename);
      } catch (error) {
        console.error('Failed to download facade front image:', error.message);
      }
    }

    currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, '5.3 ถ่ายรูปด้านนอกอาคาร "ทุกด้าน" จากด้านล่าง (เเนบรูป: ด้านหน้า)', imageExt);
    currentRow += 1;
  }

  // ===== Facade Left Image =====
  if (building.facadeLeftImage) {
    const attachment = resolveAttachment(building.facadeLeftImage, 'group_gs9vj55/image_zd8zv68', attachmentMaps);
    let imageBuffer = null;
    let imageExt = 'jpeg';

    if (attachment && attachment.url) {
      try {
        imageBuffer = await downloadImage(attachment.url);
        imageExt = getImageExtension(attachment.filename);
      } catch (error) {
        console.error('Failed to download facade left image:', error.message);
      }
    }

    currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, '5.4 ถ่ายรูปด้านนอกอาคาร "ทุกด้าน" จากด้านล่าง (เเนบรูป: ด้านซ้าย)', imageExt);
    currentRow += 1;
  }

  // ===== Facade Right Image =====
  if (building.facadeRightImage) {
    const attachment = resolveAttachment(building.facadeRightImage, 'group_gs9vj55/image_qp9jo49', attachmentMaps);
    let imageBuffer = null;
    let imageExt = 'jpeg';

    if (attachment && attachment.url) {
      try {
        imageBuffer = await downloadImage(attachment.url);
        imageExt = getImageExtension(attachment.filename);
      } catch (error) {
        console.error('Failed to download facade right image:', error.message);
      }
    }

    currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, '5.5 ถ่ายรูปด้านนอกอาคาร "ทุกด้าน" จากด้านล่าง (เเนบรูป: ด้านขวา)', imageExt);
    currentRow += 1;
  }

  // ===== Facade Back Image =====
  if (building.facadeBackImage) {
    const attachment = resolveAttachment(building.facadeBackImage, 'group_gs9vj55/image_sj5tk19', attachmentMaps);
    let imageBuffer = null;
    let imageExt = 'jpeg';

    if (attachment && attachment.url) {
      try {
        imageBuffer = await downloadImage(attachment.url);
        imageExt = getImageExtension(attachment.filename);
      } catch (error) {
        console.error('Failed to download facade back image:', error.message);
      }
    }

    currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, '5.6 ถ่ายรูปด้านนอกอาคาร "ทุกด้าน" จากด้านล่าง (เเนบรูป: ด้านหลัง)', imageExt);
    currentRow += 2;
  }

  // ===== GRID CONNECTION SECTION =====
  mergeAndWrite(worksheet, currentRow, 1, currentRow, 6, '5.7 Grid Connection and Protection detail', sectionHeaderStyle());
  currentRow += 2;

  // ===== PEA/MEA Meter Image =====
  if (building.peaMeaMeterImage) {
    const attachment = resolveAttachment(building.peaMeaMeterImage, 'group_gs9vj55/group_iz7ky31/PEA_MEA_Meter', attachmentMaps);
    let imageBuffer = null;
    let imageExt = 'jpeg';

    if (attachment && attachment.url) {
      try {
        imageBuffer = await downloadImage(attachment.url);
        imageExt = getImageExtension(attachment.filename);
      } catch (error) {
        console.error('Failed to download PEA/MEA meter image:', error.message);
      }
    }

    currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, '5.7.1 PEA/MEA Meter', imageExt);
    currentRow += 1;
  }

  return currentRow;
}
