/**
 * Google Apps Script for Green India Solar
 * Handles Config, Calculator Leads, and Contact Form Leads
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Create three sheets/tabs: "Config", "Calculator Leads", and "Contact Form Leads"
 * 
 * Config Sheet Structure (A:C):
 * | Key                     | Value  | Description              |
 * |-------------------------|--------|--------------------------|
 * | PRICE_PER_KW            | 60000  | Price per kW in INR      |
 * | UNITS_PER_KW_PER_YEAR   | 1440   | Units generated yearly   |
 * | SQFT_PER_KW             | 80     | Roof space per kW        |
 * | FLAT_DISCOUNT           | 22000  | Discount amount          |
 * | RESIDENTIAL_MULTIPLIER  | 1190   | Residential bill divisor |
 * | COMMERCIAL_MULTIPLIER   | 930    | Commercial bill divisor  |
 * | SUBSIDY_1KW             | 30000  | Subsidy for 1kW          |
 * | SUBSIDY_2KW             | 60000  | Subsidy for 2kW          |
 * | SUBSIDY_3KW_PLUS        | 78000  | Subsidy for 3kW+         |
 * 
 * Calculator Leads Sheet Structure:
 * | Timestamp | Name | Phone | Customer Type | Monthly Bill | System Size | Effective Cost | Annual Savings |
 * 
 * Contact Form Leads Sheet Structure:
 * | Timestamp | Name | Email | Phone | Address |
 * 
 * 3. Go to Extensions > Apps Script
 * 4. Paste this code and save
 * 5. Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL and add to your backend .env file
 */

// Handle GET requests - Fetch config
function doGet(e) {
    const action = e.parameter.action || 'config';

    if (action === 'config') {
        return getConfig();
    }

    return ContentService.createTextOutput(JSON.stringify({ error: 'Unknown action' }))
        .setMimeType(ContentService.MimeType.JSON);
}

// Handle POST requests - Save lead based on type
function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        const leadType = data.leadType || 'calculator'; // 'calculator' or 'contact'

        if (leadType === 'contact') {
            return saveContactLead(data);
        } else {
            return saveCalculatorLead(data);
        }
    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.message
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

// Get configuration from Config sheet
function getConfig() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config');

    if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
            error: 'Config sheet not found'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const config = {};

    // Skip header row (index 0), start from index 1
    for (let i = 1; i < data.length; i++) {
        const key = data[i][0];
        const value = data[i][1];
        if (key) {
            config[key] = value;
        }
    }

    return ContentService.createTextOutput(JSON.stringify(config))
        .setMimeType(ContentService.MimeType.JSON);
}

// Save lead from Calculator to "Calculator Leads" sheet
function saveCalculatorLead(data) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Calculator Leads');

    if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: 'Calculator Leads sheet not found'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    // Append new row
    sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.name || '',
        data.phone || '',
        data.customerType || '',
        data.monthlyBill || 0,
        data.systemSize || 0,
        data.effectiveCost || 0,
        data.annualSavings || 0
    ]);

    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Calculator lead saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
}

// Save lead from Contact Form to "Contact Form Leads" sheet
function saveContactLead(data) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Contact Form Leads');

    if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: 'Contact Form Leads sheet not found'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    // Append new row
    sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.name || '',
        data.email || '',
        data.phone || '',
        data.address || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Contact form lead saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
}
