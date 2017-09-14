import React from 'react';
import { shallow } from 'enzyme';
import ScheduleForm from './schedule_form';

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
    result = shallow(<ScheduleForm {...props} />);
  });

  it('changing date after adding text doesnt delete the text', () => {
    result.instance().onMessageChange({ target: { value: `${result.instance().state.autoMessage}z` } });
    result.instance().messageField = {};
    result.instance().handleDateChange(new Date(2010, 10, 10));
    expect(result.instance().messageField.value[result.instance().messageField.value.length - 1]).toBe('z');
  });
});
