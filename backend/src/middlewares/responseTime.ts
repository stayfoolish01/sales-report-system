import { Request, Response, NextFunction } from 'express';

/**
 * レスポンスタイム計測ミドルウェア
 * 各APIリクエストの処理時間を計測し、ログ出力とレスポンスヘッダーに追加
 */

// スロークエリの閾値（ミリ秒）
const SLOW_THRESHOLD_MS = 1000;
const WARNING_THRESHOLD_MS = 500;

interface RequestMetrics {
  path: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
}

// メトリクス履歴（直近100件を保持）
const metricsHistory: RequestMetrics[] = [];
const MAX_HISTORY_SIZE = 100;

/**
 * レスポンスタイム計測ミドルウェア
 */
export function responseTimeMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = process.hrtime.bigint();
  const startDate = new Date();

  // レスポンス完了時のハンドラー
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const durationNs = Number(endTime - startTime);
    const durationMs = durationNs / 1_000_000;

    // ヘッダーに追加（まだ送信されていない場合）
    if (!res.headersSent) {
      res.setHeader('X-Response-Time', `${durationMs.toFixed(2)}ms`);
    }

    // メトリクスを記録
    const metrics: RequestMetrics = {
      path: req.path,
      method: req.method,
      statusCode: res.statusCode,
      responseTime: durationMs,
      timestamp: startDate,
    };

    // 履歴に追加（古いものを削除）
    metricsHistory.push(metrics);
    if (metricsHistory.length > MAX_HISTORY_SIZE) {
      metricsHistory.shift();
    }

    // ログ出力（開発環境または遅いリクエスト）
    const logLevel = getLogLevel(durationMs);
    if (process.env.NODE_ENV !== 'production' || logLevel !== 'normal') {
      logRequest(metrics, logLevel);
    }
  });

  next();
}

/**
 * ログレベルを決定
 */
function getLogLevel(durationMs: number): 'slow' | 'warning' | 'normal' {
  if (durationMs >= SLOW_THRESHOLD_MS) {
    return 'slow';
  }
  if (durationMs >= WARNING_THRESHOLD_MS) {
    return 'warning';
  }
  return 'normal';
}

/**
 * リクエストをログ出力
 */
function logRequest(metrics: RequestMetrics, level: 'slow' | 'warning' | 'normal'): void {
  const { method, path, statusCode, responseTime } = metrics;
  const timeStr = responseTime.toFixed(2);

  switch (level) {
    case 'slow':
      console.warn(`🐢 SLOW: ${method} ${path} - ${statusCode} - ${timeStr}ms`);
      break;
    case 'warning':
      console.log(`⚠️  WARN: ${method} ${path} - ${statusCode} - ${timeStr}ms`);
      break;
    default:
      console.log(`✅ ${method} ${path} - ${statusCode} - ${timeStr}ms`);
  }
}

/**
 * パフォーマンス統計を取得
 */
export function getPerformanceStats(): {
  totalRequests: number;
  averageResponseTime: number;
  slowRequests: number;
  warningRequests: number;
  p50: number;
  p95: number;
  p99: number;
  byEndpoint: Record<string, { count: number; avgTime: number; maxTime: number }>;
} {
  if (metricsHistory.length === 0) {
    return {
      totalRequests: 0,
      averageResponseTime: 0,
      slowRequests: 0,
      warningRequests: 0,
      p50: 0,
      p95: 0,
      p99: 0,
      byEndpoint: {},
    };
  }

  const times = metricsHistory.map((m) => m.responseTime).sort((a, b) => a - b);
  const totalRequests = times.length;
  const averageResponseTime = times.reduce((a, b) => a + b, 0) / totalRequests;
  const slowRequests = times.filter((t) => t >= SLOW_THRESHOLD_MS).length;
  const warningRequests = times.filter((t) => t >= WARNING_THRESHOLD_MS && t < SLOW_THRESHOLD_MS).length;

  // パーセンタイル計算
  const p50 = times[Math.floor(totalRequests * 0.5)] || 0;
  const p95 = times[Math.floor(totalRequests * 0.95)] || 0;
  const p99 = times[Math.floor(totalRequests * 0.99)] || 0;

  // エンドポイント別統計
  const byEndpoint: Record<string, { count: number; avgTime: number; maxTime: number }> = {};
  for (const m of metricsHistory) {
    const key = `${m.method} ${m.path}`;
    if (!byEndpoint[key]) {
      byEndpoint[key] = { count: 0, avgTime: 0, maxTime: 0 };
    }
    byEndpoint[key].count++;
    byEndpoint[key].avgTime =
      (byEndpoint[key].avgTime * (byEndpoint[key].count - 1) + m.responseTime) / byEndpoint[key].count;
    byEndpoint[key].maxTime = Math.max(byEndpoint[key].maxTime, m.responseTime);
  }

  return {
    totalRequests,
    averageResponseTime,
    slowRequests,
    warningRequests,
    p50,
    p95,
    p99,
    byEndpoint,
  };
}

/**
 * メトリクス履歴をクリア
 */
export function clearMetricsHistory(): void {
  metricsHistory.length = 0;
}
