import { parsePrinterResponse } from '../util';

const english = `
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<HTML>
<HEAD><TITLE>ACI-PRT10 - READY</TITLE><meta http-equiv="Pragma" content="no-cache"><meta http-equiv="Expires" content="0"></HEAD>
<BODY><CENTER>
<IMG SRC="logo.png" ALT="[Logo]">
<H1>Zebra Technologies<BR>
ZTC ZD420-300dpi ZPL</H1>
<H2>ACI-PRT10</H2>
Internal Wired PrintServer<H3>Status: <FONT COLOR="GREEN">READY</FONT></H3>
<H3><FONT COLOR=RED></FONT></H3>
<HR>
<DIV ALIGN="center">
<H2>Printer Home Page</H2>
<FORM METHOD="POST" ACTION="index.html">
<DIV ALIGN="center">
<H3><A HREF="config.html">View Printer Configuration</A><BR>
<A HREF="settings">View and Modify Printer Settings</A><BR>
<A HREF="dir">Directory Listing</A><BR>
<A HREF="uns">Alert Setup</A><BR>
<A HREF="control">Printer Controls</A><BR>
<A HREF="/server/">Print Server Settings</A></H3>
</CENTER>
</FORM></DIV>
<CENTER><HR>
Home: <A HREF="https://www.zebra.com">https://www.zebra.com</A><BR>
Support: <A HREF="https://www.zebra.com/support.html">https://www.zebra.com/support.html</A><BR>
</CENTER>
</BODY>
</HTML>
`;

const englishError = `
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<HTML>
<HEAD><TITLE>ACI-PRT10 - READY</TITLE><meta http-equiv="Pragma" content="no-cache"><meta http-equiv="Expires" content="0"></HEAD>
<BODY><CENTER>
<IMG SRC="logo.png" ALT="[Logo]">
<H1>Zebra Technologies<BR>
ZTC ZD420-300dpi ZPL</H1>
<H2>ACI-PRT10</H2>
Internal Wired PrintServer<H3>Status: <FONT COLOR="GREEN">ERROR</FONT></H3>
<H3><FONT COLOR=RED></FONT></H3>
<HR>
<DIV ALIGN="center">
<H2>Printer Home Page</H2>
<FORM METHOD="POST" ACTION="index.html">
<DIV ALIGN="center">
<H3><A HREF="config.html">View Printer Configuration</A><BR>
<A HREF="settings">View and Modify Printer Settings</A><BR>
<A HREF="dir">Directory Listing</A><BR>
<A HREF="uns">Alert Setup</A><BR>
<A HREF="control">Printer Controls</A><BR>
<A HREF="/server/">Print Server Settings</A></H3>
</CENTER>
</FORM></DIV>
<CENTER><HR>
Home: <A HREF="https://www.zebra.com">https://www.zebra.com</A><BR>
Support: <A HREF="https://www.zebra.com/support.html">https://www.zebra.com/support.html</A><BR>
</CENTER>
</BODY>
</HTML>
`;

test('parse printer result (english)', () => {
    const parsed = parsePrinterResponse(english);
    expect(parsed).toMatchObject({
        isOnline: true,
        serialNumber: 'ACI-PRT10',
    });
});

test('parse printer result not ready', () => {
    const parsed = parsePrinterResponse(englishError);
    expect(parsed).toMatchObject({
        isOnline: false,
        serialNumber: 'ACI-PRT10',
    });
});
