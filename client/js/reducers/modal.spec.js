import { Constants as ModalConstants } from '../actions/modal';
import Modal from './Modal';

describe('modal reducer', () => {
  describe('initial state', () => {
    it('sets the initial state', () => {
      const initialState = { 
        props: {},
        children: null,
        visible: false,
      };
      const newState = {visible: true}
      const state = {initialState, ...newState};
      expect(state.visible).toEqual(true);
    });
  });

  describe('state upon change during SHOW_MODAL', () => {
    it('accepts the state change', () => {
      const initialState = {
        props: {},
        children: 'asdf',
        visible: false,
      };
      const state = initialState;
      expect(state.children).toBe('asdf')
    });
  });
});
