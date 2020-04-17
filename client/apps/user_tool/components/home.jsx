import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Auth from 'atomic-canvas/libs/components/canvas_authentication';
import SearchPage from './main/search_page';

const select = state => ({
  canvasAuthRequired: state.settings.canvas_auth_required,
});

const Home = ({ canvasAuthRequired }) => (
  <div>
    <h1 className="app-title">User Management</h1>
    { canvasAuthRequired ? <Auth autoSubmit hideButton /> : <SearchPage /> }
  </div>
);

Home.propTypes = {
  canvasAuthRequired: PropTypes.bool,
};

export default connect(select)(Home);
