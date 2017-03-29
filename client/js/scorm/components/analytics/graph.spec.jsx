import React           from 'react';
import TestUtils       from 'react-addons-test-utils';
import _               from 'lodash';
import Stub            from '../../../../specs_support/stub';
import Graph           from './graph';

describe('Scorm Analytics Graph', () => {

  let result;
  const props = {
    data: {
      completed: [],
    },
    navButtons: [
      {
        name: 'test application',
        stat: '12',
      },
    ],
  };

  beforeEach(() => {
    result = TestUtils.renderIntoDocument(
      <Stub>
        <Graph {...props} />
      </Stub>
    );
  });

  it('renders the graph a single div', () => {
    const divs =  TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-aa-graph-picker');
    expect(divs.length).toBe(1);
  });

  it('renders the button with the correct values', () => {
    const div =  TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    expect(div.textContent).toContain(props.navButtons[0].name);
    expect(div.textContent).toContain(props.navButtons[0].stat);
  });

  it('renders a single chart', () => {
    const div = TestUtils.findRenderedDOMComponentWithClass(result, 'recharts-wrapper');
    expect(_.size(div)).toBe(1);
  });
});
