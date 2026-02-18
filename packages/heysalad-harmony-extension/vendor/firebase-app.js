/**
 * Placeholder Firebase Web SDK shim.
 *
 * Replace this file with the official Firebase Web SDK build, e.g.
 * copy `firebase-app.js` (and any other required Firebase modules) from
 * `https://www.gstatic.com/firebasejs/VERSION/` into this directory and
 * update the imports in `integrations/firebase.js` as needed.
 *
 * Until you provide the real SDK, the helper functions below allow the
 * Bereit Sheets Agent to load without runtime errors, but Firebase
 * features will remain inactive.
 */

export function initializeApp(config) {
  console.warn(
    "[Bereit::Firebase] Firebase SDK not installed. Replace vendor/firebase-app.js with firebase-app.js from the official SDK."
  );
  return { config, __mock: true };
}

export function getApps() {
  return [];
}
