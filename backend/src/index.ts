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
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// 404 handler - すべてのルートの後に配置
app.use(notFoundHandler);

// Global error handler - 最後に配置
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;


