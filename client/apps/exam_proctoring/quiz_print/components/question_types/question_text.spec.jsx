import React from 'react';
import { shallow } from 'enzyme';
import TextOnly from './question_text';

describe('text Only', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      question_text: '<p>I am a text</p>',
      id: '7',
    };
    result = shallow(<TextOnly {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
