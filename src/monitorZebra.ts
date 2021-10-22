import superagent from 'superagent';
import roc from './roc/roc';
import { parsePrinterResponse, PrinterParserResult } from './util';
import { PrinterDocumentContent } from './util/printer';
import fastify from './fastify';
import { getPrintServersByMacAddress } from './roc/printers';

const interval = 60000 * 5; // Every 5 minute
const failInterval = 60000; // Every 1 minute if it fails

export async function startMonitoring() {
  try {
    await updateStatus();
    setTimeout(startMonitoring, interval);
  } catch (e) {
    console.log('Error while updating zebra printer status', e);
    setTimeout(startMonitoring, failInterval);
  }
}

async function updateStatus() {
  let printers = await roc.getView('entryByKind', {
    key: 'printer',
  });
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
): Promise<PrinterParserResult> {
  let result: PrinterParserResult = {
    isOnline: false,
    serialNumber: null,
  };
  try {
    const res = await superagent.get(`http://${printer.ip}`).timeout({
      response: 10000,
      deadline: 20000,
    });

    return parsePrinterResponse(res.text);
  } catch (e) {
    console.error('Error while checking printer', new Date());
    console.error(e);
    return result;
  }
}

async function updatePrinterServer(
  printer: PrinterDocumentContent,
  printerCheck: PrinterParserResult,
) {
  try {
    const data = await getPrintServersByMacAddress(printer.macAddress);

    const content = {
      macAddress: printerCheck.isOnline
        ? printerCheck.serialNumber
        : printer.macAddress,
      ip: printer.ip,
      version: 1,
      port: 80,
      protocol: 'http',
      url: `http://${printer.ip}`,
      isOnline: printerCheck.isOnline,
      kind: 'zebra',
    };
    if (!data.length) {
      return roc.create({
        $id: null,
        $kind: 'printServer',
        $content: content,
        $owners: ['printerAdmin'],
      });
    } else {
      const document = roc.getDocument(data[0]._id);
      return document.update(content);
    }
  } catch (error) {
    fastify.log.info('Error while updating print server to couchdb', { error });
  }
}
