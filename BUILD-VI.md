# Building this fork

A trimmed build of [Handy](https://github.com/cjpais/handy) (MIT) for Vietnamese dictation.

## One-time setup

```sh
brew install cmake           # transcribe-cpp-sys builds a C++ engine with Metal
curl https://sh.rustup.rs -sSf | sh
curl -fsSL https://bun.sh/install | bash
```

`cmake` is the one that bites: without it the Rust build fails partway through
with `is 'cmake' not installed?` after several minutes of compiling.

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
