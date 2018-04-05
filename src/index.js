'use strict';

global.__basedir = __dirname;

var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    api = require('./api'),
    cors = require('cors')
;

app.use(cors());
app.use('/api', api);

app.listen(process.env.PORT || 3000, ()=>{
            
    console.log('Application listening on port:', process.env.PORT || 3000);
});

//
// Connecting with database.
// console.log('Connecting to database...');
// connectDB()
//     .once('connected', ()=>{

//         console.log('Database connected');
//         // Start the server.
//         app.listen(process.env.PORT || 3000, ()=>{
            
//             console.log('Application listening on port:', process.env.PORT || 3000);
//         });
//     })
//     .on('disconnected', connectDB)
//     .on('error', (e)=>{

//         console.log(e);
//     })
// ;

// function connectDB(){

//     return mongoose.connect(process.env.DB_URL, {

//         useMongoClient: !!process.env.DB_USE_MONGO_CLIENT,
//         ssl: !!process.env.DB_SSL,
//         sslValidate: !!process.env.DB_SSL_VALIDATE,
//         sslCA: process.env.DB_SSL_CA
//     }), mongoose.connection;
// }