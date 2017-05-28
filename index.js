/* IMPORTS */

const up = require('./lib/up');
const down = require('./lib/down');
const create = require('./lib/create');

/* CODE */

const args = require('minimist')(process.argv.slice(2));
const options = Object.assign({
  config: './config.json',
  table: 'migrations',
  path: './migrations',
  count: null
}, args);


if (options._.includes('create')) {
  create(options);
} else if (options._.includes('down')) {
  down(options);
} else {
  up(options);
}
