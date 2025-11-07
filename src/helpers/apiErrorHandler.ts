export async function handleResponse<T>(response: Response, error: string): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || error || 'Request failed');
  }
  const responseData = (await response.json()) as { data: T; success: boolean };
  if (!responseData.success) {
    throw new Error(error || 'Request failed');
  }
  return responseData.data;
}
