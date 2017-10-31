import React             from 'react';
import { shallow } from 'enzyme';
import { QuizConverter } from './quiz_converter';

jest.mock('../../libs/assets');

describe('Quiz Converter', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      lmsCourseId: '1',
      importQuiz: () => {},
      conversionInProgress: false,
    };
    result = shallow(<QuizConverter {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
