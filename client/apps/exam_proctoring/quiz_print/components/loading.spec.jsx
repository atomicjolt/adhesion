import React from 'react';
import { shallow } from 'enzyme';
import Loading from './loading';

describe('loading', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      loadingQuiz: true,
    };
    result = shallow(<Loading {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });

  it('loading questions', () => {
    props.loadingQuiz = false;
    result = shallow(<Loading {...props} />);
    const element = result.find('h3').first();
    expect(element.props().children).toContain('Loading ');
    expect(element.props().children).toContain('Questions');
  });
});
