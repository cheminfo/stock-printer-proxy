export interface PrinterParserResult {
    isOnline: boolean;
    serialNumber: string | null;
    paused: boolean;
}

export function parsePrinterResponse(text: string): PrinterParserResult {
    const result: PrinterParserResult = {
        isOnline: false,
        paused: false,
        serialNumber: null,
    };
    if (text.includes('>READY<')) {
        result.isOnline = true;
    } else if (text.includes('>PAUSED<')) {
        result.paused = true;
    }
    let reg = /<h2>(?<id>[^<]+)</i;
    const m = reg.exec(text);
    if (m?.groups?.id) {
        result.serialNumber = m.groups.id;
    }
    return result;
}
