/**
 * Solar Survey Form - Data Normalization
 * Normalizes Kobo submission for solar installation survey
 * 
 * ⚠️ FORM-SPECIFIC: Do not modify field paths without updating Kobo form
 * 
 * This is the EXACT normalization logic from the original system.
 * Field names and structure are preserved for backward compatibility.
 */

import { extractMeta, extractAttachments } from '../../../utils/fieldExtractor.js';

/**
 * Normalize solar survey submission
 * @param {Object} submission - Raw Kobo submission
 * @returns {Object} - Normalized data structure
 */
export function normalize(submission) {
  console.log('\n🔄 NORMALIZING SOLAR SURVEY SUBMISSION...');
  console.log('Submission keys:', Object.keys(submission));
  
  // Extract meta fields (common)
  const meta = extractMeta(submission);

  // General Data (group_hh1ii99)
  const general = {
    projectName: submission['group_hh1ii99/text_aa8ps42'] || '',
    siteName: submission['group_hh1ii99/text_pl66z95'] || '',
    contact: submission['group_hh1ii99/text_dv4na03'] || '',
    phone: submission['group_hh1ii99/text_rw8oa22'] || '',
    datetime: submission['group_hh1ii99/datetime_am35s23'] || '',
    geopoint: submission['group_hh1ii99/geopoint_et0pz50'] || ''
  };

  // Building Data (group_gs9vj55)
  const building = {
    orientationNote: submission['group_gs9vj55/text_tm4fp17'] || '',
    orientationImage: submission['group_gs9vj55/image_bn2pa18'] || '',
    peaMeaMeterImage: submission['group_gs9vj55/group_iz7ky31/PEA_MEA_Meter'] || '',
    electricalAuthority: submission['group_gs9vj55/group_iz7ky31/Electrical_Authority'] || '',
    amrMeter: submission['group_gs9vj55/group_iz7ky31/AMR_Meter'] || '',
    amrUserPassword: submission['group_gs9vj55/group_iz7ky31/AMR_Meter_USER_Password_'] || '',
    transformer: submission['group_gs9vj55/group_iz7ky31/Transformer'] || '',
    transformerSize: submission['group_gs9vj55/group_iz7ky31/Tranformer_size_kVA'] || '',
    incomingVoltage: submission['group_gs9vj55/group_iz7ky31/PEA_MEA_Incoming_kV_V'] || '',
    connectionPoint: submission['group_gs9vj55/group_iz7ky31/connection_Point_In_rter_Housing_to_MDB_'] || '',
    connectionPointMicroInverter: submission['group_gs9vj55/group_iz7ky31/connection_Point_Micro_Inverter_Solar'] || '',
    connectionPointSolarMDB: submission['group_gs9vj55/group_iz7ky31/connection_Point_Solar_MDB'] || '',
    parkingImage: submission['group_gs9vj55/image_ao2ed61'] || '',
    facadeFrontImage: submission['group_gs9vj55/image_rc7iz33'] || '',
    facadeLeftImage: submission['group_gs9vj55/image_zd8zv68'] || '',
    facadeRightImage: submission['group_gs9vj55/image_qp9jo49'] || '',
    facadeBackImage: submission['group_gs9vj55/image_sj5tk19'] || ''
  };

  // Customer MDP/LP Data (group_li3tn67 + group_gr7hn33)
  const customerMDP = {
    electricalRoomImage: submission['group_li3tn67/image_jz8sc99'] || '',
    breakerImage: submission['group_li3tn67/image_if5sx77'] || '',
    sldExists: submission['group_li3tn67/_Single_line_diagram_SLD'] || '',
    sldImage: submission['group_li3tn67/_Single_line_diagram_SLD_'] || '',
    mainBreakerSize: submission['group_li3tn67/Main_breaker_size_AT_AF_V_kA'] || '',
    ctImage: submission['group_li3tn67/_CT'] || '',
    mainMdbCable: submission['group_li3tn67/Main_MDB_cable_AC_or_Other_Size_mm'] || '',
    feederMdb: submission['group_li3tn67/Feeder_MDB_'] || '',
    mainBusbarMdb: submission['group_li3tn67/Main_Busbar_MDB'] || '',
    mdbGroundCable: submission['group_li3tn67/_MDB_Ground_Cable_er_Size_mm_Ground'] || '',
    at: submission['group_gr7hn33/AT'] || '',
    voltage: submission['group_gr7hn33/Voltage_R_S_T_and_RN_SN_TN_V'] || '',
    ampere: submission['group_gr7hn33/Ampere_R_S_T_A'] || '',
    power: submission['group_gr7hn33/Power_R_S_T_Total_kW'] || '',
    tieInImage: submission['group_gr7hn33/_Tie_In'] || '',
    routerImage: submission['group_gr7hn33/_rounter_intrernet_'] || '',
    routerNote: submission['group_gr7hn33/_rounter_intrernet__001'] || ''
  };

  // Route Line (group_ns6fp26 - repeat)
  const routeline = [];
  if (submission['group_ns6fp26'] && Array.isArray(submission['group_ns6fp26'])) {
    submission['group_ns6fp26'].forEach((item, index) => {
      routeline.push({
        index,
        distance: item['group_ns6fp26/_m_'] || '',
        image: item['group_ns6fp26/image_ki1nl22'] || ''
      });
    });
  }

  // Combiner Box Installation (group_ib9gq22 with nested repeats)
  const combiner = {
    mainImage: submission['group_ib9gq22/image_eu9in14'] || '',
    ceilingImage: submission['group_ib9gq22/image_zz3zj61'] || '',
    waterTapImage: submission['group_ib9gq22/image_ax4lw86'] || '',
    images1: [],
    images2: [],
    images3: []
  };

  // Extract nested repeat images
  if (submission['group_ib9gq22/group_fe64a97'] && Array.isArray(submission['group_ib9gq22/group_fe64a97'])) {
    combiner.images1 = submission['group_ib9gq22/group_fe64a97'].map((item, index) => ({
      index,
      image: item['group_ib9gq22/group_fe64a97/image_vq1vq04'] || '',
      size: item['group_ib9gq22/group_fe64a97/integer_ac24n13'] || ''
    }));
  }

  if (submission['group_ib9gq22/group_hn9xa37'] && Array.isArray(submission['group_ib9gq22/group_hn9xa37'])) {
    combiner.images2 = submission['group_ib9gq22/group_hn9xa37'].map((item, index) => ({
      index,
      image: item['group_ib9gq22/group_hn9xa37/image_mj9ul94'] || '',
      lightningType: item['group_ib9gq22/group_hn9xa37/select_multiple_cp1kc67'] || ''
    }));
  }

  if (submission['group_ib9gq22/group_oi1vu72'] && Array.isArray(submission['group_ib9gq22/group_oi1vu72'])) {
    combiner.images3 = submission['group_ib9gq22/group_oi1vu72'].map((item, index) => ({
      index,
      image: item['group_ib9gq22/group_oi1vu72/image_cn7fr55'] || '',
      file: item['group_ib9gq22/group_oi1vu72/file_es9un79'] || ''
    }));
  }

  // Store raw attachments
  const attachments = extractAttachments(submission);

  const normalized = {
    meta,
    general,
    building,
    customerMDP,
    routeline,
    combiner,
    attachments
  };
  
  console.log('\n✅ SOLAR SURVEY - NORMALIZED DATA:');
  console.log('- Meta fields:', Object.keys(meta));
  console.log('- General data:', Object.keys(general));
  console.log('- Building data:', Object.keys(building));
  console.log('- Customer MDP:', Object.keys(customerMDP));
  console.log('- Routeline items:', routeline.length);
  console.log('- Combiner images sets:', combiner.images1.length, combiner.images2.length, combiner.images3.length);
  console.log('- Attachments count:', attachments.length);
  
  return normalized;
}
