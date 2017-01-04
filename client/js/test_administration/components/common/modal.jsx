import Modal        from '../../../common_components/modal';
import { connect }  from 'react-redux';

const select = state => ({
  children: state.modal.children,
  ...state.modal.props,
  visible: state.modal.visible,
});

export class TestAdminModal extends Modal {}

export default connect(select, {})(TestAdminModal);
