import React              from 'react';
import TestUtils          from 'react-addons-test-utils';
import MessageInstructor  from './message_instructor';

describe('message instructor', () => {
  let result;
  let props;
  let changed;
  let sent;
  beforeEach(() => {
    props = {
      sendMessage: () => { sent = true; },
      closeMessageModal: () => { changed = true; },
    }
    changed = false;
    sent = false;
    result = TestUtils.renderIntoDocument(<MessageInstructor {...props}/>);
  });

  it('renders a textarea and two buttons', () => {
    const button = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'textarea');
    expect(button.length).toBe(2);
    expect(element).not.toBeNull();
  });

  it('goes cancels message upon press of x button', () => {
    expect(changed).toBeFalsy();
    const button = TestUtils.findRenderedDOMComponentWithClass(result, 'spec_clear_button');
    TestUtils.Simulate.click(button);
    expect(changed).toBeTruthy();
  });

  it('sends the message upon send button click', () => {
    expect(sent).toBeFalsy();
    const button = TestUtils.findRenderedDOMComponentWithClass(result, 'send_btn_spec');
    TestUtils.Simulate.click(button);
    expect(sent).toBeTruthy();
  })
});

