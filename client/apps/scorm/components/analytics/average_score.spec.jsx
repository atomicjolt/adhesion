import React from 'react';
import { shallow } from 'enzyme';
import AverageScore from './average_score';

describe('Scorm Analytics Average Score', () => {

  let result;
  const props = {
    meanScore: 12,
    medScore: 15,
    lowScore: 18,
    highScore: 20,
  };
  beforeEach(() => {
    result = shallow(<AverageScore {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });

  it('renders 4 scorelabel components', () => {
    expect(result.find('ScoreLabel').length).toBe(4);
  });
});
