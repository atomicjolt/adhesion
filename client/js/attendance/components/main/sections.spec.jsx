import React     from 'react';
import TestUtils from 'react-addons-test-utils';
import Sections  from './sections';
import Stub      from '../../../../specs_support/stub';

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

    result = TestUtils.renderIntoDocument(<Stub><Sections {...props} /></Stub>);
  });

  it('renders Dropdown', () => {
    const button = TestUtils.findRenderedDOMComponentWithClass(result, 'c-btn c-btn--sections');
    expect(button).toBeTruthy();
  });

});
