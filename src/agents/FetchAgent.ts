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
    this.repoList = repos.split(','); // 環境変数からリポジトリリストを取得
  }

  async collectData(): Promise<RepositoryNode[]> {
    const headers = {
      Authorization: `token ${process.env.GITHUB_API_TOKEN}`, // GitHub API トークンを利用
    };

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
        console.error(`Error fetching data for ${repo}: ${error.message}`);
      }
    }
    return nodes;
  }
}