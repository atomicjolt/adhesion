/* global describe beforeEach it expect */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import CourseList from './courses_list';
import Wrapper from '../../../../specs_support/scorm_wrapper';

describe('courses list', () => {
  let props;
  let result;

  beforeEach(() => {
    props = {
      courseId: 'id',
      importPackage: () => {},
      previewPackage: () => {},
      removePackage: () => {},
      updateImportType: () => {},
      canvasUrl: 'salad.com',
      list: [
        { title: 'IMAPSEC', id: 'id' },
      ],
    };
    result = TestUtils.renderIntoDocument(<Wrapper><CourseList {...props} /></Wrapper>);
  });

  it('renders list of items from props', () => {
    const ul = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-list');
    expect(ul.length).toBe(1);
  });

  it('verifies number of items in the list', () => {
    let list = TestUtils.scryRenderedDOMComponentsWithTag(result, 'li');
    expect(list.length).toBe(1);
    props.list = [{ id: 'id' }, { id: 'id' }, { id: 'id' }];
    result = TestUtils.renderIntoDocument(<Wrapper><CourseList {...props} /></Wrapper>);
    list = TestUtils.scryRenderedDOMComponentsWithTag(result, 'li');
    expect(list.length).toBe(3);
  });
});
