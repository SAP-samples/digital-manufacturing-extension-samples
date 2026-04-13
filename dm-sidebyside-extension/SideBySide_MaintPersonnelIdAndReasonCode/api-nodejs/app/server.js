
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var cors = require('cors');
var app = express();

app.disable('x-powered-by');

// Body Parser Middleware
app.use(bodyParser.json());

const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : 'http://localhost:8080',
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

//Setting up server
 var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });

//Initializing connection string from environment variables
if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
    throw new Error('DB_USER and DB_PASSWORD environment variables are required');
}

var dbConfig = {
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server:   process.env.DB_SERVER   || 'kymasql-service',
    database: process.env.DB_NAME     || 'BootcampDB'
};

//GET all user info API
app.get('/api/v1/users', function (req, res) {
    sql.connect(dbConfig, function (err) {

        if (err) { console.log(err); res.status(500).send({ error: 'Internal server error' }); return; }
        var request = new sql.Request();

        request.query('select * from Users', function (err, recordset) {
            if (err) { console.log(err); res.status(500).send({ error: 'Internal server error' }); return; }
            res.send(recordset);
        });
    });
});

//GET user info API
app.get('/api/v1/user/:id', function (req, res) {
    var userId = req.params.id;
    sql.connect(dbConfig, function (err) {

        if (err) { console.log(err); res.status(500).send({ error: 'Internal server error' }); return; }
        var request = new sql.Request();

        request
            .input('userId', sql.NVarChar, userId)
            .query("select * from Users where userId = @userId", function (err, recordset) {
                if (err) { console.log(err); res.status(500).send({ error: 'Internal server error' }); return; }
                res.send(recordset.recordset[0]);
            });
    });
});

//add API
app.post('/api/v1/user/add', function (req, res) {
    var userId      = req.body.userId;
    var description = req.body.description;
    var personalId  = req.body.personalId;

    sql.connect(dbConfig, function (err) {

        if (err) { console.log(err); res.send({ 'error': err, 'result': null }); return; }
        var request = new sql.Request();

        request
            .input('userId',      sql.NVarChar, userId)
            .input('description', sql.NVarChar, description)
            .input('personalId',  sql.NVarChar, personalId)
            .query("INSERT INTO Users (userId, description, personalId) VALUES (@userId, @description, @personalId)", function (err, result) {
                console.log(err);
                res.send({ 'error': err, 'result': result });
            });
    });
});

//update API
app.post('/api/v1/user/update', function (req, res) {
    var userId      = req.body.userId;
    var description = req.body.description;
    var personalId  = req.body.personalId;

    sql.connect(dbConfig, function (err) {

        if (err) { console.log(err); res.send({ 'error': err, 'result': null }); return; }
        var request = new sql.Request();

        request
            .input('userId',      sql.NVarChar, userId)
            .input('description', sql.NVarChar, description)
            .input('personalId',  sql.NVarChar, personalId)
            .query("UPDATE Users SET description = @description, personalId = @personalId WHERE userId = @userId", function (err, result) {
                console.log(err);
                res.send({ 'error': err, 'result': result });
            });
    });
});

//delete API
app.post('/api/v1/user/delete/:userId', function (req, res) {
    var userId = req.params.userId;

    sql.connect(dbConfig, function (err) {

        if (err) { console.log(err); res.send({ 'error': err, 'result': null }); return; }
        var request = new sql.Request();

        request
            .input('userId', sql.NVarChar, userId)
            .query('DELETE FROM Users WHERE userId = @userId', function (err, result) {
                console.log(err);
                res.send({ 'error': err, 'result': result });
            });
    });
});


app.get('/api/v1/sfc', function (req, res, next) {
    var sfc = req.query.sfc;
    var personnelId;
    var varianceReasonCode;

    sql.connect(dbConfig, function (err) {

        if (err) { console.log(err); res.status(500).send({ error: 'Internal server error' }); return; }
        var request = new sql.Request();

        request
            .input('sfc', sql.NVarChar, sfc)
            .query('SELECT varianceReasonCode, personnelId FROM VarianceReasonCodes WHERE sfc = @sfc', function (err, recordset) {
                if (err) { console.log(err); res.status(500).send({ error: 'Internal server error' }); return; }
                console.log(recordset);
                if (recordset.recordset.length > 0) {
                    varianceReasonCode = recordset.recordset[0].varianceReasonCode;
                    personnelId        = recordset.recordset[0].personnelId;
                }

                console.log({ 'Personnel': personnelId, 'VarianceReasonCode': varianceReasonCode });
                res.send({ 'Personnel': personnelId, 'VarianceReasonCode': varianceReasonCode });
            });
    });
});

app.post('/api/v1/sfc', function (req, res, next) {
    var sfc        = req.body.sfc;
    var code       = req.body.varianceReasonCode;
    var personnelId = req.body.personnelId;

    sql.connect(dbConfig, function (err) {

        if (err) { console.log(err); res.send({ 'error': err, 'result': null }); return; }
        var request = new sql.Request();

        request
            .input('sfc',                sql.NVarChar, sfc)
            .input('varianceReasonCode', sql.NVarChar, code)
            .input('personnelId',        sql.NVarChar, personnelId)
            .query('INSERT INTO VarianceReasonCodes VALUES (@sfc, @varianceReasonCode, @personnelId)', function (err, result) {
                console.log(err);
                res.send({ 'error': err, 'result': result });
            });
    });
});
