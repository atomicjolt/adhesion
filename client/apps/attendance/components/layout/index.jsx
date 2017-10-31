import React from 'react';
import PropTypes from 'prop-types';

export default function index(props) {
  return (
    <div>
      { props.children }
    </div>
  );
}

index.propTypes = {
  children: PropTypes.node,
};
