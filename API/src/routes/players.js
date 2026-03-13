'use strict';

const db = require('../db');

// ─── Constants ───────────────────────────────────────────────
const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CM', 'DM', 'AM', 'LW', 'RW', 'ST', 'SS'];

// ─── Schemas ─────────────────────────────────────────────────
const playerProps = {
  name:        { type: 'string', minLength: 1, maxLength: 150 },
  birthday:    { type: ['string', 'null'] },
  nationality: { type: 'string', maxLength: 80 },
  position:    { type: 'string', enum: POSITIONS },
  number:      { type: ['integer', 'null'], minimum: 1, maximum: 99 },
  image:       { type: ['string', 'null'] },
  team_id:     { type: ['string', 'null'] },
};

const createBody = {
  type: 'object',
  required: ['name', 'position'],
  properties: playerProps,
  additionalProperties: false,
};

const updateBody = {
  type: 'object',
  properties: playerProps,
  additionalProperties: false,
};

const listQuery = {
  type: 'object',
  properties: {
    team_id:  { type: 'string' },
    position: { type: 'string', enum: POSITIONS },
  },
};

// ─── Helper – join với bảng teams ───────────────────────────
const withTeam = () =>
  db('players as p')
    .leftJoin('teams as t', 'p.team_id', 't.id')
    .select(
      'p.id', 'p.name', 'p.birthday', 'p.nationality',
      'p.position', 'p.number', 'p.image', 'p.team_id', 'p.created_at',
      't.name as team_name',
      't.logo as team_logo',
    );

// ─── Routes ──────────────────────────────────────────────────
const tag = ['Players'];

async function playerRoutes(fastify) {
  // GET /api/players?team_id=&position=
  fastify.get('/', { schema: { tags: tag, summary: 'Lấy danh sách cầu thủ', querystring: listQuery } }, async (req) => {
    let q = withTeam().orderBy('p.number');
    if (req.query.team_id)  q = q.where('p.team_id', req.query.team_id);
    if (req.query.position) q = q.where('p.position', req.query.position);
    return q;
  });

  // GET /api/players/:id
  fastify.get('/:id', { schema: { tags: tag, summary: 'Lấy chi tiết cầu thủ' } }, async (req, reply) => {
    const player = await withTeam().where('p.id', req.params.id).first();
    if (!player) return reply.code(404).send({ error: 'Player not found' });
    return player;
  });

  // POST /api/players
  fastify.post('/', { schema: { tags: tag, summary: 'Thêm cầu thủ mới', body: createBody } }, async (req, reply) => {
    const [player] = await db('players').insert(req.body).returning('*');
    return reply.code(201).send(player);
  });

  // PUT /api/players/:id
  fastify.put('/:id', { schema: { tags: tag, summary: 'Cập nhật cầu thủ', body: updateBody } }, async (req, reply) => {
    const [player] = await db('players')
      .where({ id: req.params.id })
      .update(req.body)
      .returning('*');
    if (!player) return reply.code(404).send({ error: 'Player not found' });
    return player;
  });

  // DELETE /api/players/:id
  fastify.delete('/:id', { schema: { tags: tag, summary: 'Xóa cầu thủ' } }, async (req, reply) => {
    const count = await db('players').where({ id: req.params.id }).delete();
    if (!count) return reply.code(404).send({ error: 'Player not found' });
    return reply.code(204).send();
  });
}

module.exports = playerRoutes;
