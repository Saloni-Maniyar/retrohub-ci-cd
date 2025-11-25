import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // ✅ Vitest configuration for testing + coverage
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',              // <-- generates coverage using V8 engine
      reporter: ['text', 'lcov'],  // <-- generates lcov.info required for SonarQube
      reportsDirectory: './coverage'
    }
  }
});
