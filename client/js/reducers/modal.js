import { Constants as ModalConstants } from '../actions/modal';

const initialState = {
  props: {},
  children: null,
  visible: false,
};

export default (state = initialState, action) => {
  switch (action.type) {

    case ModalConstants.HIDE_MODAL:
      return initialState;

    case ModalConstants.SHOW_MODAL:
      return {
        props: action.props,
        children: action.children,
        visible: true,
      };

    default:
      return state;

  }
};
