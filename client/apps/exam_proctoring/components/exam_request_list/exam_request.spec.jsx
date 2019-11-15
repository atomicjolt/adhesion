import React                      from 'react';
import ReactTestUtils                  from 'react-dom/test-utils';
import ExamRequest                from './exam_request';

describe('Exam list', () => {
  let result;
  let props;
  let messageSent;
  let modalHidden;
  let scheduledExam;
  let examStatus;
  let examId;
  beforeEach(() => {
    messageSent = false;
    modalHidden = false;
    scheduledExam = {};
    props = {
      lmsUserId: '1',
      examRequest: {
        student_name: 'Picard',
        student_id: 987,
        status: 'assigned',
        id: 123,
        exam_name: 'starcraft exam',
      },
      openSettings: () => { props.settingsOpen = true; },
      settingsOpen: false,
      scheduleExam: (date, time, message) => {
        scheduledExam.date = date;
        scheduledExam.time = time;
        scheduledExam.message = message;
      },
      showModal: () => {},
      sendMessage: () => { messageSent = true; },
      hideModal: () => { modalHidden = true; },
      examRequestList: [{}],
      finishExam: (id) => {
        examStatus = 'finish';
        examId = id;
      },
      enterAnswers: (id) => {
        examId = id;
        examStatus = 'ongoing';
      },
      startExam: (id) => {
        examId = id;
        examStatus = 'start';
      },
    };
    result = ReactTestUtils.renderIntoDocument(<ExamRequest {...props} />);
  });

  it('opens the menu when you click', () => {
    const button = ReactTestUtils.findRenderedDOMComponentWithTag(result, 'button');
    ReactTestUtils.Simulate.click(button);
    expect(props.settingsOpen).toBe(true);
  });

  it('schedule an exam', () => {
    const selectedTime = {
      value: 'seconds since 1970',
      timeZone: 'PST',
    };
    result.scheduleExam('date is 2099', selectedTime, 'my man');
    expect(messageSent).toBeTruthy();
    expect(modalHidden).toBeTruthy();
    expect(scheduledExam).toBeDefined();
    expect(scheduledExam).toEqual(jasmine.objectContaining({
      message: 'seconds since 1970 PST'
    }));
  });

  it('finish exam', () => {
    result.finishExam(props.examRequest.id);
    expect(examStatus).toContain('finish');
    expect(examId).toEqual(props.examRequest.id);
  });

  it('enter answer', () => {
    result.enterAnswers();
    expect(examStatus).toContain('ongoing');
    expect(examId).toEqual(props.examRequest.id);
  });

  it('start exam', () => {
    result.startExam();
    expect(examStatus).toContain('start');
    expect(examId).toEqual(props.examRequest.id);
  });
});
