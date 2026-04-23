# Amino Acid & Codon Trainer

20アミノ酸の`1-letter → 英語名`と、標準RNAコドン表の対応を覚えるためのNext.jsアプリです。

## 機能
- 5セクション学習モード（まず暗記カードで覚える）
- セクション内クイズ切替:
  - `1-letter → 英語名`
  - `コドン → アミノ酸`
- 総合テストモード（20アミノ酸 + 64コドンの全範囲）
- スコア/正答率の表示
- 64コドンの参照テーブル
- Enterで採点、もう一度Enterで次の問題へ進行

## セットアップ
```bash
npm install
npm run dev
```

## 主なファイル
- `app/page.tsx`: 学習アプリ本体の表示
- `components/BioStudyApp.tsx`: クイズUI・採点ロジック
- `lib/biochem.ts`: 20アミノ酸と64コドンのデータ
