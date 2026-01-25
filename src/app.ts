import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { linksRouter } from './features/links/routes.js';
import config from './config/env.js';

const app = express();

app.set('trust proxy', 1);  

// CORS Middleware - Must be first!
app.use(cors({
  origin: [
    'https://api.jmmi-its.my.id',
    'https://jmmi-its.my.id',
    'https://www.jmmi-its.my.id',
    'http://localhost:3000', // For local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
}));

// Handle preflight requests - Regex used to avoid Express 5 wildcard error
app.options(/(.*)/, cors());

// Other Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));


// Health Check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Ping Check
app.get('/ping', (_req, res) => {
  res.status(200).json({ message: 'pong' });
});

// Feature Routes
app.use('/api/links', linksRouter);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

export default app;
