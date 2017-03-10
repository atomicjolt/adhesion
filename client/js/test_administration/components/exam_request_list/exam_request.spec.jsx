import React                      from 'react';
import TestUtils                  from 'react-addons-test-utils';
import ExamRequest                from './exam_request';

describe('Exam list', () => {
  let result;
  let props;
  let messageSent;
  let modalHidden;
  let scheduledExam;
  beforeEach(() => {
    messageSent = false;
    modalHidden = false;
    scheduledExam = {};

    props = {
      lmsUserId: '1',
      examRequest: {
        student_name: 'Picard',
        status: 'assigned'
      },
      openSettings: () => { props.settingsOpen = true; },
      settingsOpen: false,
      scheduleExam: (date, time, message) => { 
        scheduledExam['date'] = date;
        scheduledExam['time'] = time;
        scheduledExam['message'] = message;
      },
      showModal: () => {},
      sendMessage: (message, name) => { messageSent = true; },
      hideModal: () => { modalHidden = true; },
      examRequestList: [{}],
    };
    result = TestUtils.renderIntoDocument(<ExamRequest {...props} />);
  });

  it('opens the menu when you click', () => {
    const button = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    TestUtils.Simulate.click(button);
    expect(props.settingsOpen).toBe(true);
  });

  it('schedule an exam', () => {
    const selectedTime = {
      value: 'seconds since 1970'
    }
    result.scheduleExam('date is 2099', selectedTime, 'my man');
    expect(messageSent).toBeTruthy();
    expect(modalHidden).toBeTruthy();
    expect(scheduledExam).toBeDefined();  
    expect(scheduledExam).toEqual(jasmine.objectContaining({
      message: 'seconds since 1970'
    }))
  });
});
