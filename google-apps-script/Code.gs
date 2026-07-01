/**
 * Google Apps Script — paste this into your Sheet's script editor.
 * Deploy as Web App: Execute as "Me", Who has access: "Anyone".
 *
 * 1. Create a Google Sheet
 * 2. Extensions → Apps Script → paste this file
 * 3. Set ADMIN_KEY below to a secret password
 * 4. Deploy → New deployment → Web app
 * 5. Copy the /exec URL into js/config.js
 */

const ADMIN_KEY = 'change-me-to-a-secret-key';

const HEADERS = ['Timestamp', 'Name', 'Email', 'Attending', 'Guests', 'Message'];

function doGet(e) {
  const action = e.parameter.action;

  if (action === 'list') {
    return jsonResponse(listRsvps(e.parameter.key));
  }

  return jsonResponse({ success: false, error: 'Unknown action' });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === 'submit') {
      return jsonResponse(submitRsvp(data));
    }

    return jsonResponse({ success: false, error: 'Unknown action' });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('RSVPs');

  if (!sheet) {
    sheet = ss.insertSheet('RSVPs');
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function submitRsvp(data) {
  if (!data.name || !data.email || !data.attending) {
    return { success: false, error: 'Missing required fields' };
  }

  const sheet = getSheet();
  const timestamp = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    'yyyy-MM-dd HH:mm:ss'
  );

  sheet.appendRow([
    timestamp,
    String(data.name).trim(),
    String(data.email).trim(),
    data.attending === 'yes' ? 'yes' : 'no',
    data.attending === 'yes' ? (data.guests || '1') : '0',
    String(data.message || '').trim(),
  ]);

  return { success: true };
}

function listRsvps(key) {
  if (key !== ADMIN_KEY) {
    return { success: false, error: 'Invalid admin key' };
  }

  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return {
      success: true,
      stats: { total: 0, attending: 0, notAttending: 0, totalGuests: 0 },
      rows: [],
    };
  }

  const rows = values.slice(1).map((row) => ({
    timestamp: row[0],
    name: row[1],
    email: row[2],
    attending: row[3],
    guests: row[4],
    message: row[5],
  }));

  const attending = rows.filter((r) => r.attending === 'yes');
  const notAttending = rows.filter((r) => r.attending === 'no');
  const totalGuests = attending.reduce((sum, r) => sum + (parseInt(r.guests, 10) || 0), 0);

  return {
    success: true,
    stats: {
      total: rows.length,
      attending: attending.length,
      notAttending: notAttending.length,
      totalGuests,
    },
    rows: rows.reverse(),
  };
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
