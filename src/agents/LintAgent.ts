import { RepositoryNode } from '../models/RepositoryNode';

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
}