import { Roc } from 'rest-on-couch-client';

import constants from '../constants';

const roc = new Roc({
    url: constants.url,
    database: constants.database,
    accessToken: constants.accessToken,
});

export default roc;
