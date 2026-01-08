import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth';
import reportsRoutes from './routes/reports';
import visitsRoutes from './routes/visits';
import commentsRoutes from './routes/comments';
import customersRoutes from './routes/customers';
import statisticsRoutes from './routes/statistics';
import salesStaffRoutes from './routes/salesStaff';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import {
  helmetMiddleware,
  generalRateLimiter,
  additionalSecurityHeaders,
  sanitizeInput,
} from './middlewares/security';
import { swaggerSpec } from './config/swagger';
import {
  initSentry,
  sentryRequestHandler,
  sentryTracingHandler,
  sentryErrorHandler,
} from './config/sentry';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Sentry (must be before other middleware)
initSentry(app);

// Sentry request handler (must be first middleware)
app.use(sentryRequestHandler());
app.use(sentryTracingHandler());

// Security Middleware
app.use(helmetMiddleware);
app.use(additionalSecurityHeaders);
app.use(generalRateLimiter);

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Sales Report API is running',
    timestamp: new Date().toISOString(),
  });
});

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: '営業日報システム API ドキュメント',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1/reports/:reportId/visits', visitsRoutes);
app.use('/api/v1/reports/:reportId/comments', commentsRoutes);
app.use('/api/v1/customers', customersRoutes);
app.use('/api/v1/statistics', statisticsRoutes);
app.use('/api/v1/sales-staff', salesStaffRoutes);

// 404 handler - すべてのルートの後に配置
app.use(notFoundHandler);

// Sentry error handler - must be before global error handler
app.use(sentryErrorHandler());

// Global error handler - 最後に配置
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});

export default app;


