/**
 * Nebuloid contact form → Google Sheet + email webhook
 *
 * Setup:
 * 1. Create a Google Sheet named e.g. "Nebuloid Contact Leads"
 * 2. Rename the first tab to "Responses" (optional but recommended)
 * 3. Extensions → Apps Script → paste this file → Save
 * 4. Run setupSheet() once from the Apps Script editor (authorize when prompted)
 * 5. Deploy → New deployment → Type: Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 6. Copy the Web app URL
 * 7. Add it as GOOGLE_SHEETS_WEBHOOK_URL in Vercel env + local .env.local
 * 8. Redeploy / restart the Next.js app
 *
 * Emails go to NOTIFY_EMAIL below on every submission (unless skipEmail is true).
 */

var SHEET_NAME = 'Responses'
var NOTIFY_EMAIL = 'NebuloidTechStudio@gmail.com'

function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
  }

  var headers = [
    'Received At',
    'Name',
    'Email',
    'Organization',
    'Event Type',
    'Industry',
    'Budget',
    'Timeline',
    'Message',
  ]

  sheet.clear()
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
  sheet.setFrozenRows(1)
  sheet.autoResizeColumns(1, headers.length)
}

function buildEmailBody(payload) {
  return [
    'New contact form submission from nebuloidtechstudio.com',
    '',
    'Name: ' + (payload.name || ''),
    'Email: ' + (payload.email || ''),
    'Organization: ' + (payload.company || '—'),
    'Event Type: ' + (payload.eventType || ''),
    'Industry: ' + (payload.industry || '—'),
    'Budget: ' + (payload.budget || '—'),
    'Timeline: ' + (payload.timeline || '—'),
    'Received: ' + (payload.receivedAt || new Date().toISOString()),
    '',
    'Message:',
    payload.message || '',
  ].join('\n')
}

function buildEmailHtml(payload) {
  function row(label, value) {
    return (
      '<tr><td style="padding:8px 12px;color:#666;width:140px;">' +
      label +
      '</td><td style="padding:8px 12px;color:#111;">' +
      String(value || '—')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;') +
      '</td></tr>'
    )
  }

  return (
    '<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">' +
    '<h2 style="color:#181712;">New Nebuloid inquiry</h2>' +
    '<table style="border-collapse:collapse;width:100%;border:1px solid #eee;">' +
    row('Name', payload.name) +
    row('Email', payload.email) +
    row('Organization', payload.company) +
    row('Event Type', payload.eventType) +
    row('Industry', payload.industry) +
    row('Budget', payload.budget) +
    row('Timeline', payload.timeline) +
    row('Received', payload.receivedAt) +
    '</table>' +
    '<p style="margin-top:20px;color:#666;">Message</p>' +
    '<p style="white-space:pre-wrap;color:#111;line-height:1.5;">' +
    String(payload.message || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;') +
    '</p></div>'
  )
}

function sendNotificationEmail(payload) {
  if (payload.skipEmail) return

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: payload.email || NOTIFY_EMAIL,
    subject: 'New Nebuloid inquiry — ' + (payload.name || 'Contact form'),
    body: buildEmailBody(payload),
    htmlBody: buildEmailHtml(payload),
    name: 'Nebuloid Contact Form',
  })
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents)
    var ss = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0]

    sheet.appendRow([
      payload.receivedAt || new Date().toISOString(),
      payload.name || '',
      payload.email || '',
      payload.company || '',
      payload.eventType || '',
      payload.industry || '',
      payload.budget || '',
      payload.timeline || '',
      payload.message || '',
    ])

    try {
      sendNotificationEmail(payload)
    } catch (mailError) {
      // Keep the sheet row even if mail fails.
      console.error('contact email failed', mailError)
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON,
    )
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(error) }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, service: 'nebuloid-contact-sheet' }),
  ).setMimeType(ContentService.MimeType.JSON)
}
