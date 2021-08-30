const monk = require('monk');

const db = monk('localhost/todo');

module.exports = db;
