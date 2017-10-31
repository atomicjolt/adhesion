import React from 'react';
import { shallow } from 'enzyme';
import AssignmentButton from './assignment_button';

describe('Assignment Button', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      canvasUrl: 'canvasorother',
      courseId: '12345',
      lms_assignment_id: 54321,
    };

    result = shallow(<AssignmentButton {...props} />);
  });

  it('renders the correct reference', () => {
    const anchor = result.find('a');
    expect(anchor.props().href).toBe('https://canvasorother/courses/12345/assignments/54321');
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
