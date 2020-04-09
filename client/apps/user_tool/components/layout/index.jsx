import React from 'react';
import PropTypes from 'prop-types';
import Errors from './errors';

export default function index({ children }) {
  return (
    <div>
      <Errors />
      { children }
    </div>
  );
}

index.propTypes = {
  children: PropTypes.node,
};
