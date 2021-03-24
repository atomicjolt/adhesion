/* eslint-env node */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const _ = require('lodash');

const environment = require('./environment');

// Setup shared manifest for multi-compiler.
// This will merge the global javascript and standard manifests, but will NOT add
// the global javascript to the 'entrypoints' list in the manifest.
const ManifestPlugin = environment.plugins.get('Manifest');
ManifestPlugin.options.merge = true;

// Convert environment to Webpack config.
const config = environment.toWebpackConfig();

const globalJavascript = 'global_javascript'
const standardConfig = _.cloneDeep(config);
const globalJavascriptConfig = _.cloneDeep(config);

// Generate a config with entries that don't include the globale javascript
_.each(standardConfig.entry, (_path, entry) => {
  if (globalJavascript === entry) {
    delete standardConfig.entry[entry];
  }
});
//
// // Generate a config that only includes the global javascript
_.each(globalJavascriptConfig.entry, (_path, entry) => {
  if (globalJavascript !== entry) {
    delete globalJavascriptConfig.entry[entry];
  }
});
//
// // Modify globalJavascriptConfig to support output to the public directory
globalJavascriptConfig.output.filename = '[name].js';
globalJavascriptConfig.output.chunkFilename = '[id].js';

module.exports = [standardConfig, globalJavascriptConfig];
