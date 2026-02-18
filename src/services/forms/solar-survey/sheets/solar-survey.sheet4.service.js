import { setColumnWidths, mergeAndWrite } from '../../../../utils/excel/helpers.js';
import { sectionHeaderStyle } from '../../../../utils/excel/styles.js';
import { addImageBlock, getImageExtension } from '../../../../utils/excel/images.js';
import { buildRepeatXPath, resolveAttachment } from '../../../../utils/attachments.js';
import { downloadImage } from '../../../kobo.service.js';

/**
 * Renders Sheet 5: Routeline & Roof Images
 * Shows route line items and roof/solar installation area images
 * 
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {Object} data - Normalized data
 * @param {Object} attachmentMaps - Attachment maps
 * @param {Object} workbook - ExcelJS workbook
 */
export async function renderSheet4(worksheet, data, attachmentMaps, workbook) {
  const { routeline, combiner } = data;

  // Set column widths - using 6 columns for wide layout
  setColumnWidths(worksheet, [5, 15, 15, 15, 15, 15]);

  let currentRow = 1;

  // ===== SECTION HEADER =====
  mergeAndWrite(worksheet, currentRow, 1, currentRow, 6, '6. ระยะเดินสายจากตู้ไฟไปพื้นที่การติดตั้ง & ข้อมูลหลังคาก่อนการติดตั้ง solar', sectionHeaderStyle());
  currentRow += 2;

  // ===== ROUTE LINE ITEMS =====
  if (routeline && routeline.length > 0) {
    for (const item of routeline) {
      const caption = `6.${item.index + 1} Route line item ${item.index + 1}: ${item.distance}`;
      
      // Resolve attachment
      const xPath = buildRepeatXPath('group_ns6fp26', item.index, 'image_ki1nl22');
      const attachment = resolveAttachment(item.image, xPath, attachmentMaps);
      
      let imageBuffer = null;
      let imageExt = 'jpeg';

      if (attachment && attachment.url) {
        try {
          imageBuffer = await downloadImage(attachment.url);
          imageExt = getImageExtension(attachment.filename);
        } catch (error) {
          console.error(`Failed to download image for route line ${item.index + 1}:`, error.message);
        }
      }

      // Add image block with dynamic row expansion
      currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, caption, imageExt);
      currentRow += 1; // Spacing between items
    }
  } else {
    mergeAndWrite(worksheet, currentRow, 1, currentRow, 6, 'No route line data available', sectionHeaderStyle());
    currentRow += 2;
  }

  currentRow += 2;

  // ===== COMBINER BOX IMAGES =====
  const roofStartNum = routeline.length + 1;
  mergeAndWrite(worksheet, currentRow, 1, currentRow, 6, `6.${roofStartNum} ข้อมูลหลังคาก่อนการติดตั้ง solar`, sectionHeaderStyle());
  currentRow += 2;

  let roofImageCount = 0;

  // Main combiner image
  if (combiner.mainImage) {
    const attachment = resolveAttachment(combiner.mainImage, 'group_ib9gq22/image_eu9in14', attachmentMaps);
    let imageBuffer = null;
    let imageExt = 'jpeg';

    if (attachment && attachment.url) {
      try {
        imageBuffer = await downloadImage(attachment.url);
        imageExt = getImageExtension(attachment.filename);
      } catch (error) {
        console.error('Failed to download main combiner image:', error.message);
      }
    }

    currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, `6.${roofStartNum}.${++roofImageCount} รูปถ่ายทางขึ้นดาดฟ้า`, imageExt);
    currentRow += 1;
  }

  // Ceiling structure image
  if (combiner.ceilingImage) {
    const attachment = resolveAttachment(combiner.ceilingImage, 'group_ib9gq22/image_zz3zj61', attachmentMaps);
    let imageBuffer = null;
    let imageExt = 'jpeg';

    if (attachment && attachment.url) {
      try {
        imageBuffer = await downloadImage(attachment.url);
        imageExt = getImageExtension(attachment.filename);
      } catch (error) {
        console.error('Failed to download ceiling structure image:', error.message);
      }
    }

    currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, `6.${roofStartNum}.${++roofImageCount} รูปถ่ายโครงสร้างใต้ฝ้า (ถ้ามี)`, imageExt);
    currentRow += 1;
  }

  // Water tap image
  if (combiner.waterTapImage) {
    const attachment = resolveAttachment(combiner.waterTapImage, 'group_ib9gq22/image_ax4lw86', attachmentMaps);
    let imageBuffer = null;
    let imageExt = 'jpeg';

    if (attachment && attachment.url) {
      try {
        imageBuffer = await downloadImage(attachment.url);
        imageExt = getImageExtension(attachment.filename);
      } catch (error) {
        console.error('Failed to download water tap image:', error.message);
      }
    }

    currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, `6.${roofStartNum}.${++roofImageCount} จุดก็อกน้ำบนดาดฟ้าหรือที่ใกล้ที่สุด`, imageExt);
    currentRow += 1;
  }

  // Combiner images set 1 (group_fe64a97)
  if (combiner.images1 && combiner.images1.length > 0) {
    for (const item of combiner.images1) {
      const sizeText = item.size ? ` - ขนาด: ${item.size}` : '';
      const caption = `6.${roofStartNum}.${++roofImageCount} ถ่ายภาพดาดฟ้าแต่ละด้าน ${item.index + 1}${sizeText}`;
      const xPath = buildRepeatXPath('group_ib9gq22/group_fe64a97', item.index, 'image_vq1vq04');
      const attachment = resolveAttachment(item.image, xPath, attachmentMaps);
      
      let imageBuffer = null;
      let imageExt = 'jpeg';

      if (attachment && attachment.url) {
        try {
          imageBuffer = await downloadImage(attachment.url);
          imageExt = getImageExtension(attachment.filename);
        } catch (error) {
          console.error(`Failed to download combiner image set 1 item ${item.index + 1}:`, error.message);
        }
      }

      currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, caption, imageExt);
      currentRow += 1;
    }
  }

  // Combiner images set 2 (group_hn9xa37)
  if (combiner.images2 && combiner.images2.length > 0) {
    for (const item of combiner.images2) {
      const typeText = item.lightningType ? ` - รูปแบบ: ${item.lightningType}` : '';
      const caption = `6.${roofStartNum}.${++roofImageCount} ตรวจสอบการติดตั้งระบบป้องกันฟ้าผ่า ${item.index + 1}${typeText}`;
      const xPath = buildRepeatXPath('group_ib9gq22/group_hn9xa37', item.index, 'image_mj9ul94');
      const attachment = resolveAttachment(item.image, xPath, attachmentMaps);
      
      let imageBuffer = null;
      let imageExt = 'jpeg';

      if (attachment && attachment.url) {
        try {
          imageBuffer = await downloadImage(attachment.url);
          imageExt = getImageExtension(attachment.filename);
        } catch (error) {
          console.error(`Failed to download combiner image set 2 item ${item.index + 1}:`, error.message);
        }
      }

      currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, caption, imageExt);
      currentRow += 1;
    }
  }

  // Combiner images set 3 (group_oi1vu72)
  if (combiner.images3 && combiner.images3.length > 0) {
    for (const item of combiner.images3) {
      const fileText = item.file ? ` - ไฟล์: ${item.file}` : '';
      const caption = `6.${roofStartNum}.${++roofImageCount} ข้อมูลอื่นๆเพิ่มเติม ${item.index + 1}${fileText}`;
      const xPath = buildRepeatXPath('group_ib9gq22/group_oi1vu72', item.index, 'image_cn7fr55');
      const attachment = resolveAttachment(item.image, xPath, attachmentMaps);
      
      let imageBuffer = null;
      let imageExt = 'jpeg';

      if (attachment && attachment.url) {
        try {
          imageBuffer = await downloadImage(attachment.url);
          imageExt = getImageExtension(attachment.filename);
        } catch (error) {
          console.error(`Failed to download combiner image set 3 item ${item.index + 1}:`, error.message);
        }
      }

      currentRow = addImageBlock(worksheet, workbook, imageBuffer, currentRow, 1, 6, caption, imageExt);
      currentRow += 1;
    }
  }

  return currentRow;
}
