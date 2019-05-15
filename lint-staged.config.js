module.exports = {
  linters: {
    '**/*.+(ts|tsx)': [
      'prettier --write \"app/**/*.{ts,tsx,scss}\"',
      'eslint app --ext .ts,.tsx',
      'git add',
    ],
  },
};
