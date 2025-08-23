# 都道府県別人口推移グラフ SPA

コーディング試験で作成したアプリケーションです。
React + TypeScript + Vite で構築された都道府県別人口推移グラフを表示する Single Page Application です。

## 機能

- APIから都道府県データを取得し、チェックボックスを生成
- 選択した都道府県の人口データをAPIから取得し人口推移グラフを作成
- 人口種別のグラフを作成&切り替え

## 🛠️ 技術スタック

- **フレームワーク**: React 19.1.1
- **言語**: TypeScript 5.8.3
- **ビルドツール**: Vite 7.1.0
- **グラフライブラリ**: Recharts 3.1.2
- **テスト**: Vitest + React Testing Library
- **リンター**: ESLint + Prettier
- **スタイリング**: カスタムCSS

## 📁 プロジェクト構造

```
src/
├── components/          # React コンポーネント
│   ├── CheckBox/       # 都道府県チェックボックス
│   ├── SelectCard/     # 都道府県選択カード
│   ├── SwitchingGraphTab/ # 人口種別切り替えタブ
│   └── GraphCard/      # 人口推移グラフ
├── hooks/              # カスタムフック
│   ├── usePrefectures.ts    # 都道府県データ取得
│   └── usePopulation.ts     # 人口データ取得
├── pages/              # ページコンポーネント
├── tests/              # テストファイル
│   ├── unit/           # 単体テスト
│   └── integration/    # 統合テスト
└── App.tsx             # メインアプリケーション
```

## 🔧 設定ファイル

- `eslint.config.js` - ESLint設定
- `prettier.config.js` - Prettier設定
- `vitest.config.ts` - Vitest設定
- `tsconfig.json` - TypeScript設定
