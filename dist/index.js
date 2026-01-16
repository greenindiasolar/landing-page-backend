"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_js_1 = require("./config/env.js");
const calculator_js_1 = __importDefault(require("./routes/calculator.js"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: env_js_1.config.frontendUrl,
    credentials: true,
}));
app.use(express_1.default.json());
// Routes
app.use('/api/calculator', calculator_js_1.default);
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Start server
app.listen(env_js_1.config.port, () => {
    console.log(`🚀 Server running on http://localhost:${env_js_1.config.port}`);
    console.log(`📊 Config URL: ${env_js_1.config.googleScriptConfigUrl ? 'Configured' : 'Not configured'}`);
    console.log(`📧 Email: ${env_js_1.config.resendApiKey ? 'Configured' : 'Not configured'}`);
});
