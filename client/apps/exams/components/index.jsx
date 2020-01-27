import React from 'react';
import PropTypes from 'prop-types';

export default function Index(props) {
  return (
    <div>
      {props.children}
    </div>
  );
}

Index.propTypes = { children: PropTypes.node };
