import React                      from 'react';
import TestUtils                  from 'react-addons-test-utils';
import ExamRequest                from './exam_request';

describe('Exam list', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      lmsUserId: '1',
      examRequest: {
        student_name: 'Picard',
        status: 'assigned'
      },
      openSettings: () => { props.settingsOpen = true; },
      settingsOpen: false,
    };
    result = TestUtils.renderIntoDocument(<ExamRequest {...props} />);
  });

  it('opens the menu when you click', () => {
    const button = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    TestUtils.Simulate.click(button);
    expect(props.settingsOpen).toBe(true);
  });
});
