import React from 'react';
import { shallow } from 'enzyme';
import ExamListItem from './exam_list_item';

describe('Exam list item', () => {
  let result;

  beforeEach(() => {
    const props = {
      exam: { title: 'america', id: 1 },
      goToExam: () => {},
    };
    result = shallow(<ExamListItem {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
