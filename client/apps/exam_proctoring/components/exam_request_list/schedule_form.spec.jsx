import React                         from 'react';
import TestUtils                     from 'react-addons-test-utils';
import ScheduleForm                  from './schedule_form';

describe('schedule form', () => {
  let result;
  beforeEach(() => {
    const props = {
      studentName: 'Joseph',
      studentId: 1,
      examName: 'Batman VS Superman',
      courseName: 'Superheros 101',
      testingCenterName: 'The best center',
      message: 'can i take this test?',
      closeModal: () => {},
      scheduleExam:  () => {}
    };
    result = TestUtils.renderIntoDocument(<ScheduleForm {...props} />);
  });

  it('changing date after adding text doesnt delete the text', () => {
    result.onMessageChange({ target: { value: `${result.state.autoMessage}z` } });
    result.handleDateChange(new Date(2010, 10, 10));
    expect(result.messageField.value[result.messageField.value.length - 1]).toBe('z');
  });
});
