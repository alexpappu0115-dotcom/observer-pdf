// Observer configuration.
//
// Google Drive: fill in the three values below to turn on "Open from / Save to Google Drive".
// They are not secrets (they are visible to anyone who loads the page), but restrict them
// in Google Cloud Console to your site's address. Step-by-step setup is in README.md.
window.OBSERVER_CONFIG = {
  google: {
    clientId: '', // OAuth client ID, e.g. 1234567890-abc123.apps.googleusercontent.com
    apiKey: '',   // API key, e.g. AIzaSy...
    appId: ''     // Google Cloud project NUMBER, e.g. 1234567890
  }
};
