import React from 'react';
import { shallow } from 'enzyme';
import Matching from './matching_question';

describe('Matching', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      answers: [
        {
          id: 1,
          text: 'Bretons'
        },
        {
          id: 2,
          text: 'Nords'
        },
        {
          id: 3,
          text: 'Argonians'
        },
      ],
      matches: [
        {
          match_id: 4,
          text: 'Black Marsh'
        },
        {
          match_id: 5,
          text: 'High Rock'
        },
        {
          match_id: 6,
          text: 'Skyrim'
        },
      ],
      question_text: '<p>Match each race to its homeland</p>',
      id: 7,
    };
    result = shallow(<Matching {...props} />);
  });

  it('renders the question text', () => {
    const element = result.find('div').at(0).props().children[0].props;
    expect(element.text).toContain('Match each race to its homeland');
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
