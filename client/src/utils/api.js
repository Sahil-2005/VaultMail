const API_BASE = import.meta.env.VITE_API_URL || '';

export const apiFetch = async (url, options = {}) => {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
  const token = localStorage.getItem('vaultmail_token');
  
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is not FormData, default to application/json
  if (options.body && !(options.body instanceof FormData)) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    // If it's not a string, stringify it
    if (typeof options.body !== 'string') {
      options.body = JSON.stringify(options.body);
    }
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Unauthorized: clear token and redirect to login
    localStorage.removeItem('vaultmail_token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response;
};
