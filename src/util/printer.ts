export type PrintDataType = string;

export interface PrintServerDocument {
  _id: string;
  $content: PrintServerDocumentContent;
}

export interface PrintServerDocumentContent {
  macAddress: string;
  ip: string;
  url: string;
  isOnline: boolean;
}

export interface PrinterDocumentContent {
  kind: string;
  ip: string;
  macAddress: string;
  name: string;
  model: string;
  id: string;
}

export interface PrinterDocument {
  _id: string;
  $content: PrinterDocumentContent;
}

export class Printer {
  private _formats: FormatDocument[];
  private _printer: PrinterDocument;
  public constructor(printer: PrinterDocument, formats: FormatDocument[]) {
    // The type of format this p
    this._printer = printer;
    this._formats = formats;
  }

  public id() {
    return this._printer._id;
  }

  public url() {
    return this._printer.$content.ip;
  }

  public name() {
    // this field is called macAddress because of legacy blaster printers
    return this._printer.$content.macAddress;
  }

  public publicName() {
    return this._printer.$content.name;
  }

  // Get formats that are compatible with this printer
  // And can print the right type of data
  public formats(params: { type: PrintDataType }) {
    // get formats compatible with printer
    let formats = this._formats.filter((format) => {
      return format.$content.models.some(
        (model) => model.name === this._printer.$content.model
      );
    });

    if (params.type) {
      formats = formats.filter((f) => String(f.$content.type) === params.type);
    }

    return formats.map((format) => new Format(format));
  }
}

export interface FormatDocument {
  _id: string;
  $content: {
    name: string;
    type: string;
    models: {
      name: string;
    }[];
  };
}

export class Format {
  private format: FormatDocument;
  public constructor(format: FormatDocument) {
    this.format = format;
  }
  public id() {
    return this.format._id;
  }
  public name() {
    return this.format.$content.name;
  }
  public type() {
    return this.format.$content.type;
  }
}