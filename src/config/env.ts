import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3001,
    resendApiKey: process.env.RESEND_API_KEY || '',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
    googleScriptConfigUrl: process.env.GOOGLE_SCRIPT_CONFIG_URL || '',
    googleScriptLeadsUrl: process.env.GOOGLE_SCRIPT_LEADS_URL || '',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
