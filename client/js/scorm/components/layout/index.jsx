import React from 'react';

export default function Index(props) {
  return (
    <div>
      {props.children}
    </div>
  );
}

Index.propTypes = {
  children: React.PropTypes.node,
};
