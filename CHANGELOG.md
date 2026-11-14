# Changelog

## v0.3.3 — 2026-11-14

- Reserved a fixed selection-information area in each panel. Head and Tail wrap independently based on their own controls and available width; empty, position and range states keep the waveform height unchanged. Long labels remain on one line, with the full text available on hover.
- Tail clicks now select only that position with zero width, shown as a vertical line and position time. They no longer select through the file end. Head clicks still clear selection, and dragging selects a range in both panels.
- Zero-width selection is used only for tail trimming. Playback, noise preview, silence and fade require a range. A zero-width click is no longer rounded into a one-sample range; trimming from a dragged range still uses its left edge.
- Updated Japanese/English hints and manuals, with regression coverage for position/range trimming, endpoints, keyboard edits, hover stability and narrow-screen controls.

## v0.3.2 — 2026-11-14

- Fixed waveform selection continuing on hover after pointer capture or window focus was lost. Selection now also checks the pressed mouse button and active pointer.
- Cancel an active waveform drag before wheel zoom clears the selection, preventing a subsequent pointer move from raising an error. Normal tail click-to-end selection is preserved.

## v0.3.1 — 2026-10-09

- Added **Check noise** buttons to Head and Tail, immediately before **Play selection** in the existing control rows.
- Analyze the full selection before playback: shared fixed gain constrained by the loudest sliding 50 ms RMS window, a sample-peak ceiling, and a maximum boost of +60 dB.
- Use a fixed preview profile (−18 dBFS RMS / −12 dBFS sample peak), without a level selector or separate preview row.
- Preview processing does not affect edits, Undo, or WAV exports. Silent selections do not start playback; non-finite samples are rejected.
- Added Space / Escape to stop noise playback; changing the selection also stops playback. More than two channels are averaged to mono for noise preview only.
- Added narrow-screen layout support and automated signal-processing regression checks.
- Display the app version beside its name and in the browser tab title.
- Output limits are digital sample limits, not calibrated sound-pressure or true-peak limits; lower device volume before listening.

## v0.3.0 — 2026-10-09

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
