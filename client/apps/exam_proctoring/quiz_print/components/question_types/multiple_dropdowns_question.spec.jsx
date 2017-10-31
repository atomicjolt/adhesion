import React from 'react';
import { shallow } from 'enzyme';
import MultipleDropdown from './multiple_dropdowns_question';

describe('Multiple DropDown', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      answers: [
        {
          blank_id: 'Skyrim',
          id: 1,
          text: 'Bretons'
        },
        {
          blank_id: 'Skyrim',
          id: 2,
          text: 'Nords'
        },
        {
          blank_id: 'Skyrim',
          id: 3,
          text: 'Argonians'
        },
        {
          blank_id: 'Marrowind',
          id: 4,
          text: 'Dunmer'
        },
        {
          blank_id: 'Marrowind',
          id: 5,
          text: 'Nords'
        },
        {
          blank_id: 'Marrowind',
          id: 6,
          text: 'Falmer'
        },
      ],
      question_text: '<p>Skyrim belongs to the [Skyrim], while Marrowind is the homeland of the [Marrowind].</p>',
      id: '7',
    };
    result = shallow(<MultipleDropdown {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });

  it('renders radio buttons for the options', () => {
    const radios = result.find('input');
    expect(radios.length).toBe(6);
    expect(radios.at(0).props().type).toBe('radio');
  });
});
