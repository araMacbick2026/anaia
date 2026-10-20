# OpenAI narration and caregiver voice preview

The replacement credential belongs only in Railway’s production ANAIA service variable `OPENAI_API_KEY`. It is never included in frontend code, public configuration, source control, URLs or application logs. The credential previously pasted into the conversation was not saved or used; revoke it in the OpenAI project if not already revoked.

With a key present, each server process generates one fixed, non-personal MP3 greeting using `gpt-4o-mini-tts`, voice `coral` and gentle delivery. The public GET `/api/voice-preview` serves that same in-memory sample, including byte-range responses for Safari. Visitor clicks do not generate new billed speech. POST/custom-text requests are not supported. A failed preparation is not retried until the process restarts. One generation per replica/startup can incur OpenAI usage charges; configure project usage controls and alerts. ChatGPT subscriptions do not include API billing.

Caregiver Settings contains **Try a gentle AI voice**, with an AI-generated voice disclosure and a fixed-sample audio control. It is a preview only and does not change the communication voice. Built-in voices are not guaranteed to sound like children. There is no custom voice cloning or age/gender data sent to OpenAI. For this preview, the backend sends only the fixed greeting; child selections, names, birthdays, gender, photos, custom phrases, medical details and journal entries are not included. Essential communication continues using device speech, including offline where the device voice supports it.

The sample is held in server memory, returned with private/no-store headers and excluded from the service-worker cache. The key is never sent to the browser. The Docker runtime includes the server-only adapter. Readiness is exposed as a status string through `/config.json`, without credential values. The site stays available when OpenAI is unavailable, misconfigured or out of quota.

Validation: local unit and browser tests use mocked provider/audio responses and verify fixed input, a single generation, generic errors, request restrictions, no secret exposure, Safari range headers, caregiver-only UI and preservation of unsaved settings/device AAC. Live verification on 2026-10-20: Railway deployment 16d3c5cc-d4cb-44f9-b929-5dc1775f859a succeeded, and the server logged `OpenAI fixed preview ready; 117888 audio bytes`. The adapter validated the audio content type and MP3 signature. This confirms authenticated provider generation, not audible quality or real-device playback. User playback must still be checked on the intended phone or iPad.

Official references:
- https://platform.openai.com/api-keys
- https://platform.openai.com/docs/guides/text-to-speech
- https://platform.openai.com/docs/guides/under-18

Review current provider requirements before expanding beyond a non-personal preview. Full AI playback for communication phrases, AI-generated starter packs, persistent audio storage and multiple selectable online voices are not implemented.

## Continuous storybook narration
`GET /api/story-book/<published-story-id>/<en|fil>` sends one complete shipped story script to `gpt-4o-mini-tts`, voice `coral`. Instructions explicitly require one consistent narrator, accent, pitch and pace, without character voices or imitating children. Public MP3s are generated once per story/language per process and held in memory. There are 12 allowed combinations, two concurrent generations, a 90-second generation timeout and an 8MB audio validation limit. Failed generation is remembered until restart. The first English Little Light book prewarms at startup. Each replica/restart can generate again and incur usage charges; set project usage controls and alerts. This is not a durable billing quota.

Only shipped story scripts are accepted. Unknown books/languages, query parameters and POST requests are rejected; HEAD does not generate. No child choices, custom phrases or profile/journal data enter provider requests. The previous fixed-page `/api/story-audio/...` route is retained for older installed clients; new readers never use it. MP3s support byte ranges, use private/no-store headers and are excluded from SW caches.

One persistent audio element plays the entire story after the first user press, with Pause/Resume and Stop. Replacing the page view does not replace the recording. Automatic page turns and manual page seeking estimate text proportions; **they are approximate**, not word-aligned timestamps. A page control never requests a different voice recording. Activities wait until the ending. Narration never switches providers automatically on error. The explicit device option pins a voice/rate/pitch for all subsequent pages and continues through them using completion callbacks.

AI pronunciation, emotional delivery and real iPad playback still need human review, especially Filipino. A single take prevents page-to-page voice variations; using the same named voice does not guarantee perfectly identical timbre across separately generated books or restarts. No genuine child voice or voice cloning is promised. Device narration may need an installed offline voice. Story text and end activities remain offline after successful caching.
