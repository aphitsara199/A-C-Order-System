(function (global) {
  const config = global.AC_API_CONFIG;
  async function request(path, options = {}) {
    const response = await fetch(config.baseUrl + path, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.message || `API error ${response.status}`);
    return body;
  }
  global.AC_API = Object.freeze({
    get: path => request(path),
    post: (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) }),
    put: (path, data) => request(path, { method: 'PUT', body: JSON.stringify(data) }),
    remove: path => request(path, { method: 'DELETE' })
  });
})(window);
