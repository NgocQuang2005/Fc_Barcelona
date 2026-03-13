'use strict';

require('dotenv').config();
const Fastify  = require('fastify');
const cors     = require('@fastify/cors');
const swagger  = require('@fastify/swagger');
const swaggerUi = require('@fastify/swagger-ui');

// ─── App Instance ────────────────────────────────────────────
const app = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      removeAdditional: 'all',
      coerceTypes:      true,
      allErrors:        true,
    },
    plugins: [
      [require('ajv-formats'), {}],
    ],
  },
});

// ─── Swagger Spec ─────────────────────────────────────────────
app.register(swagger, {
  openapi: {
    openapi: '3.0.3',
    info: {
      title:       'FC Barcelona Manager API',
      description: 'REST API cho hệ thống quản lý CLB FC Barcelona',
      version:     '1.0.0',
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 5000}`, description: 'Local' },
    ],
    tags: [
      { name: 'Club',      description: 'Thông tin câu lạc bộ' },
      { name: 'Teams',     description: 'Đội bóng' },
      { name: 'Players',   description: 'Cầu thủ' },
      { name: 'Coaches',   description: 'Ban huấn luyện' },
      { name: 'Matches',   description: 'Trận đấu (lịch + kết quả)' },
      { name: 'Standings', description: 'Bảng xếp hạng' },
      { name: 'Legends',   description: 'Huyền thoại CLB' },
      { name: 'News',      description: 'Tin tức' },
    ],
  },
});

// ─── Swagger UI ───────────────────────────────────────────────
app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion:   'list',
    deepLinking:    true,
    tryItOutEnabled: true,
  },
  staticCSP: true,
});

// ─── CORS ─────────────────────────────────────────────────────
app.register(cors, {
  origin:  process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});

// ─── Health ──────────────────────────────────────────────────
app.get('/health', {
  schema: {
    tags: ['Health'],
    summary: 'Kiểm tra server',
    response: {
      200: {
        type: 'object',
        properties: {
          status:    { type: 'string' },
          timestamp: { type: 'string' },
        },
      },
    },
  },
}, async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

// ─── Routes ──────────────────────────────────────────────────
app.register(require('./routes/club'),      { prefix: '/api/club'      });
app.register(require('./routes/teams'),     { prefix: '/api/teams'     });
app.register(require('./routes/players'),   { prefix: '/api/players'   });
app.register(require('./routes/coaches'),   { prefix: '/api/coaches'   });
app.register(require('./routes/matches'),   { prefix: '/api/matches'   });
app.register(require('./routes/standings'), { prefix: '/api/standings' });
app.register(require('./routes/legends'),   { prefix: '/api/legends'   });
app.register(require('./routes/news'),      { prefix: '/api/news'      });

// ─── Global Error Handler ─────────────────────────────────────
app.setErrorHandler((error, req, reply) => {
  app.log.error({ err: error }, 'Unhandled error');
  const code = error.statusCode || 500;
  reply.code(code).send({ statusCode: code, error: error.message || 'Internal Server Error' });
});

// ─── Start ───────────────────────────────────────────────────
const start = async () => {
  try {
    const port = parseInt(process.env.PORT) || 5000;
    const host = process.env.HOST           || '0.0.0.0';
    await app.listen({ port, host });
    console.log(`\n🚀  FC Barcelona API  →  http://localhost:${port}`);
    console.log(`📖  Swagger UI        →  http://localhost:${port}/docs\n`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
