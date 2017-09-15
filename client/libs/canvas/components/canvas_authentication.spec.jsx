import React from 'react';
import { shallow } from 'enzyme';
import { CanvasAuthentication } from './canvas_authentication';

describe('the canvas authentication', () => {
  let props;
  let result;

  beforeEach(() => {
    props = {
      overrides: {},
      settings: {
        canvas_oauth_url: 'http://www.example.com',
      },
      hideButton: false,
      autoSubmit: false,
    };
    result = shallow(<CanvasAuthentication {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
