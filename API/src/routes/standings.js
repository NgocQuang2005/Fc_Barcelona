'use strict';

const db = require('../db');

// ─── Schemas ─────────────────────────────────────────────────
// NOTE: goal_difference là GENERATED ALWAYS AS trong DB → không gửi khi insert/update
const standingProps = {
  team_name:     { type: 'string', minLength: 1, maxLength: 100 },
  team_id:       { type: ['string', 'null'] },
  tournament:    { type: ['string', 'null'], maxLength: 100 },
  season:        { type: ['string', 'null'], maxLength: 20 },
  played:        { type: 'integer', minimum: 0 },
  won:           { type: 'integer', minimum: 0 },
  drawn:         { type: 'integer', minimum: 0 },
  lost:          { type: 'integer', minimum: 0 },
  goals_for:     { type: 'integer', minimum: 0 },
  goals_against: { type: 'integer', minimum: 0 },
  points:        { type: 'integer', minimum: 0 },
};

const createBody = {
  type: 'object',
  required: ['team_name'],
  properties: standingProps,
  additionalProperties: false,
};

const updateBody = {
  type: 'object',
  properties: standingProps,
  additionalProperties: false,
};

const listQuery = {
  type: 'object',
  properties: {
    tournament: { type: 'string' },
    season:     { type: 'string' },
  },
};

// ─── Routes ──────────────────────────────────────────────────
const tag = ['Standings'];

async function standingRoutes(fastify) {
  // GET /api/standings?tournament=La+Liga&season=2024/25
  fastify.get('/', { schema: { tags: tag, summary: 'Lấy bảng xếp hạng', querystring: listQuery } }, async (req) => {
    let q = db('standings').orderBy('points', 'desc');
    if (req.query.tournament) q = q.where({ tournament: req.query.tournament });
    if (req.query.season)     q = q.where({ season: req.query.season });
    return q;
  });

  // GET /api/standings/:id
  fastify.get('/:id', { schema: { tags: tag, summary: 'Lấy chi tiết một dòng BXH' } }, async (req, reply) => {
    const row = await db('standings').where({ id: req.params.id }).first();
    if (!row) return reply.code(404).send({ error: 'Standing not found' });
    return row;
  });

  // POST /api/standings
  fastify.post('/', { schema: { tags: tag, summary: 'Thêm vào bảng xếp hạng', body: createBody } }, async (req, reply) => {
    const [row] = await db('standings').insert(req.body).returning('*');
    return reply.code(201).send(row);
  });

  // PUT /api/standings/:id
  fastify.put('/:id', { schema: { tags: tag, summary: 'Cập nhật BXH', body: updateBody } }, async (req, reply) => {
    const [row] = await db('standings')
      .where({ id: req.params.id })
      .update(req.body)
      .returning('*');
    if (!row) return reply.code(404).send({ error: 'Standing not found' });
    return row;
  });

  // DELETE /api/standings/:id
  fastify.delete('/:id', { schema: { tags: tag, summary: 'Xóa khỏi BXH' } }, async (req, reply) => {
    const count = await db('standings').where({ id: req.params.id }).delete();
    if (!count) return reply.code(404).send({ error: 'Standing not found' });
    return reply.code(204).send();
  });
}

module.exports = standingRoutes;
