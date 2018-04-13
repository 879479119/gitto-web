import request from '../utils/request';

export function queryProfile({ owner, repo }) {
  return request(`/repos/${owner}/${repo}`);
}

export function queryReadme({ owner, repo }) {
  return request(`/repos/${owner}/${repo}/readme`, {
    text: true,
    headers: {
      Accept: 'application/vnd.github.VERSION.html',
    },
  });
}
