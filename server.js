const express = require('express');
const app = express(); //server app

//global for all routes ----------------
app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next(); //go to the specific route
});

//route handling is delegated to :
var lists = require('./lists.js');
app.use('/TheToDoer/lists/', lists);

var listitems = require('./listitems.js');
app.use('/TheToDoer/listitems/', listitems);

var users = require('./users.js');
app.use('/TheToDoer/users/', users);

// -------------------------------------
var port = process.env.PORT || 3000;
app.listen(port, function () {
    //console.log('Server listening on port 3000!');
});
