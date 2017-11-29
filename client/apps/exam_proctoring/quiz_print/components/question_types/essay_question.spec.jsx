import React from 'react';
import { shallow } from 'enzyme';
import Essay from './essay_question';

describe('Essay', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      question_text: '<p>What is love?</p>',
      id: '7',
    };
    result = shallow(<Essay {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
