const express = require('express');
const bodyParser = require('body-parser');
const readline = require('readline');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var routes = require("./routes.js")(app);
 
var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});

