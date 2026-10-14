import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

// Skip API routes, Next internals, files with an extension, and the generated
// icons, which Next serves at /icon and /apple-icon without one.
export const config = {
  matcher: '/((?!api|_next|_vercel|icon$|apple-icon$|.*\\..*).*)',
};
