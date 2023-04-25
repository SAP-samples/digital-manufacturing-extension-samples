const express = require('express');
const xsenv = require('@sap/xsenv');
const xssec = require('@sap/xssec');
const passport = require('passport');
const bodyParser = require('body-parser');
const JWTStrategy = require('@sap/xssec').JWTStrategy;
const core = require('@sap-cloud-sdk/core');
const { retrieveJwt } = require('@sap-cloud-sdk/core');

const port = process.env.PORT || 5001;

const app = express();
app.disable("x-powered-by");

//Requirements
const lib = require('./library');

xsenv.loadEnv();
const services = xsenv.getServices({
    alm: { label: 'auditlog-management' }
});

passport.use(new JWTStrategy(xsenv.getServices({ xsuaa: { tag: 'xsuaa' } }).xsuaa));

app.use(passport.initialize());

app.use(bodyParser.json());

app.get("/health", function (req, res) {
    res.status(200).json({ "Status": "UP" });
});

app.get('/', function (req, res) {
    res.status(200).json({ "Status": "UP" });
});

app.get('/ui/jwt', function (req, res) {
    res.json({
        userInfo: req.user,
        authInfo: req.authInfo
    });
});


// subscribe/onboard a subscriber tenant
app.put('/callback/v1.0/tenants/*', function (req, res) {
    let tenantHost = req.body.subscribedSubdomain + '-' + appEnv.app.space_name.toLowerCase().replace(/_/g, '-') + '-' + services.registry.appName.toLowerCase().replace(/_/g, '-');
    let tenantURL = 'https:\/\/' + tenantHost + /\.(.*)/gm.exec(appEnv.app.application_uris[0])[0];
    console.log('Subscribe: ', req.body.subscribedSubdomain, req.body.subscribedTenantId, tenantHost, tenantURL);
    lib.createRoute(tenantHost, services.registry.appName).then(
        function (result) {
            res.status(200).send(tenantURL);
        },
        function (err) {
            console.log(err.stack);
            res.status(500).send(err.message);
        });
});

// unsubscribe/offboard a subscriber tenant
app.delete('/callback/v1.0/tenants/*', function (req, res) {
    let tenantHost = req.body.subscribedSubdomain + '-' + appEnv.app.space_name.toLowerCase().replace(/_/g, '-') + '-' + services.registry.appName.toLowerCase().replace(/_/g, '-');
    console.log('Unsubscribe: ', req.body.subscribedSubdomain, req.body.subscribedTenantId, tenantHost);
    lib.deleteRoute(tenantHost, services.registry.appName).then(
        function (result) {
            res.status(200).send('');
        },
        function (err) {
            console.log(err.stack);
            res.status(500).send(err.message);
        });
});

// get reuse service dependencies
app.get('/callback/v1.0/dependencies', function (req, res) {
    let tenantId = req.params.tenantId;
    let dependencies = [{
        'xsappname': services.dest.xsappname
    }];
    console.log('Dependencies: ', tenantId, dependencies);
    res.status(200).json(dependencies);
});

// app user info
app.get('/srv/info', function (req, res) {
    if (req.authInfo.checkScope('$XSAPPNAME.User')) {
        let info = {
            'userInfo': req.user,
            'subdomain': req.authInfo.getSubdomain(),
            'tenantId': req.authInfo.getZoneId()
        };
        res.status(200).json(info);
    } else {
        res.status(403).send('Forbidden');
    }
});

// app subscriptions
app.get('/srv/subscriptions', function (req, res) {
    if (req.authInfo.checkScope('$XSAPPNAME.Administrator')) {
        lib.getSubscriptions(services.registry).then(
            function (result) {
                res.status(200).json(result);
            },
            function (err) {
                console.log(err.stack);
                res.status(500).send(err.message);
            });
    } else {
        res.status(403).send('Forbidden');
    }
});


// destination reuse service
app.get('/srv/destinations', async function (req, res) {
    if (req.authInfo.checkScope('$XSAPPNAME.User')) {
        try {
            let res1 = await core.executeHttpRequest(
                {
                    destinationName: req.query.destination,
                    jwt: retrieveJwt(req)
                },
                {
                    method: 'GET',
                    url: req.query.path || '/'
                }
            );
            res.status(200).json(res1.data);
        } catch (err) {
            console.log(err.stack);
            res.status(500).send(err.message);
        }
    } else {
        res.status(403).send('Forbidden');
    }
});

app.get('/auditlogs/v1/saas/dependencies', function (req, res) {
    if (!req.authInfo.checkLocalScope("Callback")) {
        return next(create403());
    }

    console.log("req.url: " + req.baseUrl);
    console.log("servicesConfig: " + JSON.stringify(services));

    let dependencies = [{
        "xsappname": services.alm.uaa.xsappname,
        "serviceLabel": "auditlog-management",
        "serviceInstanceName": "auditlog-management"
    }];

    console.log("dependencies: " + dependencies);
    res.status(200).json(dependencies);
});

// audit logs
app.get('/dme/advauditapp-ms/getaudits', function (req, res) {
    let timeFrom = req.query.time_from;
    let timeTo = req.query.time_to;
    let handle = req.query.handle;

    var mParams = {
        timeFrom: timeFrom,
        timeTo: timeTo,
        handle: handle
    };

    //Perform call via auditlog API using retrieved credentials
    lib.getAuditLog(services.alm, mParams).then(
        function (result) {
            res.set('paging', result[0]);         //push header-paging
            res.status(200).json(result[1]);      //push body
//            res.status(200).json(result);
        },
        function (err) {
            console.log(err.stack);
            res.status(500).send(err.message);
        });
});

app.listen(port, function () {
    console.info('Listening on http://localhost:' + port);
});
