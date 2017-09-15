import React    from 'react';
import TestUtils        from 'react-addons-test-utils';
import ConfirmExam      from './confirm_take_exam';
import Stub             from '../../../../specs_support/stub';

describe('Confirm Take Exam', () => {
  let result;
  let props;
  let status;

  beforeEach(() => {
    status = null;
    props = {
      takeExam: () => { status = 'taking'; },
      closeModal: () => { status = 'closing'; },
    };
    result = TestUtils.renderIntoDocument(<Stub><ConfirmExam {...props} /></Stub>);
  });

  it('renders the start button', () => {
    result = TestUtils.renderIntoDocument(<Stub><ConfirmExam {...props} /></Stub>);
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('Begin Quiz');
  });

  it('cancel button cancels', () => {
    const close = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button')[0];
    TestUtils.Simulate.click(close);
    expect(status).toBe('closing');
  });

  it('start button starts quiz', () => {
    const start = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button')[1];
    TestUtils.Simulate.click(start);
    expect(status).toBe('taking');
  });
});
