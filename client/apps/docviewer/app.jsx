import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import jwt from 'atomic-fuel/libs/loaders/jwt';
import { getInitialSettings } from 'atomic-fuel/libs/reducers/settings';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import routes from './routes';
import configureStore from './store/configure_store';

const settings = getInitialSettings(window.DEFAULT_SETTINGS);
const store = configureStore({ settings, jwt: window.DEFAULT_JWT });
export default store;

class Root extends React.PureComponent {
  static propTypes = {
    store: PropTypes.object.isRequired,
  };

  render() {
    const { store } = this.props;
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
