import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Auth from 'atomic-canvas/libs/components/canvas_authentication';

const select = state => ({
  canvasAuthRequired: state.settings.canvas_auth_required,
});

const Home = props => (
  <div>
    { props.canvasAuthRequired ? <Auth autoSubmit hideButton /> : <p>User Tool app</p> }
  </div>
);

Home.propTypes = {
  canvasAuthRequired: PropTypes.bool,
};

export default connect(select)(Home);
