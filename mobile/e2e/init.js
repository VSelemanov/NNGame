require('babel-polyfill');
const detox = require('detox');
const config = require('../package.json').detox;

beforeEach(async () => {
  await detox.init(config);
});

afterEach(async () => {
  await detox.cleanup();
});