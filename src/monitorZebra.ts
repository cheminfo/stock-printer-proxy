import superagent from 'superagent';

import fastify from './fastify';
import { getPrinterDocs, getPrintServersByMacAddress } from './roc/printers';
import roc from './roc/roc';
import { parsePrinterResponse, PrinterParserResult } from './util';
import {
    PrinterDocumentContent,
    PrintServerDocumentContent,
} from './util/printer';

const interval = 60000 * 5; // Every 5 minute
const failInterval = 60000; // Every 1 minute if it fails

export async function startMonitoring() {
    try {
        await updateStatus();
        setTimeout(() => {
            void startMonitoring();
        }, interval);
    } catch (e) {
        fastify.log.error(e, 'Error while updating zebra printer status');
        setTimeout(() => {
            void startMonitoring();
        }, failInterval);
    }
}

async function updateStatus() {
    let printers = await getPrinterDocs();
    printers = printers.filter(
        (printer) => printer.$content.kind === 'zebra' && printer.$content.ip,
    );

    for (let printer of printers) {
        const data = printer.$content;
        const printerCheck = await checkPrinter(data);
        await updatePrinterServer(data, printerCheck);
    }
}

async function checkPrinter(
    printer: PrinterDocumentContent,
): Promise<PrinterParserResult | null> {
    try {
        const res = await superagent.get(`http://${printer.ip}`).timeout({
            response: 10000,
            deadline: 20000,
        });

        return parsePrinterResponse(res.text);
    } catch (e) {
        fastify.log.error(e, 'Error while checking printer');
        return null;
    }
}

async function updatePrinterServer(
    printer: PrinterDocumentContent,
    printerCheck: PrinterParserResult | null,
) {
    try {
        const data = await getPrintServersByMacAddress(printer.macAddress);
        let comment: string | undefined;
        if (printerCheck) {
            if (printerCheck.serialNumber !== printer.macAddress) {
                if (printerCheck.serialNumber) {
                    comment = `found non-matching printer with id ${printerCheck.serialNumber}`;
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
            // printerCheck === null means something when wrong before even parsing the response
            comment =
                'There was a problem while trying to reach the print server';
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
            isOnline: isOnline,
            kind: 'zebra',
            comment,
        };
        if (!data.length) {
            return await roc.create({
                $id: null,
                $kind: 'printServer',
                $content: content,
                $owners: ['printerAdmin'],
            });
        } else {
            const document = roc.getDocument(data[0]._id);
            return await document.update(content);
        }
    } catch (error) {
        fastify.log.error(error);
    }
}
