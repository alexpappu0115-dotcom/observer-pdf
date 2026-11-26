// Observer configuration.
//
// Google Drive: paste your OAuth Client ID below (one-time setup, see
// "Google Drive setup" in README.md). Until this is filled in, the Google Drive
// button explains that sign-in is not set up — it never falls back to the
// device's file picker, which is what Open File / iCloud-Files are for.
//
// Your users never see or need this value; they just tap "Sign in with Google".
// It is not a secret: Google ties it to the origins you authorise.
window.OBSERVER_CONFIG = {
  google: {
    clientId: '' // e.g. 1234567890-abc123def456.apps.googleusercontent.com
  }
};
