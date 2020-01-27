import React              from 'react';
import ReactTestUtils          from 'react-dom/test-utils';
import MessageStudent  from './message_student';

describe('message student', () => {
  let result;
  let props;
  let changed;
  let sent;
  beforeEach(() => {
    props = {
      sendMessage: () => { sent = true; },
      closeMessageModal: () => { changed = true; },
    };
    changed = false;
    sent = false;
    result = ReactTestUtils.renderIntoDocument(<MessageStudent {...props} />);
  });

  it('renders a textarea and two buttons', () => {
    const button = ReactTestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    const element = ReactTestUtils.findRenderedDOMComponentWithTag(result, 'textarea');
    expect(button.length).toBe(2);
    expect(element).not.toBeNull();
  });

  it('goes cancels message upon press of x button', () => {
    expect(changed).toBeFalsy();
    const button = ReactTestUtils.findRenderedDOMComponentWithClass(result, 'spec_clear_button');
    ReactTestUtils.Simulate.click(button);
    expect(changed).toBeTruthy();
  });

  it('sends the message upon send button click', () => {
    expect(sent).toBeFalsy();
    const button = ReactTestUtils.findRenderedDOMComponentWithClass(result, 'send_btn_spec');
    ReactTestUtils.Simulate.click(button);
    expect(sent).toBeTruthy();
  });
});
