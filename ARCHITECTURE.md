# Architecture Documentation

## System Overview

```
┌─────────────┐
│   Client    │
│  (Browser/  │
│   curl)     │
└──────┬──────┘
       │ HTTP GET /generate/:uid/:id
       ▼
┌─────────────────────────────────────────────────────────┐
│                    Express Server                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Routes (report.routes.js)             │ │
│  └───────────────────────┬────────────────────────────┘ │
│                          ▼                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │          Controller (report.controller.js)         │ │
│  │  • Validate params                                 │ │
│  │  • Call services                                   │ │
│  │  • Return Excel file                               │ │
│  └───────────────────────┬────────────────────────────┘ │
│                          ▼                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │         Services Layer                             │ │
│  │                                                    │ │
│  │  ┌──────────────────┐  ┌─────────────────────┐   │ │
│  │  │ kobo.service.js  │  │ report.service.js   │   │ │
│  │  │ • Fetch JSON     │  │ • Orchestrate       │   │ │
│  │  │ • Download imgs  │  │ • Normalize data    │   │ │
│  │  └────────┬─────────┘  └──────────┬──────────┘   │ │
│  │           │                        │              │ │
│  │           ▼                        ▼              │ │
│  │  ┌──────────────────────────────────────────┐   │ │
│  │  │      Excel Sheet Services                │   │ │
│  │  │  • sheet1.service.js (General/Building)  │   │ │
│  │  │  • sheet2.service.js (Routeline Summary) │   │ │
│  │  │  • sheet3.service.js (MDP/LP)            │   │ │
│  │  │  • sheet4.service.js (Route Images)      │   │ │
│  │  │  • sheet5.service.js (MDP Images)        │   │ │
│  │  └──────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────┘ │
│                          ▲                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Utilities Layer                       │ │
│  │                                                    │ │
│  │  ┌──────────────────┐  ┌──────────────────────┐  │ │
│  │  │ normalizeSubmit  │  │ attachments.js       │  │ │
│  │  │ • Parse JSON     │  │ • Build maps         │  │ │
│  │  │ • Extract groups │  │ • Resolve images     │  │ │
│  │  └──────────────────┘  └──────────────────────┘  │ │
│  │                                                    │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │        Excel Utilities (utils/excel/)        │ │ │
│  │  │  • helpers.js   (merge, draw, write)         │ │ │
│  │  │  • styles.js    (colors, fonts, borders)     │ │ │
│  │  │  • checkbox.js  (☑/☐ rendering)              │ │ │
│  │  │  • images.js    (embed, resize, calculate)   │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  KoboToolbox    │
                 │      API        │
                 └─────────────────┘
```

## Data Flow

### 1. Request Phase
```
Client Request
    ↓
Route Handler (GET /generate/:uid/:id)
    ↓
Controller Validation
    ↓
Kobo Service: fetchSubmission(uid, id)
    ↓
Kobo API: GET /api/v2/assets/{uid}/data/{id}/?format=json
    ↓
Raw Submission JSON
```

### 2. Processing Phase
```
Raw Submission
    ↓
normalizeSubmission()
    ├─ Extract meta fields
    ├─ Parse group_hh1ii99 → general
    ├─ Parse group_gs9vj55 → building
    ├─ Parse group_li3tn67 + group_gr7hn33 → customerMDP
    ├─ Parse group_ns6fp26[] → routeline (repeat)
    └─ Parse group_ib9gq22 → combiner
    ↓
buildAttachmentMaps(_attachments)
    ├─ Map by xPath: "group_ns6fp26[0]/image" → {url, filename}
    └─ Map by filename: "img.jpg" → {url, xpath}
    ↓
Normalized Data + Attachment Maps
```

### 3. Excel Generation Phase
```
Create ExcelJS Workbook
    ↓
┌─────────────────────────────────────────┐
│ Parallel Sheet Rendering                │
├─────────────────────────────────────────┤
│ Sheet 1: renderSheet1()                 │
│   • Write general data                  │
│   • Write building data                 │
│   • Apply checkboxes (☑ PEA ☐ MEA)     │
│                                         │
│ Sheet 2: renderSheet2()                 │
│   • Create routeline table              │
│   • List distances                      │
│   • Show image indicators               │
│                                         │
│ Sheet 3: renderSheet3()                 │
│   • Write MDP specifications            │
│   • Write measurements                  │
│   • List documentation                  │
│                                         │
│ Sheet 4: renderSheet4() [ASYNC]         │
│   • For each routeline item:            │
│     - Resolve attachment by xPath       │
│     - Download image buffer             │
│     - Calculate required rows           │
│     - Add image block with caption      │
│   • For each combiner image:            │
│     - Same process                      │
│                                         │
│ Sheet 5: renderSheet5() [ASYNC]         │
│   • For each MDP image:                 │
│     - Resolve SLD, CT, Tie-In, Router   │
│     - Download image buffers            │
│     - Add image blocks                  │
└─────────────────────────────────────────┘
    ↓
Generate Excel Buffer
    ↓
Send to Client as Download
```

## Key Algorithms

### Attachment Resolution Algorithm

```javascript
function resolveAttachment(fieldValue, xPath, attachmentMaps) {
  // Priority 1: Exact xPath match (best for repeats)
  if (xPath in attachmentMaps.byXPath) {
    return attachmentMaps.byXPath[xPath];
  }
  
  // Priority 2: Filename match (fallback)
  if (fieldValue in attachmentMaps.byFilename) {
    return attachmentMaps.byFilename[fieldValue];
  }
  
  // Not found: return null (will show placeholder)
  return null;
}
```

### Dynamic Row Expansion Algorithm

```javascript
function calculateImageDimensions(imageBuffer, maxWidth = 800, rowHeightPx = 20) {
  // 1. Get actual image dimensions
  const dimensions = sizeOf(imageBuffer);
  let { width, height } = dimensions;
  
  // 2. Scale down if exceeds max width
  if (width > maxWidth) {
    const scale = maxWidth / width;
    width = maxWidth;
    height = Math.floor(height * scale);
  }
  
  // 3. Calculate required Excel rows
  const rows = Math.max(5, Math.ceil(height / rowHeightPx));
  
  return { rows, width, height };
}

function addImageToRange(worksheet, workbook, imageBuffer, startRow, ...) {
  // 1. Calculate dimensions
  const { rows } = calculateImageDimensions(imageBuffer);
  
  // 2. Insert additional rows if needed
  if (rows > 5) {
    worksheet.spliceRows(startRow + 5, 0, ...Array(rows - 5).fill([]));
  }
  
  // 3. Draw bordered box
  const endRow = startRow + rows - 1;
  drawBox(worksheet, startRow, 1, endRow, 6, 'thick');
  
  // 4. Embed image
  const imageId = workbook.addImage({ buffer: imageBuffer, extension: 'jpeg' });
  worksheet.addImage(imageId, { tl: { col: 0.1, row: startRow - 0.1 }, ... });
  
  return endRow + 1; // Return next available row
}
```

### Checkbox Rendering Logic

```javascript
function setYesNoCheckbox(cell, value) {
  const isChecked = isValueChecked(value);
  cell.value = isChecked ? '☑ Yes  ☐ No' : '☐ Yes  ☑ No';
}

function isValueChecked(value) {
  const str = String(value).toLowerCase().trim();
  
  // True: yes, true, 1, checked, y
  if (['yes', 'true', '1', 'checked', 'y'].includes(str)) return true;
  
  // False: no, false, 0, unchecked, n
  if (['no', 'false', '0', 'unchecked', 'n'].includes(str)) return false;
  
  // Default: if value exists, consider checked
  return Boolean(value);
}
```

## Kobo JSON Structure Mapping

### Top Level
```json
{
  "count": 24,
  "next": "...",
  "previous": "...",
  "results": [<submission>]  ← We use results[0]
}
```

### Submission Structure
```javascript
{
  // Meta fields
  _id: 649067845,
  _uuid: "750e3b4f-...",
  _submission_time: "2026-01-26T...",
  _attachments: [...],
  
  // Data groups
  group_hh1ii99: {           // → general
    text_pl66z95: "...",     //   → siteName
    text_dv4na03: "...",     //   → contact
    // ...
  },
  
  group_gs9vj55: {           // → building
    text_tm4fp17: "...",
    group_iz7ky31: {         //   → nested building data
      Electrical_Authority: "PEA",
      AMR_Meter: "yes",
      // ...
    }
  },
  
  group_li3tn67: {           // → customerMDP (part 1)
    Main_breaker_size_AT_AF_V_kA: "..."
  },
  
  group_gr7hn33: {           // → customerMDP (part 2)
    Voltage_R_S_T_and_RN_SN_TN_V: "..."
  },
  
  group_ns6fp26: [           // → routeline (repeat array)
    { _m_: "3 m", image_ki1nl22: "img1.jpg" },
    { _m_: "5 m", image_ki1nl22: "img2.jpg" }
  ],
  
  group_ib9gq22: {           // → combiner
    image_eu9in14: "main.jpg",
    group_fe64a97: [...],    //   → images1 (repeat)
    group_hn9xa37: [...],    //   → images2 (repeat)
    group_oi1vu72: [...]     //   → images3 (repeat)
  }
}
```

## Error Handling Strategy

```
Try: Fetch submission
  ↓
Catch: Network error → 502 Bad Gateway
Catch: 404 from Kobo → 404 Not Found
  ↓
Try: Normalize data
  ↓
Catch: Parse error → 500 Internal Error
  ↓
Try: Download each image
  ↓
Catch: Image download fails → Log error, continue with placeholder
  ↓
Try: Generate Excel
  ↓
Catch: Excel error → 500 Internal Error
  ↓
Success: Return Excel buffer
```

## Performance Considerations

### Image Processing
- Images downloaded sequentially (not parallel) to avoid memory issues
- Max image size: 10MB per image (configurable)
- Image timeout: 5 seconds per download
- Images scaled to max 800px width
- Failed downloads show empty bordered boxes

### Memory Management
- Streaming not used (submissions expected < 100MB)
- Images processed one at a time
- Buffer-based approach suitable for typical report sizes

### Scalability
- Single request = single report
- No caching (each request is fresh)
- Suitable for: 1-10 requests/minute
- For higher load: Add queue system (Bull/Bee)

## Security

### API Token
- Stored in environment variable
- Never exposed in responses
- Sent in Authorization header to Kobo

### Input Validation
- UID and ID parameters validated
- No SQL injection risk (external API only)
- XSS not applicable (Excel output)

### File Safety
- Only generates Excel files
- No file system writes (memory-based)
- No shell command execution

## Extension Points

### Adding New Sheets
1. Create `src/services/excel/sheetX.service.js`
2. Export `renderSheetX(worksheet, data)`
3. Import in `report.service.js`
4. Add to generation sequence

### Adding New Data Fields
1. Update `normalizeSubmission.js` to extract field
2. Update sheet renderer to display field
3. Update styles if needed

### Custom Styling
1. Modify `utils/excel/styles.js`
2. Update THEME constants
3. Apply to sheet renderers

### Image Processing
1. Modify `utils/excel/images.js`
2. Adjust `calculateImageDimensions()`
3. Change max dimensions in config

## Testing Strategy

### Unit Tests (Future)
- `normalizeSubmission()` - various JSON structures
- `buildAttachmentMaps()` - different attachment arrays
- `isValueChecked()` - all checkbox values
- `calculateImageDimensions()` - various image sizes

### Integration Tests (Future)
- End-to-end: Mock Kobo API → Generate Excel
- Validate Excel structure with ExcelJS reader
- Check all sheets exist
- Verify cell values

### Manual Testing
- Use `test-examples.js` for quick tests
- Test with real Kobo submission IDs
- Verify Excel opens in Excel/LibreOffice
- Check images render correctly
- Verify checkboxes display properly

---

For implementation details, see source code comments in each file.
