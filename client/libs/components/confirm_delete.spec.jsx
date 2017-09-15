import React from 'react';
import TestUtils from 'react-addons-test-utils';
import _ from 'lodash';
import ConfirmDelete from './confirm_delete';
import Stub from '../../specs_support/stub';

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

    result = TestUtils.renderIntoDocument(<Stub><ConfirmDelete {...props} /></Stub>);
  });

  it('Delete button clicked', () => {
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    const button = _.find(buttons, butt => butt.textContent === 'DELETE');
    TestUtils.Simulate.click(button);
    expect(handleRemoveClicked).toBeTruthy();
  });

  it('Cancel button clicked', () => {
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    const button = _.find(buttons, butt => butt.textContent === 'CANCEL');
    TestUtils.Simulate.click(button);
    expect(closeModalClicked).toBeTruthy();
  });
});
