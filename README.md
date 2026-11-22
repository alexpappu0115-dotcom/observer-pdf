# Observer — PDF Studio

Local-first PDF studio aiming to replace Adobe Acrobat and DocuSign. Everything runs in the browser; your documents never leave the device.

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

## Notes for developers
- Libraries are bundled in `vendor/` (no CDN needed): pdf.js 3.11.174 (Apache-2.0), pdf-lib 1.17.1 (MIT), node-forge 1.3.1 (BSD-3-Clause), zgapdfsigner 2.8.0 (MIT), tesseract.js 5.0.4 (Apache-2.0). The OCR engine core and language data are downloaded on first OCR use and then cached.
- After changing anything in `vendor/` or `icons/`, bump `VERSION` in `sw.js` so installed apps pick up the new files.
- Digital IDs and the saved signature image are stored in the browser's localStorage on this device. Clearing site data removes them, so back up your Digital ID.

Repo: https://github.com/alexpappu0115-dotcom/observer-pdf
