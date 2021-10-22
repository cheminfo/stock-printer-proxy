import { connect } from 'net';

import superagent from 'superagent';

import constants from './constants';
import { PrintServerDocumentContent } from './util/printer';

export function print(printer: PrintServerDocumentContent, data: string) {
    if (constants.protocol === 'tcp') {
        return printTcp(printer.ip, data);
    } else {
        return printHttp(printer.url, data);
    }
}

function printTcp(address: string, data: string) {
    return new Promise((resolve, reject) => {
        const socket = connect(9100, address.split(':')[0], () => {
            socket.end(data, () => resolve(undefined));
        });
        socket.on('error', reject);
    });
}

function printHttp(url: string, data: string) {
    const printUrl = `${url}/pstprnt`;
    return superagent
        .post(printUrl)
        .timeout({
            response: 10000,
            deadline: 30000,
        })
        .send(data)
        .set('Content-Length', String(data.length));
}
