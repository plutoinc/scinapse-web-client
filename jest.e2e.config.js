const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  preset: 'jest-puppeteer',
  testURL: 'https://scinapse.io/',
  setupFilesAfterEnv: ['<rootDir>/jest/jestReporter.js', '<rootDir>/e2eTest/jest.setup.js'],
  verbose: true,
  rootDir: '',
  transform: {
    ...tsjPreset.transform,
  },
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  watchPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: 'output/e2e',
  testMatch: null,
  testRegex: '.*_spec.ts$',
  roots: ['<rootDir>/e2eTest/'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
