export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function unauthorized(message = 'Unauthorized'): Response {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

export function json<T>(data: T, init?: ResponseInit): Response {
  return new Response(
    JSON.stringify(data),
    {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers
      }
    }
  );
}