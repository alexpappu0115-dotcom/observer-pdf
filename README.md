# Observer — PDF Studio

Local-first PDF studio aiming to replace Adobe Acrobat and DocuSign. Everything runs in the browser. Your documents only leave the device when you choose to save them to Google Drive, and then they go straight to your own Google account.

## Features
- **View & read**: sharp high-DPI rendering, zoom, and four reading modes: single page, continuous scroll, two-page spreads, and reflow (the text re-flowed for phones)
- **Search**: full-text search across all pages with highlighted matches and next/previous (Ctrl/Cmd+F)
- **Navigate**: page thumbnails, bookmarks (the PDF's outline), clickable internal and web links, tap the page number to jump to any page
- **Select & copy text** on any page with a text layer
- **Print** every page exactly as shown, including your drawings and signatures (Ctrl/Cmd+P)
- **Draw** freehand annotations in black, blue or red, with undo. Strokes are written into the PDF as vector lines when you save
- **Place signature**: draw your signature once (it's remembered), then drag and resize it anywhere on any page, including rotated pages
- **Digitally sign** (PKCS#7 detached / PAdES-style, SHA-256, via zgapdfsigner)
  - Uses a persistent Digital ID kept on this device, so all your signatures share one identity
  - Records **reason, location and contact** in the signature dictionary, alongside the signer name
  - Shows the **SHA-256** of exactly what was signed, both on screen and on the audit page
  - Optional **audit certificate page** appended before signing, so the signature covers it: document ID, signer, timestamp, reason, location, contact, page count and the content hash
  - Optional **RFC 3161 trusted timestamp**. Only a hash is sent, never the document, and the token is embedded in the PDF as `observer-timestamp.tsr` so it can be checked later with `openssl ts -verify`. Many public timestamp servers refuse requests from a browser, in which case Observer signs without one
  - Import a certificate from a trusted provider (.p12 / .pfx) for signatures Acrobat validates automatically. Self-signed IDs show as "identity unknown" until the recipient trusts them
  - Back up your Digital ID as a password-protected .p12
  - Multiple signers: the first signature certifies the document while still allowing later signatures, which are added as incremental updates, so earlier signatures stay valid. Counter-signing never appends an audit page, since that would break the first signature
  - Signed documents are locked against edits that would break the signature
- **iCloud Drive & Files**: Open uses the system file picker (iCloud Drive, On My iPhone, and any cloud app shown in Files). On iPhone/iPad, Save → "Save to Files" opens the share sheet so you can pick iCloud Drive. On desktop Chrome/Edge you can save straight back over the file you opened (works with your iCloud Drive folder on Mac/Windows)
- **Google Drive, no sign-in needed**: works just like iCloud Drive, through your device. On iPhone/iPad the Google Drive app shows up in the Files picker and the share sheet; on Android, Drive is in the system file picker and share sheet; on Mac/Windows, Google Drive for desktop appears as a folder you can open from and save to (in Chrome/Edge, "Save over original" writes straight back to Drive). The Google Drive button shows short instructions for your device
- **Optional direct Google sign-in**: if you add a Google OAuth Client ID to `config.js`, Observer also offers Sign in with Google, recent Drive files, the Google Picker and saving back to Drive from any browser. See setup below
- **OCR** the current page (Tesseract.js, on-device), optionally the moment a file opens
- **Home screen** with a working **Recent** list: documents you open are kept in this browser so you can reopen them, iPhone included. Turn it off or clear it in Settings → Privacy & data
- **New from Scan**: photograph pages or pick images, and Observer builds a PDF from them (HEIC from an iPhone camera included)
- **Annotate**: a Draw tool and a translucent **Highlight** tool, each with its own colour, width and opacity, plus an eraser and full **undo / redo** (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z)
- **Pages panel**: select pages and insert, duplicate, rotate, delete, extract to a new PDF, or add another file; reorder by dragging the grip or with the arrows
- **Export / Share**: keep annotations as vectors (text stays selectable) or **flatten** every page to an image, then send it to Files / iCloud Drive, Google Drive, or a download
- **Customisable**: a settings panel for theme (dark / light / system), accent colour, interface size, signing defaults, pen and highlighter, eraser size, OCR language, default reading mode and zoom, the thumbnails sidebar, and a **Fully local only** switch that hides every cloud destination. Everything is stored on the device and applies straight away
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

## Optional: direct Google sign-in setup (one time, about 5 minutes)
Not needed for Google Drive through your device (above). Only set this up if you want Observer's own Sign in with Google.

Your users never deal with keys: they tap **Sign in with Google**. But Google requires every website that offers Google sign-in or Drive access to be registered once, by the site owner. That gives you one value, the **Client ID**, which goes in `config.js`.

1. Go to [console.cloud.google.com](https://console.cloud.google.com) and create a project (e.g. "Observer").
2. **APIs & Services → Library**: enable **Google Drive API** and **Google Picker API**.
3. **Google Auth platform → Branding**: enter the app name ("Observer") and your email. **Audience**: choose External. While the app is in Testing, add the Google accounts that will use it under Test users, or click Publish app to let anyone sign in. Observer only asks for basic profile and `drive.file`, which are non-sensitive scopes, so publishing doesn't need a security review.
4. **Google Auth platform → Clients → Create client → Web application**. Under *Authorized JavaScript origins* add `https://alexpappu0115-dotcom.github.io` (and `http://localhost:8000` for local testing).
5. Copy the **Client ID** (ends in `.apps.googleusercontent.com`) into `config.js` and push.

That's it: the Drive app ID is read from the Client ID automatically. An API key is optional; only add one (step 6) if **Browse Google Drive** shows an "API developer key" error.

6. *(Optional)* **APIs & Services → Credentials → Create credentials → API key**. Restrict it to *Websites* `https://alexpappu0115-dotcom.github.io/*` **and** `https://docs.google.com/*` (the Picker runs on docs.google.com), and to the Google Picker API. Put it in `config.js` as `apiKey`.

What Observer can access: your name and email (to show who's signed in), and only the Drive files you pick or create with Observer. The sign-in token lasts about an hour and is kept in memory only. Next time, "Continue as …" signs you back in with one tap. Sign out from the account button at the top.

Notes:
- On iPhone, the Google Drive app also plugs into the Files picker and the share sheet, so you can open and save Drive files through **Files / iCloud Drive** even without this setup.
- If you install Observer to the Home Screen on iPhone, Google's sign-in pop-up can be unreliable there. If it fails, use Observer in Safari for Google Drive, or use the Files route above.

## Notes for developers
- Libraries are bundled in `vendor/` (no CDN needed): pdf.js 3.11.174 (Apache-2.0), pdf-lib 1.17.1 (MIT), node-forge 1.3.1 (BSD-3-Clause), zgapdfsigner 2.8.0 (MIT), tesseract.js 5.0.4 (Apache-2.0). The OCR engine core and language data are downloaded on first OCR use and then cached.
- After changing anything in `vendor/` or `icons/`, bump `VERSION` in `sw.js` so installed apps pick up the new files.
- Google sign-in (`accounts.google.com/gsi/client`) and the Picker (`apis.google.com/js/api.js`) are only loaded when you open the account, Open or Save menu, and only if `config.js` has a Client ID.
- Digital IDs and the saved signature image are stored in the browser's localStorage on this device. Clearing site data removes them, so back up your Digital ID. Settings → Privacy & data has **Clear local data**, which removes all of it at once, and **Export settings**, which writes a JSON copy of your preferences (never any key material).
- Settings live in localStorage under `observer-*` keys (`observer-theme`, `observer-accent`, `observer-name`, `observer-ocr`, and so on). Theming is driven by CSS custom properties on `:root`, so a new accent or theme needs no changes to the rules themselves. The colour drawn on the accent is picked at runtime by WCAG contrast rather than a lightness threshold.
- Recent documents are stored in IndexedDB (`observer-recents`), contents included, capped at 12 files and 80 MB with the oldest dropped first. That is the only way Recent can reopen a file on iPhone, where a file handle cannot be kept. Settings → Privacy & data turns it off and clears it.
- `run()` holds a single busy lock, so a function that already runs inside it must call `openFileNow()` rather than `openFile()` — a nested `run()` is ignored and would silently drop the document.
- SHA-256 hashing uses `crypto.subtle`, which browsers only expose on https or localhost. Over a plain LAN IP, Observer still signs but reports the content hash as unavailable.
- The RFC 3161 request is a DER `TimeStampReq` built with node-forge and posted as `application/timestamp-query`. That content type makes the browser send a CORS preflight, so a timestamp server only works here if it answers `OPTIONS` with the right `Access-Control-Allow-*` headers. Failures are non-fatal: signing continues without a timestamp.

Repo: https://github.com/alexpappu0115-dotcom/observer-pdf
