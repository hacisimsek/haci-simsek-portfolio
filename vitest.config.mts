import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Next turns static image imports into { src, width, height, blurDataURL };
// Vite would hand back a bare URL string, which next/image rejects.
const staticImages = {
  name: 'next-static-images',
  enforce: 'pre' as const,
  load(id: string) {
    if (!/\.(jpe?g|png|webp|avif)$/i.test(id)) return null;
    const src = JSON.stringify('/' + id.split('/').pop());
    return `export default { src: ${src}, width: 1200, height: 1600, blurDataURL: 'data:image/png;base64,iVBORw0KGgo=' };`;
  },
};

export default defineConfig({
  plugins: [react(), staticImages],
  resolve: {
    tsconfigPaths: true,
    alias: {
      'server-only': fileURLToPath(
        new URL('./tests/unit/server-only.ts', import.meta.url)
      ),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    server: {
      deps: {
        // Let Vite resolve next-intl's extensionless next/navigation import.
        inline: ['next-intl'],
      },
    },
  },
});
