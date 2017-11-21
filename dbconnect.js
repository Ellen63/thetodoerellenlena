var pgp = require('pg-promise')();

//db connect string
var conn = process.env.DATABASE_URL || 'postgres://postgres:aupom883@localhost:5432/TheToDoer';
var db = pgp(conn);

//export module
module.exports = db;
