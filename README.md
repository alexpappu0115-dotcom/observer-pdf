# Observer — PDF Studio

Local-first PDF studio aiming to replace Adobe Acrobat and DocuSign. Everything runs in the browser. Your documents only leave the device when you choose to save them to Google Drive, and then they go straight to your own Google account.

## Features
- Open & view multi-page PDFs with zoom and sharp (high-DPI) rendering
- **Draw** freehand annotations in black, blue or red, with undo. Strokes are written into the PDF as vector lines when you save
- **Place signature**: draw your signature once (it's remembered), then drag and resize it anywhere on any page, including rotated pages
- **Digitally sign** (PKCS#7 / PAdES-style, via zgapdfsigner)
  - Uses a persistent Digital ID kept on this device, so all your signatures share one identity
  - Import a certificate from a trusted provider (.p12 / .pfx) for signatures Acrobat validates automatically. Self-signed IDs show as "identity unknown" until the recipient trusts them
  - Back up your Digital ID as a password-protected .p12
  - Multiple signers: the first signature certifies the document while still allowing later signatures, which are added as incremental updates, so earlier signatures stay valid
  - Signed documents are locked against edits that would break the signature
- **iCloud Drive & Files**: Open uses the system file picker (iCloud Drive, On My iPhone, and any cloud app shown in Files). On iPhone/iPad, Save → "Save to Files" opens the share sheet so you can pick iCloud Drive. On desktop Chrome/Edge you can save straight back over the file you opened (works with your iCloud Drive folder on Mac/Windows)
- **Google Drive**: open PDFs from Drive, update the original (Drive keeps the previous version), or save a copy to My Drive or any folder. Needs a one-time setup, below
- **OCR** the current page (Tesseract.js, on-device)
- Rotate / delete pages, combine multiple PDFs (your edits to the current file are kept)
- Works offline after the first visit (service worker); installable on iPhone via Add to Home Screen

## Quick Start on iPhone
1. Open the GitHub Pages URL (once enabled) or serve locally.
2. Tap Share → Add to Home Screen for an app-like experience.

## Local Server
```bash
python3 -m http.server 8000
```
Then open `http://[your-ip]:8000` on the phone (same Wi-Fi). The service worker needs HTTPS or localhost, so offline mode works on GitHub Pages but not over a plain LAN IP.

## Google Drive setup (one time, about 10 minutes)
Google needs to know which website is asking for access, so you create free credentials once and paste them into `config.js`.

1. Go to [console.cloud.google.com](https://console.cloud.google.com), create a project (e.g. "Observer").
2. **APIs & Services → Library**: enable **Google Drive API** and **Google Picker API**.
3. **Google Auth platform → Branding**: fill in the app name and your email. **Audience**: choose External. While it's in Testing, add your own Google account under Test users. (Observer only uses the `drive.file` scope, which is non-sensitive, so you can publish later without a security review.)
4. **Google Auth platform → Data access**: add the scope `https://www.googleapis.com/auth/drive.file`.
5. **Clients → Create client → Web application**. Under *Authorized JavaScript origins* add your site's origin, for GitHub Pages `https://alexpappu0115-dotcom.github.io`, plus `http://localhost:8000` for local testing. Copy the **Client ID**.
6. **APIs & Services → Credentials → Create credentials → API key**. Restrict it to *Websites* (`https://alexpappu0115-dotcom.github.io/*`) and to the Google Picker API and Google Drive API. Copy the **API key**.
7. Find your **Project number** on the project's dashboard (Cloud overview). This is the App ID.
8. Put the three values in `config.js` and push.

What Observer can access: only files you pick in the Google Picker or create with Observer. Your sign-in lasts about an hour, is kept in memory only, and you can sign out in Settings.

Notes:
- On iPhone, the Google Drive app also plugs into the Files picker and the share sheet, so you can open and save Drive files through **Files / iCloud Drive** even without this setup.
- If you install Observer to the Home Screen on iPhone, Google's sign-in pop-up can be unreliable there. If it fails, use Observer in Safari for Google Drive, or use the Files route above.

## Notes for developers
- Libraries are bundled in `vendor/` (no CDN needed): pdf.js 3.11.174 (Apache-2.0), pdf-lib 1.17.1 (MIT), node-forge 1.3.1 (BSD-3-Clause), zgapdfsigner 2.8.0 (MIT), tesseract.js 5.0.4 (Apache-2.0). The OCR engine core and language data are downloaded on first OCR use and then cached.
- After changing anything in `vendor/` or `icons/`, bump `VERSION` in `sw.js` so installed apps pick up the new files.
- Google sign-in (`accounts.google.com/gsi/client`) and the Picker (`apis.google.com/js/api.js`) are only loaded when you open the Open or Save menu, and only if `config.js` has keys.
- Digital IDs and the saved signature image are stored in the browser's localStorage on this device. Clearing site data removes them, so back up your Digital ID.

Repo: https://github.com/alexpappu0115-dotcom/observer-pdf
