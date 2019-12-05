let babelPresetEnv = [
  '@babel/preset-env',
  {
    targets: {
      browsers: ['last 2 versions'],
    },
    modules: false,
  },
];

if (process.env.TARGET === 'server') {
  babelPresetEnv = [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage',
      targets: {
        node: '8',
      },
      exclude: ['@babel/plugin-transform-classes', 'babel-plugin-transform-classes'],
      modules: false,
    },
  ];
}

module.exports = {
  plugins: [
    'lodash',
    '@loadable/babel-plugin',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
  ],
  presets: ['@babel/preset-react', babelPresetEnv],
  exclude: '/node_modules/',
};
