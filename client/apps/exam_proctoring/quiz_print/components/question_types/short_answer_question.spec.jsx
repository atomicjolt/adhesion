import React            from 'react';
import { shallow } from 'enzyme';
import ShortAnswer      from './short_answer_question';

describe('Short Answer', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      question_text: '<p>Riddle me this Batman!</p>',
      id: '7',
    };
    result = shallow(<ShortAnswer {...props} />);
  });

  it('renders the question text', () => {
    const element = result.find('div').first().props().children[0].props;
    expect(element.text).toBe(props.question_text);
  });

  it('renders text input', () => {
    const input = result.find('input');
    expect(input).toBeDefined();
    expect(input.props().type).toBe('text');
  });
});
