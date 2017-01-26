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
      examList: [{ title: 'america', id: 1 }],
      examRequests: {
        1: {
          status: 'requested'
        }
      }
    };
    result = TestUtils.renderIntoDocument(<BaseExamList {...props} />);
  });

  it('renders the exam list', () => {
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'tbody');
    expect(element.textContent).toContain('Requested');
  });
});
