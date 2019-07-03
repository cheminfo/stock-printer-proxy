'use strict';

const util = require('../util');

const example = `
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<HTML>
<HEAD><TITLE>vad-zebra1-la - BEREIT</TITLE><meta http-equiv="Pragma" content="no-cache"><meta http-equiv="Expires" content="0"></HEAD>
<BODY><CENTER>
<IMG SRC="logo.png" ALT="[Logo]">
<H1>Zebra Technologies<BR>
ZTC ZD420-300dpi ZPL</H1>
<H2>vad-zebra1-la</H2>
Intern angeschlossen PrintServer<H3>Status: <FONT COLOR="GREEN">BEREIT</FONT></H3>
<H3><FONT COLOR=RED></FONT></H3>
<HR>
<DIV ALIGN="center">
<H2>Drucker-Homepage</H2>
<FORM METHOD="POST" ACTION="index.html">
<DIV ALIGN="center">
<H3><A HREF="config.html">Druckerkonfiguration anzeigen</A><BR>
<A HREF="settings">Druckereinstellungen anzeigen und �ndern</A><BR>
<A HREF="dir">Verzeichnisliste</A><BR>
<A HREF="uns">Warnmeldungs-Setup</A><BR>
<A HREF="control">Druckersteuerungen</A><BR>
<A HREF="/server/">Druckereinstellungen drucken</A></H3>
</CENTER>
</FORM></DIV>
<CENTER><HR>
Home: <A HREF="https://www.zebra.com">https://www.zebra.com</A><BR>
Support: <A HREF="https://www.zebra.com/support.html">https://www.zebra.com/support.html</A><BR>
</CENTER>
</BODY>
</HTML>
`;

test('parse printer result', () => {
  const parsed = util.parsePrinterResult(example);
  expect(parsed).toMatchObject({
    isOnline: true,
    serialNumber: 'vad-zebra1-la'
  });
});
