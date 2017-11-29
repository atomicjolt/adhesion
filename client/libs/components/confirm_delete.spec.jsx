import React from 'react';
import { shallow } from 'enzyme';
import ConfirmDelete from './confirm_delete';

describe('confirm delete', () => {
  let props;
  let result;

  let handleRemoveClicked = false;
  let closeModalClicked = false;

  beforeEach(() => {
    props = {
      handleRemove: () => { handleRemoveClicked = true; },
      closeModal: () => { closeModalClicked = true; }
    };

    result = shallow(<ConfirmDelete {...props} />);
  });

  it('button count confirmed', () => {
    const buttons = result.find('HoverButton');
    expect(buttons.length).toBe(2);
  });

  it('handles the handleRemove onClick event', () => {
    expect(handleRemoveClicked).toBeFalsy();
    result.find('HoverButton').first().simulate('click');
    expect(handleRemoveClicked).toBeTruthy();
  });

  it('handles the closeModal onClick event', () => {
    expect(closeModalClicked).toBeFalsy();
    result.find('HoverButton').last().simulate('click');
    expect(closeModalClicked).toBeTruthy();
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
