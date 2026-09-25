<div align="center">
  <img src="assets/logo.png" width="120" alt="">
  <h1>Thì thầm</h1>
  <p><strong>Vietnamese speech-to-text for your Mac. Offline, free, and private.</strong></p>
</div>

Press a key, speak Vietnamese, and the text appears wherever your cursor is — in
Zalo, Word, Gmail, Slack, anywhere you can type.

Everything runs on your own computer. No account, no subscription, no audio ever
leaves your Mac. It works on a plane.

---

## Install

**1. Download the app**

Grab `Thì thầm_0.9.7_aarch64.dmg` from the
[latest release](https://github.com/meoghetanca/thi-tham/releases/latest), open
it, and drag **Thì thầm** into your Applications folder.

**2. Open it the first time — this part is important**

The app is not signed by Apple, so a normal double-click shows
_"Thì thầm cannot be opened because the developer cannot be verified."_
That is expected. To get past it:

> **Right-click** the app → **Open** → **Open**

You only ever do this once. Afterwards it opens normally.

> Signing an app costs $99/year through Apple's developer program. This is a
> small tool shared between colleagues, so it isn't signed. The warning is about
> the missing signature, not about anything being wrong with the app.

**3. Grant two permissions**

macOS will ask for these the first time you use it. Both are required:

| Permission        | Why it's needed                                                       |
| ----------------- | --------------------------------------------------------------------- |
| **Microphone**    | To hear you                                                           |
| **Accessibility** | To type the text into other apps, and to notice the keyboard shortcut |

Accessibility shows a strong warning about controlling your computer. That is the
standard macOS wording for any app that types on your behalf.

If you miss the prompts, grant them later in
**System Settings → Privacy & Security**.

**4. Download a speech model**

Open **Advanced → Model** and download one. It downloads once and then works
offline forever.

---

## Using it

| Action                  | How                                     |
| ----------------------- | --------------------------------------- |
| Dictate                 | Hold **Option + Space**, speak, release |
| Dictate from the window | Click the big microphone on **Home**    |
| Cancel a recording      | **Escape**                              |
| See what you dictated   | **History**                             |

The text is pasted wherever your cursor was, so click into the message or
document first, then speak.

---

## Choosing a model

Four are available, and the choice genuinely matters:

| Model                       | Size   | Accuracy | Best for                                                        |
| --------------------------- | ------ | -------- | --------------------------------------------------------------- |
| **Whisper Large v3 Turbo**  | 845 MB | ★★★★     | **Recommended.** Handles English words inside Vietnamese speech |
| Whisper Medium              | 793 MB | ★★★★     | Similar, slightly less accurate                                 |
| Moonshine Base (Vietnamese) | 73 MB  | ★★       | Small and instant, Vietnamese only                              |
| Moonshine Tiny (Vietnamese) | 33 MB  | ★        | Smallest, Vietnamese only                                       |

**The Moonshine models are Vietnamese-only.** If you say _"cái deadline này bị
delay rồi, team mình phải meeting lại với client"_ — which is how most people
actually speak at work — they cannot transcribe the English words at all. They
come out as nonsense Vietnamese.

Whisper Large v3 Turbo handles that mixture. On an Apple Silicon Mac it
transcribes a sentence in about a second, so "slower" is not something you feel.

---

## Transcript cleanup

**Advanced → Transcript cleanup** runs your text through Apple Intelligence
after transcribing, on your Mac, for free.

It fixes punctuation and capitalisation, and repairs English words the speech
model mangled. Testing showed _"team mình phải meeting lại với client"_ coming
out as _"Tim mình phải mi tìm lại với quai ẩn"_ — cleanup reconstructs that from
context, which no speech model can do on its own.

Use **Option + Shift + Space** to dictate with cleanup, or plain **Option +
Space** for raw text.

Requires Apple Intelligence to be available on your Mac.

---

## Building from source

You need [Rust](https://rustup.rs/), [Bun](https://bun.sh/), `cmake`, and
**full Xcode** — Command Line Tools alone are not enough.

```sh
brew install cmake
xcode-select --install          # then install Xcode from the App Store
sudo xcode-select -s /Applications/Xcode.app
sudo xcodebuild -license accept

git clone https://github.com/meoghetanca/thi-tham.git
cd thi-tham
bun install
bun run tauri dev               # run with hot reload
bun run tauri build             # produce the .app and .dmg
```

Two things that will waste your afternoon if you skip them:

- **Without `cmake`** the build fails several minutes in with
  `is 'cmake' not installed?`, after other crates have already compiled.
- **Without full Xcode**, Apple Intelligence is silently compiled out — Cleanup
  appears in the interface but does nothing. Command Line Tools can also ship an
  SDK older than your macOS, which fails the Swift build outright.

See [BUILD-VI.md](BUILD-VI.md) for more.

---

## Credits

Thì thầm is a fork of **[Handy](https://github.com/cjpais/Handy)** by CJ Pais,
used under the MIT License. Handy does the hard parts — the audio pipeline,
local inference, the global shortcut, and pasting into other applications.

This fork adds Vietnamese-first defaults, a trimmed interface, a Home screen with
a live microphone meter, and its own identity. It does **not** self-update, so it
will never replace itself with upstream Handy.

Speech recognition uses [Whisper](https://github.com/openai/whisper) and
[Moonshine](https://github.com/moonshine-ai/moonshine) models, running locally
through [ggml](https://github.com/ggml-org/ggml).

## License

[MIT](LICENSE) — Copyright (c) 2025 CJ Pais, and contributors to this fork.
