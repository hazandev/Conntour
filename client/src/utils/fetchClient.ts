import { handleHttpError } from './errorHandler';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const send = async <T>(
  url: string,
  method: Method,
  body?: unknown
): Promise<T> => {
  const fullUrl = `${API_URL}${url}`;
  console.log(`Making ${method} request to: ${fullUrl}`);
  
  const response = await fetch(fullUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  console.log(`Response status: ${response.status} for ${fullUrl}`);

  if (!response.ok) {
    console.error(`HTTP Error ${response.status} for ${fullUrl}`);
    await handleHttpError(response);
  }

  const result = response.status === 204 ? ({} as T) : await response.json();
  console.log(`Response data for ${fullUrl}:`, result);
  return result;
};

export const get = <T>(url: string) => send<T>(url, 'GET');
export const post = <T>(url: string, body?: unknown) => send<T>(url, 'POST', body);
export const put = <T>(url: string, body?: unknown) => send<T>(url, 'PUT', body);
export const del = <T>(url:string) => send<T>(url, 'DELETE');
