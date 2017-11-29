import React from 'react';
import { shallow } from 'enzyme';
import Scores from './scores';

describe('Scorm Analytics Scores', () => {

  let result;
  const props = {
    scores: [
      {
        name: 'test application',
        value: '12',
      },
    ],
  };

  beforeEach(() => {
    result = shallow(<Scores {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
