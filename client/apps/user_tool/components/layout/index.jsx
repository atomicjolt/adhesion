import React from 'react';
import PropTypes from 'prop-types';
import Errors from './errors';
import SuccessMessages from './success_messages';

export default function index({ children }) {
  return (
    <div>
      <Errors />
      <SuccessMessages />
      { children }
    </div>
  );
}

index.propTypes = {
  children: PropTypes.node,
};
