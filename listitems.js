var express = require('express');
var router = express.Router();
var db = require('./dbconnect'); //database
var bodyParser = require('body-parser').text();

//endpoint: GET lists ---------------------------
router.get('/', function (req, res) {

    var sql = 'SELECT * FROM listsview';
    db.any(sql).then(function(data) {

        res.status(200).json(data); //success - send the data as JSON!

    }).catch(function(err) {

        res.status(500).json(err);
    });
});

//endpoint: POST lists --------------------------
router.post('/', bodyParser, function (req, res) {

    console.log(req.body);

    var upload = JSON.parse(req.body);

    //Note. the uploaded data should also be sanitized for malicious code, e.g. use the module 'sanitize-html'

    var sql = `PREPARE insert_list (int, int, text) AS
               INSERT INTO lists VALUES (DEFAULT, $2, $3); EXECUTE insert_list
               (0, '${upload.name}', '${upload.description}')`;

    db.any(sql).then(function(data) {

        db.any("DEALLOCATE insert_list");
        res.status(200).json({msg: "insert ok"}); //success

    }).catch(function(err) {

        res.status(500).json(err);
    });
});


//export module ---------------------------------
module.exports = router;
