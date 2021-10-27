
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
    server: "kymasql-service",
    database: "BootcampDB"
};

//GET all user info API
app.get('/api/v1/users', function (req, res) {
    // connect to the database
    sql.connect(dbConfig, function (err) {
    
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query('select * from Users', function (err, recordset) {
            
            if (err) console.log(err)
            // send records as a response
            res.send(recordset);
            
        });
    });
});

//GET user info API
app.get(`/api/v1/user/:id`, function (req, res) {
    var userId = req.params.id;
    // connect to the database
    sql.connect(dbConfig, function (err) {
    
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query(`select * from Users where userId= '${userId}'`, function (err, recordset) {
            
            if (err) console.log(err)
            // send records as a response
            res.send(recordset.recordset[0]);
            
        });
    });
});

//add API
app.post('/api/v1/user/add', function (req, res) {
    var userId = req.body.userId;
    var description = req.body.description;
    var personalId = req.body.personalId;

    // connect to the database
    sql.connect(dbConfig, function (err) {
    
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query(`INSERT INTO Users (userId, description, personalId) values('${userId}', '${description}', '${personalId}')`, function(err, result){
            console.log(err)
            res.send({'error': err, 'result':result})
        });
    });
});

//update API
app.post('/api/v1/user/update', function (req, res) {
    var userId = req.body.userId;
    var description = req.body.description;
    var personalId = req.body.personalId;

    // connect to the database
    sql.connect(dbConfig, function (err) {
    
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query(`UPDATE Users SET description='${description}', personalId='${personalId}' WHERE  userId='${userId}'`, function(err, result){
            console.log(err)
            res.send({'error': err, 'result':result})
        });
    });
});


//update API
app.post('/api/v1/user/delete/:userId', function (req, res) {
    var userId = req.params.userId;

    // connect to the database
    sql.connect(dbConfig, function (err) {
    
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query(`delete from Users WHERE  userId='${userId}'`, function(err, result){
            console.log(err)
            res.send({'error': err, 'result':result})
        });
    });
});


app.get('/api/v1/sfc', function(req, res, next){
    var user = req.query.userId;
    var sfc = req.query.sfc;
    var personnelId;
    var varianceReasonCode;
    sql.connect(dbConfig, function (err) {
    
        if (err) console.log(err);
        var request = new sql.Request();
        console.log(`select personnelId from Users where userId='${user}'`);
  
        console.log(`select varianceReasonCode from VarianceReasonCodes where sfc='${sfc}'`);
        request.query(`select varianceReasonCode, personnelId from VarianceReasonCodes where sfc='${sfc}'`, function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            if ( recordset.recordset.length > 0 ){
                varianceReasonCode = recordset.recordset[0].varianceReasonCode;
                personnelId = recordset.recordset[0].personnelId;
            }
                
            console.log({'Personnel': personnelId,  'VarianceReasonCode': varianceReasonCode})
            res.send({'Personnel': personnelId,  'VarianceReasonCode': varianceReasonCode});
        });
        
    });
});

app.post('/api/v1/sfc', function(req, res, next){
    var sfc = req.body.sfc;
    var code = req.body.varianceReasonCode;
    var personnelId = req.body.personnelId;   
    sql.connect(dbConfig, function (err) {
    
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        request.query(`INSERT INTO VarianceReasonCodes values('${sfc}', '${code}', '${personnelId}')`, function(err, result){
            console.log(err)
            res.send({'error': err, 'result':result})
        });
        
    });
});
