var pgp = require('pg-promise')();
pgp.pg.defaults.ssl = true;

//db connect string
//var conn = process.env.DATABASE_URL || 'postgres://postgres:aupom883@localhost:5432/TheToDoer';

var conn = process.env.DATABASE_URL || 'postgres://lezmxorchdibxq:ce6ec6f2b003b4863b72049c519810d1cafad4e4a8f9503544e57459b9d2d92f@ec2-54-75-233-162.eu-west-1.compute.amazonaws.com:5432/da9gqpciumdn5c';

var db = pgp(conn);

//export module
module.exports = db;
