/* global describe beforeEach it expect */

import React from 'react';
import { shallow } from 'enzyme';
import Settings from './settings';
import HoverButton from '../common/hover_button';
import AssignmentButton from './assignment_button';

describe('settings', () => {
  let props;
  let result;

  beforeEach(() => {
    props = {
      handlePreview: () => {},
      handleUpdate: () => {},
      handleRemove: () => {},
      hideModal: () => {},
      showModal: () => {},
      handleAnalytics: () => {},
      analyticsButton: false,
    };
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });

  it('renders the package buttons', () => {
    result = shallow(<Settings {...props} />);
    const buttons = result.find(HoverButton);
    expect(buttons.length).toBe(3);
  });
});
