import React                      from 'react';
import TestUtils                  from 'react-addons-test-utils';
import { BaseExamRequestList } from './_exam_request_list';

describe('Exam Assignment list', () => {
  let result;

  beforeEach(() => {
    const props = {
      lmsUserId: '1',
      loadExamRequests: () => {},
      testingCentersAccountSetup: () => {},
      examRequestList: [{
        student_name: 'Picard',
        status: 'requested'
      }, {
        student_name: 'James',
        status: 'scheduled'
      }],
      canvasRequest: () => {}
    };
    result = TestUtils.renderIntoDocument(<BaseExamRequestList {...props} />);
  });

  it('filters on search', () => {
    result.setState({ searchVal: 'scheduled' });
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'table');
    expect(element.textContent).toContain('James');
    expect(element.textContent).not.toContain('Picard');
  });
});
