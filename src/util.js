'use strict';

module.exports = {
  parsePrinterResponse: function(text) {
    const result = {
      isOnline: false
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
};
