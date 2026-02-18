# Bereit Sheets Agent (Chrome Extension)

Bereit Sheets Agent is a Manifest V3 Chrome extension that augments Google Sheets with an “AI Assist” sidebar. It reads the currently selected rows, sends their context to OpenAI’s GPT‑5 Responses API, and writes returned suggestions back to the sheet’s `Notes` column.

## Features

- Injects a right-hand “AI Assist” sidebar inside `docs.google.com/spreadsheets/*`.
- Reads selected rows directly from the active sheet and bundles them into a structured prompt.
- Securely stores the OpenAI API key with `chrome.storage.sync`.
- Calls the OpenAI Responses API from the background service worker.
- Attempts to write generated notes into the `Notes` column for each selected row.
- Provides placeholders for future Bereit backend synchronization.

## Project Structure

- `manifest.json` — Extension manifest (MV3).
- `background/service-worker.js` — Handles storage, OpenAI calls, and backend sync placeholders.
- `content/content-script.js` — Injects the sidebar, inspects the sheet, and orchestrates messaging.
- `content/content-styles.css` — Styles for the injected sidebar container and iframe.
- `panel/sidebar.*` — Standalone sidebar UI loaded via iframe.
- `options/options.*` — Options page to manage API key and backend toggle placeholder.
- `assets/icon-*.png` — Minimal icon set used by the extension.

## Setup & Usage

1. **Load the extension**
   - Open Chrome and navigate to `chrome://extensions`.
   - Enable **Developer mode**.
   - Click **Load unpacked** and select the `bereit_extension` directory.

2. **Add your OpenAI API key**
   - From the extension tile, click **Details → Extension options** (or use the sidebar link).
   - Paste your API key and click **Save Key**. The key is stored only in `chrome.storage.sync`.

3. **Use the AI sidebar**
   - Open a Google Sheet (`https://docs.google.com/spreadsheets/...`).
   - Ensure your sheet has a header row with a `Notes` column.
   - Select one or more rows (the extension reads the currently highlighted cells).
   - Open the **AI Assist** sidebar if it is not already visible.
   - Click **Generate Notes**. The extension will:
     1. Gather the selected rows and build a prompt.
     2. Request suggestions from OpenAI GPT‑5.
     3. Attempt to write each suggestion into the `Notes` column for the corresponding row.

4. **Review results**
   - The sidebar lists the rows sent, suggestions received, and writeback status (success or failure per row).

## Limitations & Next Steps

- The writeback logic relies on Google Sheets’ DOM structure and may need refinement for complex sheets or future UI changes.
- Error handling is surfaced in the sidebar, but you may need to refresh the sheet if the iframe becomes unresponsive.
- `syncWithBereitBackend` in the background service worker is a stub. Replace it with real network calls once Bereit’s backend API is available.
- The OpenAI Responses API call assumes model `gpt-5.0` and a specific JSON schema; adjust to match actual availability and desired output.

## Development Notes

- The extension uses `chrome.runtime.sendMessage` for communication between the sidebar, content script, and service worker.
- Sidebar ↔ content script communication uses `postMessage` to safely bridge the iframe boundary.
- Icons are programmatically generated placeholders; replace them with branded assets before release.

## Testing

- Load the unpacked extension and exercise the “AI Assist” flow directly in Google Sheets.
- If suggestions fail to write, check the console (`View → Developer → JavaScript console`) for diagnostics emitted by `content-script.js`.
- Validate API key storage by closing and reopening Chrome; the key should persist via sync storage.
