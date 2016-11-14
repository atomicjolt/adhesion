/* global describe beforeEach it expect */

import React      from 'react';
import TestUtils  from 'react/lib/ReactTestUtils';
import CoursesList from './courses_list';
import Stub      from '../../../../specs_support/stub.jsx';

describe('courses list', () => {
  let props, result;
  beforeEach(() => {
    props = { course: {title: 'IMAPSEC'},
                      importPackage: () => {},
                      previewPackage: () => {},
                      removePackage: () => {}, 
    	        list: [{course: {title: 'IMAPSEC'},
                      importPackage: () => {},
                      previewPackage: () => {},
                      removePackage: () => {}}
                     ]
            };
    result = TestUtils.renderIntoDocument(<Stub><CoursesList {...props}/></Stub>);
  });

  it('renders list of items from props', () => {
    let ul = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-list');
    expect(ul.length).toBe(1);
  });

  it('verifies number of items in the list', () =>{
    let list = TestUtils.scryRenderedDOMComponentsWithTag(result, 'li');
    expect(list.length).toBe(1);
    props.list = [{},{},{}];
    result = TestUtils.renderIntoDocument(<Stub><CoursesList {...props}/></Stub>);
    list = TestUtils.scryRenderedDOMComponentsWithTag(result, 'li');
    expect(list.length).toBe(3);
  });
});