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
]