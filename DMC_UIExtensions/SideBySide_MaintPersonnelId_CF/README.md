To deploy the application to SAP Cloud Platform Cloud Foundry Environment, execute the following command:
```
cf push --random-route
```

To Test the deployed application, find the URL and test the following methods

```
GET <APP_URL>/users
```
```
GET <APP_URL>/users/<userId>
```
```
POST <APP_URL>/users
```