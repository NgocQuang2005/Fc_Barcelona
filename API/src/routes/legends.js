'use strict';

const db = require('../db');

// ─── Schemas ─────────────────────────────────────────────────
const legendProps = {
  name:         { type: 'string', minLength: 1, maxLength: 150 },
  period:       { type: ['string', 'null'], maxLength: 50 },
  achievements: { type: ['string', 'null'] },
  image:        { type: ['string', 'null'] },
};

const createBody = {
  type: 'object',
  required: ['name'],
  properties: legendProps,
  additionalProperties: false,
};

const updateBody = {
  type: 'object',
  properties: legendProps,
  additionalProperties: false,
};

// ─── Routes ──────────────────────────────────────────────────
const tag = ['Legends'];

async function legendRoutes(fastify) {
  // GET /api/legends
  fastify.get('/', { schema: { tags: tag, summary: 'Lấy danh sách huyền thoại' } }, async () => db('legends').orderBy('name'));

  // GET /api/legends/:id
  fastify.get('/:id', { schema: { tags: tag, summary: 'Lấy chi tiết huyền thoại' } }, async (req, reply) => {
    const legend = await db('legends').where({ id: req.params.id }).first();
    if (!legend) return reply.code(404).send({ error: 'Legend not found' });
    return legend;
  });

  // POST /api/legends
  fastify.post('/', { schema: { tags: tag, summary: 'Thêm huyền thoại mới', body: createBody } }, async (req, reply) => {
    const [legend] = await db('legends').insert(req.body).returning('*');
    return reply.code(201).send(legend);
  });

  // PUT /api/legends/:id
  fastify.put('/:id', { schema: { tags: tag, summary: 'Cập nhật huyền thoại', body: updateBody } }, async (req, reply) => {
    const [legend] = await db('legends')
      .where({ id: req.params.id })
      .update(req.body)
      .returning('*');
    if (!legend) return reply.code(404).send({ error: 'Legend not found' });
    return legend;
  });

  // DELETE /api/legends/:id
  fastify.delete('/:id', { schema: { tags: tag, summary: 'Xóa huyền thoại' } }, async (req, reply) => {
    const count = await db('legends').where({ id: req.params.id }).delete();
    if (!count) return reply.code(404).send({ error: 'Legend not found' });
    return reply.code(204).send();
  });
}

module.exports = legendRoutes;
