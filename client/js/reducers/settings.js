import _ from 'lodash';

// Just return state. Don't let settings from the server mutate.
export default (state = {}) => state;

// Add default settings that can be overriden by values in serverSettings
export function getInitialSettings(...args) {
  let settings = {};
  _.forEach(args, arg => (settings = { ...settings, ...arg }));
  return settings;
}
