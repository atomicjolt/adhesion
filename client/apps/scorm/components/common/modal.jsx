import { connect } from 'react-redux';
import Modal from '../../../../libs/components/modal';

const select = state => ({
  children: state.modal.children,
  ...state.modal.props,
  visible: state.modal.visible,
});

export class ScormModal extends Modal {}

export default connect(select, {})(ScormModal);
