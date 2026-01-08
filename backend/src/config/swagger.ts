import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '営業日報システム API',
      version: '1.0.0',
      description: '営業担当者の日報管理を行うRESTful API',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWTトークンを入力してください',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            sales_id: { type: 'integer', example: 1 },
            name: { type: 'string', example: '山田太郎' },
            email: { type: 'string', format: 'email', example: 'yamada@example.com' },
            department: { type: 'string', example: '営業部' },
            position: { type: 'string', example: '課長' },
            role: { type: 'string', enum: ['admin', 'general'], example: 'general' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'yamada@example.com' },
            password: { type: 'string', format: 'password', example: 'password123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                access_token: { type: 'string' },
                token_type: { type: 'string', example: 'Bearer' },
                expires_in: { type: 'integer', example: 86400 },
                user: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
        Report: {
          type: 'object',
          properties: {
            report_id: { type: 'integer', example: 1 },
            sales_id: { type: 'integer', example: 1 },
            report_date: { type: 'string', format: 'date', example: '2026-01-08' },
            status: { type: 'string', enum: ['draft', 'submitted'], example: 'submitted' },
            problem: { type: 'string', example: '顧客からの要望が複雑' },
            plan: { type: 'string', example: '明日再訪問予定' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        ReportListItem: {
          type: 'object',
          properties: {
            report_id: { type: 'integer' },
            sales_name: { type: 'string' },
            report_date: { type: 'string', format: 'date' },
            status: { type: 'string', enum: ['draft', 'submitted'] },
            visit_count: { type: 'integer' },
            customers: { type: 'array', items: { type: 'string' } },
            comment_count: { type: 'integer' },
            has_unread_comments: { type: 'boolean' },
          },
        },
        Customer: {
          type: 'object',
          properties: {
            customer_id: { type: 'integer', example: 1 },
            customer_code: { type: 'string', example: 'C001' },
            customer_name: { type: 'string', example: '株式会社ABC' },
            address: { type: 'string', example: '東京都千代田区...' },
            phone: { type: 'string', example: '03-1234-5678' },
            email: { type: 'string', format: 'email' },
            is_active: { type: 'boolean', example: true },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            comment_id: { type: 'integer' },
            comment_type: { type: 'string', enum: ['problem', 'plan'] },
            comment_content: { type: 'string' },
            commenter: {
              type: 'object',
              properties: {
                sales_id: { type: 'integer' },
                name: { type: 'string' },
              },
            },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total_pages: { type: 'integer' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: 'Auth', description: '認証関連' },
      { name: 'Reports', description: '日報関連' },
      { name: 'Customers', description: '顧客マスタ' },
      { name: 'Sales Staff', description: '営業担当マスタ' },
      { name: 'Comments', description: 'コメント関連' },
      { name: 'Statistics', description: '統計情報' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
