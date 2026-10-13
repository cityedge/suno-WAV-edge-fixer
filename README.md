# Suno WAV Edge Fixer

**バージョン：v0.3.1**

**Sunoなどで生成したWAV音源の先頭・末尾だけを、ブラウザで手早く修正するツールです。**

冒頭・末尾の微小クリックノイズ、曲末の不自然な途切れ、余分な無音などを、波形を見ながら手動で調整できます。アルバム制作時に複数ファイルをまとめて読み込み、確認・修正した曲から順にリストを片付ける運用を想定しています。

- **インストール不要**：`index.html` を Chrome / Edge で開くだけ（オフライン動作）。
- **波形の表示ゲイン 0〜+60 dB**：実際の音源を増幅せず、極小ノイズを視認。
- **ノイズ確認（v0.3.1）**：「選択範囲を再生」の左のボタンで、小さな音を試聴用に自動増幅。出力ピークと短時間RMSで増幅量を抑え、保存するWAVは変更しません。
- **先頭**：範囲の無音化・フェードイン。
- **末尾**：範囲の無音化・フェードアウト・指定位置以降の切り詰め・無音の追加。
- **原音の維持**：対応するWAVのPCMサンプルを直接編集。未編集区間を再エンコードしません。
- **アルバム単位の作業**：複数WAVを投入し、ダウンロードした曲または問題のない曲をリストから取り除けます。
- **日本語／英語UI、ダークテーマ**。外部サーバーへのファイル送信はありません。

![Suno WAV Edge Fixer の画面（デモ用の合成波形）](docs/images/overview.png)

## 使い方（最短手順）

1. `index.html` を Chrome または Edge で開きます。あるいは、GitHub Pages で公開したページにアクセスします。
2. WAVファイルをまとめてドラッグ＆ドロップするか、左上の **「WAVを追加」** から読み込みます。
3. 左側の曲を選び、**先頭／末尾の波形上をドラッグ**して修正したい範囲を選択します。末尾波形は**クリックだけでクリック位置〜終端**を選択できます。
4. 必要なら **「ノイズ確認」** で音を聞いてから、**「選択範囲を無音」「選択範囲をフェードイン／アウト」** などを実行します。**「元に戻す」**、通常音量での選択範囲の再生も利用できます。
5. **「保存してリストから削除」** を押すと、元と同じファイル名のWAVのダウンロードを開始し、曲をリストから外します。修正不要な曲は、左の **「WAVをリストから削除」** でダウンロードせずに外します。

操作の詳細、波形のdBFS目盛り、制限事項、ショートカットは **[ユーザーマニュアル（日本語）](USER_MANUAL.md)** を参照してください。 / **[English user manual](USER_MANUAL_EN.md)**

## 対応形式・動作環境

- **入力／出力**：非圧縮のRIFF/WAVE形式のWAV。整数PCM（8 / 16 / 24 / 32-bit）、IEEE Float（32 / 64-bit）。一般的なPCM／FloatのWAVE_FORMAT_EXTENSIBLEも対象です。
- **推奨ブラウザ**：デスクトップ版の最新Chrome / Edge（Windows 11など）。ローカルファイルとして開く場合もサーバーは不要です。
- **保存先**：ブラウザのダウンロード設定に従います。通常は「ダウンロード」フォルダーです。元ファイルに同名で上書き保存する機能はありません。
- **非対応**：MP3などWAV以外の音声形式、圧縮WAV、RF64 / WAVE64などの特殊コンテナ。特殊なメタデータを持つWAVは十分に検証されていません。

**注意：** 波形の表示ゲインは描画用で、WAV出力や試聴音量を大きくするものではありません。保存ボタンを押すとブラウザにダウンロードを要求し、リストから曲を取り除きます。ブラウザがダウンロードをブロックした場合でもリストから外れる可能性があるため、ダウンロード結果を確認してください。リストからの削除は元ファイルを削除しません。

## リポジトリ構成

```text
suno-wav-edge-fixer/
├── .gitignore          # 作業用生成物の除外設定
├── index.html          # アプリ本体（CSS / JavaScriptを内包）
├── README.md           # 概要と導入方法
├── USER_MANUAL.md      # 詳細ユーザーマニュアル（日本語）
├── USER_MANUAL_EN.md   # Detailed user manual (English)
├── CHANGELOG.md        # 変更履歴
├── LICENSE             # MIT License
├── tests/
│   └── noise_preview.cjs # ノイズ確認の検証（Node.js、実行は任意）
└── docs/images/
    └── overview.png    # サンプル画面
```

ビルド、依存パッケージのインストール、APIキー、外部ライブラリは不要です。GitHub Pagesで公開する場合は、リポジトリの **Settings → Pages** で公開元を **main / (root)** に設定できます（GitHub上の設定や表示名は変更される場合があります）。

## 開発時の検証

Node.jsがある環境では、このアプリのフォルダーから `node tests/noise_preview.cjs` を実行すると、試聴のピーク／RMS上限、無音・不正値、ステレオ、元音源とWAV出力の保持を検証できます。実際の音は出しません。

## ライセンス

MIT License — Copyright (c) 2026 cityedge. 詳細は [LICENSE](LICENSE) を参照してください。

このアプリは非公式の音声編集ツールであり、Sunoとの提携・承認を示すものではありません。

---

## English overview

**Suno WAV Edge Fixer v0.3.1** is a lightweight, offline, browser-based editor for cleaning up the **beginning and end** of WAV tracks. Inspect very quiet clicks using display-only gain (+0 to +60 dB), audition them with **Check noise**, silence a selection, apply a linear fade-in/out, trim the end, or append silence. Queue multiple tracks, download each edited WAV under its original filename, or remove unaffected tracks from the list without downloading them.

Open `index.html` in desktop Chrome or Edge; no installation, build process, server, or upload is required. The interface supports both Japanese and English. Output remains in the source WAV's sample rate, channel count and sample format. **See the [English user manual](USER_MANUAL_EN.md)** for steps, shortcuts and limitations. Licensed under the [MIT License](LICENSE).
