import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      isolate: false,
      // you can also disable isolation only for specific pools
      poolOptions: {
        vmThreads: {
          isolate: false,
        },
      },
      fileParallelism: false,
      setupFiles: './tests/setupTests.js', // Path to your setup file
      coverage: {
        provider: 'istanbul',
        reporter: ['text', 'json', 'html'], // Choose desired reporters
        include: ['src/**/*.{js,ts,vue}'], // Specify which files to include in coverage
        exclude: ['node_modules/**/*'], // Specify files to exclude from coverage
        reportsDirectory: './tests/coverage'
      },
    }
  })
)