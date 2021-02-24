import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import jwt from 'atomic-fuel/libs/loaders/jwt';
import { getInitialSettings } from 'atomic-fuel/libs/reducers/settings';
import ReactModal from 'react-modal';
import routes from './routes';
import storeProvider from './store/store_provider';
import configureStore from './store/configure_store';
import './styles/styles.scss';

const settings = getInitialSettings(window.DEFAULT_SETTINGS);
const doConfigureStore = () => configureStore({ settings, jwt: window.DEFAULT_JWT });
storeProvider.init(doConfigureStore);
const store = storeProvider.getStore();

class Root extends React.PureComponent {
  render() {
    return (
      <Provider store={store}>
        <div>
          {routes}
        </div>
      </Provider>
    );
  }
}

if (window.DEFAULT_JWT) { // Setup JWT refresh
  jwt(store.dispatch, settings.user_id);
}

ReactModal.setAppElement('#main-app');

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('main-app'),
);
