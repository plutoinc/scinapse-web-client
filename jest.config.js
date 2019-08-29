module.exports = {
  preset: 'ts-jest',
  testURL: 'https://scinapse.io/',
  setupFilesAfterEnv: ['<rootDir>/jest/jestReporter.js'],
  verbose: true,
  rootDir: '',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  watchPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: 'output/coverage',
  testMatch: null,
  testRegex: '__tests__/.*_spec.tsx$',
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/app/__tests__/fileMock.js',
    '\\.(css|scss|less)$': 'identity-obj-proxy',
    'isomorphic-style-loader/withStyles': '<rootDir>/app/__tests__/withStyles.js',
  },
  unmockedModulePathPatterns: ['/.*\\.scss$', '<rootDir>/app/__mocks__', '<rootDir>/app/__tests__'],
  setupFiles: ['<rootDir>/app/__tests__/preload.tsx'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
      babelConfig: true,
    },
  },
};
