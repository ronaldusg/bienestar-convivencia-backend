const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const routesIndex = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');
require('dotenv').config();

const app = express();

// CORS — orígenes desde .env (coma-separados)
const origins = (process.env.CORS_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origins.length === 0) return callback(null, true);
    if (origins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health
app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

// API routes
app.use('/api', routesIndex);

// Error handler (JSON unificado)
app.use(errorHandler);

module.exports = app;
