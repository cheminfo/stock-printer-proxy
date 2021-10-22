export interface PrinterParserResult {
  isOnline: boolean;
  serialNumber: string | null;
}

export function parsePrinterResponse(text: string): PrinterParserResult {
  const result: PrinterParserResult = {
    isOnline: false,
    serialNumber: null,
  };
  if (text.indexOf('>READY<') > -1 || text.indexOf('>BEREIT<') > -1) {
    result.isOnline = true;
  }
  var reg = /<h2>([^<]+)</i;
  const m = reg.exec(text);
  if (m && m[1]) {
    result.serialNumber = m[1];
  }
  return result;
}
