import React                      from 'react';
import TestUtils                  from 'react-addons-test-utils';
import { BaseExamAssignmentList } from './_exam_assignment_list';

describe('Exam Assignment list', () => {
  let result;

  beforeEach(() => {
    const props = {
      lmsUserId: '1',
      loadProctorCodes: () => {},
      proctorCodeList: {
        1: {
          proctor_id: 1,
          code: 'imaCODE',
          assigned_exam: {
            student_name: 'Picard',
            status: 'assigned'
          },
        },
      }
    };
    result = TestUtils.renderIntoDocument(<BaseExamAssignmentList {...props} />);
  });

  it('renders the proctor codes', () => {
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'table');
    expect(element.textContent).toContain('imaCODE');
  });
});
