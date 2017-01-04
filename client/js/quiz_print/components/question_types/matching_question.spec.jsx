import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import Matching         from './matching_question';
import Stub             from '../../../../specs_support/stub';

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
      id: '7',
    };
    result = TestUtils.renderIntoDocument(<Stub><Matching {...props} /></Stub>);
  });

  it('renders the question text', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('Match each race to its homeland');
    expect(element.textContent).not.toContain('<p>');
  });

  it('renders the answer Text', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('Bretons');
    expect(element.textContent).toContain('Nords');
    expect(element.textContent).toContain('Argonians');
  });

  it('renders the Match Text', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('Black Marsh');
    expect(element.textContent).toContain('High Rock');
    expect(element.textContent).toContain('Skyrim');
  });
});
