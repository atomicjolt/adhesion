/* global describe beforeEach it expect */

import React      from 'react';
import TestUtils  from 'react/lib/ReactTestUtils';
import { ScormIndex } from './scorm_index';


describe('scorm index', () => {
  let props, result, create, courseId, queryObject, remove;
  beforeEach(() => {
    props = { loadPackages: () => {},
              shouldRefreshList: false,
              canvasRequest(create_assignment, course, query) {
                create = create_assignment;
                courseId = course.course_id;
                queryObject = query
              },
              removeError(e){ remove = true },
              lmsCourseId: 1,
              removePackage: () => {},
              previewPackage: () => {},
              scormFile: false,
              scormList: [],
              uploadPackage: () => {}
            };
    remove = false;
    result = TestUtils.renderIntoDocument(<ScormIndex {...props}/>);
  });

  it('renders no lists when no scormFiles exist', () => {
    expect(result.scormFile).toBeFalsy();
    let li = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-list-item__title');
    expect(li.length).toBe(0);
  });

  it('renders list when assignment exists', () => {
    props.scormList = [{course: {title: 'something'}}];
    result = TestUtils.renderIntoDocument(<ScormIndex {...props} />);
    let li = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-list-item__title');
    expect(li.length).toBe(1);
  });

  it('onClick function calls removeError function', () => {
    expect(remove).toBeFalsy();
    let button = TestUtils.findRenderedDOMComponentWithClass(result, 'c-header__btns');
    TestUtils.Simulate.click(button);
    expect(remove).toBeTruthy();
  });

});