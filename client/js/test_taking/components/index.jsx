import React from 'react';
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
  children: React.PropTypes.node
};
