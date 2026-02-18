import { initializeApp, getApps } from "../vendor/firebase-app.js";

let firebaseApp = null;
let lastError = null;

/**
 * Attempt to initialize Firebase using the provided configuration object.
 * Returns the cached app instance when already initialized.
 */
export async function ensureFirebaseApp(config) {
  if (firebaseApp) {
    return firebaseApp;
  }

  if (!config || typeof config !== "object") {
    throw new Error("Firebase config missing or invalid.");
  }

  try {
    const apps = typeof getApps === "function" ? getApps() : [];
    if (Array.isArray(apps) && apps.length > 0) {
      firebaseApp = apps[0];
      lastError = null;
      return firebaseApp;
    }

    firebaseApp = initializeApp(config);
    lastError = null;
    return firebaseApp;
  } catch (error) {
    lastError = error;
    throw error;
  }
}

export function getFirebaseApp() {
  return firebaseApp;
}

export function getFirebaseStatus() {
  return {
    initialized: Boolean(firebaseApp),
    lastError: lastError ? serializeError(lastError) : null
  };
}

export function resetFirebaseState() {
  firebaseApp = null;
  lastError = null;
}

function serializeError(error) {
  if (!error) {
    return null;
  }
  return {
    message: error.message ?? String(error),
    name: error.name ?? "Error",
    stack: error.stack ?? null
  };
}
