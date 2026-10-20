# OpenAI narration and caregiver voice preview

The replacement credential belongs only in Railway’s production ANAIA service variable `OPENAI_API_KEY`. It is never included in frontend code, public configuration, source control, URLs or application logs. The credential previously pasted into the conversation was not saved or used; revoke it in the OpenAI project if not already revoked.

With a key present, each server process generates one fixed, non-personal MP3 greeting using `gpt-4o-mini-tts`, voice `coral` and gentle delivery. The public GET `/api/voice-preview` serves that same in-memory sample, including byte-range responses for Safari. Visitor clicks do not generate new billed speech. POST/custom-text requests are not supported. A failed preparation is not retried until the process restarts. One generation per replica/startup can incur OpenAI usage charges; configure project usage controls and alerts. ChatGPT subscriptions do not include API billing.

Caregiver Settings contains **Try a gentle AI voice**, with an AI-generated voice disclosure and a fixed-sample audio control. It is a preview only and does not change the communication voice. Built-in voices are not guaranteed to sound like children. There is no custom voice cloning or age/gender data sent to OpenAI. The backend sends only the fixed greeting; child selections, names, birthdays, gender, photos, custom phrases, medical details and journal entries are not included. Essential communication continues using device speech, including offline where the device voice supports it.

The sample is held in server memory, returned with private/no-store headers and excluded from the service-worker cache. The key is never sent to the browser. The Docker runtime includes the server-only adapter. Readiness is exposed as a status string through `/config.json`, without credential values. The site stays available when OpenAI is unavailable, misconfigured or out of quota.

Validation: local unit and browser tests use mocked provider/audio responses and verify fixed input, a single generation, generic errors, request restrictions, no secret exposure, Safari range headers, caregiver-only UI and preservation of unsaved settings/device AAC. Live verification on 2026-10-20: Railway deployment 16d3c5cc-d4cb-44f9-b929-5dc1775f859a succeeded, and the server logged `OpenAI fixed preview ready; 117888 audio bytes`. The adapter validated the audio content type and MP3 signature. This confirms authenticated provider generation, not audible quality or real-device playback. User playback must still be checked on the intended phone or iPad.

Official references:
- https://platform.openai.com/api-keys
- https://platform.openai.com/docs/guides/text-to-speech
- https://platform.openai.com/docs/guides/under-18

Review current provider requirements before expanding beyond a non-personal preview. Full AI playback for communication phrases, AI-generated starter packs, persistent audio storage and multiple selectable online voices are not implemented.

## Fixed story narration
`GET /api/story-audio/<published-story-id>/<en|fil>/<zero-based-page>` narrates only a shipped public script with `gpt-4o-mini-tts` / `coral`. Unknown pages, query parameters and all POST requests are rejected. HEAD checks do not trigger generation. A request cannot choose arbitrary text, a child profile or an external URL. Gentle expressive delivery instructions request clear pacing, light character dialogue, no shouting and no invented words. AI delivery and pronunciation still need human review, especially Filipino.

The first English Little Light page prewarms once per startup. Other pages generate on first play. Shared in-memory promises prevent duplicate charges for simultaneous/repeated requests to the same page. Two concurrent generations and 60 total attempts per process are allowed; failures are sticky until restart. These are per-process controls, not a persistent account spending cap. Configure provider project usage controls and alerts. The maximum shipped catalogue is 60 language/page combinations. MP3 responses are private/no-store and excluded from SW caches. No private data is stored alongside them.

The reader explicitly labels its AI voice. Native audio controls and a Listen button start only on a user action, with Stop and device-voice fallback. No authentic child voice is promised. Communication buttons and story-choice responses continue to use device speech; those selections are never sent to OpenAI. Story text, illustrations and activities remain offline after caching, while AI narration needs internet.
