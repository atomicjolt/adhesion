import React                      from 'react';
import TestUtils                  from 'react-addons-test-utils';
import { BaseExamAssignmentList } from './_exam_assignment_list';

describe('Exam Assignment list', () => {
  let result;

  beforeEach(() => {
    const props = {
      lmsUserId: '1',
      loadProctorCodes: () => {},
      testingCentersAccountSetup: () => {},
      proctorCodeList: [{
        proctor_id: 1,
        code: 'imaCODE',
        assigned_exam: {
          student_name: 'Picard',
          status: 'assigned'
        },
      }, {
        proctor_id: 1,
        code: 'NEWCODE',
        assigned_exam: {
          student_name: 'James',
          status: 'started'
        },
      }]
    };
    result = TestUtils.renderIntoDocument(<BaseExamAssignmentList {...props} />);
  });

  it('renders the proctor codes', () => {
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'table');
    expect(element.textContent).toContain('imaCODE');
  });

  it('filters on search', () => {
    result.setState({ searchVal: 'started' });
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'table');
    expect(element.textContent).toContain('NEWCODE');
    expect(element.textContent).not.toContain('imaCODE');
  });
});
