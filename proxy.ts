import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

// Skip API routes, Next internals, files with an extension, and generated
// metadata images, which Next serves without one: /icon, /apple-icon and the
// per-locale /{locale}/opengraph-image (the proxy would redirect /en/… away).
export const config = {
  matcher:
    '/((?!api|_next|_vercel|icon$|apple-icon$|.*opengraph-image|.*\\..*).*)',
};
