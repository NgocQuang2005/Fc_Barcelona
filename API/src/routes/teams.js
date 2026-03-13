'use strict';

const db = require('../db');

// ─── Schemas ─────────────────────────────────────────────────
const teamProps = {
  name:    { type: 'string', minLength: 1, maxLength: 100 },
  logo:    { type: 'string' },
  country: { type: 'string', maxLength: 80 },
};

const createBody = {
  type: 'object',
  required: ['name'],
  properties: teamProps,
  additionalProperties: false,
};

const updateBody = {
  type: 'object',
  properties: teamProps,
  additionalProperties: false,
};

// ─── Routes ──────────────────────────────────────────────────
const tag = ['Teams'];

async function teamRoutes(fastify) {
  // GET /api/teams
  fastify.get('/', { schema: { tags: tag, summary: 'Lấy danh sách đội bóng' } }, async () => {
    return db('teams').orderBy('name');
  });

  // GET /api/teams/:id
  fastify.get('/:id', { schema: { tags: tag, summary: 'Lấy chi tiết một đội bóng' } }, async (req, reply) => {
    const team = await db('teams').where({ id: req.params.id }).first();
    if (!team) return reply.code(404).send({ error: 'Team not found' });
    return team;
  });

  // POST /api/teams
  fastify.post('/', { schema: { tags: tag, summary: 'Thêm đội bóng mới', body: createBody } }, async (req, reply) => {
    const [team] = await db('teams').insert(req.body).returning('*');
    return reply.code(201).send(team);
  });

  // PUT /api/teams/:id
  fastify.put('/:id', { schema: { tags: tag, summary: 'Cập nhật đội bóng', body: updateBody } }, async (req, reply) => {
    const [team] = await db('teams')
      .where({ id: req.params.id })
      .update(req.body)
      .returning('*');
    if (!team) return reply.code(404).send({ error: 'Team not found' });
    return team;
  });

  // DELETE /api/teams/:id
  fastify.delete('/:id', { schema: { tags: tag, summary: 'Xóa đội bóng' } }, async (req, reply) => {
    const count = await db('teams').where({ id: req.params.id }).delete();
    if (!count) return reply.code(404).send({ error: 'Team not found' });
    return reply.code(204).send();
  });
}

module.exports = teamRoutes;
