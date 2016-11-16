var karmaConfig = require('./config/karma');

module.exports = function(config){
  var testConfig = karmaConfig();
  testConfig.singleRun = true;
  testConfig.autoWatch = false;
  testConfig.customLaunchers = {
    Chrome_travis_ci: {
      base: 'Chrome',
      flags: ['--no-sandbox']
    }
  };
  testConfig.browsers = ['Chrome_travis_ci'];
  config.set(testConfig);
};
