import React            from 'react';
import { shallow } from 'enzyme';
import _                from 'lodash';
import MultipleChoice   from './multiple_choice_question';

describe('Multiple Choice', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      answers: [
        {
          id: 1,
          text: 'yes'
        },
        {
          id: 2,
          text: 'no'
        },
        {
          id: 3,
          text: 'maybe'
        },
      ],
      question_text: '<p>I am the title</p>',
      id: 7,
    };
    result = shallow(<MultipleChoice {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });

  it('renders radio buttons for the options', () => {
    const radios = result.find('input');
    expect(radios.length).toBe(3);
    expect(radios.at(0).props().type).toEqual('radio');
  });
});
