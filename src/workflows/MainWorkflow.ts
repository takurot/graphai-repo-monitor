import { FetchAgent } from '../agents/FetchAgent';
import { LintAgent } from '../agents/LintAgent';
import { ImprovementAgent } from '../agents/ImprovementAgent';
import { CrossRepoAgent } from '../agents/CrossRepoAgent';

export async function mainWorkflow() {
  try {
    const fetchAgent = new FetchAgent(); // 引数不要
    const nodes = await fetchAgent.collectData();

    const lintAgent = new LintAgent(nodes);
    const analyzedNodes = await lintAgent.analyze();

    const improvementAgent = new ImprovementAgent(analyzedNodes);
    const proposals = await improvementAgent.generateProposals();

    const crossRepoAgent = new CrossRepoAgent(analyzedNodes);
    const bestPractices = crossRepoAgent.generateBestPractices();

    // 個別リポジトリの提案を出力
    for (const node of analyzedNodes) {
      console.log(`Repository: ${node.name}`);
      console.log(`URL: ${node.url}`);
      console.log(`Last Commit Date: ${node.lastCommitDate}`);
      console.log(`Lines of Code: ${node.linesOfCode}`);
      console.log(`Lint Errors: ${node.lintErrors}`);
      console.log(`Proposal: ${proposals[node.name]}`);
      console.log('-----');
    }

    // リポジトリ横断的な改善案を出力
    console.log('=== Cross-Repository Best Practices ===');
    bestPractices.forEach((practice) => console.log(practice));
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in main workflow:', error.message);
    } else {
      console.error('Error in main workflow:', error);
    }
  }
}
