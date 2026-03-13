'use strict';

const db = require('../db');

// ─── Schemas ─────────────────────────────────────────────────
const newsProps = {
  title:        { type: 'string', minLength: 1, maxLength: 250 },
  content:      { type: ['string', 'null'] },
  image:        { type: ['string', 'null'] },
  author:       { type: 'string', maxLength: 100 },
  published_at: { type: 'string' },         // DATE – YYYY-MM-DD
};

const createBody = {
  type: 'object',
  required: ['title'],
  properties: newsProps,
  additionalProperties: false,
};

const updateBody = {
  type: 'object',
  properties: newsProps,
  additionalProperties: false,
};

const listQuery = {
  type: 'object',
  properties: {
    limit: { type: 'integer', minimum: 1, maximum: 100 },
  },
};

// ─── Routes ──────────────────────────────────────────────────
const tag = ['News'];

async function newsRoutes(fastify) {
  // GET /api/news?limit=10
  fastify.get('/', { schema: { tags: tag, summary: 'Lấy danh sách tin tức', querystring: listQuery } }, async (req) => {
    let q = db('news').orderBy('published_at', 'desc');
    if (req.query.limit) q = q.limit(req.query.limit);
    return q;
  });

  // GET /api/news/:id
  fastify.get('/:id', { schema: { tags: tag, summary: 'Lấy chi tiết bài viết' } }, async (req, reply) => {
    const article = await db('news').where({ id: req.params.id }).first();
    if (!article) return reply.code(404).send({ error: 'News not found' });
    return article;
  });

  // POST /api/news
  fastify.post('/', { schema: { tags: tag, summary: 'Thêm tin tức mới', body: createBody } }, async (req, reply) => {
    const [article] = await db('news').insert(req.body).returning('*');
    return reply.code(201).send(article);
  });

  // PUT /api/news/:id
  fastify.put('/:id', { schema: { tags: tag, summary: 'Cập nhật tin tức', body: updateBody } }, async (req, reply) => {
    const [article] = await db('news')
      .where({ id: req.params.id })
      .update(req.body)
      .returning('*');
    if (!article) return reply.code(404).send({ error: 'News not found' });
    return article;
  });

  // DELETE /api/news/:id
  fastify.delete('/:id', { schema: { tags: tag, summary: 'Xóa tin tức' } }, async (req, reply) => {
    const count = await db('news').where({ id: req.params.id }).delete();
    if (!count) return reply.code(404).send({ error: 'News not found' });
    return reply.code(204).send();
  });
}

module.exports = newsRoutes;
