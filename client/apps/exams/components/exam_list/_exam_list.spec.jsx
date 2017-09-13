import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import { BaseExamList } from './_exam_list';

describe('Exam list', () => {
  let result;

  beforeEach(() => {
    const props = {
      canvasRequest: () => {},
      loadExamRequests: () => {},
      getTestingCentersAccount: () => {},
      lmsCourseId: '1',
      examList: [{ title: 'america', id: 1, access_code: 'proctored-exam-asdfasdf' }],
      examRequests: {
        1: {
          status: 'requested'
        }
      },
      lmsUserId: 'lms user id',
      toolConsumerInstanceName: 'instance name'
    };
    result = TestUtils.renderIntoDocument(<BaseExamList {...props} />);
  });

  it('renders the exam list', () => {
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'tbody');
    expect(element.textContent).toContain('Requested');
  });
});
