"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiRequest = apiRequest;
exports["default"] = void 0;

var _api = _interopRequireDefault(require("atomic-fuel/libs/api/api"));

var _wrapper = require("atomic-fuel/src/constants/wrapper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function apiRequest(store, action) {
  console.log("apiRequest action: ", action);
  var state = store.getState();

  var updatedParams = _objectSpread({
    // Add the context id from the lti launch
    context_id: state.settings.context_id,
    // Add consumer key to requests to indicate which lti app requests are originating from.
    oauth_consumer_key: state.settings.oauth_consumer_key
  }, action.params);

  var promise = _api["default"].execRequest(action.method, action.url, state.settings.api_url, state.jwt, state.settings.csrf_token, updatedParams, action.body, action.headers, action.timeout);

  if (promise) {
    promise.then(function (response) {
      console.log("apiRequest response: ", response);
      store.dispatch({
        type: action.type + _wrapper.DONE,
        payload: response.body,
        original: action,
        response: response
      }); // Dispatch the new data
    }, function (error) {
      console.log("apiRequest error: ", error);
      store.dispatch({
        type: action.type + _wrapper.DONE,
        payload: {},
        original: action,
        error: error
      }); // Dispatch the new error
    });
  }
  console.log("apiRequest promise: ", promise);

  return promise;
}

var API = function API(store) {
  return function (next) {
    return function (action) {
      if (action.method) {
        apiRequest(store, action);
      } // call the next middleWare


      next(action);
    };
  };
};

exports["default"] = API;
