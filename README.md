# GraphAI Repository Monitor

GraphAI Repository Monitorは、GitHubリポジトリを監視し、コードの品質を分析し、改善提案を生成するためのツールです。このツールは、複数のリポジトリを効率的に監視することで、コードの保守性と品質向上を支援します。

## 特徴

- **GitHubリポジトリ監視:** GitHub APIを使用して、リポジトリの最新情報を取得。
- **コード品質解析:** Lintエラーやコードの複雑度を解析。
- **改善提案生成:** OpenAI GPTモデルを活用し、コードの改善提案を自動生成。
- **環境変数管理:** `.env`ファイルを使用して簡単にリポジトリを管理。

## 必要要件

- Node.js (バージョン16以降)
- npm
- GitHub API トークン
- OpenAI API トークン

## インストール

1. このリポジトリをクローンします。

   ```bash
   git clone https://github.com/your-username/graphai-repo-monitor.git
   cd graphai-repo-monitor
   ```

2. 必要な依存関係をインストールします。

   ```bash
   npm install
   ```

3. `.env`ファイルを作成し、以下のように設定します。

   ```plaintext
   GITHUB_REPOS=receptron/graphai,octocat/Hello-World
   GITHUB_API_TOKEN=your_github_api_token
   OPENAI_API_KEY=your_openai_api_key
   ```

## 使い方

1. 以下のコマンドでスクリプトを実行します。

   ```bash
   npm start
   ```

2. 結果がコンソールに表示されます：

   ```
   Repository: graphai
   URL: https://github.com/receptron/graphai
   Last Commit Date: 2024-01-01T00:00:00Z
   Lines of Code: 2000
   Lint Errors: 5
   Proposal: Refactor repetitive functions and improve naming conventions.
   ```

## 機能

### FetchAgent
GitHub APIを利用して、リポジトリ情報（リポジトリ名、URL、最終コミット日など）を取得します。

### LintAgent
リポジトリのコード品質を分析し、Lintエラーやコード行数を収集します。

### ImprovementAgent
OpenAI APIを使用して、コードの改善提案を生成します。

## 開発

### 開発環境の設定

1. 開発用依存関係をインストールします。

   ```bash
   npm install
   ```

2. ファイル構成は以下の通りです：

   ```
   src/
   ├── agents/
   ├── models/
   ├── workflows/
   ├── utils/
   └── index.ts
   ```

3. TypeScriptで開発し、以下のコマンドでスクリプトを実行します。

   ```bash
   npx ts-node src/index.ts
   ```

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。詳細は[LICENSE](LICENSE)をご覧ください。

## 貢献

バグ報告や機能リクエストは、[Issues](https://github.com/takurot/graphai-repo-monitor/issues)で受け付けています。
