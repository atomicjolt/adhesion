import 'babel-polyfill';
import es6Promise               from 'es6-promise';
import React                    from 'react';
import ReactDOM                 from 'react-dom';
import { Provider }             from 'react-redux';
import routes                   from './exams/routes';
import DevTools                 from './dev/dev_tools';
import configureStore           from './exams/store/configure_store';
import jwt                      from './loaders/jwt';
import { getInitialSettings }   from './reducers/settings';

// Polyfill es6 promises for IE
es6Promise.polyfill();


function Root(props) {
  const devTools = __DEV__ ? <DevTools /> : null;
  const { store } = props;

  const rootStyles = {
    fontFamily: "'Roboto', sans-serif"
  };

  return (
    <Provider store={store}>
      <div style={rootStyles}>
        {routes}
        {devTools}
      </div>
    </Provider>
  );
}

Root.propTypes = {
  store: React.PropTypes.shape({}),
};

const settings = getInitialSettings(window.DEFAULT_SETTINGS);
const store = configureStore({ settings, jwt: window.DEFAULT_JWT });
if (window.DEFAULT_JWT) { // Setup JWT refresh
  jwt(store.dispatch, settings.user_id);
}

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('main-app'),
);
