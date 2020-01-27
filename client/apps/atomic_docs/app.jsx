import 'core-js';
import 'regenerator-runtime/runtime';
import es6Promise from 'es6-promise';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { getInitialSettings } from 'atomic-fuel/libs/reducers/settings';
import jwt from 'atomic-fuel/libs/loaders/jwt';
import PropTypes from 'prop-types';
import Index from './components/layout/index';
import initResizeHandler from '../../common/libs/resize_iframe';
import configureStore from './store/configure_store';

import './styles/styles.scss';

// Polyfill es6 promises for IE
es6Promise.polyfill();

class Root extends React.PureComponent {
  static propTypes = {
    store: PropTypes.object.isRequired,
  };

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <div>
          <Index />
        </div>
      </Provider>
    );
  }
}

const settings = getInitialSettings(window.DEFAULT_SETTINGS);
const store = configureStore({ settings, jwt: window.DEFAULT_JWT });
if (window.DEFAULT_JWT) { // Setup JWT refresh
  jwt(store.dispatch, settings.user_id);
}

const mainApp =  document.getElementById('main-app');
initResizeHandler(mainApp);

ReactDOM.render(
  <Root store={store} />,
  mainApp,
);
