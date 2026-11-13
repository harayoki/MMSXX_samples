# Poison of Snake (DEV comparison)
- Tabs: `poison-of-snake-msx-fixch.mml` (SCC5 + PSG2 + OPLL7) and `poison-of-snake-msx-scc.mml` (SCC5 + PSG2).
- These are byte-for-byte exact copies of the user's 2026-11-12 uploads (Git blob SHA: `accb664b2bafeaa484af1816a624c4458cfc7a63` and `d670fb461f121b7936ae28be51abf274964a20fd`).
- Player: unchanged official Pico 1.5.0. Sound: unchanged official 0.87.0. Existing common loader applies.
- Only approved existing addons: `gamenotes::sccSrmnd`, `gamenotes::manbowDrumkit`, `gamenotes::grdsSccDrumkit`. Official sources copied without edits, `.mjs` renamed to `.js` for static-server MIME compatibility.
- Tab change stops playback and loads the chosen MML. No JS-controlled timed FX or new custom sound.
- This is DEV only. No production workflow triggered.
