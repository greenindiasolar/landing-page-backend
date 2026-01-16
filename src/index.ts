import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import calculatorRouter from './routes/calculator.js';

const app = express();

// Middleware
app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/calculator', calculatorRouter);

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port}`);
    console.log(`📊 Config URL: ${config.googleScriptConfigUrl ? 'Configured' : 'Not configured'}`);
    console.log(`📧 Email: ${config.resendApiKey ? 'Configured' : 'Not configured'}`);
});
