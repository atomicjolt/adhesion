import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../apps/scorm/store/configure_store';

export default class Wrapper extends React.Component {

  render() {
    return <Provider store={configureStore({})}>
      {this.props.children}
    </Provider>;
  }
}
