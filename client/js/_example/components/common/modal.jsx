import { connect }  from 'react-redux';
import Modal        from '../../../common_components/modal';

const select = state => ({
  children: state.modal.children,
  ...state.modal.props,
  visible: state.modal.visible,
});

export class TestTakingModal extends Modal {}

export default connect(select, {})(TestTakingModal);
