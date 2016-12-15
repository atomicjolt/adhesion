import React from 'react';

export default function index(props) {
  return (
    <div>
      { props.children }
    </div>
  );
}

index.propTypes = {
  children: React.PropTypes.node,
};
