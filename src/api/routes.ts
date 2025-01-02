import { withAuth } from './middleware/auth.ts';
import { handleProtectedRequest } from './handlers/protected';

export async function handleRequest(request: Request) {
  const url = new URL(request.url);
  
  // Protected routes
  if (url.pathname === '/api/protected') {
    const auth = await withAuth();
    return handleProtectedRequest(auth);
  }

  return new Response('Not Found', { status: 404 });
}