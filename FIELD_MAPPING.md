# Exact Field Mapping from asset_content.json

## General Data (group_hh1ii99)
| Field ID (xpath) | Current Label in Code | **Exact Label from Content** |
|------------------|----------------------|------------------------------|
| `group_hh1ii99/text_aa8ps42` | Project Name | **ชื่อโครงการ/หน้างาน** |
| `group_hh1ii99/geopoint_et0pz50` | Geopoint | **ที่อยู่หน้างาน** |
| `group_hh1ii99/text_pl66z95` | Site Name | **ที่ตั้งโครงการ/หน้างาน** |
| `group_hh1ii99/text_dv4na03` | Contact | **ชื่อผู้สำรวจ** |
| `group_hh1ii99/text_rw8oa22` | Phone | **เบอร์โทรผู้ติดต่อหน้างาน** |
| `group_hh1ii99/datetime_am35s23` | Date/Time | **วันที/เวลาเริ่มสำรวจ** |

## Building Exterior Data (group_gs9vj55)
| Field ID (xpath) | Current Label in Code | **Exact Label from Content** |
|------------------|----------------------|------------------------------|
| `group_gs9vj55/image_bn2pa18` | Orientation Image | **ถ่ายรูปถนนทางเข้าโครงการ/หน้างาน** |
| `group_gs9vj55/text_tm4fp17` | Orientation Note | **ทิศทางของร้าน/หน้างาน** (with trailing space) |
| `group_gs9vj55/image_ao2ed61` | Parking/Lot Image | **ถ่ายรูปพื้นที่วางของ/ลานจอดรถ** |
| `group_gs9vj55/image_rc7iz33` | Facade (Front) Image | **ถ่ายรูปด้านนอกอาคาร "ทุกด้าน" จากด้านล่าง (เเนบรูป: ด้านหน้า)** |
| `group_gs9vj55/image_zd8zv68` | Facade (Left) Image | **ถ่ายรูปด้านนอกอาคาร "ทุกด้าน" จากด้านล่าง (เเนบรูป: ด้านซ้าย)** |
| `group_gs9vj55/image_qp9jo49` | Facade (Right) Image | **ถ่ายรูปด้านนอกอาคาร "ทุกด้าน" จากด้านล่าง (เเนบรูป: ด้านขวา)** |
| `group_gs9vj55/image_sj5tk19` | Facade (Back) Image | **ถ่ายรูปด้านนอกอาคาร "ทุกด้าน" จากด้านล่าง (เเนบรูป: ด้านหลัง)** |

## Grid Connection (group_gs9vj55/group_iz7ky31)
| Field ID (xpath) | Current Label in Code | **Exact Label from Content** |
|------------------|----------------------|------------------------------|
| `group_gs9vj55/group_iz7ky31/PEA_MEA_Meter` | PEA/MEA Meter Image | **PEA/MEA Meter** |
| `group_gs9vj55/group_iz7ky31/Electrical_Authority` | Electrical Authority | **Electrical Authority** |
| `group_gs9vj55/group_iz7ky31/AMR_Meter` | AMR Meter | **AMR Meter** |
| `group_gs9vj55/group_iz7ky31/AMR_Meter_USER_Password_` | AMR Meter User/Password | **AMR Meter ( ใส่ USER เเละ Password ถ้ามี)** (with trailing space) |
| `group_gs9vj55/group_iz7ky31/PEA_MEA_Incoming_kV_V` | PEA/MEA Incoming (kV/V) | **PEA/MEA Incoming (kV,V)** |
| `group_gs9vj55/group_iz7ky31/Transformer` | Transformer | **Transformer** |
| `group_gs9vj55/group_iz7ky31/Tranformer_size_kVA` | Transformer Size (kVA) | **Tranformer size (kVA)** |
| `group_gs9vj55/group_iz7ky31/connection_Point_Micro_Inverter_Solar` | Connection Point (Micro Inverter → Solar) | **connection Point (Micro Inverter ถึงตู้ Solar)** |
| `group_gs9vj55/group_iz7ky31/connection_Point_Solar_MDB` | Connection Point (Solar → MDB) | **connection Point (ตู้ Solar ถึงตู้เมน MDB)** |

**NOTE:** The field `connection_Point_In_rter_Housing_to_MDB_` is NOT in the content file! Need to check if it exists.

## Electrical Room (group_li3tn67)
| Field ID (xpath) | Current Label in Code | **Exact Label from Content** |
|------------------|----------------------|------------------------------|
| `group_li3tn67/image_jz8sc99` | (used in sldImage fallback) | **ถ่ายภาพห้องไฟ (มุมกว้าง)** |
| `group_li3tn67/image_if5sx77` | (used in sldImage fallback) | **ภาพถ่าย เบรคเกอร์ที่เห็นหนาดเเอมพ์** (with trailing space) |
| `group_li3tn67/_Single_line_diagram_SLD` | SLD Available | **มี Single line diagram (SLD)** (with trailing spaces) |
| `group_li3tn67/_Single_line_diagram_SLD_` | Single Line Diagram (SLD) | **มี Single line diagram (SLD) (ถ้ามีเเนบภาพประกอบ)** (with leading space) |
| `group_li3tn67/Main_breaker_size_AT_AF_V_kA` | Main Breaker Size (AT/AF/V/kA) | **Main breaker size (AT, AF, V, kA)** |
| `group_li3tn67/Main_MDB_cable_AC_or_Other_Size_mm` | Main MDB Cable | **Main MDB cable ( AC Cable THW or Other , Size (mm²))** (with trailing space) |
| `group_li3tn67/_CT` | CT Image | **จุดติดตั้ง CT** |
| `group_li3tn67/Feeder_MDB_` | Feeder MDB (Qty) | **Feeder MDB ( จำนวน )** |
| `group_li3tn67/Main_Busbar_MDB` | Main Busbar MDB | **Main Busbar MDB** |
| `group_li3tn67/_MDB_Ground_Cable_er_Size_mm_Ground` | MDB Ground Cable | **ระบบกราวด์เดิมที่มีอยู่เเล้วของตู้ MDB ( Ground Cable(THW or Other), Size (mm²), Ground)** |

## MDB Measurements (group_gr7hn33)
| Field ID (xpath) | Current Label in Code | **Exact Label from Content** |
|------------------|----------------------|------------------------------|
| `group_gr7hn33/AT` | AT | **AT** (with trailing space) |
| `group_gr7hn33/Power_R_S_T_Total_kW` | Power (R, S, T, Total) kW | **Power (R, S, T) Total kW** |
| `group_gr7hn33/Ampere_R_S_T_A` | Ampere (R, S, T) A | **Ampere (R, S, T) A.** |
| `group_gr7hn33/Voltage_R_S_T_and_RN_SN_TN_V` | Voltage (R, S, T and RN, SN, TN) V | **Voltage (R, S, T and RN , SN ,TN ) V.** |
| `group_gr7hn33/_Tie_In` | Tie In Image | **จุด Tie-In** |
| `group_gr7hn33/_rounter_intrernet_` | Router/Internet Image | **จุด rounter intrernet (สามารถโยงมาที่ห้องไฟยังไงได้บ้าง)** (with trailing space) |
| `group_gr7hn33/_rounter_intrernet__001` | Router Note | **จุด rounter intrernet (สามารถโยงมาที่ห้องไฟยังไงได้บ้าง) อธิบายเพิ่มเติม** |

## Cable Route (group_ns6fp26 - Repeating)
| Field ID (xpath) | Current Label in Code | **Exact Label from Content** |
|------------------|----------------------|------------------------------|
| `group_ns6fp26/_m_` | Distance | **ระยะเดินสายไฟโดยประมาณ ในการเดินสายไปขึ้นไปติดตั้งโซล่าห์ (m) แต่ละห้อง** |
| `group_ns6fp26/image_ki1nl22` | Route Image | **รูปถ่ายเเนวเดินสายจากตู้ไฟไปพื้นที่การติดตั้งโซล่าห์ แต่ละห้อง** |

## Rooftop/Solar Installation (group_ib9gq22)
| Field ID (xpath) | Current Label in Code | **Exact Label from Content** |
|------------------|----------------------|------------------------------|
| `group_ib9gq22/image_zz3zj61` | Ceiling Structure Image | **รูปถ่ายโครงสร้างใต้ฝ้า (ถ้ามี)** |
| `group_ib9gq22/image_eu9in14` | Rooftop Access Image | **รูปถ่ายทางขึ้นดาดฟ้า** |
| `group_ib9gq22/image_ax4lw86` | Water Tap Image | **จุดก๊อกน้ำบนดาดฟ้าหรือที่ใกล้ที่สุด** |

## Rooftop Photos (group_ib9gq22/group_fe64a97 - Repeating)
| Field ID (xpath) | Current Label in Code | **Exact Label from Content** |
|------------------|----------------------|------------------------------|
| `group_ib9gq22/group_fe64a97/image_vq1vq04` | Rooftop Image | **แนบรูปดาดฟ้า** (with trailing space) |
| `group_ib9gq22/group_fe64a97/integer_ac24n13` | Rooftop Size | **ระบุขนาดด้านของดาดฟ้า/หลังคา** |

## Lightning Protection (group_ib9gq22/group_hn9xa37 - Repeating)
| Field ID (xpath) | Current Label in Code | **Exact Label from Content** |
|------------------|----------------------|------------------------------|
| `group_ib9gq22/group_hn9xa37/select_multiple_cp1kc67` | Lightning Protection Type | **รูปเเบบการติดตั้งระบบป้องกันฟ้าผ่า** |
| `group_ib9gq22/group_hn9xa37/image_mj9ul94` | Lightning Protection Image | **ุถ่ายรูป/ระบบป้องกันฟ้าผ่า** |

## Additional Documents (group_ib9gq22/group_oi1vu72 - Repeating)
| Field ID (xpath) | Current Label in Code | **Exact Label from Content** |
|------------------|----------------------|------------------------------|
| `group_ib9gq22/group_oi1vu72/file_es9un79` | Additional File | **ข้อมูลอื่นๆ (ขอเพิ่มเติม) เเบบอาคาร** |
| `group_ib9gq22/group_oi1vu72/image_cn7fr55` | Additional Image | **ข้อมูลอื่นๆ (ขอเพิ่มเติม) เเบบอาคาร** |

## Group Labels (for Section Headers)
| Group ID (xpath) | Current Section Header | **Exact Label from Content** |
|------------------|----------------------|------------------------------|
| `group_hh1ii99` | GENERAL DATA | **ข้อมูลทั่วไป (General data)** |
| `group_gs9vj55` | BUILDING DATA | **สำรวจภายนอกอาคาร/ทางเข้า** |
| `group_gs9vj55/group_iz7ky31` | (subsection) | **Grid Connection and Protection detail** |
| `group_li3tn67` | CUSTOMER MDP/LP DATA | **ห้องไฟ** |
| `group_gr7hn33` | (part of MDP section) | **MDB** |
| `group_ns6fp26` | CABLE ROUTELINE... | **ระยะเดินสายจากตู้ไฟไปพื้นที่การติดตั้ง (แต่ละห้อง)** |
| `group_ib9gq22` | COMBINER BOX INSTALLATION | **ข้อมูลหลังคาก่อนการติดตั้งsolar** |
| `group_ib9gq22/group_fe64a97` | (rooftop photos) | **ถ่ายภาพดาดฟ้าแต่ละด้าน** |
| `group_ib9gq22/group_hn9xa37` | (lightning protection) | **ตรวจสอบการติดตั้งระบบป้องกันฟ้าผ่า** |
| `group_ib9gq22/group_oi1vu72` | (additional docs) | **ข้อมูลอื่นๆเพิ่มเติม** |

## ⚠️ MISSING FIELD ALERT
**Field used in code but NOT found in content file:**
- `group_gs9vj55/group_iz7ky31/connection_Point_In_rter_Housing_to_MDB_`

This needs to be investigated - it might be an old field or there's a mismatch.

## Notes on Exact Label Matching:
1. Some labels have **trailing spaces** - these should be preserved exactly
2. Some labels have **leading spaces** - these should be preserved exactly  
3. Some labels use **เเ** (double mai ek) instead of **แ** - preserve as is
4. Spacing in English labels varies (e.g., "A." vs "A" vs " A.") - match exactly
5. Labels with quotes use **escaped quotes in JSON**: `\"` becomes `"` in display
