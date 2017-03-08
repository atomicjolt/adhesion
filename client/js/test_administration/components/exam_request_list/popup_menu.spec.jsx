import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import PopupMenu        from './popup_menu';
import Stub             from '../../../../specs_support/stub';

describe('popup menu', () => {
  let result;
  let props;
  beforeEach(() => {
    props = {
      status: 'scheduled'
    };
  });

  it('renders the start button when assigned', () => {
    result = TestUtils.renderIntoDocument(<Stub><PopupMenu {...props} /></Stub>);
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('Start');
  });

  it('renders the renders the pause and terminate buttons when started', () => {
    props.status = 'started';
    result = TestUtils.renderIntoDocument(<Stub><PopupMenu {...props} /></Stub>);
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('Finish');
  });
});
