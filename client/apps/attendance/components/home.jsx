import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Student from './main/student_list';
import Auth from '../../libs/canvas/components/canvas_authentication';

const select = state => ({
  canvasAuthRequired: state.settings.canvas_auth_required,
});

const Home = props => (
  <div>
    { props.canvasAuthRequired ? <Auth autoSubmit hideButton /> : <Student /> }
  </div>
);

Home.propTypes = {
  canvasAuthRequired: PropTypes.bool,
};

export default connect(select)(Home);
