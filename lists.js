var express = require('express');
var router = express.Router();
var db = require('./dbconnect'); //database
var bodyParser = require('body-parser').text();
var jwt = require("jsonwebtoken");
var secret = "frenchfriestastegood!"; //used to check the token
var logindata; //logindata from the token

//Authorize all travel-endpoints ----------------
router.use(function (req, res, next) {

    //get the token from the URL-variable named 'token'
    var token = req.query['token'];

    if (!token) {
        res.status(403).json({msg: "No token received"}); //send
        return; //quit
    }
    else {
        try {
            logindata = jwt.verify(token, secret); //check the token
        }
        catch(err) {
            res.status(403).json({msg: "The token is not valid!"}); //send
            return; //quit
        }
    }
    next(); //we have a valid token - go to the requested endpoint
});

//endpoint: GET lists ---------------------------
router.get('/', function (req, res) {

     var sql = `PREPARE get_lists (text) AS
               SELECT * FROM listsview WHERE loginname=$1 ORDER BY list_id DESC;
               EXECUTE get_lists('${logindata.loginname}')`;

    db.any(sql).then(function(data) {

        res.status(200).json(data); //success - send the data as JSON!

    }).catch(function(err) {

        res.status(500).json(err);
    });
});

//endpoint: POST lists --------------------------
router.post('/', bodyParser, function (req, res) {

    var upload = JSON.parse(req.body);

    //Note. the uploaded data should also be sanitized for malicious code, e.g. use the module 'sanitize-html'

    var sql = `PREPARE insert_list (int, text, text, text) AS
               INSERT INTO lists VALUES (DEFAULT, $2, $3, $4) RETURNING *;
               EXECUTE insert_list (0, '${upload.name}', '${upload.description}', '${logindata.loginname}')`;

    db.any(sql).then(function(data) {

        db.any("DEALLOCATE insert_list");
        res.status(200).json({msg: "insert ok", newrow: data}); //success

    }).catch(function(err) {

        res.status(500).json(err);
    });
});

//endpoint: DELETE lists ------------------------
router.delete('/', function (req, res) {

    var upload = req.query.list_id; //uploaded data should be sanitized

    var sql = `PREPARE delete_list (int, text) AS
               DELETE FROM lists WHERE list_id=$1 AND loginname=$2 RETURNING *;
               EXECUTE delete_list('${upload}', '${logindata.loginname}')`;

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
