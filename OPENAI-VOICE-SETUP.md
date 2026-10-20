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

## Prepared storybook narration
The server prepares all 12 book/language combinations in a two-worker background queue. It makes one `gpt-4o-mini-tts` / `coral` recording per shipped book, then sends that **public recording only** to `whisper-1` for word timestamps. Script/timestamp alignment must meet coverage and page-end validation before a recording enters the ready catalogue. No text-length timing estimates are used. Playback never triggers speech generation or transcription.

Assets persist in `NARRATION_CACHE_DIR` or `<RAILWAY_VOLUME_MOUNT_PATH>/story-narration` (temporary `/tmp/anaia-narration` without a mount). Production uses a 256MB Railway volume at `/data`. Content-versioned MP3s and timing JSON survive restarts. Existing MP3s are reused if only timing preparation needs to be retried on restart. A completed preparation is reused without API calls until scripts or model-version settings change. Two jobs run at once; generation and timing calls each have a 90-second timeout. Configure OpenAI usage controls; generation, transcription and Railway volume storage have usage charges. No secrets are written to this public-asset cache. The app process runs as the unprivileged `node` user after its container entrypoint initializes cache ownership.

Ready catalogue entries in `/config.json` include a public source URL, script identity, measured page starts/ends and duration. `GET /api/story-recording/<published-story>/<en|fil>/<revision>` serves an already ready MP3 or promptly returns 404; arbitrary queries and POST requests are rejected. MP3s use private immutable browser caching and byte-range support. The service worker does not cache API responses. The older whole-book route now serves prepared recordings only; it never generates during a visitor request.

The selected recording preloads when its book opens. Listen uses AI only if browser media is ready; otherwise it starts a pinned device voice immediately where available. It never silently changes voices partway through a story. The explicit prepared-AI option can be chosen later. Forward controls cannot interrupt active narration. AI page turns use measured page boundaries; device page turns use completion callbacks. Activities open after the final media-ended/completion event. Slow network transfer and unavailable device voices can still limit playback; no zero-latency or real-device quality guarantee is made. AI timing/pronunciation should be reviewed on the actual iPad, especially Filipino. No authentic child voice is promised.

Only fixed shipped scripts, fixed greeting and their generated public audio reach OpenAI. Child selections, names, birthdays, gender, photos, custom phrases, medical details and journals are never included.
