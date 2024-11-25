import axios from 'axios';
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
    this.repoList = repos.split(','); // .envからリポジトリリストを取得
  }

  async collectData(): Promise<RepositoryNode[]> {
    const token = process.env.GITHUB_API_TOKEN || ''; // APIトークンを環境変数から取得（オプション）
    const headers = token ? { Authorization: `token ${token}` } : {}; // トークンがあればヘッダーを設定

    const nodes: RepositoryNode[] = [];
    for (const repo of this.repoList) {
      try {
        const response = await axios.get(`https://api.github.com/repos/${repo}`, { headers });
        const data = response.data;
        nodes.push({
          name: data.name,
          url: data.html_url,
          lastCommitDate: data.pushed_at,
        });
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error fetching data for ${repo}: ${error.message}`);
        } else {
          console.error(`Error fetching data for ${repo}:`, error);
        }
      }
    }
    return nodes;
  }
}
