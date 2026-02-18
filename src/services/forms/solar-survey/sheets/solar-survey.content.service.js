import { mergeAndWrite, writeRow } from '../../../../utils/excel/helpers.js';

/**
 * Renders Content Sheet (Table of Contents)
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {Object} data - Normalized data
 * @param {Object} attachmentMaps - Attachment maps
 * @param {Object} workbook - ExcelJS workbook
 */
export function renderContentSheet(worksheet, data, attachmentMaps, workbook) {
  const { general } = data;

  // Set column widths
  worksheet.getColumn(1).width = 2;
  worksheet.getColumn(2).width = 8;
  worksheet.getColumn(3).width = 50;
  worksheet.getColumn(4).width = 15;
  worksheet.getColumn(5).width = 15;

  let currentRow = 5;

  // Site Name Header
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 4, 'Site Name', {
    font: { size: 14, bold: true },
    alignment: { horizontal: 'center', vertical: 'middle' }
  });
  currentRow++;

  mergeAndWrite(worksheet, currentRow, 2, currentRow, 4, general.siteName || 'สาขา....... จังหวัด.......', {
    font: { size: 12 },
    alignment: { horizontal: 'center', vertical: 'middle' }
  });
  currentRow++;

  mergeAndWrite(worksheet, currentRow, 2, currentRow, 4, 'RS', {
    font: { size: 12, bold: true },
    alignment: { horizontal: 'center', vertical: 'middle' }
  });
  currentRow += 3;

  // Contents Title
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 4, 'Contents', {
    font: { size: 24, bold: true },
    alignment: { horizontal: 'center', vertical: 'middle' }
  });
  worksheet.getRow(currentRow).height = 35;
  currentRow += 3;

  // Table of Contents Items
  const contents = [
    { number: '1', title: 'General data' },
    { number: '2', title: 'Building data' },
    { number: '3', title: 'Inverters Housing Area' },
    { number: '4', title: 'DC Cable Route line' },
    { number: '5', title: 'Grid Connection and Protection detail' },
    { number: '6', title: 'Customer MDB' },
    { number: '7', title: 'Sketch and Pictures' },
    { number: '7.1', title: 'Overview layout and Route line', indent: true },
    { number: '7.2', title: 'Access road', indent: true },
    { number: '7.3', title: 'Roof Area', indent: true },
    { number: '7.4', title: 'Lightning Protection', indent: true },
    { number: '7.5', title: 'ป้ายโฆษณาของสาขา', indent: true },
    { number: '7.6', title: 'Inverter Area', indent: true },
    { number: '7.7', title: 'AC Route Line (Inverter house to Connection Point)', indent: true },
    { number: '7.8', title: 'AMR Meter (ถ้ามี)', indent: true },
    { number: '7.9', title: 'Location บริเวณ Existing MDB', indent: true },
    { number: '7.1', title: 'Protection Point (CT Position) and Tie-in', indent: true },
    { number: '7.11', title: 'Main Incoming MCB', indent: true },
    { number: '7.12', title: 'Single Line Diagram (Exsiting/Sketch)', indent: true },
    { number: '7.13', title: 'Water supply Location', indent: true },
    { number: '7.14', title: 'สภาพหลังคา', indent: true }
  ];

  const contentStyle = {
    font: { size: 11 },
    alignment: { horizontal: 'left', vertical: 'middle' }
  };

  const contentStyleBold = {
    font: { size: 11, bold: true },
    alignment: { horizontal: 'left', vertical: 'middle' }
  };

  contents.forEach(item => {
    const style = item.indent ? contentStyle : contentStyleBold;
    const startCol = item.indent ? 3 : 2;
    
    // Number column
    worksheet.getCell(currentRow, startCol).value = item.number;
    worksheet.getCell(currentRow, startCol).style = style;
    
    // Title column
    mergeAndWrite(worksheet, currentRow, startCol + 1, currentRow, 4, item.title, style);
    
    worksheet.getRow(currentRow).height = 20;
    currentRow++;
  });

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
