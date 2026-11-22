# Observer — Local PDF Studio

A free, local-only Acrobat alternative with **OCR** and **certified digital signatures**.

## Features
- Open and view PDFs (multi-page navigation)
- **OCR** current page with Tesseract.js (fully on-device)
- **Certified digital signature** — generates a self-signed X.509 certificate in the browser and applies a real PKCS#7 signature recognized by Adobe Acrobat and other viewers
- Download the signed PDF
- Dark theme with brass accents (inspired by Quire branding)
- Works offline after first load (CDNs cache)
- PWA-ready (add to Home Screen on iPhone)

## How to Use

### Option 1: Open directly (simplest)
1. Download `index.html` (and `manifest.json` if you want PWA).
2. On your computer or iPhone: open the HTML file in Safari or Chrome.
3. Drop a PDF or click **Open PDF**.
4. Use **OCR Current Page** to extract text from scans.
5. Click **Add Digital Signature**, draw or enter your name, then **Apply Certified Signature**.
6. Click **Download** to save the signed PDF.

### Option 2: Serve locally (recommended for iPhone / better experience)
```bash
cd observer
python3 -m http.server 8000
```
Then open `http://localhost:8000` (or your device’s IP on the local network).

On iPhone Safari → Share → **Add to Home Screen**. It will open like a native app.

### Option 3: Host on your existing infrastructure
Copy the folder to your GMKtec / Proxmox / Cloudflare Pages / any static host. No backend required — everything runs in the browser.

## Notes on Digital Signatures
- The signature is a real certificate-based PKCS#7 detached signature.
- It uses a self-signed certificate generated on the fly (valid for integrity and non-repudiation within your organization).
- Adobe Acrobat and other PDF viewers will show it as a digital signature.
- For a trusted CA certificate, you can extend the code to import a `.p12` / `.pfx` file (the underlying library supports it).

## OCR
- Renders the current page to canvas and runs Tesseract.js.
- Best results on clear scans. English by default; other languages can be added.

## Limitations (v1)
- Basic viewer (annotations and advanced form filling can be added next).
- Self-signed certificates are not automatically trusted by third parties (expected for local/internal use).
- Large multi-page OCR is sequential; process page-by-page.

Fully local. Nothing is uploaded. No subscription.

---
Renamed from the previous Acrobat alternative build and enhanced with OCR + certified digital signature.
