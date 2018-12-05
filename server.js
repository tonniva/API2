// db.js   https://github.com/mysqljs/mysql#getting-the-id-of-an-inserted-row
//สั่ง งาน เสียง https://tutorialzine.com/2017/08/converting-from-speech-to-text-with-javascript
var mssql = require("mssql");
const utf8 = require('utf8');
var SqlString = require('sqlstring');

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
var cors = require('cors');
// app.use(cors);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


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
app.get('/books/:Clinicname', function(req, res, next) {
    var request = new db.Request();
    var Query = SqlString.format('USE [stg-product]  SELECT * FROM [dbo].[UserDetail] where Clinicname LIKE N?', '%' + req.params.Clinicname + '%');


    console.log(Query);
    request.query(Query, function(err, result) {
        if (err)
            return next(err);

        var data = {};
        data["user"] = result.recordset;
        res.send(data);
    });
});


var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ limit: '50mb', extended: true })
app.post('/books', urlencodedParser, function(req, res, next) {
    if (!req.body) return res.sendStatus(400)
    res.send('welcome, ' + req)
    var request = new db.Request();
    var post = req.body;

    var sql = SqlString.format('INSERT INTO [dbo].[UserDetail]([Clinicname],[Customername],[Operatorname],[Address],[Latitude],[Longitude],[Status],[Image]) VALUES (N?,N?,N?,N?,N?,N?,?,?)', [req.body.Clinicname, req.body.Customername, req.body.Operatorname, req.body.Address, req.body.Latitude, req.body.Longitude, req.body.Status, req.body.Image]);

    console.log(sql);


    request.query(sql, function(err, result) {
        if (err)
            return next(err);
        var data = {};
        data["user"] = result.recordset;
        res.send(data);
        next();
    });


});

// var http = require('http')
var port = process.env.PORT || 1337;
// http.createServer(function(req, res) {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('Hello World\n');
// }).listen(port);


app.listen(port, function() {
    console.log('Server is running..');
});