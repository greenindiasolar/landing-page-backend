# Green Solar Backend Server

Backend API server for the Solar Calculator, handling Google Sheets integration and email notifications.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
PORT=3001
RESEND_API_KEY=re_xxxxx           # Get from resend.com
ADMIN_EMAIL=admin@example.com      # Email to receive notifications
GOOGLE_SCRIPT_CONFIG_URL=https://script.google.com/macros/s/xxx/exec?action=config
GOOGLE_SCRIPT_LEADS_URL=https://script.google.com/macros/s/xxx/exec
FRONTEND_URL=http://localhost:5173
```

## Google Sheet Setup

1. **Create a new Google Sheet** with two tabs: `Config` and `Leads`

2. **Config tab** - Add these rows (Row 1 is header):

| Key | Value | Description |
|-----|-------|-------------|
| PRICE_PER_KW | 60000 | Price per kW (₹) |
| UNITS_PER_KW_PER_YEAR | 1440 | Units generated per kW yearly |
| SQFT_PER_KW | 80 | Roof space per kW (sq.ft) |
| FLAT_DISCOUNT | 22000 | Discount amount (₹) |
| RESIDENTIAL_MULTIPLIER | 1190 | Residential bill divisor |
| COMMERCIAL_MULTIPLIER | 930 | Commercial bill divisor |
| SUBSIDY_1KW | 30000 | Subsidy for 1kW |
| SUBSIDY_2KW | 60000 | Subsidy for 2kW |
| SUBSIDY_3KW_PLUS | 78000 | Subsidy for 3kW+ |

3. **Leads tab** - Add header row:

| Timestamp | Name | Phone | Customer Type | Monthly Bill | System Size | Effective Cost | Annual Savings |

4. **Deploy Apps Script:**
   - Go to Extensions > Apps Script
   - Paste code from `google-apps-script.js`
   - Deploy > New deployment > Web app
   - Execute as: Me | Access: Anyone
   - Copy the URL to your `.env` file

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/calculator/config` | Fetch calculator config |
| POST | `/api/calculator/leads` | Submit lead and send email |
| GET | `/health` | Health check |

## Scripts

- `npm run dev` - Start dev server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
