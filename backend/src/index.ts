import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import reportsRoutes from './routes/reports';
import visitsRoutes from './routes/visits';
import commentsRoutes from './routes/comments';
import customersRoutes from './routes/customers';
import statisticsRoutes from './routes/statistics';
import salesStaffRoutes from './routes/salesStaff';
import metricsRoutes from './routes/metrics';
import dashboardRoutes from './routes/dashboard';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import {
  helmetMiddleware,
  generalRateLimiter,
  additionalSecurityHeaders,
  sanitizeInput,
} from './middlewares/security';
import { responseTimeMiddleware } from './middlewares/responseTime';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Response time measurement (must be first to measure accurately)
app.use(responseTimeMiddleware);

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

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1/reports/:reportId/visits', visitsRoutes);
app.use('/api/v1/reports/:reportId/comments', commentsRoutes);
app.use('/api/v1/customers', customersRoutes);
app.use('/api/v1/statistics', statisticsRoutes);
app.use('/api/v1/sales-staff', salesStaffRoutes);
app.use('/api/v1/metrics', metricsRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// 404 handler - すべてのルートの後に配置
app.use(notFoundHandler);

// Global error handler - 最後に配置
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;


