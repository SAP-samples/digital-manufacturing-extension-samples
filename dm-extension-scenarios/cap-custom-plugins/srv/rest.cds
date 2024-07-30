service RemoteRestService {

    function getOrders(Plant: String, fromDate: DateTime, toDate: DateTime) returns array of {

        PLANT: String;
        MFG_ORDER: String;
        MATERIAL: String;
        SCHEDULED_START: DateTime;
        ACTUAL_START: DateTime;

    };

}