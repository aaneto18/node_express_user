// call the packages we need
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var morgan = require("morgan");
var makeRouter = require("./router");

// configure app
app.use(morgan("dev")); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3333; // set our port

// create our router
var router = makeRouter(express);

// REGISTER OUR ROUTES -------------------------------
app.use("/", router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log("Magic happens on port " + port);
