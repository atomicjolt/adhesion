import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import ExamListItem     from './exam_list_item';
import Stub             from '../../../../specs_support/stub';

describe('Exam list item', () => {
  let result;

  beforeEach(() => {
    const props = {
      exam: { title: 'america', id: 1 },
      goToExam: () => {},
    };
    result = TestUtils.renderIntoDocument(<Stub><ExamListItem {...props} /></Stub>);
  });

  it('renders the exam', () => {
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'li');
    expect(element.textContent).toContain('america');
  });
});
