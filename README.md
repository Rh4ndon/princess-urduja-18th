# 18th Birthday RSVP

A simple RSVP website using HTML, CSS, and JavaScript with **Google Sheets** as the database.

## What's included

| File | Purpose |
|------|---------|
| `index.html` | Guest RSVP form |
| `admin.html` | Admin dashboard (reads from Google Sheet) |
| `js/config.js` | Your Apps Script URL |
| `google-apps-script/Code.gs` | Backend script for Google Sheets |

## Setup (Google Sheets as database)

### 1. Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name it something like **18th Birthday RSVPs**.

### 2. Add the Apps Script

1. In the sheet: **Extensions → Apps Script**.
2. Delete any default code and paste the contents of `google-apps-script/Code.gs`.
3. Change `ADMIN_KEY` to a strong secret password (you'll use this on the admin page).
4. Save the project (Ctrl+S).

### 3. Deploy as Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon → select **Web app**.
3. Settings:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy** and authorize the script when prompted.
5. Copy the **Web app URL** (it ends with `/exec`).

### 4. Configure the website

1. Open `js/config.js`.
2. Paste your Web app URL into `SCRIPT_URL`:

```js
SCRIPT_URL: 'https://script.google.com/macros/s/XXXXX/exec',
```

3. Edit event details in `index.html` (date, time, venue) if needed.

### 5. Run locally or host

**Local preview:**
```bash
# From the project folder — any static server works, e.g.:
python -m http.server 8080
# Then open http://localhost:8080
```

**Host for free:** Upload the folder to [GitHub Pages](https://pages.github.com), [Netlify](https://netlify.com), or [Vercel](https://vercel.com).

## How it works

```
Guest fills form (index.html)
        ↓ POST
Google Apps Script (Code.gs)
        ↓ writes row
Google Sheet ("RSVPs" tab)

Admin opens admin.html
        ↓ GET + admin key
Google Apps Script
        ↓ reads rows
Admin dashboard shows stats + table
```

- **RSVP submissions** are appended as new rows in the sheet.
- **Admin page** fetches all rows using your secret `ADMIN_KEY`.
- The admin key is stored in `sessionStorage` only for the browser session.

## Customization

- **Styling:** Edit `css/styles.css`
- **Event info:** Edit the hero section in `index.html`
- **Form fields:** Update `index.html`, `js/app.js`, and `Code.gs` together

## Security notes

- Keep `ADMIN_KEY` secret — only share it with yourself.
- The RSVP form is public; anyone with the link can submit.
- For a private admin URL, don't link to `admin.html` from the public page (remove the footer link).
