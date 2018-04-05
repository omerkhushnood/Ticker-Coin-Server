'use strict';

var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    api = express(),
    bodyParser = require('body-parser')
;

const modelsDir = 'models';

//
// Bootstrap models.
fs.readdirSync(path.join(__dirname, modelsDir))
    .filter((file)=>~file.indexOf('.js'))
    .forEach((file)=>require(path.join(__dirname, modelsDir, file)))
;

//
// Request body parser.
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({extended: true}));

//
// Load routes.
// var userRoutes = require('./routes/user.routes');
var ccxtRoutes = require('./routes/ccxt.routes');

//
// Mount routes.
// api.use('/users', userRoutes);
api.use('/ccxt', ccxtRoutes);

//
// Route not found.
api.use(function(req, res, next){

    res.sendStatus(404);
});

//
// Export api instance.
module.exports = api;