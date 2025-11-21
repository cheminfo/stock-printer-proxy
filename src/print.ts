import { connect } from 'net';

import constants from './constants.ts';

export function print(
    printer: {
        ip: string;
    },
    data: string,
) {
    if (constants.protocol === 'tcp') {
        return printTcp(printer.ip, data);
    } else {
        return printHttp(`http://${printer.ip}`, data);
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

async function printHttp(url: string, data: string) {
    const printUrl = `${url}/pstprnt`;
    const res = await fetch(printUrl, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Length': String(data.length),
        },
        signal: AbortSignal.timeout(30000), // 30 seconds
    });
    if (!res.ok) {
        throw new Error(`HTTP print request failed with status ${res.status}`);
    }
}
