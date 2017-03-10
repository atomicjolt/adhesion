import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import PopupMenu        from './popup_menu';
import Stub             from '../../../../specs_support/stub';

describe('popup menu', () => {
  let result;
  let props;
  let examHasStarted;
  let examHasFinished;
  let examModal;
  let message;
  beforeEach(() => {

    examHasStarted = false;
    examHasFinished = false;
    message = "empty";

    props = {
      status: 'scheduled',
      studentHasExamStarted: false,
      startExam: () => { examHasStarted = true; },
      finishExam: () => { examHasFinished = true; },
      openExamModal: () => { examModal = 1; },
      openMessageModal: () => { message = "If you're reading this, I'm too late"},
    };

    result = TestUtils.renderIntoDocument(<Stub><PopupMenu {...props} /></Stub>);
  });

  it('renders the start button when assigned', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('Start');
  });

  it('renders the renders the pause and terminate buttons when started', () => {
    props.status = 'started';
    result = TestUtils.renderIntoDocument(<Stub><PopupMenu {...props} /></Stub>);
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('Finish');
  });

  fit('start exam', () => {
    props.studentHasExamStarted = true;
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    const startButton = buttons[0];
    TestUtils.Simulate.click(startButton);
    expect(examHasStarted).toBeTruthy();
    debugger;
  });

  it('finish exam', () => {
    props.status = 'started';
    result = TestUtils.renderIntoDocument(<Stub><PopupMenu {...props} /></Stub>);
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    const finishButton = buttons[0];
    TestUtils.Simulate.click(finishButton);
    expect(examHasFinished).toBeTruthy();
  });

  it('open exam modal', () => {
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    const openExamModalButton = buttons[2];
    TestUtils.Simulate.click(openExamModalButton);
    expect(examModal).toBeDefined();
  });

  fit('open message modal', () => {
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    const messageStudentButton = buttons[3];
    TestUtils.Simulate.click(messageStudentButton);
    debugger;
  });

});
