# Capturing answers to a Google Sheet (free, no service account)

The opt-in step posts to `/api/capture`, which forwards the row to a Google
Apps Script web app. This is the simplest free way to append to a Sheet ~ no
OAuth, no service-account JSON, no paid tier.

If `GOOGLE_SHEET_WEBHOOK_URL` is not set, capture is skipped silently and the
gift still works end to end.

## 1. Make the Sheet
1. Create a new Google Sheet.
2. In row 1, add these headers (left to right):

   `timestamp | lens | email | interests | cues | freshness | social | labelWord | labelLeavesOut | residue | signatureLine`

## 2. Add the Apps Script
1. In the Sheet: **Extensions → Apps Script**.
2. Replace the contents with:

```javascript
const SHARED_TOKEN = 'some-long-random-string'; // match GOOGLE_SHEET_WEBHOOK_TOKEN

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (SHARED_TOKEN && body.token !== SHARED_TOKEN) {
      return ContentService.createTextOutput('forbidden').setMimeType(ContentService.MimeType.TEXT);
    }
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.appendRow([
      body.timestamp || new Date().toISOString(),
      body.lens || '',
      body.email || '',
      body.interests || '',
      body.cues || '',
      body.freshness || '',
      body.social || '',
      body.labelWord || '',
      body.labelLeavesOut || '',
      body.residue || '',
      body.signatureLine || ''
    ]);
    return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err).setMimeType(ContentService.MimeType.TEXT);
  }
}
```

3. **Deploy → New deployment → Web app.**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Copy the web app URL.

## 3. Set the env vars in Vercel
- `GOOGLE_SHEET_WEBHOOK_URL` = the web app URL
- `GOOGLE_SHEET_WEBHOOK_TOKEN` = the same string you put in `SHARED_TOKEN`

That’s it. New opt-ins append a row.

> Privacy note: only what the person chooses to submit on the opt-in step is
> captured. The reflection is delivered fully on-screen before this ask, and the
> ask is always skippable.
