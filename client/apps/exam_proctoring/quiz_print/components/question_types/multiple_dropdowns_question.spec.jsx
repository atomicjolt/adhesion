import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import _                from 'lodash';
import MultipleDropdown from './multiple_dropdowns_question';
import Stub             from '../../../../../specs_support/stub';

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
    result = TestUtils.renderIntoDocument(<Stub><MultipleDropdown {...props} /></Stub>);
  });

  it('renders the question text', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('Skyrim belongs to the');
    expect(element.textContent).toContain(', while Marrowind is the homeland of the');
    expect(element.textContent).not.toContain('<p>');
  });

  it('renders radio buttons for the options', () => {
    const radios = TestUtils.scryRenderedDOMComponentsWithTag(result, 'input');
    expect(radios.length).toBe(6);
    _.forEach(radios, (radio) => {
      expect(radio.type).toBe('radio');
    });
  });

  it('renders the answer Text', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('Bretons');
    expect(element.textContent).toContain('Nords');
    expect(element.textContent).toContain('Argonians');
    expect(element.textContent).toContain('Dunmer');
    expect(element.textContent).toContain('Falmer');
  });
});
