import { Router, Request, Response } from 'express';
import { getPerformanceStats, clearMetricsHistory } from '../middlewares/responseTime';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /api/v1/metrics/performance:
 *   get:
 *     summary: パフォーマンス統計を取得
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: パフォーマンス統計
 */
router.get('/performance', authenticate, requireAdmin, (_req: Request, res: Response) => {
  const stats = getPerformanceStats();
  res.json({
    success: true,
    data: {
      summary: {
        totalRequests: stats.totalRequests,
        averageResponseTime: `${stats.averageResponseTime.toFixed(2)}ms`,
        slowRequests: stats.slowRequests,
        warningRequests: stats.warningRequests,
      },
      percentiles: {
        p50: `${stats.p50.toFixed(2)}ms`,
        p95: `${stats.p95.toFixed(2)}ms`,
        p99: `${stats.p99.toFixed(2)}ms`,
      },
      byEndpoint: Object.entries(stats.byEndpoint).map(([endpoint, data]) => ({
        endpoint,
        count: data.count,
        avgTime: `${data.avgTime.toFixed(2)}ms`,
        maxTime: `${data.maxTime.toFixed(2)}ms`,
      })),
    },
  });
});

/**
 * @swagger
 * /api/v1/metrics/performance/clear:
 *   post:
 *     summary: パフォーマンス統計をクリア
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: クリア成功
 */
router.post('/performance/clear', authenticate, requireAdmin, (_req: Request, res: Response) => {
  clearMetricsHistory();
  res.json({
    success: true,
    message: 'Performance metrics cleared',
  });
});

export default router;
