import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { linksRouter } from './features/links/routes.js';
import config from './config/env.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

// Health Check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Feature Routes
app.use('/api/links', linksRouter);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

export default app;
