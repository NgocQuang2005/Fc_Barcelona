'use strict';

const db = require('../db');

// ─── Constants ───────────────────────────────────────────────
const STATUSES = ['upcoming', 'completed', 'cancelled'];

// ─── Schemas ─────────────────────────────────────────────────
const matchProps = {
  match_time:   { type: 'string' },
  stadium:      { type: ['string', 'null'], maxLength: 150 },
  home_team_id: { type: 'string' },
  away_team_id: { type: 'string' },
  tournament:   { type: ['string', 'null'], maxLength: 100 },
  status:       { type: 'string', enum: STATUSES },
  home_score:   { type: ['integer', 'null'], minimum: 0 },
  away_score:   { type: ['integer', 'null'], minimum: 0 },
  image:        { type: ['string', 'null'] },
};

const createBody = {
  type: 'object',
  required: ['match_time', 'home_team_id', 'away_team_id'],
  properties: matchProps,
  additionalProperties: false,
};

const updateBody = {
  type: 'object',
  properties: matchProps,
  additionalProperties: false,
};

const listQuery = {
  type: 'object',
  properties: {
    status:     { type: 'string', enum: [...STATUSES, 'all'] },
    tournament: { type: 'string' },
    limit:      { type: 'integer', minimum: 1, maximum: 100 },
  },
};

// ─── Helper – join 2 đội vào kết quả ────────────────────────
const withTeams = () =>
  db('matches as m')
    .leftJoin('teams as ht', 'm.home_team_id', 'ht.id')
    .leftJoin('teams as at', 'm.away_team_id', 'at.id')
    .select(
      'm.id', 'm.match_time', 'm.stadium', 'm.tournament',
      'm.status', 'm.home_score', 'm.away_score', 'm.image', 'm.created_at',
      'm.home_team_id', 'm.away_team_id',
      'ht.name as home_team_name', 'ht.logo as home_team_logo',
      'at.name as away_team_name', 'at.logo as away_team_logo',
    );

// ─── Routes ──────────────────────────────────────────────────
const tag = ['Matches'];

async function matchRoutes(fastify) {
  // GET /api/matches?status=upcoming&tournament=La+Liga&limit=20
  fastify.get('/', { schema: { tags: tag, summary: 'Lấy danh sách trận đấu (lọc theo status/tournament)', querystring: listQuery } }, async (req) => {
    let q = withTeams().orderBy('m.match_time', 'desc');
    if (req.query.status && req.query.status !== 'all') q = q.where('m.status', req.query.status);
    if (req.query.tournament) q = q.where('m.tournament', req.query.tournament);
    if (req.query.limit)      q = q.limit(req.query.limit);
    return q;
  });

  // GET /api/matches/:id
  fastify.get('/:id', { schema: { tags: tag, summary: 'Lấy chi tiết trận đấu' } }, async (req, reply) => {
    const match = await withTeams().where('m.id', req.params.id).first();
    if (!match) return reply.code(404).send({ error: 'Match not found' });
    return match;
  });

  // POST /api/matches
  fastify.post('/', { schema: { tags: tag, summary: 'Thêm trận đấu mới', body: createBody } }, async (req, reply) => {
    const [match] = await db('matches').insert(req.body).returning('*');
    return reply.code(201).send(match);
  });

  // PUT /api/matches/:id
  fastify.put('/:id', { schema: { tags: tag, summary: 'Cập nhật trận đấu', body: updateBody } }, async (req, reply) => {
    const [match] = await db('matches')
      .where({ id: req.params.id })
      .update(req.body)
      .returning('*');
    if (!match) return reply.code(404).send({ error: 'Match not found' });
    return match;
  });

  // DELETE /api/matches/:id
  fastify.delete('/:id', { schema: { tags: tag, summary: 'Xóa trận đấu' } }, async (req, reply) => {
    const count = await db('matches').where({ id: req.params.id }).delete();
    if (!count) return reply.code(404).send({ error: 'Match not found' });
    return reply.code(204).send();
  });
}

module.exports = matchRoutes;
