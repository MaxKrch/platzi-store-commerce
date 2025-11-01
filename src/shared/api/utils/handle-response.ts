export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
}

export const isApiError = (error: unknown): error is ApiError => {
  return typeof error === 'object' && error !== null && 'status' in error;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      let errorBody = null;
     
      try {
        errorBody = await response.json();
      } catch {}

      const error: ApiError = {
        status: response.status,
        message: errorBody?.message || response.statusText,
        details: errorBody,
      };

 
      throw error;
    }

    return response.json() as Promise<T>;
  };

  export default handleResponse;