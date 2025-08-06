import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
    type UseMutationOptions,
  } from '@tanstack/react-query';
  import { get, post, put, del } from '../utils/fetchClient';
  import { toast } from 'react-toastify';
  
  const handleError = (err: any, fallback = 'Something went wrong') => {
    const message = err?.message || fallback;
    toast.error(message);
  };
  
  const extractKeyFromUrl = (url: string): string[] =>
    url
      .replace(/^\/+/, '') 
      .split('/')
      .filter(Boolean);
  
  export const api = {
    get<T>(
      key: unknown[],
      url: string,
      options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
    ) {
      return useQuery<T, Error>({
        queryKey: key,
        queryFn: () => get<T>(url),
        ...options,
      });
    },
  
    post<T = unknown, V = unknown>(
      url: string,
      options: UseMutationOptions<T, Error, V> = {}
    ) {
      const queryClient = useQueryClient();
      const key = extractKeyFromUrl(url);
  
      return useMutation<T, Error, V>({
        mutationFn: (body) => post<T>(url, body),
        onError: (err) => handleError(err, 'Failed to create'),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
        ...options,
      });
    },
  
    put<T = unknown, V = unknown>(
      url: string,
      options: UseMutationOptions<T, Error, V> = {}
    ) {
      const queryClient = useQueryClient();
      const key = extractKeyFromUrl(url);
  
      return useMutation<T, Error, V>({
        mutationFn: (body) => put<T>(url, body),
        onError: (err) => handleError(err, 'Failed to update'),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
        ...options,
      });
    },
  
    delete<T = unknown>(
      url: string,
      options: UseMutationOptions<T, Error, void> = {}
    ) {
      const queryClient = useQueryClient();
      const key = extractKeyFromUrl(url);
  
      return useMutation<T, Error, void>({
        mutationFn: () => del<T>(url),
        onError: (err) => handleError(err, 'Failed to delete'),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
        ...options,
      });
    },
  };
  