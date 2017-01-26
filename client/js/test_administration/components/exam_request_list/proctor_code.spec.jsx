import React                      from 'react';
import TestUtils                  from 'react-addons-test-utils';
import ProctorCode                from './proctor_code';

describe('Exam list', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      lmsUserId: '1',
      loadProctorCodes: () => {},
      proctorCode: {
        proctor_id: 1,
        code: 'imaCODE',
        assigned_exam: {
          student_name: 'Picard',
          status: 'assigned'
        },
      },
      assignedExam: {
        student_name: 'Picard',
        status: 'assigned',
      },
      openSettings: () => { props.settingsOpen = true; },
      settingsOpen: false,
    };
    result = TestUtils.renderIntoDocument(<ProctorCode {...props} />);
  });

  it('opens the menu when you click', () => {
    const button = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    TestUtils.Simulate.click(button);
    expect(props.settingsOpen).toBe(true);
  });
});
