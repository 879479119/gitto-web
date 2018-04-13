import fetch from 'dva/fetch';

function parseJSON(response) {
  return response.json();
}

function parseText(response) {
  return response.text();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

const base = 'https://api.github.com';

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const newUrl = base + url;

  const token = (window.location.search.match(/token=(.*)?(&)*/) || [0, 0])[1];

  const newOption = {
    ...options,
    // headers: {
    //   Authorization: `Token ${token}`,
    // },
  };

  if (newOption.text === true) {
    return fetch(newUrl, newOption)
      .then(checkStatus)
      .then(parseText)
      .then(data => ({ data }))
      .catch(err => ({ err }));
  }
  return fetch(newUrl, newOption)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => ({ err }));
}
