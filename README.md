# stock-printer-proxy

-   Server to launch print commands
-   Monitors printers on printers configured in rest-on-couch database
-   Sends printer status to rest-on-couch printer database
-   Authentication to rest-on-couch uses an [access token](https://github.com/cheminfo/rest-on-couch/blob/main/API.md#tokens)

## Env variables

Those env variables must be defined:

-   REST_ON_COUCH_URL
-   REST_ON_COUCH_DATABASE
-   REST_ON_COUCH_ACCESS_TOKEN
-   SERVER_PORT
-   PRINTER_PROTOCOL - can be http or tcp
