
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var cors = require('cors');
var rateLimit = require('express-rate-limit');
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
    server:   process.env.DB_SERVER   || 'localhost',
    database: process.env.DB_NAME     || 'BootcampDB'
};

var finalresult = {};
const fail_Number = 3;

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});

app.get('/api/v1/listAll', apiLimiter, async function(req, res) {

    try {
        console.log ("Enter SELECT function");
        let pool = await sql.connect(dbConfig);
        console.log ("SELECT function DB connected");
        let result = await pool.request().query("SELECT * FROM DCs");
        console.log("SELECT function Result:" + JSON.stringify(result));

        res.send(result.recordset);

    } catch (err) {
        console.log (err);
        res.status(500).send({ error: 'Internal server error' });
    }

});

//POST API
app.post('/api/v1/dcs', apiLimiter, async function (req, res) {

    console.log("input params: %j", req.body);

    if (req.body.TorqueLeftValue >= req.body.TorqueLeftLowerValue && req.body.TorqueLeftUpperValue >= req.body.TorqueLeftValue && req.body.TorqueRightValue >= req.body.TorqueRightLowerValue &&  req.body.TorqueRightUpperValue >= req.body.TorqueRightValue) {
        finalresult.evaluationCurrent = 1;
    }
    else {
        finalresult.evaluationCurrent = 0;
    }

    console.log("EvaluationCurrent: " + finalresult.evaluationCurrent.toString());

    let fail_count = await getFailCount(req.body.SFC);

    if (fail_count >= fail_Number) {
        finalresult.evaluationHistory = 0;
    }
    else {
        finalresult.evaluationHistory = 1;
    }

    try {
        console.log ("Enter INSERT function");
        let pool = await sql.connect(dbConfig);
        console.log ("INSERT function DB connected");
        let result = await pool.request()
            .input('SFC',                 sql.NVarChar, req.body.SFC)
            .input('TorqueLeftValue',     sql.Float,    req.body.TorqueLeftValue)
            .input('TorqueLeftLowerValue',sql.Float,    req.body.TorqueLeftLowerValue)
            .input('TorqueLeftUpperValue',sql.Float,    req.body.TorqueLeftUpperValue)
            .input('TorqueRightValue',    sql.Float,    req.body.TorqueRightValue)
            .input('TorqueRightLowerValue',sql.Float,   req.body.TorqueRightLowerValue)
            .input('TorqueRightUpperValue',sql.Float,   req.body.TorqueRightUpperValue)
            .input('Evaluation',          sql.Int,      finalresult.evaluationCurrent)
            .input('Count',               sql.Int,      fail_count)
            .query('INSERT INTO DCs (SFC, TorqueLeftValue, TorqueLeftLowerValue, TorqueLeftUpperValue, TorqueRightValue, TorqueRightLowerValue, TorqueRightUpperValue, Evaluation, Count) VALUES (@SFC, @TorqueLeftValue, @TorqueLeftLowerValue, @TorqueLeftUpperValue, @TorqueRightValue, @TorqueRightLowerValue, @TorqueRightUpperValue, @Evaluation, @Count)');
        console.log("INSERT function Result:" + JSON.stringify(result));

    } catch (err) {
        console.log (err);
        res.status(500).send({ error: 'Internal server error' });
        return;
    }

    res.send(finalresult);
});

sql.on('error', err => {
    console.log (err);
})

async function getFailCount(sfc) {

    try {
        let fail_count;
        console.log ("getFailCount function: Entered");
        let pool = await sql.connect(dbConfig);
        console.log ("getFailCount function: DB connected");
        if (finalresult.evaluationCurrent == 0) {
            let result = await pool.request()
                .input('SFC', sql.NVarChar, sfc)
                .query('SELECT TOP 1 Evaluation, Count FROM DCs WHERE SFC = @SFC ORDER BY RowID DESC');
            console.log("getFailCount function: Result:" + JSON.stringify(result));
            if (result.recordset[0] && result.recordset[0].Evaluation == 0) {
                fail_count = result.recordset[0].Count + 1;
            }
            else {
                fail_count = 1;
            }
        }
        else {
            fail_count = 1;
        }
        console.log ("getFailCount function: Fail Count: " + fail_count);
        return fail_count;
    } catch (err) {
        console.log (err);
    }
}
