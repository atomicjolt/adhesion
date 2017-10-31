import React from 'react';
import { shallow } from 'enzyme';
import FillInTheBlanks from './fill_in_multiple_blanks_question';

describe('Multiple Choice', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      question_text: '<p>Holy [blank1] youve been down too long in the [blank2] sea.</p>',
      id: '7',
    };
    result = shallow(<FillInTheBlanks {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
