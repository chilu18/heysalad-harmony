const PARENT_ORIGIN = "https://docs.google.com";

const statusEl = document.getElementById("bereit-status");
const selectionEl = document.getElementById("bereit-selection");
const suggestionsEl = document.getElementById("bereit-suggestions");
const writeStatusEl = document.getElementById("bereit-write-status");
const refreshBtn = document.getElementById("bereit-refresh");
const generateBtn = document.getElementById("bereit-generate");
const settingsBtn = document.getElementById("bereit-open-settings");

let isGenerating = false;

function postMessageToParent(message) {
  window.parent.postMessage(message, PARENT_ORIGIN);
}

function setStatus(text) {
  statusEl.textContent = text;
}

function renderSelection(selection) {
  if (!selection?.rows?.length) {
    selectionEl.innerHTML = "<p>No rows selected.</p>";
    return;
  }

  const parts = selection.rows.map((row) => {
    const rowLabel = `<span class="sidebar__badge">Row ${row.rowIndex}</span>`;
    const cellText = row.cells
      .map(({ header, value }) => `<strong>${escapeHtml(header)}:</strong> ${escapeHtml(value)}`)
      .join("<br />");
    return `<div class="sidebar__row">${rowLabel}<div>${cellText}</div></div>`;
  });

  selectionEl.innerHTML = parts.join("<hr />");
}

function renderSuggestions(notes) {
  if (!notes?.length) {
    suggestionsEl.innerHTML = "<p>No suggestions yet.</p>";
    return;
  }

  const parts = notes.map(
    (note) =>
      `<div class="sidebar__row"><span class="sidebar__badge">Row ${note.rowIndex}</span>${escapeHtml(
        note.suggestion
      )}</div>`
  );

  suggestionsEl.innerHTML = parts.join("<hr />");
}

function renderWriteStatus(results) {
  if (!results?.length) {
    writeStatusEl.innerHTML = "<p>No writeback attempt yet.</p>";
    return;
  }

  const parts = results.map((result) => {
    const badge = `<span class="sidebar__badge">Row ${result.rowIndex ?? "?"}</span>`;
    if (result.success) {
      return `<div class="sidebar__row">${badge}✅ Note updated in sheet.</div>`;
    }
    return `<div class="sidebar__row">${badge}⚠️ ${escapeHtml(result.reason ?? "Unknown error")}</div>`;
  });

  writeStatusEl.innerHTML = parts.join("<hr />");
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toggleGenerating(flag) {
  isGenerating = flag;
  generateBtn.disabled = flag;
  refreshBtn.disabled = flag;
  generateBtn.textContent = flag ? "Generating…" : "Generate Notes";
}

refreshBtn.addEventListener("click", () => {
  postMessageToParent({
    type: "BEREIT::REQUEST_REFRESH"
  });
});

generateBtn.addEventListener("click", () => {
  toggleGenerating(true);
  setStatus("Collecting selection…");
  postMessageToParent({
    type: "BEREIT::GENERATE_NOTES"
  });
});

settingsBtn.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

window.addEventListener("message", (event) => {
  if (event.origin !== PARENT_ORIGIN) {
    return;
  }

  const { type, payload } = event.data ?? {};

  switch (type) {
    case "BEREIT::STATUS":
      if (payload?.message) {
        setStatus(payload.message);
      }
      break;
    case "BEREIT::CONTEXT_UPDATE":
      renderSelection(payload);
      if (payload?.notesColumnIndex == null) {
        setStatus("Select rows that include a 'Notes' column header in row 1.");
      } else {
        setStatus("Ready.");
      }
      toggleGenerating(false);
      break;
    case "BEREIT::SUGGESTIONS_READY":
      renderSuggestions(payload?.notes);
      setStatus("Suggestions received.");
      break;
    case "BEREIT::WRITE_RESULTS":
      renderWriteStatus(payload?.results);
      toggleGenerating(false);
      break;
    case "BEREIT::ERROR":
      setStatus(payload?.message ?? "Unexpected error.");
      toggleGenerating(false);
      break;
    default:
      break;
  }
});

postMessageToParent({
  type: "BEREIT::UI_READY"
});
