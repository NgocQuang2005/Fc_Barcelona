'use strict';

const db = require('../db');

// ─── Schemas ─────────────────────────────────────────────────
const coachProps = {
  name:        { type: 'string', minLength: 1, maxLength: 150 },
  birthday:    { type: ['string', 'null'] },
  nationality: { type: 'string', maxLength: 80 },
  image:       { type: ['string', 'null'] },
};

const createBody = {
  type: 'object',
  required: ['name'],
  properties: coachProps,
  additionalProperties: false,
};

const updateBody = {
  type: 'object',
  properties: coachProps,
  additionalProperties: false,
};

// ─── Routes ──────────────────────────────────────────────────
const tag = ['Coaches'];

async function coachRoutes(fastify) {
  // GET /api/coaches
  fastify.get('/', { schema: { tags: tag, summary: 'Lấy danh sách HLV' } }, async () => db('coaches').orderBy('name'));

  // GET /api/coaches/:id
  fastify.get('/:id', { schema: { tags: tag, summary: 'Lấy chi tiết HLV' } }, async (req, reply) => {
    const coach = await db('coaches').where({ id: req.params.id }).first();
    if (!coach) return reply.code(404).send({ error: 'Coach not found' });
    return coach;
  });

  // POST /api/coaches
  fastify.post('/', { schema: { tags: tag, summary: 'Thêm HLV mới', body: createBody } }, async (req, reply) => {
    const [coach] = await db('coaches').insert(req.body).returning('*');
    return reply.code(201).send(coach);
  });

  // PUT /api/coaches/:id
  fastify.put('/:id', { schema: { tags: tag, summary: 'Cập nhật HLV', body: updateBody } }, async (req, reply) => {
    const [coach] = await db('coaches')
      .where({ id: req.params.id })
      .update(req.body)
      .returning('*');
    if (!coach) return reply.code(404).send({ error: 'Coach not found' });
    return coach;
  });

  // DELETE /api/coaches/:id
  fastify.delete('/:id', { schema: { tags: tag, summary: 'Xóa HLV' } }, async (req, reply) => {
    const count = await db('coaches').where({ id: req.params.id }).delete();
    if (!count) return reply.code(404).send({ error: 'Coach not found' });
    return reply.code(204).send();
  });
}

module.exports = coachRoutes;
