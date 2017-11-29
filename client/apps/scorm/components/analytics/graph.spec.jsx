import React from 'react';
import { shallow } from 'enzyme';
import Graph from './graph';

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
    result = shallow(<Graph {...props} />);
  });

  it('renders the graph a single div', () => {
    const divs =  result.find('.c-aa-graph-picker');
    expect(divs.length).toBe(1);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
