'use strict';

require('dotenv').config();
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME     || 'barcelona_db',
    user:     process.env.DB_USER     || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost'
      ? { rejectUnauthorized: false }
      : false,
  },
  pool: {
    min: 2,
    max: 10,
  },
  acquireConnectionTimeout: 10000,
});

module.exports = db;
