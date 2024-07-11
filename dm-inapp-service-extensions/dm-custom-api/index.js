const logging = require('@sap/logging');

const express = require( 'express');
const app = express();

const xsenv = require('@sap/xsenv');
const services = xsenv.getServices({ uaa: { tag: "xsuaa" } });
const credentials = services.uaa;

const passport = require('passport');
const { XssecPassportStrategy, XsuaaService } = require("@sap/xssec");
const authService = new XsuaaService(credentials) // or: IdentityService, XsaService, UaaService ...
console.log( `Found UAA service credentials for client: ${services.uaa.clientid}` )
passport.use(new XssecPassportStrategy(authService));
app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));


const SapCfAxios = require('sap-cf-axios').default;
const axios = SapCfAxios("SAP_DMC_DEFAULT_SERVICE_KEY");

const appContext = logging.createAppContext();

app.use(logging.middleware({ appContext: appContext, logNetwork: true }));
app.use(express.json());

app.listen(process.env.PORT || 4000)

app.get( '/', function ( req, res) {
    res.send('Hello World');
});

app.get('/reasoncodes', function(req,res){
    axios({
        method: 'GET',
        url: '/dmci/v1/extractor/ReasonCode?$format=json&$top=3',
        headers: {
            "content-type": "application/json"
        }
    }).then(function(response){
        // console.log(response.toString())
        res.send(response.data);
    }).catch(function (error) {
        console.log(error);
    });
})


