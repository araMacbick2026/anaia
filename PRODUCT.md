# ANAIA: an intentional everyday world

## Product promise

Help a person express a choice, enjoy a moment, and feel included. The communication board is always reachable, free, and useful without an account. Characters are familiar guides, not rewards, diagnoses, or AI companions.

## What changed in this release

The first version had disconnected utility screens and inconsistent platform emoji. This release introduces a shared set of original vector pictograms and four reusable companions. The home page connects expression, play, stories, and caregiver observations; related links connect story endings to communication and colors/shapes. Caregivers can create distinct local profiles and choose an age group, optional birthday/gender, companion, and voice preferences. Changing profiles switches their board, journal, settings, and story progress without moving existing default-profile records.

Google sign-in is deliberately only an unavailable design, following the caregiver's request to skip implementation for now. It does not create an account, authenticate anyone, or synchronize data.

## Character bible

- **Tala:** a curious child who uses an AAC board and a wheelchair. Teal clothing, dark hair, and a small gold star clip make her recognizable. Her communication is part of ordinary life, not a problem to be cured. She is a fictional original character, not a likeness of the founder's daughter.
- **Bituin:** a gentle gold star. Bituin waits and notices; a quiet moment counts. A natural companion for cause-and-effect, pause, and bedtime stories.
- **Kiko:** a sage-green turtle. Thoughtful, unrushed, and interested in shapes and familiar objects. A natural guide for accessible sorting, choice-making, and visual routines.
- **Maya:** a warm terracotta bird. Loves music and also respects a request for quiet. A natural guide for animal, sound, rhythm, and sensory-choice activities.

No gender restricts character choice, activity access, or voice choice. A companion changes presentation, not the person's abilities or needs. These are reusable avatars/illustrations, not autonomous pets or personalized AI agents.

## Story series: Tala & the Little Lights

Series one contains three complete five-page English/Filipino stories, original vector scene illustrations, user-controlled narration, large choice cards, bookmarks, saved page position, and a next-episode journey.

1. **The Little Light / Ang Munting Liwanag:** Bituin meets Tala; pictures, movement, words, and pauses all belong. Useful language: hello, pictures, a break, water.
2. **Kiko's Own Pace / Sa Sariling Bilis ni Kiko:** the friends adapt a shape game and make objects reachable. Useful language: help, wait, colors and shapes.
3. **Maya's Quiet Song / Ang Tahimik na Awit ni Maya:** Maya asks before singing and respects a changed choice. Useful language: music, quiet, stop, again.

The reader never auto-advances, auto-plays audio, awards speed points, or infers emotions. Choice selections are spoken invitations, not comprehension tests, definite consent, or clinical observations. Motion is limited to a gentle scene entrance and respects both app settings and device reduced motion. Character-specific full animation and video are future work.

## Voice design and limits

Age suggestions slightly change pace/pitch for children (13 and under), teens (14–17), and adults. Child-labeled device voices are preferred if available; most iPads cannot be assumed to supply one. A birthday is unnecessary: a chosen age band is enough. Optional gender can suggest a device voice by its human-readable name; browsers expose no portable age/gender metadata. This is a best-effort match, not an authentic age/identity voice. Any saved explicit voice takes priority, and manual pace/pitch can override age suggestions. No child voice cloning or voice sample upload is used. A device-installed voice is preferred when compatible. Some languages and voices need internet; missing voices fall back to an available voice or visible text.

## Next improvements, in order of value

1. **Validate with families and AAC professionals:** test symbol recognition, real devices, screen readers, larger hit areas, switch/eye-gaze compatibility, accidental activation, and voices. Change the design based on observed access needs.
2. **Recovery before sync:** build validated backup import, a visible backup reminder controlled by a caregiver, and a safe profile migration flow. Current exports cover all profiles; changing device/browser still loses access without a backup.
3. **Now & Next routines:** caregiver-built two-step picture sequences such as water → rest or story → play; no timers or assumptions about compliance. Reuse each profile's existing pictures and photos.
4. **Printable/downloadable activity packs:** start with Tala's choice cards, Kiko's large shape cards, and Maya's sound-or-quiet cards. Specify A4/Letter, high contrast, grayscale alternatives, large labels, and a caregiver guide. Treat printed export as an intentional artifact, not a low-resolution screenshot. Template downloads are not implemented in this release.
5. **More communication depth:** optional multi-picture phrases, undo/stop-access options appropriate to each child's motor access, professionally reviewed Filipino symbol-language packs, and contextual boards. Preserve one-press communication for those who need it.
6. **Stories in more access modes:** a single-picture page mode, larger captions, sentence highlighting after real-device narration tests, caregiver-authored photo stories, and short non-looping animations with static alternatives. Add reading comprehension features only if optional and without scoring/punishment.
7. **Caregiver accounts and optional sync:** server-verified Google identity with caregiver consent, authenticated server authorization, per-family isolation, secure deletion/recovery, and an explicit decision about what gets synchronized. Never imply Google sign-in automatically backs up child records.
8. **Business integrations last:** complete audited one-time payments/restoration, then evaluate whether a child-directed ad network can meet the existing home-only privacy constraints. Current essential features remain free; live ads/payments remain disabled.

## Deliberate boundaries

No medical inference, emotion detection, engagement scoring, streaks, timed rewards, external AI uploads, or advertising in child-facing screens. Local profiles are not a security boundary: an unlocked shared browser can access its records. Birthdays and gender are optional; collect no full legal name, location, or medical history. Google access, cloud sync, printed templates, full character animation, live ads, and checkout must not be presented as functional until implemented and tested.

## Navigation and character refinement

The sample's useful principle is a stable spatial map: brand at the top, familiar destinations at the bottom. The iPad now has seven large picture-and-word buttons that never disappear while scrolling, with direct Home/Profiles/Settings access repeated in the footer. Small screens reserve space for a two-row bar. This reduces the need to search for a back link or precisely scroll back to a hidden menu. Advertising has no place in this shared shell; its existing top-of-Home-only boundary is preserved.

Tala's original simplified seated pose was ambiguous. The refreshed original generated illustration makes the seat, legs, paired shoes, footplate, large wheel, and front casters visually distinct. It remains a fictional character and does not use a real child's photograph. The new ANAIA wordmark/star icon provides both a word and a familiar shape at Home Screen sizes. Existing iPad icon refresh is controlled by iPadOS and remains a real-device verification task.

### Everyday support, without pretending to replace therapy

Everyday moments now implements three optional entry points: model two meaningful choices and a break; notice colors/shapes without a right-answer test; share a story with no obligation to finish. These are low-pressure interactions built from the existing AAC, play, and story tools. There is no diagnosis, exercise prescription, therapy-progress score, or guarantee of improvement after a missed appointment.

The next useful additions are (1) a paged AAC board for users who cannot comfortably scroll, (2) caregiver-created Now/Next picture routines, (3) safe backup import before any device migration, and (4) printable high-contrast Tala/Kiko/Maya activities aligned with a family's existing professional guidance. Family usability sessions should determine which access mode to build first. These remain future work rather than simulated functionality.

### Illustration direction
Use the editable SVG character masters in `public/art/`, consistently across home, profiles, stories and activities. Tala retains the original flat face, bob and star clip; her seated pose separates both lower legs, matching shoes, footplate, rear wheel and front caster. Keep flat fills, rounded dark-teal outlines, cream backgrounds and restrained sage/gold/terracotta accents. Avoid generated raster character variants, gloss, faux 3D, random textures and unrelated visual styles. These assets are code-authored illustrations, not commissioned human artwork. Have a wheelchair user and illustrator review the chair and pose before treating this as a final character model. Keep familiar AAC symbols stable; caregiver photographs remain available. Future story scenes should reuse the same character masters rather than regenerate faces or equipment per page.
