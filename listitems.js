var express = require('express');
var router = express.Router();
var db = require('./dbconnect'); //database
var bodyParser = require('body-parser').text();
var jwt = require("jsonwebtoken");
var secret = "frenchfriestastegood!"; //used to check the token
var logindata; //logindata from the token

//sjekker token----------------
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

    var listid = req.query.listid;

    var sql = `SELECT * FROM list_items WHERE list_id=${listid}`;
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

    var sql = `PREPARE insert_items (int, int, text) AS
               INSERT INTO list_items VALUES (DEFAULT, $2, $3); EXECUTE insert_items
               (0, ${upload.listid}, '${upload.title}')`;

    db.any(sql).then(function(data) {

        db.any("DEALLOCATE insert_items");
        res.status(200).json({msg: "insert ok"}); //success

    }).catch(function(err) {

        res.status(500).json(err);
    });
});


//export module ---------------------------------
module.exports = router;
