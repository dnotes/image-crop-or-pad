import quickpickle from "quickpickle";

export default [
  {
    plugins: [quickpickle()],
    test: {
      name: 'node',
      setupFiles: ['test/common.steps.js', 'test/node/node.steps.js'],
      include: ['test/node/*.feature'],
    },
  },
  {
    extends: 'vite.config.js',
    plugins: [quickpickle({
      worldConfig: {
        componentDir: 'src/lib',
      }
    })],
    test: {
      name: 'browser',
      setupFiles: ['test/common.steps.js', 'test/browser/browser.steps.js'],
      include: ['test/browser/*.feature', 'src/lib/**/*.feature'],
      browser: {
        provider: 'playwright',
        enabled: true,
        instances: [
          { browser: 'chromium' },
        ],
        headless: false,
        ui: true,
      }
    },
  },
  // {
  //   plugins: [quickpickle()],
  //   test: {
  //     name: 'headless',
  //     setupFiles: ['test/common.steps.js', 'test/browser/browser.steps.js'],
  //     include: ['test/browser/*.feature', 'src/lib/**/*.feature'],
  //     ui: false,
  //     environment: 'browser',
  //     browser: {
  //       enabled: true,
  //       headless: true,
  //     }
  //   },
  // },
]