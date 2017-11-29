import React from 'react';
import { shallow } from 'enzyme';
import MultipleChoice from './multiple_answers_question';

describe('Multiple Choice', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      answers: [
        {
          id: 1,
          text: 'grass'
        },
        {
          id: 2,
          text: 'potatoes'
        },
        {
          id: 3,
          text: 'trees'
        },
        {
          id: 4,
          text: 'bats'
        },
        {
          id: 5,
          text: 'fear'
        },
      ],
      question_text: '<p>What things are green</p>',
      id: 7,
    };
    result = shallow(<MultipleChoice {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });

  it('renders radio buttons for the options', () => {
    const boxes = result.find('input');
    expect(boxes.length).toBe(5);
    expect(boxes.at(0).props().type).toEqual('checkbox');
  });
});
