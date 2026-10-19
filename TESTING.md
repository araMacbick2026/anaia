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
