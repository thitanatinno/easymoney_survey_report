# Kobo Excel Report Generator

Node.js (Express) API that generates Excel reports from KoboToolbox submission data.

## 📋 Features

- **REST API Endpoint**: `GET /generate/:uid/:id`
- **Kobo Integration**: Fetches submissions from KoboToolbox API
- **Multi-Sheet Reports**: Generates 5-sheet Excel workbooks
- **Image Embedding**: Downloads and embeds images with dynamic sizing
- **Checkbox Rendering**: Unicode checkboxes (☑/☐) for Yes/No fields
- **Repeat Groups**: Handles nested and repeat group structures
- **Professional Formatting**: Styled headers, borders, and layouts

## 📁 Project Structure

```
kobo-excel/
├── src/
│   ├── app.js                      # Express application entry point
│   ├── config/
│   │   └── kobo.config.js          # Kobo API configuration
│   ├── routes/
│   │   └── report.routes.js        # API routes
│   ├── controllers/
│   │   └── report.controller.js    # Request handlers
│   ├── services/
│   │   ├── kobo.service.js         # Kobo API client
│   │   ├── report.service.js       # Report orchestrator
│   │   └── excel/
│   │       ├── sheet1.service.js   # General & Building Data
│   │       ├── sheet2.service.js   # Routeline Summary
│   │       ├── sheet3.service.js   # Customer MDP/LP
│   │       ├── sheet4.service.js   # Routeline Images
│   │       └── sheet5.service.js   # MDP Images
│   ├── utils/
│   │   ├── normalizeSubmission.js  # Kobo JSON parser
│   │   ├── attachments.js          # Attachment resolution
│   │   └── excel/
│   │       ├── helpers.js          # Excel utilities
│   │       ├── images.js           # Image handling
│   │       ├── checkbox.js         # Checkbox rendering
│   │       └── styles.js           # Style definitions
│   └── middleware/
│       └── errorHandler.js         # Error handling
├── package.json
├── .env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (ES Modules support)
- KoboToolbox API token

### Installation

1. Clone or navigate to the project:
```bash
cd kobo-excel
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from template:
```bash
cp .env.example .env
```

4. Configure your `.env`:
```env
KOBO_API_URL=https://kf.kobotoolbox.org/api/v2
KOBO_API_TOKEN=your_token_here
PORT=3000
```

### Get Your Kobo API Token

1. Log in to KoboToolbox
2. Go to **Account Settings** → **Security**
3. Generate or copy your **API Token**
4. Paste it in the `.env` file

### Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server runs on: `http://localhost:3000`

## 📡 API Usage

### Generate Report

**Endpoint**: `GET /generate/:uid/:id`

**Parameters**:
- `uid` - KoboToolbox asset UID (form identifier)
- `id` - Submission ID

**Example Request**:
```bash
curl http://localhost:3000/generate/aBC123xyz/649067845 --output report.xlsx
```

**Response**:
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- File download: `kobo_report_{uid}_{id}_{timestamp}.xlsx`

### Health Check

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-27T..."
}
```

## 📊 Report Structure

The generated Excel workbook contains 5 sheets:

### Sheet 1: General & Building Data
- Site information (name, contact, location)
- Building electrical details
- Checkboxes for PEA/MEA, AMR Meter, Transformer

### Sheet 2: Routeline Summary
- Table of all route line items
- Distance measurements
- Image availability indicators

### Sheet 3: Customer MDP/LP
- Main breaker specifications
- Voltage, ampere, power measurements
- Documentation references

### Sheet 4: Routeline Images
- Route line item images (with dynamic sizing)
- Combiner box installation images
- Large bordered image blocks

### Sheet 5: MDP Images
- Single Line Diagram (SLD)
- CT (Current Transformer) images
- Tie-In connection photos
- Router/Internet setup images

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `KOBO_API_URL` | KoboToolbox API base URL | `https://kf.kobotoolbox.org/api/v2` |
| `KOBO_API_TOKEN` | Your API token | *Required* |
| `PORT` | Server port | `3000` |
| `MAX_IMAGE_SIZE_MB` | Max image download size | `10` |
| `IMAGE_TIMEOUT_MS` | Image download timeout | `5000` |
| `MAX_IMAGE_WIDTH_PX` | Max image width | `800` |
| `MAX_IMAGE_HEIGHT_PX` | Max image height | `600` |

## 🧩 Key Technical Features

### Attachment Resolution

The system uses a two-layer mapping strategy for resolving image attachments:

1. **By xPath** (exact match for repeat groups)
2. **By filename** (fallback)

Example:
```javascript
// For repeat group item: group_ns6fp26[0]/image_ki1nl22
// Maps to: { url, filename, buffer }
```

### Dynamic Row Expansion

Images automatically calculate required Excel rows based on dimensions:

```javascript
// Small image: 5 rows minimum
// Large image: calculated based on height / 20px per row
```

### Checkbox Rendering

Uses Unicode characters for visual checkboxes:
- `☑` Checked
- `☐` Unchecked

Supports formats: `yes/no`, `true/false`, `1/0`

## 🐛 Error Handling

| Error | Status Code | Description |
|-------|-------------|-------------|
| Missing parameters | `400` | uid or id not provided |
| Submission not found | `404` | Invalid uid/id combination |
| Kobo API error | `502` | KoboToolbox API unavailable |
| Image download failure | `200` | Continues with placeholder |
| Excel generation error | `500` | Internal server error |

## 📝 Example Kobo JSON Structure

The API expects submissions with this structure:

```json
{
  "count": 24,
  "results": [
    {
      "_id": 649067845,
      "_uuid": "750e3b4f-...",
      "group_hh1ii99": { "text_pl66z95": "site name" },
      "group_gs9vj55": { "group_iz7ky31": { "Electrical_Authority": "PEA" } },
      "group_ns6fp26": [ { "_m_": "3 m", "image_ki1nl22": "img.jpg" } ],
      "_attachments": [
        {
          "filename": "img.jpg",
          "download_url": "https://...",
          "question_xpath": "group_ns6fp26[0]/image_ki1nl22"
        }
      ]
    }
  ]
}
```

## 🔍 Testing

Test the endpoint with a real submission:

```bash
# Replace with your actual asset UID and submission ID
curl -o test_report.xlsx \
  http://localhost:3000/generate/aBC123xyz/649067845

# Open the generated file
open test_report.xlsx
```

## 📚 Dependencies

- **express** - Web framework
- **exceljs** - Excel file generation
- **axios** - HTTP client for Kobo API
- **dotenv** - Environment configuration
- **image-size** - Image dimension detection

## 🛠️ Development

### Adding New Sheets

1. Create service: `src/services/excel/sheetX.service.js`
2. Export render function: `export function renderSheetX(worksheet, data) { ... }`
3. Import and call in `report.service.js`

### Modifying Data Mapping

Edit `src/utils/normalizeSubmission.js` to adjust field mappings from Kobo JSON structure.

## 📄 License

MIT

## 👥 Support

For issues or questions:
1. Check the error logs in the console
2. Verify your `.env` configuration
3. Test with `/health` endpoint
4. Check Kobo API token permissions

---

Built with Node.js, Express, and ExcelJS
# easymoney_survey_report
