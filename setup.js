const fs = require('fs');
const path = require('path');

// フォルダ構成とファイル内容を定義
const structure = {
    src: {
        agents: {
            'FetchAgent.ts': `import axios from 'axios';
import * as dotenv from 'dotenv';
import { RepositoryNode } from '../models/RepositoryNode';

dotenv.config(); // .envファイルを読み込む

export class FetchAgent {
  private repoList: string[];

  constructor() {
    const repos = process.env.GITHUB_REPOS;
    if (!repos) {
      throw new Error('GITHUB_REPOS environment variable is not defined.');
    }
    this.repoList = repos.split(','); // 環境変数からリポジトリリストを取得
  }

  async collectData(): Promise<RepositoryNode[]> {
    const headers = {
      Authorization: \`token \${process.env.GITHUB_API_TOKEN}\`, // GitHub API トークンを利用
    };

    const nodes: RepositoryNode[] = [];
    for (const repo of this.repoList) {
      try {
        const response = await axios.get(\`https://api.github.com/repos/\${repo}\`, { headers });
        const data = response.data;
        nodes.push({
          name: data.name,
          url: data.html_url,
          lastCommitDate: data.pushed_at,
        });
      } catch (error) {
        console.error(\`Error fetching data for \${repo}: \${error.message}\`);
      }
    }
    return nodes;
  }
}`,
            'LintAgent.ts': `import { RepositoryNode } from '../models/RepositoryNode';

export class LintAgent {
  private nodes: RepositoryNode[];

  constructor(nodes: RepositoryNode[]) {
    this.nodes = nodes;
  }

  async analyze(): Promise<RepositoryNode[]> {
    for (const node of this.nodes) {
      node.lintErrors = Math.floor(Math.random() * 10); // Mock lint errors
      node.linesOfCode = Math.floor(Math.random() * 5000); // Mock lines of code
    }
    return this.nodes;
  }
}`,
            'ImprovementAgent.ts': `import { Configuration, OpenAIApi } from 'openai';
import { RepositoryNode } from '../models/RepositoryNode';

export class ImprovementAgent {
  private nodes: RepositoryNode[];
  private openai: OpenAIApi;

  constructor(nodes: RepositoryNode[]) {
    this.nodes = nodes;

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY, // OpenAI APIキーを取得
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generateProposals(): Promise<{ [key: string]: string }> {
    const proposals: { [key: string]: string } = {};

    for (const node of this.nodes) {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that reviews code repositories and suggests improvements.',
          },
          {
            role: 'user',
            content: \`Analyze the following repository information and suggest improvements:\\n\\n
              Repository: \${node.name}\\n
              Lint Errors: \${node.lintErrors || 0}\\n
              Lines of Code: \${node.linesOfCode || 0}\\n
              URL: \${node.url}\\n\`,
          },
        ],
      });

      const suggestion = response.data.choices[0].message?.content || 'No suggestions available.';
      proposals[node.name] = suggestion;
    }

    return proposals;
  }
}`,
        },
        models: {
            'RepositoryNode.ts': `export interface RepositoryNode {
  name: string;
  url: string;
  lastCommitDate: string | null;
  lintErrors?: number;
  linesOfCode?: number;
}`,
        },
        workflows: {
            'MainWorkflow.ts': `import { FetchAgent } from '../agents/FetchAgent';
import { LintAgent } from '../agents/LintAgent';
import { ImprovementAgent } from '../agents/ImprovementAgent';

export async function mainWorkflow() {
  try {
    const fetchAgent = new FetchAgent();
    const nodes = await fetchAgent.collectData();

    const lintAgent = new LintAgent(nodes);
    const analyzedNodes = await lintAgent.analyze();

    const improvementAgent = new ImprovementAgent(analyzedNodes);
    const proposals = await improvementAgent.generateProposals();

    for (const node of analyzedNodes) {
      console.log(\`Repository: \${node.name}\`);
      console.log(\`URL: \${node.url}\`);
      console.log(\`Last Commit Date: \${node.lastCommitDate}\`);
      console.log(\`Lines of Code: \${node.linesOfCode}\`);
      console.log(\`Lint Errors: \${node.lintErrors}\`);
      console.log(\`Proposal: \${proposals[node.name]}\`);
      console.log('-----');
    }
  } catch (error) {
    console.error('Error in main workflow:', error.message);
  }
}`,
        },
        utils: {
            'GitHubAPI.ts': `import axios from 'axios';

export async function fetchGitHubRepo(repo: string, token: string) {
  const headers = { Authorization: \`token \${token}\` };
  const response = await axios.get(\`https://api.github.com/repos/\${repo}\`, { headers });
  return response.data;
}`,
        },
        'index.ts': `import { mainWorkflow } from './workflows/MainWorkflow';

mainWorkflow().catch((error) => console.error('Error in workflow:', error.message));`,
    },
    '.gitignore': `node_modules/
dist/
.env`,
    '.env': `GITHUB_REPOS=receptron/graphai,octocat/Hello-World
GITHUB_API_TOKEN=your_github_api_token
OPENAI_API_KEY=your_openai_api_key`,
    'package.json': `{
  "name": "graphai-repo-monitor",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "ts-node src/index.ts"
  },
  "dependencies": {
    "axios": "^1.2.0",
    "dotenv": "^16.0.0",
    "openai": "^3.2.0"
  },
  "devDependencies": {
    "ts-node": "^10.9.1",
    "typescript": "^4.9.4"
  }
}`,
};

// フォルダとファイルを作成
function createStructure(base, structure) {
    for (const key in structure) {
        const value = structure[key];
        const fullPath = path.join(base, key);

        if (typeof value === 'string') {
            fs.writeFileSync(fullPath, value); // ファイルを作成
            console.log(`Created file: ${fullPath}`);
        } else {
            if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath); // フォルダを作成
            createStructure(fullPath, value); // 再帰的に処理
        }
    }
}

// 実行
createStructure(process.cwd(), structure);
