
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var cors = require('cors');
var app = express(); 
 
// Body Parser Middleware
app.use(bodyParser.json()); 
app.use(cors());
 
//Setting up server
 var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });

//Initializing connection string
var dbConfig = {
    user:  "sa",
    password: "DMC_Bootcamp123",
    server: "localhost",
    database: "BootcampDB"
};

var finalresult = {};
const fail_Number = 3;

app.get('/api/v1/listAll', async function(req, res) {

    try {
        console.log ("Enter SELECT function");
        // connect to the database
        let pool = await sql.connect(dbConfig);
        console.log ("SELECT function DB connected"); 
        let query = "SELECT * FROM DCs";
        console.log ("SELECT QUERY: " + query);
        let result = await pool.request().query(query);
        console.log("SELECT function Result:" + JSON.stringify(result));

        res.send(result.recordset);
        
    } catch (err) {
        console.log (err);
    }

});

//POST API
app.post('/api/v1/dcs',async function (req, res) {
    
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
        // connect to the database
        let pool = await sql.connect(dbConfig);
        console.log ("INSERT function DB connected"); 
        let query = "INSERT INTO DCs (SFC, TorqueLeftValue, TorqueLeftLowerValue, TorqueLeftUpperValue, TorqueRightValue, TorqueRightLowerValue, TorqueRightUpperValue, Evaluation, Count) VALUES(\'" + req.body.SFC + "\', " + req.body.TorqueLeftValue + ", " + req.body.TorqueLeftLowerValue + ", " + req.body.TorqueLeftUpperValue + ", " + req.body.TorqueRightValue + ", " + req.body.TorqueRightLowerValue + ", " + req.body.TorqueRightUpperValue + ", " + finalresult.evaluationCurrent + ", " + fail_count +")";
        console.log ("INSERT QUERY: " + query);
        let result = await pool.request().query(query);
        console.log("INSERT function Result:" + JSON.stringify(result));
        
    } catch (err) {
        console.log (err);
    }

//    sql.close();

    res.send(finalresult);
});

sql.on('error', err => {
    // ... error handler
    console.log (err);
})

async function getFailCount(sfc) {

    try {
        let fail_count;
        console.log ("getFailCount function: Entered");
        // connect to the database
        let pool = await sql.connect(dbConfig);
        console.log ("getFailCount function: DB connected");
        if (finalresult.evaluationCurrent == 0) {
            let result = await pool.request().query("select top 1 Evaluation, Count from DCs where SFC = '" + sfc + "' order by RowID DESC")
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
