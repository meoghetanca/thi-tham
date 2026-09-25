# Building this fork

A trimmed build of [Handy](https://github.com/cjpais/handy) (MIT) for Vietnamese dictation.

## One-time setup

```sh
brew install cmake           # transcribe-cpp-sys builds a C++ engine with Metal
curl https://sh.rustup.rs -sSf | sh
curl -fsSL https://bun.sh/install | bash
```

**Full Xcode is required — Command Line Tools are not enough.** Two reasons:

1. A CLT-only install can ship an SDK older than the running macOS (seen here:
   MacOSX15.2 SDK against macOS 26.6), and its `swiftc` then refuses the SDK with
   `this SDK is not supported by the compiler`. The build dies compiling
   `swift/apple_intelligence_stub.swift`.
2. Apple Intelligence needs the FoundationModelsMacros plugin, which only full
   Xcode has. With CLT, `build.rs` silently compiles the _stub_ — the Cleanup
   setting appears in the UI but does nothing.

After installing Xcode:

```sh
sudo xcode-select -s /Applications/Xcode.app
sudo xcodebuild -license accept
```

`cmake` is the other one that bites: without it the Rust build fails partway
through with `is 'cmake' not installed?` after several minutes of compiling.

## Run

```sh
bun install
bun run tauri dev            # app window + hot reload
```

## Ship a real app

```sh
bun run tauri build          # .app + .dmg in src-tauri/target/release/bundle
```

The build is unsigned, so macOS blocks it on first launch: right-click the app
→ Open → Open. Anyone you share it with must do the same once.

## Pulling upstream fixes

`upstream` still points at cjpais/handy:

```sh
git fetch upstream && git merge upstream/main
```

Expect conflicts in `src/components/Sidebar.tsx`, the settings pages, and
`src-tauri/src/catalog/catalog.json` — those are the files this fork rewrote.
