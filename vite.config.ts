import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'next/navigation': path.join(process.cwd(), 'src/mocks/next-navigation.ts'),
    },
  },
  ssr: {
    noExternal: ['nextstepjs', 'motion'],
  },
});
