import React from 'react';
import { connect } from 'react-redux';

import Student from './main/student_list';
import Auth from '../../libs/canvas/components/canvas_authentication';

const select = state => ({
  canvasAuthRequired: state.settings.canvas_auth_required,
});

const Home = (props) => {
  return <div>
    { props.canvasAuthRequired ? <Auth autoSubmit hideButton /> : <Student /> }
  </div>
};

export default connect(select)(Home);
