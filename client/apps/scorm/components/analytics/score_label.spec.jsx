import React from 'react';
import { shallow } from 'enzyme';
import ScoreLabel from './score_label';

describe('Scorm Analytics ScoreLabel', () => {

  let result;
  const props = {
    name: 'test application',
    value: '12',
  };

  beforeEach(() => {
    result = shallow(<ScoreLabel {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
