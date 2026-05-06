# 452b — The CEO Operating System Site

The complete consulting site. Single React app. One deploy.

## What's in here

- `src/App.jsx` — the entire site (Home, 4SL, Diagnostic, Writing, Studio, About)
- `index.html` — shell with custom typography (EB Garamond, Fraunces, JetBrains Mono)
- `package.json` — Vite + React 18
- `vite.config.js` — Vite config
- `00-MASTER-LANGUAGE.md` — locked wording (use this when writing emails, intros, anything)
- `01-DIAGNOSTIC-SPEC.md` — the 9-question diagnostic spec
- `02-OPERATOR-READ-TEMPLATE.md` — the 5-page deliverable a $5K client receives

## How to deploy

### Option A — Replace the existing 4sl-system.vercel.app

1. Go to GitHub → `ogmferjones/4sl-system` (or wherever the current site lives)
2. Replace all files with the contents of this folder
3. Commit and push
4. Vercel auto-deploys

### Option B — Deploy fresh as 452b.io

1. Create new GitHub repo `ogmferjones/452b`
2. Drag every file from this folder into the repo
3. On Vercel: New Project → Import `ogmferjones/452b`
4. Vercel auto-detects Vite. Click Deploy.
5. After deploy, in Vercel project settings → Domains → add `452b.io` and `www.452b.io`
6. Update DNS at your registrar to point to Vercel

## Local preview

```bash
npm install
npm run dev
```

## What changed from the old 4sl-system.vercel.app

- **One unified site** instead of two competing surfaces (4sl-system + 452b.io)
- **Diagnostic shrunk** from 25 questions to 9 (operator-grade, not survey-grade)
- **Two doors instead of three tiers** ($5K Operator Read, $30K Quarterly)
- **Custom typography** (Fraunces + EB Garamond + JetBrains Mono) — no generic system fonts
- **Editorial dark theme** with kintsugi gold accents
- **Real CTA** on every page (book the read)
- **Article filter** by 4SL dimension (proves the framework with the writing)
- **Studio + range** included so prospects see the full operator, not just the consultant
- **Mailto links** to og@452b.io for actual booking (replace with Calendly/Cal.com link when ready)

## Things to update before sending to a CEO

1. Change `og@452b.io` to your actual booking email or Cal.com link in `App.jsx` (search for `mailto:`)
2. Update the LinkedIn URL on the Writing page (search for `linkedin.com/in/ogjones`)
3. If you want different article titles in the Writing section, edit the `ARTICLES` array in `App.jsx`
4. Consider adding actual Worn Faded / Soft Gods images in the Studio section (currently text-only)

## Order of operations to launch

1. Push code to GitHub
2. Deploy to Vercel
3. Point 452b.io DNS at Vercel
4. Send the link to ONE friendly CEO for feedback before broad outreach
5. Run three pro-bono Operator Reads to build proof
6. Anonymize and add as case studies to the site
7. Then partner starts sending the link
