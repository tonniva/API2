// db.js 
var mssql = require("mssql");
var dbConfig = {
    user: 'stg-product',
    password: 'Tonniva016449054',
    server: 'stg-product.database.windows.net',
    database: 'stg-product',
    options: {
        encrypt: true
    }
};

var connection = mssql.connect(dbConfig, function(err) {
    if (err)
        throw err;
});

module.exports = connection;

// app.js 
var db = require("mssql");
var express = require("express");
var app = express();

app.get('/books', function(req, res, next) {
    var request = new db.Request();
    request.query('USE [stg-product]  SELECT * FROM [dbo].[UserDetail] ', function(err, result) {
        if (err)
            return next(err);

        var data = {};
        data["user"] = result.recordset;
        res.send(data);
    });
});


// app.get('/books', function(req, res, next) {
//     var request = new db.Request();
//     request.query('USE [stg-product]  SELECT * FROM [dbo].[UserDetail]', function(err, result) {
//         if (err)
//             return next(err);

//         var data = {};
//         data["user"] = result.recordset;
//         res.send(data);
//     });
// });

var server = app.listen(5000, function() {
    console.log('Server is running..');
});