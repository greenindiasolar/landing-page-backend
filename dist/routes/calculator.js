"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const googleSheets_js_1 = require("../services/googleSheets.js");
const email_js_1 = require("../services/email.js");
const router = (0, express_1.Router)();
/**
 * GET /api/calculator/config
 * Fetch calculator configuration from Google Sheets
 */
router.get('/config', async (_req, res) => {
    try {
        const config = await (0, googleSheets_js_1.fetchConfigFromSheet)();
        res.json({ success: true, config });
    }
    catch (error) {
        console.error('Error fetching config:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch configuration' });
    }
});
/**
 * POST /api/calculator/leads
 * Save calculator lead and send email notification
 */
router.post('/leads', async (req, res) => {
    try {
        const leadData = req.body;
        // Validate required fields
        if (!leadData.name || !leadData.phone || !leadData.monthlyBill) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }
        // Validate phone number
        if (leadData.phone.length !== 10 || !/^\d+$/.test(leadData.phone)) {
            res.status(400).json({ success: false, message: 'Invalid phone number' });
            return;
        }
        // Save to Google Sheet (non-blocking)
        const sheetPromise = (0, googleSheets_js_1.saveLeadToSheet)(leadData);
        // Send email notification (non-blocking)
        const emailPromise = (0, email_js_1.sendLeadNotification)(leadData);
        // Wait for both operations
        const [sheetResult, emailResult] = await Promise.all([sheetPromise, emailPromise]);
        console.log(`Calculator Lead processed - Sheet: ${sheetResult}, Email: ${emailResult}`);
        res.json({
            success: true,
            message: 'Lead submitted successfully',
            details: {
                savedToSheet: sheetResult,
                emailSent: emailResult,
            },
        });
    }
    catch (error) {
        console.error('Error processing calculator lead:', error);
        res.status(500).json({ success: false, message: 'Failed to process lead' });
    }
});
/**
 * POST /api/calculator/contact-leads
 * Save contact form lead and send email notification
 */
router.post('/contact-leads', async (req, res) => {
    try {
        const contactData = req.body;
        // Validate required fields
        if (!contactData.name || !contactData.email || !contactData.phone || !contactData.address) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }
        // Validate phone number
        if (contactData.phone.length !== 10 || !/^\d+$/.test(contactData.phone)) {
            res.status(400).json({ success: false, message: 'Invalid phone number' });
            return;
        }
        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email)) {
            res.status(400).json({ success: false, message: 'Invalid email address' });
            return;
        }
        // Save to Google Sheet (non-blocking)
        const sheetPromise = (0, googleSheets_js_1.saveContactFormLead)(contactData);
        // Send email notification (non-blocking)
        const emailPromise = (0, email_js_1.sendContactFormNotification)(contactData);
        // Wait for both operations
        const [sheetResult, emailResult] = await Promise.all([sheetPromise, emailPromise]);
        console.log(`Contact Form Lead processed - Sheet: ${sheetResult}, Email: ${emailResult}`);
        res.json({
            success: true,
            message: 'Contact form submitted successfully',
            details: {
                savedToSheet: sheetResult,
                emailSent: emailResult,
            },
        });
    }
    catch (error) {
        console.error('Error processing contact form lead:', error);
        res.status(500).json({ success: false, message: 'Failed to process contact form' });
    }
});
exports.default = router;
