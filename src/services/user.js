import request from '../utils/request';

export function queryProfile({ owner }) {
  return request(`/users/${owner}`);
}

export function queryRepos({ owner }) {
  return request(`/users/${owner}/repos`);
}
