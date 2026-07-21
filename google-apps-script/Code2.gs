/**
 * Google Apps Script — Program & Entourage Sheet
 * Paste this into your program Google Sheet's script editor.
 *
 * Deployment:
 * 1. Open your Google Sheet → Extensions → Apps Script
 * 2. Paste this code, save (Ctrl+S)
 * 3. Deploy → New deployment → Web app
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 4. Copy the /exec URL → paste into js/config.js as PROGRAM_URL
 */

function doGet(e) {
  const action = e.parameter.action;

  if (action === 'getProgram') {
    return jsonResponse(getProgramData());
  }

  return jsonResponse({ success: false, error: 'Unknown action' });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getActiveSheet();
}

function getProgramData() {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();

  if (values.length < 2) {
    return { success: true, data: [] };
  }

  const headers = values[0].map(function (h) { return String(h).trim(); });
  var rows = values.slice(1).filter(function (row) {
    return row.some(function (cell) { return String(cell).trim(); });
  }).map(function (row) {
    var obj = {};
    headers.forEach(function (h, i) { obj[h] = String(row[i] || '').trim(); });
    return obj;
  });

  return { success: true, data: rows };
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
