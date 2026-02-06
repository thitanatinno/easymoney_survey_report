import { mergeAndWrite, writeRow } from '../../utils/excel/helpers.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Renders Cover Sheet
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {Object} workbook - ExcelJS workbook
 * @param {Object} data - Normalized data
 */
export async function renderCoverSheet(worksheet, workbook, data) {
  const { general, meta } = data;

  // Set column widths
  worksheet.getColumn(1).width = 2;
  worksheet.getColumn(2).width = 12;
  worksheet.getColumn(3).width = 12;
  worksheet.getColumn(4).width = 15;
  worksheet.getColumn(5).width = 20;
  worksheet.getColumn(6).width = 12;
  worksheet.getColumn(7).width = 12;
  worksheet.getColumn(8).width = 12;
  worksheet.getColumn(9).width = 12;
  worksheet.getColumn(10).width = 12;

  let currentRow = 2;

  // Add INNO logo (only if file exists)
  const logoPath = path.join(__dirname, '../../../assets/inno-logo.png');
  if (fs.existsSync(logoPath)) {
    try {
      const logoId = workbook.addImage({
        filename: logoPath,
        extension: 'png',
      });
      
      worksheet.addImage(logoId, {
        tl: { col: 3, row: currentRow - 1 },
        ext: { width: 150, height: 80 }
      });
    } catch (error) {
      console.log('Error adding logo:', error.message);
    }
  } else {
    console.log('Logo not found at:', logoPath);
  }

  // Reference Number (top right)
  const refNumber = `EM01-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`;
  mergeAndWrite(worksheet, currentRow, 6, currentRow, 9, refNumber, {
    font: { size: 14, bold: true },
    alignment: { horizontal: 'center', vertical: 'middle' }
  });

  currentRow += 5;

  // Site Information Section
  const siteInfoStyle = {
    font: { size: 11, bold: true },
    alignment: { horizontal: 'left', vertical: 'middle' }
  };

  const valueStyle = {
    font: { size: 11 },
    alignment: { horizontal: 'left', vertical: 'middle' }
  };

  // Site name
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 3, 'Site name :', siteInfoStyle);
  mergeAndWrite(worksheet, currentRow, 4, currentRow, 6, `สาขา..${general.siteName}..จังหวัด..............` || 'สาขา....... จังหวัด.......', valueStyle);
  currentRow++;

  // Site Code
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 3, 'Site Code :', siteInfoStyle);
  mergeAndWrite(worksheet, currentRow, 4, currentRow, 6, 'RS', valueStyle);
  currentRow++;

  // By
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 3, 'By', siteInfoStyle);
  mergeAndWrite(worksheet, currentRow, 4, currentRow, 6, general.contact || 'ชื่อหรม หรม ที่เข้าสำรวจ', valueStyle);
  currentRow += 3;

  // Link note (right aligned)
  mergeAndWrite(worksheet, currentRow, 7, currentRow, 9, 'หมายขี Link ของมูลที่ของมูลนี้', {
    font: { size: 9, italic: true },
    alignment: { horizontal: 'right', vertical: 'middle' }
  });
  currentRow += 2;

  // Main Title
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 9, 'Technical Site Survey Report (TSSR)', {
    font: { size: 20, bold: true },
    alignment: { horizontal: 'center', vertical: 'middle' }
  });
  worksheet.getRow(currentRow).height = 30;
  currentRow += 5;

  // Client Section
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 9, 'ชื่อลูกค้า : บริษัท ตั้งธนสิน จำกัด', {
    font: { size: 12, bold: true },
    alignment: { horizontal: 'center', vertical: 'middle' }
  });
  currentRow += 3;

  // Address Section
  const address = 'ที่อยู่ ' + (general.siteName || '............................................................');
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 3, 'สถานที่ติดตั้ง :', {
    font: { size: 11, bold: true },
    alignment: { horizontal: 'left', vertical: 'top' }
  });
  mergeAndWrite(worksheet, currentRow, 4, currentRow + 2, 9, address, {
    font: { size: 11 },
    alignment: { horizontal: 'left', vertical: 'top', wrapText: true }
  });
  currentRow += 5;

  // Prepared By Section
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 9, 'PREPARED BY', {
    font: { size: 14, bold: true },
    alignment: { horizontal: 'center', vertical: 'middle' }
  });
  worksheet.getRow(currentRow).height = 25;

  // Set print settings
  worksheet.pageSetup = {
    paperSize: 9, // A4
    orientation: 'portrait',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3
    }
  };
}
