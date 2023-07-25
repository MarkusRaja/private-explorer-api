require('dotenv').config();
const assert = require('assert');

const { NODE_ENV, PORT, HOST, WEB3_PROVIDER_URL, DATABASE_URL } = process.env;

assert(NODE_ENV, 'NODE_ENV is required');
assert(PORT, 'PORT is required');
assert(HOST, 'HOST is required');
assert(WEB3_PROVIDER_URL, 'WEB3_PROVIDER_URL is required');
assert(DATABASE_URL, 'DATABASE_URL is required');

module.exports = {
  NODE_ENV,
  PORT,
  HOST,
  WEB3_PROVIDER_URL,
  DATABASE_URL,
}
