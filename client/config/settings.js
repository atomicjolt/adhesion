const info         = require('../../package.json');
const deployConfig = require('../../.s3-website.json');
const path         = require('path');

const clientAppPath = path.join(__dirname, '../');

const devRelativeOutput     = '/';
const prodRelativeOutput    = '/assets/';

const devOutput     = path.join(__dirname, '../../build/dev', devRelativeOutput);
const prodOutput    = path.join(__dirname, '../../public', prodRelativeOutput);

// const prodAssetsUrl = ''; // Set this to the url where the assets will be deployed.
                          // If you want the paths to be relative to the deploy then leave this
                          // value as an empty string. This value could also be a CDN or
                          // it could be the ssl version of your S3 bucket ie:
                          // https://s3.amazonaws.com/' + deployConfig.domain;

const prodAssetsUrl = `https://s3.amazonaws.com/${deployConfig.domain}`;

// There is a warning if the .env file is missing
// This is fine in a production setting, where settings
// are loaded from the env and not from a file
require('dotenv').load({ path: path.join(__dirname, '../../.env') });

const hotPort = process.env.ASSETS_PORT || 8080;

module.exports = {
  title: info.title,
  author: info.author,
  version: info.versions,
  build: Date.now(),

  devRelativeOutput,
  prodRelativeOutput,

  devOutput,
  prodOutput,

  // Dev urls
  devAssetsUrl: process.env.ASSETS_URL || '',
  prodAssetsUrl,

  hotPort,

  buildSuffix: '_bundle.js',

  staticDir: `${clientAppPath}static`,

  entries: {
    scorm: `${clientAppPath}js/scorm.jsx`,
    attendance: `${clientAppPath}js/attendance.jsx`,
    exams: `${clientAppPath}js/exams.jsx`,
    quiz_converter: `${clientAppPath}js/quiz_converter.jsx`,
    test_administration: `${clientAppPath}js/test_administration.jsx`,
    test_taking: `${clientAppPath}js/test_taking.jsx`,
    survey_tool: `${clientAppPath}js/survey_tool.jsx`,
  },

  cssEntries: {
    scorm_styles: `${clientAppPath}styles/scorm_styles.js`,
    attendance_styles: `${clientAppPath}styles/attendance_styles.js`,
    exams_styles: `${clientAppPath}styles/exams_styles.js`,
    quiz_converter_styles: `${clientAppPath}styles/quiz_converter_styles.js`,
    test_administration_styles: `${clientAppPath}styles/test_administration_styles.js`,
    test_taking_styles: `${clientAppPath}styles/test_taking_styles.js`,
    survey_tool_styles: `${clientAppPath}styles/survey_tool_styles.js`
  }

};
