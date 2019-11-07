module.exports = {
  linters: {
    'app/**/*.+(ts|tsx)': ['eslint app --ext .ts,.tsx', 'git add'],
  },
};
