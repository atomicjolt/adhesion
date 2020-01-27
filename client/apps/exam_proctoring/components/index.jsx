import React from 'react';
import PropTypes from 'prop-types';
import Modal from './common/modal';

export default function Index(props) {
  return (
    <div>
      {props.children}
      <Modal />
    </div>
  );
}

Index.propTypes = {
  children: PropTypes.node
};
