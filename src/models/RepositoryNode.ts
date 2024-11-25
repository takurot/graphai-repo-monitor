export interface RepositoryNode {
  name: string;
  url: string;
  lastCommitDate: string | null;
  lintErrors?: number;
  linesOfCode?: number;
}