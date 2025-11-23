type TResponseWithData<T> = {
  success: boolean;
  data: T;
};

type TResponsePlain<T> = {
  success: boolean;
} & T;

export async function handleResponse<T>(response: Response, error: string): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || error || 'Request failed');
  }

  const responseData = (await response.json()) as
    | TResponseWithData<T>
    | TResponsePlain<T>;

  if (!responseData.success) {
    throw new Error(error || 'Request failed');
  }

  if ('data' in responseData) {
    return responseData.data;
  }

  return responseData as T;
}
