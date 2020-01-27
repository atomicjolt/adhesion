/* global describe beforeEach it expect */

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import Course from './course';
import Settings from './settings';

describe('course', () => {
  let props;
  let result;
  let remove;

  beforeEach(() => {
    props = {
      course: {
        title: 'IMASPEC',
        fetching: false,
        grading_type: 'points',
        points_possible: 100,
        lms_assignment_id: 1,
        id: 'id'
      },
      removePackage: () => { remove = true; },
      importPackage: () => { remove = true; },
      previewPackage: () => { remove = true; },
      updateImportType: () => { remove = true; },
      replacePackage: () => {},
      publishPackage: () => {},
      onClick: () => {},
      canvasUrl: 'www.canvas.com',
      courseId: '7',
      hideModal: () => {},
      showModal: () => {},
      canvasAssignment: {},
    };
    remove = false;
    result = ReactTestUtils.renderIntoDocument(<Course {...props} />);
  });

  it('should check the course title', () => {
    const title = ReactTestUtils.findRenderedDOMComponentWithClass(result, 'c-list-item__title');
    expect(title.textContent).toContain('IMASPEC');
  });

  it('should verify that Loader is rendered when course.fetching is true', () => {
    let loader = ReactTestUtils.scryRenderedDOMComponentsWithClass(result, 'loader');
    expect(loader.length).toBe(0);
    props.course.fetching = true;
    result = ReactTestUtils.renderIntoDocument(<Course {...props} />);
    loader = ReactTestUtils.scryRenderedDOMComponentsWithClass(result, 'loader');
    expect(loader.length).toBe(1);
  });

  it('renders Graded Assigment when assignment exists and is a graded assignment', () => {
    const itemType = ReactTestUtils.scryRenderedDOMComponentsWithClass(result, 'c-list-item__type');
    expect(itemType.length).toBe(1);
    const itemTypeText = ReactTestUtils.findRenderedDOMComponentWithClass(result, 'c-list-item__type');
    const dropDown = ReactTestUtils.scryRenderedDOMComponentsWithClass(result, 'c-dropdown');
    expect(dropDown.length).toBe(0);
    expect(itemTypeText.textContent).toContain('Graded Assignment');
  });

  it('renders Ungraded Assignment when assignment exists and is an ungraded assignment', () => {
    props.course.grading_type = 'points';
    props.course.points_possible = 0;
    result = ReactTestUtils.renderIntoDocument(<Course {...props} />);
    const itemTypeText = ReactTestUtils.findRenderedDOMComponentWithClass(result, 'c-list-item__type');
    const dropDown = ReactTestUtils.scryRenderedDOMComponentsWithClass(result, 'c-dropdown');
    expect(dropDown.length).toBe(0);
    expect(itemTypeText.textContent).toContain('Ungraded Assignment');
  });

  it('renders Pass/Fail Assignment when assignment exists and is a pass_fail assignment', () => {
    props.course.grading_type = 'pass_fail';
    result = ReactTestUtils.renderIntoDocument(<Course {...props} />);
    const itemTypeText = ReactTestUtils.findRenderedDOMComponentWithClass(result, 'c-list-item__type');
    const dropDown = ReactTestUtils.scryRenderedDOMComponentsWithClass(result, 'c-dropdown');

    expect(dropDown.length).toBe(0);
    expect(itemTypeText.textContent).toContain('Pass/Fail Assignment');
  });

  it('renders ImportTypeSelector component when isAssignment is not true', () => {
    props.course.lms_assignment_id = undefined;
    result = ReactTestUtils.renderIntoDocument(<Course {...props} />);
    const dropDown = ReactTestUtils.scryRenderedDOMComponentsWithClass(result, 'c-dropdown');
    expect(dropDown.length).toBe(1);
  });

  it('should render Settings component', () => {
    result.setState({ opened: true });
    const settings = ReactTestUtils.scryRenderedComponentsWithType(result, Settings);
    expect(settings).toBeDefined();
  });

  it('verifies that ImportTypeSelector handleGoClick calls handleGoClick function', () => {
    props.course.lms_assignment_id = undefined;
    result = ReactTestUtils.renderIntoDocument(<Course {...props} />);
    expect(remove).toBeFalsy();
    const btn = ReactTestUtils.scryRenderedDOMComponentsWithClass(result, 'c-btn--go');
    ReactTestUtils.Simulate.click(btn[0]);
    expect(remove).toBeTruthy();
  });

  it('verifies that ImportTypeSelector handleImportType function is called by handleImportType with proper select value', () => {
    props.course.lms_assignment_id = undefined;
    result = ReactTestUtils.renderIntoDocument(<Course {...props} />);
    const selector = ReactTestUtils.findRenderedDOMComponentWithTag(result, 'select');
    ReactTestUtils.Simulate.change(selector, { target: { value: 'Graded Assignment' } });
    expect(remove).toBeTruthy();
    ReactTestUtils.Simulate.change(selector, { target: { value: 'Ungraded Assignment' } });
    expect(remove).toBeTruthy();
  });
});
