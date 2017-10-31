import React from 'react';
import { shallow } from 'enzyme';
import { AbsentIcon, PresentIcon, LateIcon } from './attendance_icons';

describe('attendance icons', () => {
  it('should render the absent icon', () => {
    const result = shallow(<AbsentIcon />);
    const paths = result.find('path');
    expect(paths.length).toBe(2);
  });

  it('should render the late icon', () => {
    const result = shallow(<LateIcon />);
    const paths = result.find('path');
    expect(paths.length).toBe(3);
  });

  it('should render the present icon', () => {
    const result = shallow(<PresentIcon />);
    const paths = result.find('path');
    expect(paths.length).toBe(3);
  });
});
