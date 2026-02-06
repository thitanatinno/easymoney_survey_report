import { mergeAndWrite, writeRow, setColumnWidths, drawTableGrid } from '../../utils/excel/helpers.js';
import { headerStyle, cellStyle, sectionHeaderStyle } from '../../utils/excel/styles.js';
import { setYesNoCheckbox, setCheckboxForValue } from '../../utils/excel/checkbox.js';

/**
 * Renders Sheet 1: General Data + Building Data
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {Object} data - Normalized data
 */
export function renderSheet1(worksheet, data) {
  const { general, building } = data;

  // Set column widths
  setColumnWidths(worksheet, [25, 30, 25, 30]);

  let currentRow = 1;

  // ===== SECTION 1: GENERAL DATA =====
  mergeAndWrite(worksheet, currentRow, 1, currentRow, 4, '1. ข้อมูลทั่วไป (General data)', sectionHeaderStyle());
  currentRow++;

  // Row 1: Project Name | [value] | Site Name | [value]
  writeRow(worksheet, currentRow, ['1.1 ชื่อโครงการ/หน้างาน', general.projectName, '1.2 ที่ตั้งโครงการ/หน้างาน', general.siteName], cellStyle());
  currentRow++;

  // Row 2: Contact | [value] | Phone | [value]
  writeRow(worksheet, currentRow, ['1.3 ชื่อผู้สำรวจ', general.contact, '1.4 เบอร์โทรผู้ติดต่อหน้างาน', general.phone], cellStyle());
  currentRow++;

  // Row 3: Date/Time | [value]
  writeRow(worksheet, currentRow, ['1.5 วันที/เวลาเริ่มสำรวจ', general.datetime, '', ''], cellStyle());
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 4, general.datetime, cellStyle());
  currentRow++;

  // Row 4: Geopoint (spanning all columns)
  writeRow(worksheet, currentRow, ['1.6 ที่อยู่หน้างาน', general.geopoint, '', ''], cellStyle());
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 4, general.geopoint, cellStyle());
  currentRow += 2; // Add spacing

  // ===== SECTION 2: BUILDING DATA =====
  mergeAndWrite(worksheet, currentRow, 1, currentRow, 4, '2. สำรวจภายนอกอาคาร/ทางเข้า', sectionHeaderStyle());
  currentRow++;

  // Orientation Note
  writeRow(worksheet, currentRow, ['2.1 ทิศทางของร้าน/หน้างาน ', '', '', ''], cellStyle());
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 4, building.orientationNote, cellStyle());
  currentRow += 2;

  // Electrical Authority (with checkboxes)
  const authCell = worksheet.getCell(currentRow, 2);
  writeRow(worksheet, currentRow, ['2.2 Electrical Authority', '', '', ''], cellStyle());
  setCheckboxForValue(authCell, building.electricalAuthority, 'PEA', 'PEA');
  const meaValue = (building.electricalAuthority || '').toLowerCase() === 'mea' ? '☑ MEA' : '☐ MEA';
  authCell.value = `${authCell.value}  ${meaValue}`;
  Object.assign(authCell, cellStyle());
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 4, authCell.value, cellStyle());
  currentRow++;

  // AMR Meter (Yes/No checkboxes)
  const amrCell = worksheet.getCell(currentRow, 2);
  writeRow(worksheet, currentRow, ['2.3 AMR Meter', '', '', ''], cellStyle());
  setYesNoCheckbox(amrCell, building.amrMeter);
  Object.assign(amrCell, cellStyle());
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 4, amrCell.value, cellStyle());
  currentRow++;

  // Transformer (Yes/No checkboxes)
  const transformerCell = worksheet.getCell(currentRow, 2);
  writeRow(worksheet, currentRow, ['2.4 Transformer', '', '', ''], cellStyle());
  setYesNoCheckbox(transformerCell, building.transformer);
  Object.assign(transformerCell, cellStyle());
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 4, transformerCell.value, cellStyle());
  currentRow++;

  // Transformer Size
  writeRow(worksheet, currentRow, ['2.5 Tranformer size (kVA)', building.transformerSize || 'N/A', '', ''], cellStyle());
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 4, building.transformerSize || 'N/A', cellStyle());
  currentRow++;

  // Incoming Voltage
  writeRow(worksheet, currentRow, ['2.6 PEA/MEA Incoming (kV,V)', building.incomingVoltage || 'N/A', '', ''], cellStyle());
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 4, building.incomingVoltage || 'N/A', cellStyle());
  currentRow++;

  // AMR Meter User/Password
  writeRow(worksheet, currentRow, ['2.7 AMR Meter ( ใส่ USER เเละ Password ถ้ามี) ', building.amrUserPassword || 'N/A', '', ''], cellStyle());
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 4, building.amrUserPassword || 'N/A', cellStyle());
  currentRow++;

  // Connection Point
  writeRow(worksheet, currentRow, ['2.8 connection Point (Inverter Housing to MDB)', building.connectionPoint || 'N/A', '', ''], cellStyle());
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 4, building.connectionPoint || 'N/A', cellStyle());
  currentRow++;

  // Connection Point (Micro Inverter -> Solar)
  writeRow(worksheet, currentRow, ['2.9 connection Point (Micro Inverter ถึงตู้ Solar)', building.connectionPointMicroInverter || 'N/A', '', ''], cellStyle());
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 4, building.connectionPointMicroInverter || 'N/A', cellStyle());
  currentRow++;

  // Connection Point (Solar -> MDB)
  writeRow(worksheet, currentRow, ['2.10 connection Point (ตู้ Solar ถึงตู้เมน MDB)', building.connectionPointSolarMDB || 'N/A', '', ''], cellStyle());
  mergeAndWrite(worksheet, currentRow, 2, currentRow, 4, building.connectionPointSolarMDB || 'N/A', cellStyle());
  currentRow += 2;

  return currentRow;
}
