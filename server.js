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

    // var uniqueImageGEN = uniqueImage(req.body.FileName);
    // var urlImage = insertImageBlob(uniqueImageGEN, req.body.Image);

    setTimeout(() => {

        var sql = SqlString.format('INSERT INTO [dbo].[UserDetail]([CustomerID],[TransactionID],[TitleName],[FirstName],[LastName],[Clinicname],[Customername],[Operatorname],[Address],[Latitude],[Longitude],[Status],[FileType],[FileName],[ImageUrl],[Image]) ' +
            'VALUES (N?,N?,N?,N?,N?,N?,N?,N?,N?,N?,N?,N?,N?,N?,N?,?)', ['', '', '', '', '', req.body.Clinicname, req.body.Customername, req.body.Operatorname, req.body.Address, req.body.Latitude, req.body.Longitude, req.body.Status, req.body.FileType, req.body.FileName, bloburl + uniqueImageGEN, req.body.FileName]);

        console.log(sql);
        request.query(sql, function(err, result) {
            if (err)
                return next(err);
            var data = {};
            data["user"] = result.recordset;
            res.send(data);
            next();

        });

    }, 4500);


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

// var http = require('http')
var port = process.env.PORT || 1337;
// http.createServer(function(req, res) {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('Hello World\n');
// }).listen(port);


app.listen(port, function() {
    console.log('Server is running..');
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
function insertImageBlob(ImgfileName, Image) {
    const storage = require('azure-storage');



    const {
        Aborter,
        BlockBlobURL,
        ContainerURL,
        ServiceURL,
        SharedKeyCredential,
        StorageURL,
        uploadStreamToBlockBlob,
        uploadFileToBlockBlob
    } = require('@azure/storage-blob');

    const fs = require("fs");
    const path = require("path");

    if (process.env.NODE_ENV !== "production") {
        require("dotenv").config();
    }

    const STORAGE_ACCOUNT_NAME = "iamge";
    const ACCOUNT_ACCESS_KEY = "LuggCBkGfnr2o8rgcToXFGbip69nkh9Fec6wJbwZhSd0f7wLuCAjdPWXf/F7WfJFsZhN2lNSVKHHFT8OfkqT9Q==";

    const ONE_MEGABYTE = 1024 * 1024;
    const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
    const ONE_MINUTE = 60 * 1000;

    async function showContainerNames(aborter, serviceURL) {

        let response;
        let marker;

        do {
            response = await serviceURL.listContainersSegment(aborter, marker);
            marker = response.marker;
            for (let container of response.containerItems) {
                console.log(` - ${ container.name }`);
            }
        } while (marker);
    }

    async function uploadLocalFile(aborter, containerURL, filePath) {

        filePath = path.resolve(filePath);

        const fileName = path.basename(filePath);
        const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

        return await uploadFileToBlockBlob(aborter, filePath, blockBlobURL);
    }

    async function uploadStream(aborter, containerURL, filePath) {

        filePath = path.resolve(filePath);

        const fileName = path.basename(filePath).replace('.md', '-stream.md');
        const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

        const stream = fs.createReadStream(filePath, {
            highWaterMark: FOUR_MEGABYTES,
        });

        const uploadOptions = {
            bufferSize: FOUR_MEGABYTES,
            maxBuffers: 5,
        };

        return await uploadStreamToBlockBlob(
            aborter,
            stream,
            blockBlobURL,
            uploadOptions.bufferSize,
            uploadOptions.maxBuffers);
    }

    async function showBlobNames(aborter, containerURL) {

        let response;
        let marker;

        do {
            response = await containerURL.listBlobFlatSegment(aborter);
            marker = response.marker;
            for (let blob of response.segment.blobItems) {
                console.log(` - ${ blob.name }`);
            }
        } while (marker);
    }

    async function execute() {
        const containerName = "blob";
        const blobName = ImgfileName + ".gif";
        const content = Image;
        const localFilePath = "C:/Users/Buzzebees/Pictures/download.jpg";

        const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
        const pipeline = StorageURL.newPipeline(credentials);
        const serviceURL = new ServiceURL('https://iamge.blob.core.windows.net', pipeline);

        const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
        const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);

        const aborter = Aborter.timeout(30 * ONE_MINUTE);

        var blobSvc = storage.createBlobService(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);


        var rawdata = content;
        var matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        var type = matches[1];
        var buffer = new Buffer(matches[2], 'base64');

        blobSvc.createBlockBlobFromText(containerName, ImgfileName, buffer, { contentType: type }, function(error, result, response) {
            if (error) {
                console.log(error);
            } else {
                console.log(result)
            }
        });


        // console.log("Containers:");
        // await showContainerNames(aborter, serviceURL);

        // await containerURL.create(aborter);
        // console.log(`Container: "${containerName}" is created`);

        // await blockBlobURL.upload(aborter, content, content.length);
        // console.log(`Blob "${blobName}" is uploaded`);

        // await uploadLocalFile(aborter, containerURL, localFilePath);
        // console.log(`Local file "${localFilePath}" is uploaded`);

        // await uploadStream(aborter, containerURL, localFilePath);
        // console.log(`Local file "${localFilePath}" is uploaded as a stream`);

        // console.log(`Blobs in "${containerName}" container:`);
        // await showBlobNames(aborter, containerURL);

        // const downloadResponse = await blockBlobURL.download(aborter, 0);
        // const downloadedContent = downloadResponse.readableStreamBody.read(content.length).toString();
        // console.log(`Downloaded blob content: "${downloadedContent}"`);

        // await blockBlobURL.delete(aborter)
        // console.log(`Block blob "${blobName}" is deleted`);

        // await containerURL.delete(aborter);
        // console.log(`Container "${containerName}" is deleted`);
    }

    execute().then(() => console.log("Done")).catch((e) => console.log(e));
    return 'Image';
}