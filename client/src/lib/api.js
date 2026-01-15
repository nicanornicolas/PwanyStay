const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getAuthHeaders = () => {
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('userToken');

  if (adminToken) {
    return { 'Authorization': `Bearer ${adminToken}` };
  }
  if (userToken) {
    return { 'Authorization': `Bearer ${userToken}` };
  }
  return {};
};

async function handleRes(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function get(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Accept': 'application/json', ...getAuthHeaders() },
  });
  return handleRes(res);
}

export async function post(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

export async function put(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

export async function del(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Accept': 'application/json', ...getAuthHeaders() },
  });
  return handleRes(res);
}

export default { get, post, put, del, API_BASE };
