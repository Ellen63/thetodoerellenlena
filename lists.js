var express = require('express');
var router = express.Router();
var db = require('./dbconnect'); //database
var bodyParser = require('body-parser').text();

//endpoint: GET lists ---------------------------
router.get('/', function (req, res) {

    var sql = 'SELECT * FROM listview';
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

    var sql = `PREPARE insert_list (int, text, text, text) AS
               INSERT INTO lists VALUES (DEFAULT, $2, $3, $4); EXECUTE insert_list
               (0, '${upload.name}', '${upload.description}', 'testuser')`;

    db.any(sql).then(function(data) {

        db.any("DEALLOCATE insert_list");
        res.status(200).json({msg: "insert ok"}); //success

    }).catch(function(err) {

        res.status(500).json(err);
    });
});

//endpoint: DELETE lists ------------------------
router.delete('/', function (req, res) {

    var upload = req.query.list_id; //uploaded data should be sanitized

    var sql = `PREPARE delete_list (int) AS
            DELETE FROM lists WHERE list_id=$1 RETURNING *;
            EXECUTE delete_list(${upload})`;

    console.log(sql);

    db.any(sql).then(function(data) {

        db.any("DEALLOCATE delete_list");

        if (data.length > 0) {
            res.status(200).json({msg: "delete ok"}); //success!
        }
        else {
            res.status(200).json({msg: "can´t delete"});
        }

    }).catch(function(err) {
        res.status(500).json(err);
    });
});

//export module ---------------------------------
module.exports = router;
