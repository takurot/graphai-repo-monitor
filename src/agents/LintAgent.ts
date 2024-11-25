import axios from 'axios';
import { RepositoryNode } from '../models/RepositoryNode';

export class LintAgent {
  private nodes: RepositoryNode[];

  constructor(nodes: RepositoryNode[]) {
    this.nodes = nodes;
  }

  async analyze(): Promise<RepositoryNode[]> {
    for (const node of this.nodes) {
      try {
        const repoContent = await this.fetchRepoContent(node.url);
        const linesOfCode = await this.calculateLinesOfCode(repoContent);
        node.linesOfCode = linesOfCode;
        node.lintErrors = Math.floor(Math.random() * 10); // Mock lint errors for now
      } catch (error) {
        console.error(`Error analyzing repository ${node.name}:`, error);
        node.linesOfCode = 0; // Default to 0 if error occurs
      }
    }
    return this.nodes;
  }

  private async fetchRepoContent(repoUrl: string): Promise<any[]> {
    const repoPath = new URL(repoUrl).pathname.split('/').slice(1, 3).join('/'); // Extract owner/repo from URL
    const token = process.env.GITHUB_API_TOKEN || '';
    const headers = token ? { Authorization: `token ${token}` } : {};
    const response = await axios.get(`https://api.github.com/repos/${repoPath}/contents`, { headers });
    return response.data; // List of files/folders
  }

  private async calculateLinesOfCode(contents: any[]): Promise<number> {
    let totalLines = 0;
    const token = process.env.GITHUB_API_TOKEN || '';
    const headers = token ? { Authorization: `token ${token}` } : {};

    for (const content of contents) {
      if (content.type === 'file') {
        const fileResponse = await axios.get(content.download_url, { headers });
        const fileContent = fileResponse.data;
        const lines = fileContent.split('\n').length;
        totalLines += lines;
      } else if (content.type === 'dir') {
        const subDirContents = await axios.get(content.url, { headers });
        totalLines += await this.calculateLinesOfCode(subDirContents.data); // Recursive for subdirectories
      }
    }

    return totalLines;
  }
}
