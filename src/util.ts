export interface PrinterParserResult {
  isOnline: boolean;
  serialNumber: string | null;
}

export function parsePrinterResponse(text: string): PrinterParserResult {
  const result: PrinterParserResult = {
    isOnline: false,
    serialNumber: null,
  };
  if (text.includes(">READY<") || text.includes(">BEREIT<")) {
    result.isOnline = true;
  }
  let reg = /<h2>(?<id>[^<]+)</i;
  const m = reg.exec(text);
  if (m?.groups?.id) {
    result.serialNumber = m.groups.id;
  }
  return result;
}
