# ANAIA validation record

Implementation session: 20 October 2026 (Asia/Manila). Tested the production `dist/` build in headless Chromium on local HTTP localhost, which browsers treat as a secure context. No Railway deployment or real-device installation was performed.

## Passed

- `npm run build`: dependency-free production asset copy and content-versioned worker generation.
- `npm run lint`: Node syntax parsing of application, storage, data, server, entitlement verifier, build script, and generated worker. This is a syntax check, not ESLint or a semantic TypeScript check. TypeScript is not installed/configured.
- `npm test`: starter bilingual safety data, HTML escaping, valid manifest/icon dimensions and PNG signatures, static home-only ad boundary, public-cache allowlist, server headers/routes, default and enabled banner configuration, and signed-receipt rejection for missing keys, forged, expired, unpaid, or wrong-amount claims.
- Production browser flows (`tests/browser.mjs`): AAC selection and dispatch of the selected phrase into speech synthesis; custom category and bilingual phrase creation; favorite selection; image upload/rasterization; custom button editing/deletion; settings and button persistence after reload.
- All four activities respond to repeated selection; My Favorites uses caregiver-marked pictures.
- Journal creation, edit, chronological display, date filter, JSON/CSV download dispatch, and delete.
- Responsive widths 360, 768, and 1024 CSS pixels, including landscape: Home, communication, activities, journal, and caregiver screens have no horizontal overflow. Keyboard Tab moves focus to an interactive element; visible focus was reviewed in the mobile screenshot.
- Service-worker activation and shell precache; network disabled using Chrome DevTools; successful offline full reload, selection of Help Me and saved custom pictures, and browsing saved journal observations. Offline edits are also covered by the browser suite.
- Cache contents contain only public shell assets, never `/api/` or configuration responses. No runtime JavaScript exceptions in the full browser flow.
- A second server with `SHOW_BANNER_PLACEHOLDER=true` (`tests/banner-browser.mjs`): exactly one placeholder at the top of Home, none on communication, play, journal, settings, premium, or privacy, and exactly one on return to Home.
- Simulated supported install offer: the Install control invokes the supplied browser prompt, reports only an installation request after acceptance, and then hides. This is an event-flow test, not an actual installation.
- Chromium `Page.getAppManifest`: ANAIA manifest parsed with no errors. Icon PNG dimensions validated directly.

## Not established by these tests

- Actual OS installation, launch from a home-screen icon, native branding/splash rendering, and standalone display on Android/iOS/iPadOS. Manifest configuration supports these behaviors, but they require a real-device test.
- Audible speech quality, Filipino device voice availability, speaker routing, offline voice engines, and assistive switch/eye-gaze compatibility. The test verifies speech API dispatch, not audible playback. No animal recordings are included.
- Complete manual WCAG audit, screen-reader flow, contrast analyzer, touch usability with families, or a full physical-device safe-area inspection. Layout/focus/labels were inspected; these checks do not certify accessibility.
- Payment provider, checkout, authenticated restore, transaction ledger, refunds, or premium feature unlock. Only the fail-closed cryptographic verification boundary is implemented and tested.
- Live ad network, eligibility, consent, or revenue. No network is integrated.
- Docker image build in Docker, Railway HTTPS deployment, long-term browser storage retention/eviction, cross-browser offline behavior, backup import, or cross-device sync.

See README for real-device, installation, offline, and deployment checklists. Do not treat the manifest alone as proof of installation or local tests as proof of a deployed service.

## Startup recovery follow-up

Production build, syntax checks, core/unit suites, full browser/offline flows, and the banner-placement suite passed after the startup changes. Startup browser tests also passed with the main module blocked and with IndexedDB held unresponsive: recovery guidance appears, the starter AAC board becomes available after the storage timeout, and writes are blocked to avoid replacing unloaded records. The direct-file instruction branch is covered by a VM unit test; direct file navigation is unavailable to this test browser.

## Windows server fix

Replaced the POSIX-only static-file prefix check with platform-aware relative-path containment. Added Windows/POSIX tests covering valid pages/icons, parent/sibling escapes, and cross-drive paths. Build, syntax checks, and automated suites pass on Linux using Node Windows path semantics; native Windows runtime testing remains to be confirmed on the user device. npm start now runs node server.mjs without shell-specific environment assignment.

## Direct communication speech

Removed Speak, Repeat speech, and Clear message controls. Every communication picture activation dispatches its phrase immediately, including consecutive activations of the same picture. Browser tests verify the sequence Water, Water, Help Me and the absence of the removed controls. Audible playback still depends on device/browser voices.

## Connected profiles, companions, and Tala series release

- Build and syntax checks passed. Automated suites cover optional/invalid birthdays, exact child/teen/adult age transitions, optional gender suggestions, explicit voice override, manual pitch, Filipino/Tagalog voice tags, complete bilingual story content, scene references, and SVG response MIME types.
- `tests/world-browser.mjs` passed on the updated production server at localhost:3010: legacy/default records preserved; separate child/teen/adult profiles; isolated journals/boards; birthday/gender and voice settings; repeat-click and native Enter speech dispatch; character selection; original illustrated story narration and choices; all 15 pages and series completion; library/next-episode navigation; bookmarks and reload persistence; Filipino text; nine routes plus story reader at 360, 768, and 1024px widths without horizontal overflow; offline illustration loading and progress; profile deletion preserving other records; and a clearly disabled Google sign-in design. No runtime exceptions were observed.
- Existing core browser flow, home-only enabled ad-placeholder suite, and startup/storage-failure suites were rerun and passed after the new build. No private profile/journal data is sent to a server or cached in the service-worker cache.
- Speech tests inspect dispatched utterance text, selected voice, rate, and pitch. They do not establish audible voice gender/age, voice quality, availability on a real device, or physical assistive-device usability. Real-device installation and manual screen-reader review remain necessary.
- Local profiles are not authenticated accounts. Google sign-in, cloud sync, downloadable activity templates, full character animation, checkout, and live ads remain unimplemented. These are explicitly described as future work in the app and PRODUCT.md.

## Explicit stale-version recovery

`tests/update-browser.mjs` reproduced a cache-first old app with another controlled tab kept open, installed the new service worker through `/update.html`, requested activation only after pressing Update, and confirmed the new home screen loaded. Existing IndexedDB settings, birthday/gender profile information, and private journal records were unchanged. The update route and version endpoint are not precached; no site-data clearing is used. Build, syntax, and automated suites passed.

## Visible iPad installation

`tests/install-browser.mjs` passed iPad-style MacIntel/touch detection, Install ANAIA visibility from Communication Corner, navigation to full Safari Share/Add to Home Screen instructions, 360/768/1024px layouts, hiding the header option in standalone mode, and use of the browser prompt when supported. Acceptance reports only an installation request. These are Chromium simulations; actual Safari Home Screen installation still needs a real iPad check. Build, syntax, and automated checks passed.

## Steady touch and child-voice selection

Build, syntax, and automated tests passed, including ages 13/14/18, a child-labeled voice preference, and explicit adult-voice override. `tests/touch-browser.mjs` passed real Chromium emulated touch events at tablet dimensions: dragging from a picture did not pan the page; repeated native taps dispatched speech once each; selected tile/message geometry remained stable; scrolling from gaps still worked; disabling Steady touch persisted through reload. These tests do not establish the touch feel or available voices on a real iPad. No voice cloning or external speech integration was added.

## Character, icon, fixed iPad shell, and everyday activities

- Generated Tala artwork was visually inspected for two distinct legs/shoes supported on the wheelchair footplate. New ANAIA wordmark/star icons were visually reviewed; PNG dimensions and WebP headers are checked automatically. This is visual product QA, not a clinical wheelchair-fitting assessment.
- Build, syntax, and six automated test files passed. New tests cover navigation destinations, hidden decorative icon semantics, versioned Apple icon dimensions, valid WebP, and English/Filipino everyday-choice labels.
- `tests/shell-browser.mjs` passed on the production build at 768×1024, 1024×768, 390×844, and 844×390: fixed header and seven visible 64px+ navigation targets, no horizontal overflow, no overlap between bars, Home/Profiles/Settings footer links, keyboard-focused profile input and final AAC tile remain visible, new Tala/manifest/Apple icon references, repeated choice speech, play/story connections, and offline new-image/activity loading. Screenshots were visually reviewed.
- `tests/touch-browser.mjs` passed after the shell redesign: picture drag suppression, repeated tap speech, stable selection geometry, gap scrolling, and persisted caregiver override.
- `tests/update-browser.mjs` passed after the new asset bundle: upgrading from an older cache with another tab open preserved saved records.
- `tests/shell-ad-browser.mjs` passed with the development placeholder enabled: one banner first in Home; none in the header, navigation, footer, communication, play, stories, journal, profiles, settings, companions, account design, or everyday activities.
- Real iPad Home Screen icon refresh, physical touch comfort, screen-reader use, zoom/text enlargement, and software-keyboard behavior need real-device checks. No therapy efficacy, automatic icon replacement, or standalone installation has been inferred from Chromium simulation.

## Adaptive communication and quick choices (2026-10-20)
`node tests/communication-browser.mjs` checks two-choice geometry at 768×1024, 1024×768, 390×844 and 844×390; editor creation/add/remove/edit; direct saved-picture shortcuts; repeated speech dispatch; native Enter activation; reduced-motion suppression; saving a local category; persistence and offline reload; saved custom-button deletion; returning to the original board; optional sound preference persistence; and temporary-board reset on reload. Short landscape screens retain scrolling rather than clipping labels or shrinking touch targets. `node tests/touch-browser.mjs` checks actual emulated touch drags/taps, stationary selection geometry and scrollable gutters. `tests/communication.test.mjs` checks editor escaping, optional related sound generation, bounded gain and cancellation. Speech dispatch is observed with a browser stub; real iPad voice quality, audible synthesized effects and subjective animation comfort still require testing on the family's device. No recorded sound library is integrated; water/music effects are locally synthesized and other phrases use speech only.

## Free plan and caregiver donations (2026-10-20)
`node tests/donations-browser.mjs` checks the supplied original GCash and BPI JPGs, byte-identical HTTP responses, loading and aspect ratio at 390×844, 768×1024 and 1024×768, original-image/download links, PHP/US-dollar symbols, amount validation, unverified-transfer wording, unavailable USD checkout, no donation prompts on child-facing routes, the old pricing URL showing the free plan, and offline communication. QR images and /config.json are excluded from Cache Storage and use no-store responses. `tests/qr-assets.test.mjs` records the hashes of the exact user-supplied originals and checks build copies. Unit/server tests cover locale suggestions, amount boundaries, provider URL validation, PHP-only QR selection and original-image routes.

Both original JPGs from QR.zip and the rendered phone previews decoded using the local libzbar decoder. Both EMV payloads have valid CRC-16 checksums, currency 608 (PHP), country PH, and no embedded fixed amount. Rendered payload hashes match their originals. The initial smooth-downscaled preview failed decoding; CSS pixelated rendering fixed that test without modifying the source files. Raw account payloads were not printed or copied into application code. This is a decoder check, not a real bank transfer or banking-app acceptance test. No transfer, account-ownership check, transaction verification, receipt or USD checkout has been tested or claimed. Donors must confirm the recipient, amount and any fees in their payment app.

## Header shortcuts and announcements (2026-10-20)
`node tests/updates-browser.mjs` checks 320/390-pixel phones and iPad portrait/landscape; 64-pixel header targets, automatic spacing below the fixed header, Donate visibility only on Home/caregiver routes, native keyboard activation of the bell, reading and persisted read state across reload, detection of a new feed item, failed-refresh preservation, offline announcement reading/marking, JSON exclusion from service-worker caches, and coexistence with simulated iOS install instructions. It installs a genuinely waiting test service worker and verifies the update indicator and explicit update link appear without navigating/reloading the current app. The test announcement and worker version are local fixtures only. Unit tests cover feed constraints, stable unread IDs and child-appropriate bundled news. Real iPadOS layout and OS push are not tested; OS push is not implemented.
