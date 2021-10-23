import {
    FormatDocument,
    FormatDocumentContent,
    PrintDataType,
    Printer,
    PrinterDocument,
    PrinterDocumentContent,
    PrintServerDocument,
    PrintServerDocumentContent,
} from '../util/printer';

import roc from './roc';

const MINUTE = 1000 * 60;

export function getPrintServer(id: string) {
    const doc = roc.getDocument<PrintServerDocumentContent>(id);
    return doc.fetch();
}

export function getPrinter(id: string) {
    const doc = roc.getDocument<PrinterDocumentContent>(id);
    return doc.fetch();
}

export function getPrintFormat(id: string) {
    const doc = roc.getDocument<FormatDocumentContent>(id);
    return doc.fetch();
}

export async function getPrinterDocs() {
    let printers = await roc.getView<string, PrinterDocument['$content']>(
        'entryByKind',
        {
            key: 'printer',
        },
    );

    // We only support zebra printers
    printers = printers.filter(
        (printer) => printer.$content.kind === 'zebra' && printer.$content.ip,
    );

    return printers;
}

export async function getFormatDocs() {
    const printFormats = await roc.getView<string, FormatDocument['$content']>(
        'entryByKind',
        {
            key: 'printFormat',
        },
    );

    printFormats.sort((a, b) => b?.$modificationDate - a.$modificationDate);
    return printFormats;
}

async function getPrinters() {
    let printerDocs = await getPrinterDocs();
    const formatDocs = await getFormatDocs();
    let printServerDocs = await roc.getView<
        string,
        PrintServerDocument['$content']
    >('entryByKind', {
        key: 'printServer',
    });

    printServerDocs = printServerDocs.filter(
        (ps) =>
            ps.$content.isOnline !== false &&
            Date.now() - ps.$modificationDate < 10 * MINUTE,
    );
    printerDocs = printerDocs.filter((p) =>
        printServerDocs.some(
            (ps) => ps.$content.macAddress === p.$content.macAddress,
        ),
    );
    return printerDocs.map((p) => new Printer(p, formatDocs));
}

export async function getPrintServersByMacAddress(macAddress: string) {
    return roc.getView<string, PrintServerDocumentContent>(
        'printServerByMacAddress',
        {
            key: macAddress,
        },
    );
}

export async function getPrinterFormatPairs(type: PrintDataType) {
    const printers = await getPrinters();
    return printers
        .map((printer) => {
            return printer.formats({ type }).map((format) => ({
                printer,
                format,
            }));
        })
        .flat();
}
