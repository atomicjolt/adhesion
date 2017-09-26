import _ from 'lodash';

export default function camelize(object) {
  return _.reduce(object, (accumulator, val, key) => {
    if (_.isObject(val)) { val = camelize(val); }
    accumulator[_.camelCase(key)] = val;
    return accumulator;
  }, {});
}
