import React from 'react';
import { shallow } from 'enzyme';
import QuizInfo from './quiz_info';

describe('Quiz Info', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      title: 'Testacular',
    };
    result = shallow(<QuizInfo {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
