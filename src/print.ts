import { connect } from 'net';
import { request } from 'node:http';

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
        return printHttp(printer.ip, data);
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

async function printHttp(hostname: string, data: string) {
    return new Promise((resolve, reject) => {
        const req = request(
            {
                hostname,
                port: 80,
                path: '/pstprnt',
                method: 'POST',
                headers: {
                    'Content-Length': String(data.length),
                },
                signal: AbortSignal.timeout(30000), // 30s timeout
            },
            (res) => {
                if (res.statusCode !== 200) {
                    reject(
                        new Error(
                            `HTTP print request failed with status ${res.statusCode}`,
                        ),
                    );
                } else {
                    resolve(res);
                }
            },
        );

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}
