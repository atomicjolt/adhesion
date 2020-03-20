import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

export default class EditUserModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    userToEdit: PropTypes.object.isRequired,
  };

  render() {
    const { isOpen, closeModal, userToEdit:user } = this.props;

    return (
      <ReactModal
        contentLabel="Edit User Modal"
        isOpen={isOpen}
        onRequestClose={closeModal}
      >
        <h2>Edit User</h2>
        <p>
          Editing
          {user.sortable_name}
        </p>
      </ReactModal>
    );
  }
}
