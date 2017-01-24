import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import { BaseExamList } from './_exam_list';

describe('Exam list', () => {
  let result;

  beforeEach(() => {
    const props = {
      canvasRequest: () => {},
      getTestingCentersAccount: () => {},
      lmsCourseId: '1',
      examList: [{ title: 'america' }],
    };
    result = TestUtils.renderIntoDocument(<BaseExamList {...props} />);
  });

  it('renders the exam list', () => {
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'ul');
    expect(element.textContent).toContain('america');
  });
});
