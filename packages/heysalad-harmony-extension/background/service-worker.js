import { ensureFirebaseApp, getFirebaseStatus, resetFirebaseState } from "../integrations/firebase.js";

const OPENAI_RESPONSES_ENDPOINT = "https://api.openai.com/v1/responses";
const STORAGE_KEYS = {
  apiKey: "bereit_openai_api_key",
  backendSync: "bereit_backend_sync",
  firebaseConfig: "bereit_firebase_config"
};

/**
 * Fetch the API key stored in chrome.storage.sync.
 */
async function getApiKey() {
  const stored = await chrome.storage.sync.get(STORAGE_KEYS.apiKey);
  return stored?.[STORAGE_KEYS.apiKey] ?? "";
}

/**
 * Persist API key securely inside chrome.storage.sync.
 * The caller (options page or UI) is responsible for validation.
 */
async function setApiKey(apiKey) {
  await chrome.storage.sync.set({ [STORAGE_KEYS.apiKey]: apiKey });
}

async function getFirebaseConfig() {
  const stored = await chrome.storage.sync.get(STORAGE_KEYS.firebaseConfig);
  return stored?.[STORAGE_KEYS.firebaseConfig] ?? null;
}

async function setFirebaseConfig(config) {
  await chrome.storage.sync.set({ [STORAGE_KEYS.firebaseConfig]: config });
}

/**
 * Placeholder for future Bereit backend synchronization.
 * The function resolves immediately but documents the expected shape.
 */
async function syncWithBereitBackend(payload) {
  console.debug("[Bereit] Sync placeholder invoked", payload);
  // TODO: Integrate with Bereit backend once API details are available.
  return { synced: false, reason: "Backend integration not yet implemented." };
}

/**
 * Call OpenAI Responses API (GPT-5 placeholder) with provided sheet context.
 */
async function requestOpenAiSuggestions({ prompt, metadata }) {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error("OpenAI API key is not set. Please add it in the extension options.");
  }

  const body = {
    model: "gpt-5.0",
    input: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: "You are the Bereit Sheets Agent. Provide concise, actionable suggestions for spreadsheet rows."
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt
          },
          ...(metadata ? [{ type: "json", json: metadata }] : [])
        ]
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "bereit_sheet_notes",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            notes: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  rowIndex: { type: "number" },
                  suggestion: { type: "string" }
                },
                required: ["rowIndex", "suggestion"]
              }
            }
          },
          required: ["notes"]
        }
      }
    }
  };

  const response = await fetch(OPENAI_RESPONSES_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorPayload = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorPayload}`);
  }

  const result = await response.json();
  const notes =
    result?.output?.[0]?.content?.[0]?.json?.notes ??
    result?.notes ??
    [];

  return { notes, raw: result };
}

async function initializeFirebaseFromStorage() {
  const config = await getFirebaseConfig();
  if (!config) {
    resetFirebaseState();
    return { initialized: false, reason: "Config not yet provided." };
  }

  try {
    await ensureFirebaseApp(config);
    return { initialized: true, reason: null };
  } catch (error) {
    return { initialized: false, reason: error.message ?? String(error) };
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const { type, payload } = message ?? {};

  if (type === "BEREIT::SAVE_API_KEY") {
    setApiKey(payload?.apiKey)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (type === "BEREIT::REQUEST_SUGGESTIONS") {
    requestOpenAiSuggestions(payload)
      .then(async (suggestions) => {
        await syncWithBereitBackend({
          action: "OPENAI_RESPONSE",
          timestamp: Date.now(),
          suggestions
        });
        sendResponse({ ok: true, data: suggestions });
      })
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (type === "BEREIT::SAVE_FIREBASE_CONFIG") {
    setFirebaseConfig(payload?.config ?? null)
      .then(() => initializeFirebaseFromStorage())
      .then((status) => sendResponse({ ok: true, status }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (type === "BEREIT::GET_FIREBASE_STATUS") {
    Promise.all([getFirebaseConfig(), initializeFirebaseFromStorage()])
      .then(([config, status]) => {
        sendResponse({
          ok: true,
          configPresent: Boolean(config),
          status: {
            ...status,
            ...getFirebaseStatus()
          }
        });
      })
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (type === "BEREIT::PING") {
    sendResponse({ ok: true, message: "Bereit Sheets Agent is active." });
    return false;
  }

  return undefined;
});

chrome.runtime.onInstalled.addListener(() => {
  console.info("Bereit Sheets Agent installed.");
  initializeFirebaseFromStorage().catch((error) => {
    console.warn("Bereit Sheets Agent failed to initialize Firebase on install", error);
  });
});

chrome.runtime.onStartup?.addListener(() => {
  initializeFirebaseFromStorage().catch((error) => {
    console.warn("Bereit Sheets Agent failed to initialize Firebase on startup", error);
  });
});
