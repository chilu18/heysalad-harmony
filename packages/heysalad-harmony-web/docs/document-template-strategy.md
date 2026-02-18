# Document Template & Editing Strategy

This note captures the next iteration for onboarding/visa documents so we can move
from one-off AI output to reusable, editable templates.

## Goals
- Allow admins to maintain “source of truth” templates for every document type.
- Merge structured data (employee, company, location) into templates before AI is
  invoked – apply DRY principles and minimise repeated prompts.
- Offer a post-generation editor so people can fix wording, swap logos, or add
  custom paragraphs before the PDF is published.

## Proposed Architecture
1. **Template Registry (Firestore)**
   - Collection: `documentTemplates`
   - Fields: `label`, `type`, `locale`, `content`, `placeholders[]`, `version`.
   - Store Markdown/HTML with placeholder tags e.g. `{{employee.name}}`.
   - Seed core templates once and expose CRUD UI for admins.

2. **Template Merge Pipeline**
   - When a package is generated: load template → inject structured data via
     simple token replacement → optionally send merged prompt to AI for polishing.
   - Keep both the “raw template” and “final output” for auditability.

3. **Document Editor**
   - Use a rich text editor such as TipTap/Slate on a new modal/page:
     - Tabs per document, live word count, placeholder guardrails.
     - Upload/replace logos and letterheads with preview (store assets in Storage).
   - Persist edits to Firestore `packageDocuments` subcollection before PDF export.

4. **Versioning & Approval**
   - Add optional status fields: `draft`, `needs-review`, `approved`.
   - Keep an edit history log referencing the new `systemLogs` collection.

5. **PDF Generation**
   - Render from the edited HTML using `html2canvas`/`jspdf` or server-side
     rendering to avoid layout quirks and to honour the final editor state.

This roadmap keeps today’s AI-assisted workflow but gives humans the last word,
supports brand consistency, and sets us up for more automation later.
