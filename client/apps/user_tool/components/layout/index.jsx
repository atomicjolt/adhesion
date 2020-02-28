import React from 'react';
import PropTypes from 'prop-types';

export default function index({ children }) {
  return (
    <div>
      { children }
    </div>
  );
}

index.propTypes = {
  children: PropTypes.node,
};
