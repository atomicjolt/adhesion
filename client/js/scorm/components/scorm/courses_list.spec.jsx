/* global describe beforeEach it expect */

import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import CoursesList from './courses_list';
import Wrapper from '../../../../specs_support/scorm_wrapper';

describe('courses list', () => {
  let props;
  let result;

  beforeEach(() => {
    props = {
      course: { title: 'IMAPSEC' },
      importPackage: () => {},
      previewPackage: () => {},
      removePackage: () => {},
      list: [
        { course: { title: 'IMAPSEC' } },
      ],
    };
    result = TestUtils.renderIntoDocument(<Wrapper><CoursesList {...props} /></Wrapper>);
  });

  it('renders list of items from props', () => {
    const ul = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-list');
    expect(ul.length).toBe(1);
  });

  it('verifies number of items in the list', () => {
    let list = TestUtils.scryRenderedDOMComponentsWithTag(result, 'li');
    expect(list.length).toBe(1);
    props.list = [{}, {}, {}];
    result = TestUtils.renderIntoDocument(<Wrapper><CoursesList {...props} /></Wrapper>);
    list = TestUtils.scryRenderedDOMComponentsWithTag(result, 'li');
    expect(list.length).toBe(3);
  });
});
