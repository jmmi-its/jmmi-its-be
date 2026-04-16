import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { linksRouter } from './features/links/routes.js';
import { LinksController } from './features/links/controller.js';
import { announcementRouter } from './features/announcements/routes.js';
import { financeRouter } from './features/finance/routes.js';
import { authRouter } from './features/auth/routes.js';
import { calendarRouter } from './features/calendar/routes.js';
import config from './config/env.js';

const app = express();
const linksController = new LinksController();

app.set('trust proxy', 1);  

// CORS Middleware - Must be first!
app.use(cors({
  origin: [
    'https://api.jmmi-its.my.id',
    'https://jmmi-its.my.id',
    'https://www.jmmi-its.my.id',
    'https://jmmi-its.com',
    'https://www.jmmi-its.com',
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

// Public short-link redirect
app.get('/s/:shortCode', linksController.redirectShortLink);

// Feature Routes
app.use('/api/auth', authRouter);
app.use('/api/links', linksRouter);
app.use('/api/announcement', announcementRouter);
app.use('/api/finance', financeRouter);
app.use('/api/calendar', calendarRouter);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

export default app;
