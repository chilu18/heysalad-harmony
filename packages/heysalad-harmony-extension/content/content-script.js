const EXTENSION_ORIGIN = new URL(chrome.runtime.getURL("")).origin;
const SIDEBAR_CONTAINER_ID = "bereit-sheets-agent-container";
const SIDEBAR_ID = "bereit-sheets-agent-sidebar";
const TOGGLE_BUTTON_ID = "bereit-sheets-agent-toggle";

let sidebarContainer = null;
let sidebarFrame = null;
let toggleButton = null;
let isSidebarVisible = true;

/**
 * Injects the sidebar iframe onto the Sheets page.
 */
async function ensureSidebar() {
  sidebarContainer = document.getElementById(SIDEBAR_CONTAINER_ID);
  if (sidebarContainer) {
    sidebarFrame = sidebarContainer.querySelector(`#${SIDEBAR_ID}`);
    return;
  }

  const container = document.createElement("div");
  container.id = SIDEBAR_CONTAINER_ID;

  sidebarFrame = document.createElement("iframe");
  sidebarFrame.id = SIDEBAR_ID;
  sidebarFrame.title = "Bereit Sheets Agent";
  sidebarFrame.src = chrome.runtime.getURL("panel/sidebar.html");
  sidebarFrame.setAttribute("loading", "lazy");

  container.appendChild(sidebarFrame);
  document.body.appendChild(container);
  sidebarContainer = container;
}

function updateSidebarVisibility() {
  if (!sidebarContainer) {
    return;
  }

  sidebarContainer.classList.toggle("bereit-hidden", !isSidebarVisible);
  sidebarContainer.style.display = isSidebarVisible ? "block" : "none";

  if (toggleButton) {
    toggleButton.dataset.state = isSidebarVisible ? "open" : "closed";
    toggleButton.setAttribute("aria-expanded", String(isSidebarVisible));
    toggleButton.setAttribute(
      "aria-label",
      isSidebarVisible ? "Hide Bereit AI Assist sidebar" : "Show Bereit AI Assist sidebar"
    );
  }
}

function showSidebar() {
  if (!sidebarContainer) {
    return;
  }
  if (isSidebarVisible) {
    return;
  }

  isSidebarVisible = true;
  ensureToggleButton();
  updateSidebarVisibility();
  const selection = collectSelectedRows();
  postToSidebar({
    type: "BEREIT::CONTEXT_UPDATE",
    payload: selection
  });
  postToSidebar({
    type: "BEREIT::STATUS",
    payload: { message: "Bereit Sheets Agent ready." }
  });
}

function hideSidebar() {
  if (!sidebarContainer) {
    return;
  }
  if (!isSidebarVisible) {
    return;
  }

  isSidebarVisible = false;
  ensureToggleButton();
  updateSidebarVisibility();
  postToSidebar({
    type: "BEREIT::STATUS",
    payload: { message: "Sidebar hidden. Use the toggle button to reopen." }
  });
}

function ensureToggleButton() {
  const existing = document.getElementById(TOGGLE_BUTTON_ID);
  if (existing) {
    toggleButton = existing;
    updateSidebarVisibility();
    return;
  }

  toggleButton = document.createElement("button");
  toggleButton.id = TOGGLE_BUTTON_ID;
  toggleButton.type = "button";
  toggleButton.textContent = "";
  toggleButton.dataset.state = isSidebarVisible ? "open" : "closed";
  toggleButton.setAttribute("aria-label", "Toggle Bereit AI Assist sidebar visibility");
  toggleButton.setAttribute("aria-expanded", String(isSidebarVisible));
  toggleButton.addEventListener("click", async () => {
    await ensureSidebar();
    if (isSidebarVisible) {
      hideSidebar();
    } else {
      showSidebar();
    }
  });

  document.body.appendChild(toggleButton);
  updateSidebarVisibility();
}

/**
 * Gather all currently selected rows inside the active sheet.
 */
function collectSelectedRows() {
  const cells = Array.from(
    document.querySelectorAll('div[role="gridcell"][aria-selected="true"]')
  );

  if (!cells.length) {
    return {
      rows: [],
      headers: [],
      notesColumnIndex: null
    };
  }

  const headerMap = buildHeaderMap();
  const notesColumnIndex = findNotesColumnIndex(headerMap);
  const rowMap = new Map();

  for (const cell of cells) {
    const rowIndex = Number(cell.getAttribute("aria-rowindex"));
    const colIndex = Number(cell.getAttribute("aria-colindex"));
    const text = cell.innerText.trim();

    if (!rowMap.has(rowIndex)) {
      rowMap.set(rowIndex, {
        rowIndex,
        valuesByColumnIndex: {},
        ordered: []
      });
    }

    const row = rowMap.get(rowIndex);
    const header = headerMap.get(colIndex) ?? `Col ${colIndex}`;
    row.valuesByColumnIndex[colIndex] = text;
    row.ordered.push({ header, colIndex, value: text });
  }

  const rows = Array.from(rowMap.values()).sort(
    (a, b) => a.rowIndex - b.rowIndex
  );

  return {
    rows: rows.map((row) => ({
      rowIndex: row.rowIndex,
      cells: row.ordered
    })),
    headers: Array.from(headerMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, header]) => header),
    notesColumnIndex
  };
}

/**
 * Build a map of column index -> header label by inspecting row 1.
 */
function buildHeaderMap() {
  const headerCells = Array.from(
    document.querySelectorAll('div[role="gridcell"][aria-rowindex="1"]')
  );
  const headerMap = new Map();

  headerCells.forEach((cell) => {
    const colIndex = Number(cell.getAttribute("aria-colindex"));
    const text = cell.innerText.trim();
    if (text) {
      headerMap.set(colIndex, text);
    }
  });

  return headerMap;
}

/**
 * Locate the Notes column index using the header map.
 */
function findNotesColumnIndex(headerMap) {
  for (const [index, header] of headerMap.entries()) {
    if (header.toLowerCase() === "notes") {
      return index;
    }
  }
  return null;
}

/**
 * Build a prompt string for OpenAI using current selection.
 */
function buildPromptFromSelection(selection) {
  const { rows } = selection;
  if (!rows.length) {
    return "No rows selected.";
  }

  const lines = [
    "Given the following rows from a Google Sheet, provide actionable notes for each row to add under the 'Notes' column:",
    ""
  ];

  rows.forEach((row) => {
    const renderedCells = row.cells
      .map(({ header, value }) => `${header}: ${value}`)
      .join(" | ");
    lines.push(`Row ${row.rowIndex}: ${renderedCells}`);
  });

  return lines.join("\n");
}

/**
 * Attempt to write the supplied suggestions into the Notes column.
 */
async function applyNotesToSheet(notes, notesColumnIndex) {
  if (!Array.isArray(notes) || notes.length === 0) {
    return [];
  }

  const results = [];
  for (const note of notes) {
    const rowIndex = typeof note.rowIndex === "number" ? note.rowIndex : null;
    const suggestion = String(note.suggestion ?? "").trim();

    if (!rowIndex || !suggestion || !notesColumnIndex) {
      results.push({ rowIndex, success: false, reason: "Missing data" });
      continue;
    }

    const cell = document.querySelector(
      `div[role="gridcell"][aria-rowindex="${rowIndex}"][aria-colindex="${notesColumnIndex}"]`
    );
    if (!cell) {
      results.push({ rowIndex, success: false, reason: "Cell not found" });
      continue;
    }

    const success = await editCell(cell, suggestion);
    results.push({
      rowIndex,
      success,
      reason: success ? undefined : "Failed to edit cell"
    });
  }

  return results;
}

async function editCell(cell, value) {
  cell.scrollIntoView({ behavior: "smooth", block: "center" });

  cell.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  cell.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
  cell.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  await wait(60);

  const enterEvent = new KeyboardEvent("keydown", {
    key: "Enter",
    code: "Enter",
    bubbles: true
  });
  cell.dispatchEvent(enterEvent);

  await wait(80);

  const editor =
    document.querySelector('div[contenteditable="true"][aria-label="Cell editor"]') ||
    document.querySelector('div[contenteditable="true"][role="textbox"]') ||
    document.querySelector('textarea[aria-label="Cell editor"]');

  if (editor) {
    editor.textContent = value;
    editor.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        data: value,
        inputType: "insertText"
      })
    );

    await wait(40);

    const commit = new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      bubbles: true
    });
    editor.dispatchEvent(commit);
    await wait(40);
    document.activeElement?.blur?.();
    return true;
  }

  const selectionMade = document.execCommand("selectAll");
  const inserted = document.execCommand("insertText", false, value);
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      bubbles: true
    })
  );
  return selectionMade && inserted;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function postToSidebar(message) {
  if (!sidebarFrame?.contentWindow) {
    return;
  }
  sidebarFrame.contentWindow.postMessage(message, EXTENSION_ORIGIN);
}

async function handleSidebarMessage(event) {
  if (event.origin !== EXTENSION_ORIGIN) {
    return;
  }
  const { type, payload } = event.data ?? {};

  if (type === "BEREIT::UI_READY") {
    const selection = collectSelectedRows();
    postToSidebar({
      type: "BEREIT::CONTEXT_UPDATE",
      payload: selection
    });
    return;
  }

  if (type === "BEREIT::REQUEST_REFRESH") {
    const selection = collectSelectedRows();
    postToSidebar({
      type: "BEREIT::CONTEXT_UPDATE",
      payload: selection
    });
    return;
  }

  if (type === "BEREIT::GENERATE_NOTES") {
    const selection = collectSelectedRows();
    if (!selection.rows.length) {
      postToSidebar({
        type: "BEREIT::ERROR",
        payload: { message: "No rows selected." }
      });
      return;
    }

    postToSidebar({
      type: "BEREIT::STATUS",
      payload: { message: "Requesting suggestions…" }
    });

    try {
      const prompt = buildPromptFromSelection(selection);
      const response = await chrome.runtime.sendMessage({
        type: "BEREIT::REQUEST_SUGGESTIONS",
        payload: {
          prompt,
          metadata: selection
        }
      });

      if (!response?.ok) {
        throw new Error(response?.error ?? "Unknown error");
      }

      const notes = response.data?.notes ?? [];
      postToSidebar({
        type: "BEREIT::SUGGESTIONS_READY",
        payload: { notes }
      });

      const results = await applyNotesToSheet(notes, selection.notesColumnIndex);
      postToSidebar({
        type: "BEREIT::WRITE_RESULTS",
        payload: { results }
      });
    } catch (error) {
      postToSidebar({
        type: "BEREIT::ERROR",
        payload: { message: error.message }
      });
    }
  }
}

async function init() {
  await ensureSidebar();
  ensureToggleButton();
  updateSidebarVisibility();
  window.addEventListener("message", handleSidebarMessage);
  postToSidebar({
    type: "BEREIT::STATUS",
    payload: { message: "Bereit Sheets Agent loaded." }
  });
}

init().catch((error) => {
  console.error("Bereit Sheets Agent failed to initialize", error);
});
