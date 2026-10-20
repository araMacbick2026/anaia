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

If the PWA shows an older version, open `/update.html` online and press **Update ANAIA now**. Finish unsaved edits in other tabs first. This explicitly activates the newest worker without clearing IndexedDB. Reload other open tabs afterward. Caregiver settings includes the same update link. The manual updater and version endpoint are intentionally not precached; the automatic update manager is part of the versioned app shell. Chat text and source-file links do not host the interactive app; use the local server or a deployed HTTPS Railway domain.

## What works

- Communication Corner: 15 bilingual starter pictures across six categories; press a picture to speak immediately; press again to repeat. Custom categories and buttons, editing, reordering, favorites, and locally stored photos. Starter safety buttons remain available and cannot be deleted.
- Play & Learn: Touch & Discover, Animal Friends, Colors & Shapes, and My Favorites. Repeatable interactions, optional generated gentle tones or device speech, no timers, scores, or penalties. Animal audio is explicitly speech of the name; animal sound recordings are not included.
- My Little World: create, edit, delete, chronological history, date filtering, simple observation counts, JSON and CSV exports. No medical predictions or inferred emotions.
- Caregiver settings: multiple local profiles, optional birthday/gender, original companions, nickname, optional avatar, English/Filipino phrases, voice and speed, larger buttons, grid density/spacing, complexity, sounds/animations, photos, export and local deletion.
- PWA: ANAIA manifest, 192/512 PNG icons, maskable icon, Apple touch icon, content-versioned shell cache, offline local records, supported browser install prompt, Safari instructions.

## Profiles, voices, companions, and Tala stories

Open **Caregiver → Profiles & voices** to add/edit a local profile (up to 10 on one device). Nickname is required; birthday and gender are optional. If no birthday is entered, choose Child, Teen, or Adult. Each profile has independent settings, buttons, journal entries, categories, and story places. Existing data remains in the initial profile without destructive migration. Switching profile stops current speech. Deleting a profile deletes only its records; the initial profile is preserved. Export all local data creates a version 2 JSON backup covering every profile, including any optional birthday/gender—keep this private. Backup import is not implemented yet.

The companion gallery introduces original Tala, Bituin, Kiko, and Maya characters, available to any profile. Their local SVG illustrations and original AAC pictograms remain available offline after caching. Caregiver-uploaded photographs still take priority over a built-in picture.

**Stories → Tala & the Little Lights** contains six complete bilingual episodes (30 pages total): *The Little Light*, *Kiko's Own Pace*, *Maya's Quiet Song*, *The Rainy-Day Parade*, *The Missing Mango*, and *The Moon’s Pajama Party*. Narrate only when the reader presses Listen, stop at any time, explore choice cards after the ending, save a bookmark, return to a saved page, and continue to the next episode. Story illustrations use gentle entrance motion and honor reduced-motion settings. This is not full video/character animation or an AI pet. No child-facing screen contains ads or purchase prompts.

**Voice flexibility:** compatible device voices are suggested using the profile's optional gender and language; age changes default pace/pitch slightly. Browser voice names are an imperfect hint: age/gender are not reliable browser metadata, and an authentic child's voice cannot be promised. A caregiver's explicit saved voice always wins. Uncheck age suggestions to use manual pitch, and adjust speed independently. Preview the actual device voice before choosing it. No voice cloning, recordings upload, or external speech service is used. English/Filipino story text is bundled; the surrounding UI is primarily English.

**Google sign-in was deferred at the user's request.** The account page is a clearly disabled design only. It cannot authenticate, create an account, or sync records, and requires no Google credentials. All child profile records remain on the device. Local profiles are not password protected and should not be mistaken for isolated cloud accounts.

See [PRODUCT.md](PRODUCT.md) for the character bible, story themes, design reasoning, and prioritized ideas for printable activity packs, routines, access modes, and future caregiver accounts.

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

## Current free plan and voluntary donations

All current features are free. The previous ₱499 upgrade and restore controls have been removed from the interface. Caregiver Settings links to **Free plan & optional donation**; no donation prompts appear on child-facing pages. Donations do not change access or grant an entitlement.

Optional Railway variables:

- `DONATION_GCASH_URL`: the owner’s verified HTTPS public GCash payment link (`gcash.com` or `mynt.xyz`, including subdomains). PHP only.
- `DONATION_USD_URL`: a separate owner-provided HTTPS USD payment link on PayPal/PayPal.me or Stripe Payment Links. Configure the destination to accept a donor-chosen amount in USD.

GCash and BPI donations use the supplied original QR images and need no payment-link variables. A QR takes priority over a configured GCash link. USD remains disabled until its separate destination is configured. Missing methods stay disabled with an accurate explanation. Both server and browser validate provider URLs; credentials, HTTP links, other domains and custom ports are rejected. These are public recipient links, never secret API credentials. Do not use an example/test recipient in production. For GCash/BPI QR transfers, copy the exact owner-supplied JPG files to `public/donations/gcash.jpg` and `public/donations/bpi.jpg`. The server advertises only present JPEG files; missing methods remain disabled. QR transfers are PHP-only, with original-image viewing/download and manual transfer instructions. These payment images are excluded from the offline shell allowlist and served with no-store headers. Do not regenerate or alter payment QR patterns. Verify each original with a banking app before claiming that scanning works. Both original JPGs were supplied in QR.zip and copied byte-for-byte. Both originals and mobile-rendered previews were decoded locally: valid checksums, PHP currency, and no fixed amount. This does not verify account ownership, receiving-bank acceptance or a completed transfer. No test payment was made.

The currency initially follows the browser’s locale region (PH → PHP, otherwise USD) and remains manually selectable. This is a suggestion, not geolocation. Amounts are validated locally with two decimal places. The review step displays the chosen amount, but a general payment link cannot prefill or verify it: donors enter and verify the amount and recipient with the provider. There is no conversion of USD to PHP, no automatic debit, transaction verification, donation history or receipt issuance. The app never displays a payment-success claim. Network/offline failures leave the app free. Payment destinations and responses are not cached by the service worker; selected amounts are not stored in child profiles or sent to ANAIA. Test a real owner-controlled link on the intended phone before enabling it publicly.

## Deferred premium architecture (inactive)

Premium is planned at **₱499 PHP paid once**, not a subscription. This earlier premium proposal is inactive; there is no current premium pricing screen. All current features remain free; there are no child-facing upgrade prompts or paywalls. No premium checkout is implemented. Voluntary donations use a separate external-provider link only when configured.

`src/entitlements.mjs` implements a fail-closed verification boundary for server-signed Ed25519 receipts. A claim must have the expected issuer/audience, paid status, product, PHP 49,900 minor units, transaction identifier, subject, and valid time window. The server never reads premium status from localStorage, IndexedDB, URL flags, or an unverified frontend setting. `/api/entitlement` is uncached and returns unavailable by default. The verifier remains unused by the free interface and is not a working purchase recovery service.

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

New connected-world browser suite: start a production server with `PORT=3010 node server.mjs` (PowerShell: `$env:PORT=3010; node server.mjs`), keep the test Chromium running, then run `node tests/world-browser.mjs`. It resets only its disposable localhost:3010 origin, not the deployed app.

### Finding installation on iPad

When ANAIA detects an iPad/iPhone outside standalone mode, a visible **Install ANAIA** link appears in the shared header on all screens, including Communication Corner, and on Home. It opens `#install` with large Safari Share → Add to Home Screen instructions. Safari cannot be forced to install by a website. Supported prompt browsers use the native prompt through the header button. Installation access hides in standalone mode; unsupported desktop browsers do not receive a misleading installation button. Actual iPad installation remains a real-device verification step.

### Steady touch and younger voice suggestions

Steady touch is enabled by default in Communication Corner and can be changed under **Caregiver → Comfort & access**. A one-finger drag beginning on a picture does not pan the page; swipe in the gutters or outside the picture grid to scroll. Pinch zoom, keyboard activation, mouse-wheel scrolling, and native release/click behavior remain available. The selected outline no longer changes a tile's size, and the message area has a stable height with internal scrolling for long phrases. This reduces movement rather than locking the entire page. If a person needs to swipe directly over pictures, turn Steady touch off. A future paged-board mode could remove the need for scrolling altogether.

A child age band now includes age 13; teen covers 14–17. ANAIA prefers a compatible device voice labeled child/kid/boy/girl when one is available. A saved explicit voice always overrides the suggestion. Browser voice names are not reliable age metadata; iPad may have no true child voice. In that case the app adjusts an available voice's pitch and pace—it does not manufacture or clone a child's voice. A genuine child-voice option would require appropriately licensed recordings or a separate reviewed speech integration. The optional OpenAI narrator reads fixed stories; it does not provide an authentic child voice.

## Kid-friendly iPad navigation and everyday moments

The ANAIA brand header stays fixed at the top. A large icon-and-word navigation bar stays at the bottom with **Home, Talk, Play, Stories, Journal, Profiles, Settings**. iPad/landscape layouts keep all seven in one row; smaller phones use two rows to preserve 64px minimum targets. The page reserves space for both bars and iPad safe areas; focus and footer links remain reachable. The footer repeats Home/Profiles/Settings and links to Everyday moments and Privacy.

Tala uses the consistent flat SVG character master, with separate lower legs, matching shoes and a wheelchair footplate. Other companion and pictogram assets remain local SVGs. Versioned v4 PNG icons use a colored-pencil smiling star, a small green awareness ribbon honoring cerebral palsy awareness, and large childlike ANAIA hand lettering, with 192/512 sizes, a safe-zone maskable version, and an Apple touch icon. Manifest and Apple icon paths point to the new files. **An already installed iPad icon may remain unchanged until iPadOS refreshes its installation metadata. A website cannot force that update; do not delete the app or clear browser data to troubleshoot without considering your local records.** The new identity is visible inside the app independently of the OS icon.

**Home → Explore everyday moments** opens optional caregiver-assisted choice-making, colors/shapes, and shared-story activities. Choices can be repeated and spoken in the current English/Filipino phrase language. There are no timers, scores, diagnostic assessments, or automatic journal entries. These ordinary interactions can complement a family's established routines between appointments but are not a replacement for OT or speech therapy and do not prescribe exercises.

The sample reference informed persistent navigation and visual warmth. Advertising remains disabled by default, with one optional development placeholder at the top of Home only. No ad component appears in the fixed header, bottom navigation, footer, or any activity.

### Communication: quick choices and sensory feedback
In Communication Corner, open **Caregiver · Quick choices**. Enter a question and two to six choices, or start each choice from a saved picture; change its words, emoji, optional photo or sound. Remove unused choices before showing the board. **Show these choices** opens a temporary board; **Full board · End quick choices** returns to the usual board. Help and Stop remain available. Temporary choices are held only in this open app session and clear on reload or profile switching. To retain them, reopen the caregiver editor and choose **Keep these choices in my board**; they become an ordinary locally saved category. Edit/delete saved choices in Caregiver settings. This does not replace the essential free board.

One and two choices expand across the available board area; larger boards retain adjustable grid density. Very short landscape viewports, long phrases, large text or an expanded caregiver editor may require scrolling so labels and controls stay usable. Picture selection gives a short raised-picture animation, with unchanged touch targets; animation preferences and device reduced motion take priority. Speech always starts immediately. Optional communication sounds are disabled by default; enable them in caregiver settings or **Touch, speech & sound options**. Water bubbles and music notes are synthesized locally and play after speech. Other words use speech only; these are gentle illustrative effects, not recorded real-world sounds. Offline voices and audio permissions depend on the device/browser. No extra audio asset download or network request is needed.

### Header Donate shortcut and Updates bell
The fixed header includes a Donate shortcut on Home and caregiver pages only; communication, play, stories, journal, companions and everyday activities hide it. The Updates bell is available throughout the app. It shows unread public announcements plus an indicator when the browser has installed a newer service worker that is waiting to activate. It never reloads an active board automatically; updates download automatically and apply when Home or Updates is idle and every open ANAIA window is ready. A visible status announces downloading, waiting and applying. The manual update page remains a recovery option. Marking announcements read saves that preference locally across profiles in this browser. Saved announcements remain readable offline. No OS push notifications, background notification service, permission prompts, sounds or pop-ups are implemented.

To publish news, edit `public/announcements.json` and deploy normally. Each entry needs a unique stable `id` (letters/numbers/hyphens, max 100), an ISO `YYYY-MM-DD` date, a title (max 140 characters) and body (max 1500). Up to 50 entries are supported; put newest first. Use a new ID for a new announcement so it appears unread. Keep all content child-appropriate, with no advertising, donations or purchase promotions: the bell can be opened from child-facing pages. Entries render as plain text with no embedded links or HTML. The JSON feed is fetched with no-store on startup or by **Check for announcements**, excluded from the offline shell cache, validated, and saved locally for offline reading. Only the public announcement content and read IDs are stored for this feature; no child records are sent to the feed. Invalid/unavailable feeds preserve the previously loaded announcements. Bundled fallback announcements support a first offline view after caching. Publishing only JSON does not require forcing a new service-worker version; existing app code can fetch the new feed on reopening or manual refresh.

### Optional OpenAI caregiver voice preview
Add a replacement project API key directly in Railway as `OPENAI_API_KEY`; never paste it into chat or commit it. The server prepares one fixed, non-personal greeting per process startup with `gpt-4o-mini-tts` / `coral`. Caregiver Settings → **Try a gentle AI voice** plays that fixed sample. It is explicitly AI-generated and does not guarantee a child voice or change communication playback. Child selections, names, profiles, custom phrases, photos and journals are never included in this provider request. Device speech remains the default and offline fallback. No visitor-supplied text or per-click generation endpoint is exposed. API charges are separate from ChatGPT, and each replica/restart can make one generation request. See `OPENAI-VOICE-SETUP.md` for setup, privacy boundaries and validation limits.

### Story Garden narration and new activities
Story Garden now has six original bilingual stories (30 pages). New episodes: **The Rainy-Day Parade**, **The Missing Mango**, **The Moon’s Pajama Party**. Play & Learn has seven activities, including **Grow a Garden**, **Picture Pairs**, and **Make a Little Scene**. These work offline after successful caching; new game rounds are temporary and restart when reopened. No timers, scores, penalties, ads, or purchases appear in these activities.

Press **Listen to story** once. The same narrator continues through the pages, with top Previous/Next, Pause/Resume and Stop controls. All picture-choice activities wait until the ending. Forward navigation is disabled while speech is active so it cannot cut off a page; pause or stop to browse manually.

All six English and six Filipino AI recordings prepare in the background, not when a child presses Listen. OpenAI `gpt-4o-mini-tts` uses one `coral` recording per book. The server then transcribes that fixed public recording with `whisper-1` word timestamps and aligns them to the shipped script. Page turns use measured speech boundaries, not text-length estimates. Unreliable alignments are withheld rather than guessed. The final activities open only on the audio-ended event. Speech recognition timing still needs real-device listening review.

Prepared public recordings and timings persist on the **256MB `anaia-public-narration` Railway volume**, mounted at `/data`, in `story-narration/`. They are keyed by a content/model version so changed stories are rebuilt. The cache contains no child data. `NARRATION_CACHE_DIR` optionally overrides its location; otherwise Railway’s injected mount path is used, or `/tmp/anaia-narration` when running without a volume. Container startup creates the cache directory and drops root privileges before starting the HTTP server. Railway storage and OpenAI generation/transcription incur usage charges; set project usage controls. Normal playback never generates or transcribes audio.

When a book opens, its prepared recording preloads. If it has not downloaded yet, the first Listen starts the device voice immediately, where one is available. A narrator is chosen before speaking and stays fixed for that story session. **About this narrator → Use prepared AI narrator** is an explicit alternative once available. A visible device option is available if AI loading fails. Network transfer can still take time; no zero-latency guarantee is made. Offline playback uses installed device voices and their completion events, with the same voice/rate/pitch for every page.

`/config.json` contains only ready recording metadata and catalogue counts. `/api/story-recording/<story>/<language>/<content-revision>` serves ready public MP3s with byte ranges and private immutable browser-cache headers. These API files are excluded from the service-worker cache; profile/journal/settings data stay local. Script version checks prevent an old app from narrating different revised text. The legacy whole-book route serves prepared recordings only and never starts generation. The older fixed-page route remains bounded for old clients. No child text, choices, profile or journal is sent to either speech API.

### Revised story lessons
The same Tala, Bituin, Kiko and Maya character designs and six saved-story IDs remain. Each five-page book now follows a concrete problem, a choice and a resolution, with the lesson and optional caregiver-assisted activity after the ending. English and Filipino scripts are both included.

| Book | Lesson |
| --- | --- |
| The Little Light | Listen before deciding how to help. |
| Kiko’s Own Pace | Take your time and share the jobs. |
| Maya’s Quiet Song | Stop when asked, then ask what would help. |
| The Rainy-Day Parade | Make another plan when things change. |
| The Missing Mango | Tell the truth and try to make things right. |
| The Moon’s Pajama Party | Ask before borrowing and respect “no.” |

End activities use story-related picture choices and a short “Try it together” invitation. Looking, using a board, partner assistance or skipping are welcome; there is no score or assessment. Borrowing, sound and picnic activities can use pictures only. Narration contains only the story, not the lesson/activity instructions. Rewritten books retain the continuous single-narrator player and top page controls. Install the latest app update to receive the revised scripts; do not clear site data or remove local records.

### Automatic app updates
ANAIA checks for a new app version when it opens, comes back into view, reconnects, and every five minutes while visible. New files download in the background. A reserved status strip below the header announces **Updating ANAIA…**, explains when it is waiting, and confirms the successful update after reopening. It does not cover controls or require a dismiss action.

Automatic activation waits until Home or Updates has been idle for at least five seconds, with no pending speech/media, temporary quick-choice board, active game/story, focused input or unsaved form. Every other ANAIA window must also report that it is safe; unknown older tabs, communication boards and unsaved caregiver edits defer activation. Pointer/keyboard input cancels a pending readiness grant. A short visible notice precedes applying and refreshing. Close another busy ANAIA window or finish its activity and return Home to let the update complete.

Only app files are replaced. IndexedDB records, profiles, photos, journals and settings are not cleared. Failed or offline downloads leave the current version available, clean the failed shell cache, and retry when connected. The previous shell cache is retained temporarily; reload attempts are bounded to prevent loops. No child data is included in update requests or cross-window messages. Browsers may suspend checks while the app is closed/backgrounded, especially on iPad; reopening online starts the checks again.

**One-time setup for older installations:** versions released before the automatic updater cannot display or run this new code themselves. Open **Settings → Check for ANAIA updates**, or `/update.html`, and press **Update ANAIA now** once after saving work in other tabs. Future releases then update automatically at a safe idle moment. The manual recovery page remains available. Do not delete the installed app or clear site data to update it.
