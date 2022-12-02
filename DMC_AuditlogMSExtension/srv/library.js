module.exports = {
    getAuditLog: getAuditLog,
    getSubscriptions: getSubscriptions,
    createRoute: createRoute,
    deleteRoute: deleteRoute
};

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();

const core = require('@sap-cloud-sdk/core');

const axios = require('axios');
const qs = require('qs');

async function getAuditLog(alm, mParams) {
    try {
        const options1 = {
            method: 'POST',
            url: alm.uaa.url + '/oauth/token',
            params: { "grant_type": "client_credentials" },
            headers: {
                Authorization: 'Basic ' + Buffer.from(alm.uaa.clientid + ':' + alm.uaa.clientsecret).toString('base64')
            }
        };
        const res1 = await axios(options1);

        console.log("XSUAA Bearer Token: " + res1.data.access_token);

        try {
            const options2 = {
                method: 'GET',
                url: alm.url + '/auditlog/v2/auditlogrecords',
                params: {
                    "time_from": mParams.timeFrom,
                    "time_to": mParams.timeTo,
                    "handle": mParams.handle
                },
                headers: {
                    Authorization: 'Bearer ' + res1.data.access_token
                }
            };
            const res2 = await axios(options2);
            const auditlogs = res2.data;
            const filteredLogs = [];

            //Return only audit.configuration messages
            auditlogs.forEach(element => {
                if (element.category === 'audit.configuration') {
                    filteredLogs.push(element);
                }
            });
            // return filteredLogs;
            // Return paging & filtered logs
            const result = [];
            result.push(res2.headers['paging']);
            result.push(filteredLogs);
            return result;
//
        } catch (err) {
            console.log(err.stack);
            return err.message;
        }
    } catch (err) {
        console.log(err.stack);
        return err.message;
    }
};

async function getSubscriptions(registry) {
    try {
        // get access token
        let options = {
            method: 'POST',
            url: registry.url + '/oauth/token?grant_type=client_credentials&response_type=token',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(registry.clientid + ':' + registry.clientsecret).toString('base64')
            }
        };
        let res = await axios(options);
        try {
            // get subscriptions
            let options1 = {
                method: 'GET',
                url: registry.saas_registry_url + '/saas-manager/v1/application/subscriptions',
                headers: {
                    'Authorization': 'Bearer ' + res.data.access_token
                }
            };
            let res1 = await axios(options1);
            return res1.data;
        } catch (err) {
            console.log(err.stack);
            return err.message;
        }
    } catch (err) {
        console.log(err.stack);
        return err.message;
    }
};

async function getCFInfo(appname) {
    try {
        // get app GUID
        let res1 = await core.executeHttpRequest({ destinationName: 'app-cfapi' }, {
            method: 'GET',
            url: '/v3/apps?organization_guids=' + appEnv.app.organization_id + '&space_guids=' + appEnv.app.space_id + '&names=' + appname
        });
        // get domain GUID
        let res2 = await core.executeHttpRequest({ destinationName: 'app-cfapi' }, {
            method: 'GET',
            url: '/v3/domains?names=' + /\.(.*)/gm.exec(appEnv.app.application_uris[0])[1]
        });
        let results = {
            'app_id': res1.data.resources[0].guid,
            'domain_id': res2.data.resources[0].guid
        };
        return results;
    } catch (err) {
        console.log(err.stack);
        return err.message;
    }
};

async function createRoute(tenantHost, appname) {
    getCFInfo(appname).then(
        async function (CFInfo) {
            try {
                // create route
                let res1 = await core.executeHttpRequest({ destinationName: 'app-cfapi' }, {
                    method: 'POST',
                    url: '/v3/routes',
                    data: {
                        'host': tenantHost,
                        'relationships': {
                            'space': {
                                'data': {
                                    'guid': appEnv.app.space_id
                                }
                            },
                            'domain': {
                                'data': {
                                    'guid': CFInfo.domain_id
                                }
                            }
                        }
                    },
                });
                // map route to app
                let res2 = await core.executeHttpRequest({ destinationName: 'app-cfapi' }, {
                    method: 'POST',
                    url: '/v3/routes/' + res1.data.guid + '/destinations',
                    data: {
                        'destinations': [{
                            'app': {
                                'guid': CFInfo.app_id
                            }
                        }]
                    },
                });
                console.log('Route created for ' + tenantHost);
                return res2.data;
            } catch (err) {
                console.log(err.stack);
                return err.message;
            }
        },
        function (err) {
            console.log(err.stack);
            return err.message;
        });
};

async function deleteRoute(tenantHost, appname) {
    getCFInfo(appname).then(
        async function (CFInfo) {
            try {
                // get route id
                let res1 = await core.executeHttpRequest({ destinationName: 'app-cfapi' }, {
                    method: 'GET',
                    url: '/v3/apps/' + CFInfo.app_id + '/routes?hosts=' + tenantHost
                });
                if (res1.data.pagination.total_results === 1) {
                    try {
                        // delete route
                        let res2 = await core.executeHttpRequest({ destinationName: 'app-cfapi' }, {
                            method: 'DELETE',
                            url: '/v3/routes/' + res1.data.resources[0].guid
                        });
                        console.log('Route deleted for ' + tenantHost);
                        return res2.data;
                    } catch (err) {
                        console.log(err.stack);
                        return err.message;
                    }
                } else {
                    let errmsg = { 'error': 'Route not found' };
                    console.log(errmsg);
                    return errmsg;
                }
            } catch (err) {
                console.log(err.stack);
                return err.message;
            }
        },
        function (err) {
            console.log(err.stack);
            return err.message;
        });
};
