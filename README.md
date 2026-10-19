# ANAIA

An accessible, local-first communication, play, and caregiver observation app. Core features are free, with no account required. No child data, photos, journal entries, or communication selections are uploaded. This is a functional early MVP, not a medical device or substitute for professional therapy.

## Run locally

Install Node.js 22 or newer (Node 24 recommended). There are no runtime or build dependencies to download.

```sh
npm run build
npm run dev
```

On Windows PowerShell, use `npm.cmd run build` and `npm.cmd start` if script execution policy blocks `npm`. The start command works on Windows, macOS, and Linux.

Open http://localhost:3000. `npm start` serves the same production build. After changing files in `public/` or `src/sw.js`, run `npm run build` again and reload. The server serves `dist/`, not the source folder. All app routes use hash navigation, so the start URL is `/`.

This repository was empty. Dependency downloads were unavailable in the implementation environment, so this version uses native JavaScript ES modules, CSS, IndexedDB, and a Node HTTP server rather than React/TypeScript. `npm run lint` checks JavaScript syntax; it is not a full style/accessibility linter. There is no TypeScript semantic type-check command. A future migration can retain the storage schema and component boundaries.

## If the page looks blank

The source ZIP is a download, not a hosted website or interactive chat preview. Extract it first, run the commands above from its `anaia` folder, and open `http://localhost:3000` in a normal browser. Do not open `public/index.html` or `dist/index.html` directly. Opening the source HTML now shows instructions rather than an empty content area.

The page includes an initial welcome screen and recovery instructions if application JavaScript fails. Local-storage initialization is bounded: if it cannot load, starter communication remains available and writes/deletion are blocked to protect existing records. Reload to retry storage access. Do not clear site data as a first troubleshooting step because it contains local journal/photos.

If a previously installed PWA still shows an older version, close all its tabs/windows and reopen it online, allowing the updated worker to activate. Chat text and source-file links do not host the interactive app; use the local server or a deployed HTTPS Railway domain.

## What works

- Communication Corner: 15 bilingual starter pictures across six categories; press a picture to speak immediately; press again to repeat. Custom categories and buttons, editing, reordering, favorites, and locally stored photos. Starter safety buttons remain available and cannot be deleted.
- Play & Learn: Touch & Discover, Animal Friends, Colors & Shapes, and My Favorites. Repeatable interactions, optional generated gentle tones or device speech, no timers, scores, or penalties. Animal audio is explicitly speech of the name; animal sound recordings are not included.
- My Little World: create, edit, delete, chronological history, date filtering, simple observation counts, JSON and CSV exports. No medical predictions or inferred emotions.
- Caregiver settings: nickname, optional avatar, English/Filipino phrases, voice and speed, larger buttons, grid density/spacing, complexity, sounds/animations, photos, export and local deletion.
- PWA: ANAIA manifest, 192/512 PNG icons, maskable icon, Apple touch icon, content-versioned shell cache, offline local records, supported browser install prompt, Safari instructions.

## Railway deployment

No Railway project or existing deployment configuration was present. This change prepares deployment but does not deploy it.

1. Commit these source files to your GitHub repository. Do not commit `.env`, private keys, or exported family data.
2. In Railway choose **New Project → Deploy from GitHub repo**, select ANAIA, and use the repository root.
3. Railway reads `railway.json` and builds the Dockerfile. The build runs `npm run build`; the start command is `node server.mjs`. It binds `0.0.0.0` on Railway's supplied `PORT`.
4. Under service networking, generate a public domain. Railway terminates HTTPS; use the HTTPS address on phones. The health check is `/health`.
5. Leave `SHOW_BANNER_PLACEHOLDER` unset or `false`. No payment credentials are needed. `ENTITLEMENT_PUBLIC_KEY` is optional and should remain unset until the payment backend exists.
6. Confirm `/health` responds, `/manifest.webmanifest` loads, and `/sw.js` has JavaScript content type. Test the full phone checklist below before sharing with families.

Alternatively, after installing/authenticating the Railway CLI and linking the intended project/service, run `railway up` from this folder. Verify the deployment reaches SUCCESS. Do not treat a queued build as a successful deployment.

The Docker image uses Node 24 Alpine and a non-root runtime user. The app has no server-side journal/database or persistent-volume requirement: records are in each device's browser. Keep one stable HTTPS origin; moving domains creates separate browser storage. Host-level logs may contain ordinary access metadata, but the app does not log private records or put them in requests.

## Install on a real phone or tablet

First open the deployed HTTPS URL online and allow shell caching to finish. Caregiver settings shows confirmed offline readiness when the cache check succeeds. Installation availability is browser-dependent.

- **Android / supported Chrome or Edge:** when the browser offers installation, ANAIA shows an unobtrusive **Install ANAIA** button on Home. Tap it and complete the browser's prompt. You can also use the browser menu's Install app / Add to Home screen option when provided.
- **iPhone / iPad:** open the URL in Safari, use **Share → Add to Home Screen → Add**. The home page includes these instructions when it detects iOS/iPadOS and is not running standalone.
- Open the new ANAIA icon. Confirm ANAIA branding and a standalone window without normal browser address/navigation bars. This actual installation check must be done on your device; headless browser emulation cannot establish it.
- ANAIA hides its prompt button without a supported `beforeinstallprompt` event and in standalone mode. Accepting a prompt is reported only as an installation request; installation is only reported if the browser emits `appinstalled`.

## Offline test

1. Open the HTTPS app online and wait for confirmed cache readiness in caregiver settings.
2. Add a custom phrase and photo, change a setting, and save a journal observation. Export a backup.
3. Close/reopen or reload online once; confirm those records persist.
4. Switch the device to airplane mode (turn Wi-Fi off too), reopen the same URL or installed app, and reload.
5. Select Help Me and your custom picture, press a picture again to repeat its message, run all activities, and browse/edit a saved observation. Confirm they are available and new changes survive another offline reload.
6. Try speech with an installed device voice. Some browser/Filipino voices are network-only or unavailable; download device voices online first. Messages remain visible on failure. Generated tones need no audio download, but playback requires a user gesture and functioning sound output.
7. Verify the Premium entitlement check explains that it needs internet. Return online and confirm normal use resumes.

The worker precaches an explicit build-time allowlist of public app files only. No runtime cache, request logs, analytics SDK, API responses, payment responses, uploaded photos, or journal data enter Cache Storage. IndexedDB is separate and private to this origin/browser profile. The offline shell is available only after successful initial caching; an interrupted first visit is insufficient. Unknown URLs and query-string requests are not cached. Use `/` with hash routes. A new worker waits until older app tabs close before activating, to avoid replacing an active board mid-session.

Browser storage may be evicted or cleared. Private browsing is temporary. Changing device, origin, or browser profile does not transfer data. Durable-storage requests are optional and browser controlled. JSON backups include pictures and settings; journal CSV is spreadsheet-safe. Backup import and sync are not implemented yet.

## Advertising boundary

`MainPageBannerAd()` in `public/app.js` is called exclusively by `home()`. It is absent from the shared header, footer, AAC board, games, journal, settings, and premium screen. All child-facing screens are advertisement-free. No SDK, tracking pixels, real impressions, advertiser links, pop-ups, interstitials, video, floating overlays, or full-screen advertising are implemented.

- Default: completely disabled.
- `SHOW_BANNER_PLACEHOLDER=true`: shows one labeled, reserved-height development placeholder at the top of Home only. This setting enables no real ads and generates no revenue.
- To disable it completely, unset that variable or set it to `false` and restart/redeploy the server. Offline config falls back to disabled.

Before any live network is added, review its child-directed eligibility, COPPA where applicable, Philippine Data Privacy Act, relevant local/territorial consent rules, platform policies, and data practices with qualified advice. Obtain any required parental consent. Never send child selections, photos, journal content, medical information, or device identifiers derived from these records to an ad service. A provider that cannot reliably enforce the home-only placement and privacy requirements must not be enabled. Enabling a live provider is a separate reviewed integration, not a supported environment-variable switch in this MVP.

## ₱499 PHP premium architecture

Premium is planned at **₱499 PHP paid once**, not a subscription. Pricing lives in a separate caregiver screen. All current features remain free; there are no child-facing upgrade prompts or paywalls. No checkout is implemented and no money can be collected.

`src/entitlements.mjs` implements a fail-closed verification boundary for server-signed Ed25519 receipts. A claim must have the expected issuer/audience, paid status, product, PHP 49,900 minor units, transaction identifier, subject, and valid time window. The server never reads premium status from localStorage, IndexedDB, URL flags, or an unverified frontend setting. `/api/entitlement` is uncached and returns unavailable by default. The current UI's restore/check control accurately reports that configuration is incomplete; it is not a working purchase recovery service.

To finish purchases safely:

1. Choose a web payment provider supporting PHP, one-time transactions, sandbox mode, and signed webhooks. Review Philippine merchant and consumer requirements.
2. Add separate payment routes and authenticated caregiver identity or a secure recovery mechanism. Keep provider secrets server-side in Railway Variables.
3. Store purchases/entitlements in a server database, separate from children's local data. Use unique provider transaction IDs and idempotency constraints. Model pending → paid → refunded/revoked; do not grant access from redirects.
4. Verify webhook signatures using raw request bytes, and retrieve the transaction server-to-server. Check paid/captured status, exact PHP amount and product, correct merchant, and identity binding.
5. Only then issue a short-lived signed receipt from a trusted backend, using a private signing key unavailable to the frontend. Configure its matching public key for the verifier. Expiry controls re-verification, not recurring billing. Protect restore using verified account/recovery ownership and provide refund/revocation handling.
6. Test success, cancellation, duplicate delivery, wrong amount/currency, tampered signature, expiry, refunds, and restore in sandbox before production.
7. Apply premium presentation only from a verified server entitlement. This MVP deliberately has no premium unlock flag or premium-only feature enforcement yet. Essential communication must remain accessible during verification failures or offline periods.

Google Play and App Store releases require a separate digital-purchase policy review. No provider integration, database ledger, purchase issuance, refund handling, or authenticated recovery is claimed functional here.

## Accessibility & device testing

Use Tab / Shift+Tab and Enter / Space; a skip link and visible focus outlines are provided. Controls use large targets, flexible grids, meaningful labels, no hover dependencies, and reduced-motion support. Device reduced motion overrides app animations. Change columns to one for sequential access. Browser/system switches or eye-gaze tools may operate normal keyboard controls; no built-in scanning or eye tracker is included. Test compatibility on the actual access device with a caregiver.

On a real phone/tablet test portrait and landscape, browser text enlargement, safe-area/notch spacing, screen-reader labels, photo upload, every core flow, volume/mute, and standalone/offline launch. Verify selecting a picture is never treated as definitive consent. The journal/settings area is labeled caregiver-assisted, but has no PIN gate; anyone using the same unlocked browser profile can view local records. It is not encrypted at rest by ANAIA.

## Verification

```sh
npm run build
npm run lint
npm test
```

`tests/browser.mjs` uses built-in Node WebSocket and Chrome DevTools Protocol; no third-party test dependency is required. Run the app at localhost:3000 and a separate test Chromium profile with remote debugging enabled:

```sh
chromium --headless --no-sandbox --disable-dev-shm-usage --remote-debugging-port=9222 --user-data-dir=/tmp/anaia-test about:blank
node tests/browser.mjs
```

Use a disposable browser profile: the browser test clears this origin's local data. Use `--no-sandbox` only in an isolated test container where needed; normal local desktop browsers should retain their sandbox. See `TESTING.md` for observed results and verification limits.

## Prioritized roadmap

1. Family and AAC-specialist usability sessions, manual screen-reader/switch/eye-gaze review, and real Android/iOS standalone and speech testing.
2. Backup import with schema/image validation, clearer recovery guidance, and device migration.
3. Consistent bilingual UI, professionally reviewed Filipino phrases, locally licensed pictograms and animal recordings, and additional motor-access options.
4. Complete and audit authenticated payment ledger, provider sandbox integration, refunds, and recovery before enabling sales.
5. Optional consent-based encrypted sync and expanded games/themes. Assess any advertising network separately; keep live ads disabled until child-directed policies and placement can be enforced.
