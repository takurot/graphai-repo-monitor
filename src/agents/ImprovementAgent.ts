import { Configuration, OpenAIApi } from 'openai';
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
            content: `Analyze the following repository information and suggest improvements:\n\n
              Repository: ${node.name}\n
              Lint Errors: ${node.lintErrors || 0}\n
              Lines of Code: ${node.linesOfCode || 0}\n
              URL: ${node.url}\n`,
          },
        ],
      });

      const suggestion = response.data.choices[0].message?.content || 'No suggestions available.';
      proposals[node.name] = suggestion;
    }

    return proposals;
  }
}