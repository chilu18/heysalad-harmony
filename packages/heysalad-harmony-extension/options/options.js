const STORAGE_KEYS = {
  apiKey: "bereit_openai_api_key",
  backendSync: "bereit_backend_sync"
};

const form = document.getElementById("api-key-form");
const apiKeyInput = document.getElementById("api-key-input");
const apiKeyStatus = document.getElementById("api-key-status");
const toggleVisibilityBtn = document.getElementById("toggle-visibility");
const backendToggle = document.getElementById("backend-sync-toggle");
const backendStatus = document.getElementById("backend-sync-status");

let hasStoredApiKey = false;

async function init() {
  const stored = await chrome.storage.sync.get([
    STORAGE_KEYS.apiKey,
    STORAGE_KEYS.backendSync
  ]);

  if (stored?.[STORAGE_KEYS.apiKey]) {
    hasStoredApiKey = true;
    apiKeyStatus.textContent = "API key already stored. Submit to replace.";
  }

  backendToggle.checked = Boolean(stored?.[STORAGE_KEYS.backendSync]);
  backendStatus.textContent = backendToggle.checked
    ? "Backend sync placeholder enabled."
    : "Backend sync placeholder disabled.";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    apiKeyStatus.textContent = "Please enter a valid API key.";
    return;
  }

  apiKeyStatus.textContent = "Saving…";
  try {
    const response = await chrome.runtime.sendMessage({
      type: "BEREIT::SAVE_API_KEY",
      payload: { apiKey }
    });

    if (!response?.ok) {
      throw new Error(response?.error ?? "Unknown error");
    }

    hasStoredApiKey = true;
    apiKeyInput.value = "";
    apiKeyStatus.textContent = "API key saved successfully.";
  } catch (error) {
    apiKeyStatus.textContent = `Failed to save key: ${error.message}`;
  }
});

toggleVisibilityBtn.addEventListener("click", () => {
  const showing = apiKeyInput.type === "text";
  apiKeyInput.type = showing ? "password" : "text";
  toggleVisibilityBtn.textContent = showing ? "Show" : "Hide";
});

backendToggle.addEventListener("change", async () => {
  await chrome.storage.sync.set({
    [STORAGE_KEYS.backendSync]: backendToggle.checked
  });
  backendStatus.textContent = backendToggle.checked
    ? "Backend sync placeholder enabled."
    : "Backend sync placeholder disabled.";
});

init().catch((error) => {
  apiKeyStatus.textContent = `Failed to load settings: ${error.message}`;
});
