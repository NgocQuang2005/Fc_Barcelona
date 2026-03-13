'use strict';

const db = require('../db');

// ─── Schemas ─────────────────────────────────────────────────
const bodySchema = {
  type: 'object',
  required: ['club_name'],
  properties: {
    club_name:   { type: 'string', minLength: 1, maxLength: 100 },
    description: { type: 'string' },
  },
  additionalProperties: false,
};

// ─── Routes ──────────────────────────────────────────────────
const tag = ['Club'];

async function clubRoutes(fastify) {
  // GET /api/club
  fastify.get('/', {
    schema: { tags: tag, summary: 'Lấy thông tin CLB' },
  }, async () => {
    const row = await db('club').first();
    return row ?? { id: 1, club_name: 'FC Barcelona', description: '' };
  });

  // PUT /api/club
  fastify.put('/', { schema: { tags: tag, summary: 'Cập nhật thông tin CLB', body: bodySchema } }, async (req, reply) => {
    const { club_name, description } = req.body;
    const exists = await db('club').where({ id: 1 }).first();

    if (exists) {
      const [updated] = await db('club')
        .where({ id: 1 })
        .update({ club_name, description, updated_at: db.fn.now() })
        .returning('*');
      return updated;
    }

    const [inserted] = await db('club')
      .insert({ club_name, description })
      .returning('*');
    return reply.code(201).send(inserted);
  });
}

module.exports = clubRoutes;
