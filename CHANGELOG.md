# Changelog

## v0.3 — 2026-10-09

- Added **Remove WAV from list**, allowing tracks with no needed repairs to be discarded from the queue without downloading.
- Changed waveform time labels to **red**, improving readability over dense waveforms.
- Added **dBFS amplitude axes and reference gridlines**, linked to the per-panel display-gain setting.
- Updated waveform plotting/selection geometry to accommodate the axis gutter.

## v0.2

- Changed Head defaults to **1 second** and **+40 dB**; Tail remained at **+20 dB**.
- Added **Fade in selection** to Head.
- Made the playback button visually indicate its playing/stopped state.
- Added **Append silence** and **Trim from selection start** to Tail.
- Supported length-changing operations when generating WAV output.

## v0.1

- Initial single-file browser application for selecting and silencing Head/Tail regions and fading out Tail regions.
- Added multiple-WAV queue, waveform zoom and display gain, playback, undo, and same-name WAV download.
- Kept untouched PCM samples unchanged during compatible WAV exports.
