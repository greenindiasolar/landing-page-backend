"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3001,
    resendApiKey: process.env.RESEND_API_KEY || '',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
    googleScriptConfigUrl: process.env.GOOGLE_SCRIPT_CONFIG_URL || '',
    googleScriptLeadsUrl: process.env.GOOGLE_SCRIPT_LEADS_URL || '',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
