# OpenAI caregiver voice preview

The replacement credential belongs only in Railway’s production ANAIA service variable `OPENAI_API_KEY`. It is never included in frontend code, public configuration, source control, URLs or application logs. The credential previously pasted into the conversation was not saved or used; revoke it in the OpenAI project if not already revoked.

With a key present, each server process generates one fixed, non-personal MP3 greeting using `gpt-4o-mini-tts`, voice `coral` and gentle delivery. The public GET `/api/voice-preview` serves that same in-memory sample, including byte-range responses for Safari. Visitor clicks do not generate new billed speech. POST/custom-text requests are not supported. A failed preparation is not retried until the process restarts. One generation per replica/startup can incur OpenAI usage charges; configure project usage controls and alerts. ChatGPT subscriptions do not include API billing.

Caregiver Settings contains **Try a gentle AI voice**, with an AI-generated voice disclosure and a fixed-sample audio control. It is a preview only and does not change the communication voice. Built-in voices are not guaranteed to sound like children. There is no custom voice cloning or age/gender data sent to OpenAI. The backend sends only the fixed greeting; child selections, names, birthdays, gender, photos, custom phrases, medical details and journal entries are not included. Essential communication continues using device speech, including offline where the device voice supports it.

The sample is held in server memory, returned with private/no-store headers and excluded from the service-worker cache. The key is never sent to the browser. The Docker runtime includes the server-only adapter. Readiness is exposed as a status string through `/config.json`, without credential values. The site stays available when OpenAI is unavailable, misconfigured or out of quota.

Validation: local unit and browser tests use mocked provider/audio responses and verify fixed input, a single generation, generic errors, request restrictions, no secret exposure, Safari range headers, caregiver-only UI and preservation of unsaved settings/device AAC. A live provider check is pending the production deployment and application of the staged replacement key. Confirm the bounded startup log `OpenAI fixed preview ready` before claiming the provider connection succeeded; this is still not a real-device listening test. User playback must be checked on the intended phone or iPad.

Official references:
- https://platform.openai.com/api-keys
- https://platform.openai.com/docs/guides/text-to-speech
- https://platform.openai.com/docs/guides/under-18

Review current provider requirements before expanding beyond a non-personal preview. Full AI playback for communication phrases, AI-generated starter packs, persistent audio storage and multiple selectable online voices are not implemented.
