# stock-printer-proxy

- Server to launch print commands
- Monitors printers on printers configured in rest-on-couch database
- Sends printer status to rest-on-couch printer database

## Env variables

Those env variables must be defined:

- REST_ON_COUCH_URL
- REST_ON_COUCH_DATABASE
- REST_ON_COUCH_USERNAME
- REST_ON_COUCH_PASSWORD
- SERVER_PORT
- PRINTER_PROTOCOL - can be http or tcp
