import assert from 'node:assert';

import { getFastify } from './fastify.ts';
import { getPrintServersByMacAddress, getPrinterDocs } from './roc/printers.ts';
import roc from './roc/roc.ts';
import type {
    PrintServerDocumentContent,
    PrinterDocumentContent,
} from './util/printer.ts';
import type { PrinterParserResult } from './util.ts';
import { parsePrinterResponse } from './util.ts';

const interval = 60000 * 5; // Every 5 minute
const failInterval = 60000; // Every 1 minute if it fails

export async function startMonitoring() {
    let timeout: NodeJS.Timeout;
    const fastify = await getFastify();
    try {
        await updateStatus();
        timeout = setTimeout(() => {
            void startMonitoring();
        }, interval);
    } catch (e) {
        fastify.log.error(e, 'Error while updating zebra printer status');
        timeout = setTimeout(() => {
            void startMonitoring();
        }, failInterval);
    }
    return () => {
        if (timeout) {
            clearTimeout(timeout);
        }
    };
}

async function updateStatus() {
    let printers = await getPrinterDocs();
    printers = printers.filter(
        (printer) => printer.$content.kind === 'zebra' && printer.$content.ip,
    );

    for (const printer of printers) {
        const data = printer.$content;
        // eslint-disable-next-line no-await-in-loop
        const printerCheck = await checkPrinter(data);
        // eslint-disable-next-line no-await-in-loop
        await updatePrinterServer(data, printerCheck);
    }
}

async function checkPrinter(
    printer: PrinterDocumentContent,
): Promise<PrinterParserResult | null> {
    const fastify = await getFastify();
    try {
        const res = await fetch(`http://${printer.ip}`, {
            method: 'GET',
            headers: {
                'Accept-Language': 'en-US',
            },
            signal: AbortSignal.timeout(20000),
        });

        const text = await res.text();

        return parsePrinterResponse(text);
    } catch (e) {
        fastify.log.error(e, 'Error while checking printer');
        return null;
    }
}

async function updatePrinterServer(
    printer: PrinterDocumentContent,
    printerCheck: PrinterParserResult | null,
) {
    const fastify = await getFastify();
    try {
        if (!printer.macAddress) {
            fastify.log.info('Not updating for printer without macAddress');
            return;
        }
        const data = await getPrintServersByMacAddress(printer.macAddress);
        const comments: string[] = [];
        if (printerCheck) {
            if (printerCheck.paused) {
                comments.push('printer is paused');
            }
            if (printerCheck.serialNumber !== printer.macAddress) {
                if (printerCheck.serialNumber) {
                    comments.push(
                        `found non-matching printer with id ${printerCheck.serialNumber}`,
                    );
                }
                fastify.log.warn(
                    `expected printer to have id (macAddress) to ${
                        printer.macAddress
                    } but connected printer's id is ${
                        printerCheck.serialNumber === null
                            ? '[unable to parse]'
                            : printerCheck.serialNumber
                    }`,
                );
            }
        } else {
            // printerCheck === null means something went wrong before even parsing the response
            comments.push(
                'There was a problem while trying to reach the print server',
            );
        }

        const isOnline =
            (printerCheck &&
                printerCheck.serialNumber === printer.macAddress &&
                printerCheck.isOnline) ||
            false;
        const content: PrintServerDocumentContent = {
            macAddress: printer.macAddress,
            ip: printer.ip,
            version: 1,
            port: 80,
            protocol: 'http',
            url: `http://${printer.ip}`,
            isOnline,
            kind: 'zebra',
            comment: comments.join(', '),
        };
        if (!data.length) {
            await roc.create({
                $id: printer.macAddress,
                $kind: 'printServer',
                $content: content,
                $owners: ['printerAdmin'],
            });
        } else {
            assert(data[0]);
            const document = roc.getDocument(data[0]._id);
            await document.update(content);
        }
    } catch (error) {
        fastify.log.error(error);
    }
}
