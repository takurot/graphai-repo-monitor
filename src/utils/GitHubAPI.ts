import axios from 'axios';

export async function fetchGitHubRepo(repo: string, token: string) {
  const headers = { Authorization: `token ${token}` };
  const response = await axios.get(`https://api.github.com/repos/${repo}`, { headers });
  return response.data;
}