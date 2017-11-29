import React from 'react';
import { shallow } from 'enzyme';
import Sections from './sections';

describe('Sections', () => {
  let result;
  let props;

  const sections = [
    { course_id: 1, id: 1, name: 'Sec1' },
    { course_id: 1, id: 2, name: 'Sec2' },
    { course_id: 1, id: 3, name: 'Sec3' },
  ];

  beforeEach(() => {
    props = {
      sections,
      currentSection: -1,
      filterStudents: () => {},
    };

    result = shallow(<Sections {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
