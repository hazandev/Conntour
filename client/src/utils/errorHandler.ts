const ERROR_MESSAGES: Record<number, string> = {
  400: 'Invalid request data.',
  401: 'Unauthorized – please log in.',
  403: 'Forbidden – access denied.',
  404: 'Resource not found.',
  409: 'Conflict – duplicate data.',
  422: 'Unprocessable entity.',
  500: 'Server error – please try again later.',
};

export const getErrorMessage = (status: number, fallback?: string) =>
  ERROR_MESSAGES[status] || fallback || 'Unexpected error occurred.';

export const extractErrorBody = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
};

export const handleHttpError = async (response: Response): Promise<never> => {
  const errorBody = await extractErrorBody(response);

  const message =
    typeof errorBody === 'string'
      ? errorBody
      : errorBody?.message || undefined;

  const finalMessage = getErrorMessage(response.status, message);

  const error = new Error(finalMessage);
  (error as any).status = response.status;
  (error as any).body = errorBody;

  throw error;
};
