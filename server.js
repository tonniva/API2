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

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     // res.setHeader("Content-Type", "application/json"); 
//     res.statusCode = 404;
//     // res.end();

//     next();
// });

app.use(function(req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization, x-access-token");
    res.header("Content-Type", "text/plain");

    next();
});





app.get('/books', function(req, res, next) {
    var request = new db.Request();
    request.query('USE [stg-product]  SELECT * FROM [dbo].[UserDetail] ', function(err, result) {
        if (err) {
            throw err
        }

        var data = {};
        data["user"] = result.recordset;
        res.send(data);
        next();
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
        next();
    });
});


var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ limit: '50mb', extended: true })
app.post('/books', urlencodedParser, function(req, res, next) {
    try {
        if (!req.body) return res.sendStatus(400)
        res.send('welcome, ' + req)
        var request = new db.Request();
        var post = req.body;
        // var uniqueImageGEN = uniqueImage(req.body.FileName);
        var uniqueImageGEN = "";
        var bloburl = "https://iamge.blob.core.windows.net/blob/";

        // file not presenet
        //insertImageBlob(uniqueImageGEN, req.body.Image);
    } catch (err) {
        console.log(err);
    }



    //New code
    var sql = SqlString.format('INSERT INTO [dbo].[UserDetail]([CustomerID],[TransactionID],[TitleName],[FirstName],[LastName],[Clinicname],[Customername],[Operatorname],[Address],[Latitude],[Longitude],[Status],[FileType],[FileName],[ImageUrl],[Image]) ' +
        'VALUES (N?,N?,N?,N?,N?,N?,N?,N?,N?,N?,N?,N?,N?,N?,N?,?)', ['', '', '', '', '', req.body.Clinicname, req.body.Customername, req.body.Operatorname, req.body.Address, req.body.Latitude, req.body.Longitude, req.body.Status, req.body.FileType, req.body.FileName, bloburl + uniqueImageGEN, req.body.FileName]);

    console.log(sql);
    request.query(sql, function(err, result) {
        if (err) {
            throw err
        }

        next();
        // if (err)
        //     return next(err);
        // var data = {};
        // data["user"] = result.recordset;
        // res.send(data); 
        // next();
        // console.log('this ran');
        // res.status(200).json({ message: 'ok' });
        // console.log('this ran too');
        // res.status(200).json({ message: 'ok' });

    });


    // old code
    // var sql = SqlString.format('INSERT INTO [dbo].[UserDetail]([Clinicname],[Customername],[Operatorname],[Address],[Latitude],[Longitude],[Status],[Image]) VALUES (N?,N?,N?,N?,N?,N?,?,?)', [req.body.Clinicname, req.body.Customername, req.body.Operatorname, req.body.Address, req.body.Latitude, req.body.Longitude, req.body.Status, req.body.Image]);

    // console.log(sql);


    // request.query(sql, function(err, result) {
    //     if (err)
    //         return next(err);
    //     var data = {};
    //     data["user"] = result.recordset;
    //     res.send(data);
    //     next();
    // });


});





function uniqueImage() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

//imae insert to blob
// function insertImageBlob(ImgfileName, Image) {
//     const storage = require('azure-storage');
//     const {
//         Aborter,
//         BlockBlobURL,
//         ContainerURL,
//         ServiceURL,
//         SharedKeyCredential,
//         StorageURL,
//         uploadStreamToBlockBlob,
//         uploadFileToBlockBlob
//     } = require('@azure/storage-blob');

//     const fs = require("fs");
//     const path = require("path");

//     if (process.env.NODE_ENV !== "production") {
//         require("dotenv").config();
//     }

//     const STORAGE_ACCOUNT_NAME = "iamge";
//     const ACCOUNT_ACCESS_KEY = "LuggCBkGfnr2o8rgcToXFGbip69nkh9Fec6wJbwZhSd0f7wLuCAjdPWXf/F7WfJFsZhN2lNSVKHHFT8OfkqT9Q==";

//     const ONE_MEGABYTE = 1024 * 1024;
//     const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
//     const ONE_MINUTE = 60 * 1000;


//     async function execute() {

//         const containerName = "blob";
//         const blobName = ImgfileName + ".gif";
//         const content = Image;
//         const localFilePath = "C:/Users/Buzzebees/Pictures/download.jpg";

//         const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
//         const pipeline = StorageURL.newPipeline(credentials);
//         const serviceURL = new ServiceURL('https://iamge.blob.core.windows.net', pipeline);

//         const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
//         const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);

//         const aborter = Aborter.timeout(30 * ONE_MINUTE);

//         var blobSvc = storage.createBlobService(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);


//         var rawdata = content;
//         var matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
//         var type = matches[1];
//         var buffer = new Buffer(matches[2], 'base64');

//         blobSvc.createBlockBlobFromText(containerName, ImgfileName, buffer, { contentType: type }, function(error, result, response) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 console.log(result)
//             }
//         });


//         // console.log("Containers:");
//         // await showContainerNames(aborter, serviceURL);

//         // await containerURL.create(aborter);
//         // console.log(`Container: "${containerName}" is created`);

//         // await blockBlobURL.upload(aborter, content, content.length);
//         // console.log(`Blob "${blobName}" is uploaded`);

//         // await uploadLocalFile(aborter, containerURL, localFilePath);
//         // console.log(`Local file "${localFilePath}" is uploaded`);

//         // await uploadStream(aborter, containerURL, localFilePath);
//         // console.log(`Local file "${localFilePath}" is uploaded as a stream`);

//         // console.log(`Blobs in "${containerName}" container:`);
//         // await showBlobNames(aborter, containerURL);

//         // const downloadResponse = await blockBlobURL.download(aborter, 0);
//         // const downloadedContent = downloadResponse.readableStreamBody.read(content.length).toString();
//         // console.log(`Downloaded blob content: "${downloadedContent}"`);

//         // await blockBlobURL.delete(aborter)
//         // console.log(`Block blob "${blobName}" is deleted`);

//         // await containerURL.delete(aborter);
//         // console.log(`Container "${containerName}" is deleted`);
//     }
//     try {
//         execute().then(() => console.log("Done")).catch((e) => console.log(e));
//     } catch (error) {
//         console.log(error);
//     }




// }



// var http = require('http')
var port = process.env.PORT;
// var port = process.env.PORT || 1337;
// http.createServer(function(req, res) {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('Hello World\n');
// }).listen(port);



app.listen(port, function() {
    console.log('Server is running..');
});