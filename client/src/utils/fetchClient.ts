import { handleHttpError } from './errorHandler';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const send = async <T>(
  url: string,
  method: Method,
  body?: unknown
): Promise<T> => {
  const response = await fetch(`${API_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    await handleHttpError(response);
  }

  return response.status === 204 ? ({} as T) : await response.json();
};

export const get = <T>(url: string) => send<T>(url, 'GET');
export const post = <T>(url: string, body?: unknown) => send<T>(url, 'POST', body);
export const put = <T>(url: string, body?: unknown) => send<T>(url, 'PUT', body);
export const del = <T>(url:string) => send<T>(url, 'DELETE');
