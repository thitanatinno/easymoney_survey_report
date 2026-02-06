import { mergeAndWrite, writeRow, setColumnWidths } from '../../utils/excel/helpers.js';
import { headerStyle, cellStyle, sectionHeaderStyle } from '../../utils/excel/styles.js';

/**
 * Renders Sheet 3: Customer MDP/LP Data
 * @param {Object} worksheet - ExcelJS worksheet
 * @param {Object} data - Normalized data
 */
export function renderSheet3(worksheet, data) {
  const { customerMDP } = data;

  // Set column widths
  setColumnWidths(worksheet, [30, 40]);

  let currentRow = 1;

  // ===== SECTION: CUSTOMER MDP/LP =====
  mergeAndWrite(worksheet, currentRow, 1, currentRow, 2, '4. ห้องไฟ / MDB', sectionHeaderStyle());
  currentRow += 2;

  // Main Breaker Size
  writeRow(worksheet, currentRow, ['4.1 Main breaker size (AT, AF, V, kA)', customerMDP.mainBreakerSize || 'N/A'], cellStyle());
  currentRow++;

  // SLD Exists
  writeRow(worksheet, currentRow, ['4.2 มี Single line diagram (SLD)  ', customerMDP.sldExists || 'N/A'], cellStyle());
  currentRow += 2;

  // Main MDB Cable
  writeRow(worksheet, currentRow, ['4.3 Main MDB cable ( AC Cable THW or Other , Size (mm²)) ', customerMDP.mainMdbCable || 'N/A'], cellStyle());
  currentRow++;

  // Feeder MDB
  writeRow(worksheet, currentRow, ['4.4 Feeder MDB ( จำนวน )', customerMDP.feederMdb || 'N/A'], cellStyle());
  currentRow++;

  // Main Busbar MDB
  writeRow(worksheet, currentRow, ['4.5 Main Busbar MDB', customerMDP.mainBusbarMdb || 'N/A'], cellStyle());
  currentRow++;

  // MDB Ground Cable
  writeRow(worksheet, currentRow, ['4.6 ระบบกราวด์เดิมที่มีอยู่เเล้วของตู้ MDB ( Ground Cable(THW or Other), Size (mm²), Ground)', customerMDP.mdbGroundCable || 'N/A'], cellStyle());
  currentRow += 2;

  // Measurements Section
  mergeAndWrite(worksheet, currentRow, 1, currentRow, 2, '4.7 การวัดค่า', sectionHeaderStyle());
  currentRow++;

  // Voltage
  writeRow(worksheet, currentRow, ['4.7.1 Voltage (R, S, T and RN , SN ,TN )  V.', customerMDP.voltage || 'N/A'], cellStyle());
  currentRow++;

  // Ampere
  writeRow(worksheet, currentRow, ['4.7.2 Ampere (R, S, T)  A.', customerMDP.ampere || 'N/A'], cellStyle());
  currentRow++;

  // Power
  writeRow(worksheet, currentRow, ['4.7.3 Power (R, S, T)  Total kW', customerMDP.power || 'N/A'], cellStyle());
  currentRow += 2;

  // AT
  writeRow(worksheet, currentRow, ['4.8 AT ', customerMDP.at || 'N/A'], cellStyle());
  currentRow += 2;

  // Additional Images
  mergeAndWrite(worksheet, currentRow, 1, currentRow, 2, '4.9 เอกสารเพิ่มเติม', sectionHeaderStyle());
  currentRow++;

  // Router Note
  writeRow(worksheet, currentRow, ['4.9.1 จุด rounter intrernet (สามารถโยงมาที่ห้องไฟยังไงได้บ้าง) อธิบายเพิ่มเติม', customerMDP.routerNote || 'N/A'], cellStyle());
  currentRow++;

  return currentRow;
}
