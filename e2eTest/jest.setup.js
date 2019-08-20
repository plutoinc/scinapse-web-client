const mkdirp = require('mkdirp');
const { DEFAULT_SCREEN_SHOT_OUTPUT_DIRECTORY } = require('./constants/setting');

mkdirp(DEFAULT_SCREEN_SHOT_OUTPUT_DIRECTORY, function (err) {
  if (err) console.error(err)
});

jest.setTimeout(30000);
