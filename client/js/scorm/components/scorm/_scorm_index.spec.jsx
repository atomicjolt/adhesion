/* global describe beforeEach it expect */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { ScormIndex } from './_scorm_index';
import Wrapper from '../../../../specs_support/scorm_wrapper';
import Stub from '../../../../specs_support/stub';

describe('scorm index', () => {
  let props;
  let result;
  let remove;

  beforeEach(() => {
    props = {
      loadPackages: () => {},
      shouldRefreshList: false,
      canvasRequest() {},
      removeError() { remove = true; },
      lmsCourseId: '1',
      removePackage: () => {},
      previewPackage: () => {},
      updateImportType: () => {},
      canvasUrl: 'salad.com',
      scormFile: null,
      scormList: [],
      uploadPackage: () => {},
      canvasAssignments: {},
      listAssignmentsDone: true,
      loadError: false,
      hideModal: () => {},
      showModal: () => {},
    };
    remove = false;
    result = TestUtils.renderIntoDocument(<Stub><ScormIndex {...props} /></Stub>);
  });

  it('renders no lists when no scormFiles exist', () => {
    expect(result.scormFile).toBeFalsy();
    const li = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-list-item__title');
    expect(li.length).toBe(0);
  });

  it('renders list when assignment exists', () => {
    props.scormList = [{ title: 'something', id: 'id' }];
    result = TestUtils.renderIntoDocument(<Wrapper><ScormIndex {...props} /></Wrapper>);
    result.setState({ synced: true });
    const li = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-list-item__title');
    expect(li.length).toBe(1);
  });

  // TODO: Joseph needs to fix this. It broke on his PR, but Travis failed too.
  xit('onClick function calls removeError function', () => {
    expect(remove).toBeFalsy();
    result.setState({ synced: true });
    const button = TestUtils.findRenderedDOMComponentWithClass(result, 'c-header__btns');
    TestUtils.Simulate.click(button);
    expect(remove).toBeTruthy();
  });

  it('renders error message when SCORM goes down', () => {
    props.loadError = true;
    result = TestUtils.renderIntoDocument(<Wrapper><ScormIndex {...props} /></Wrapper>);
    const error = TestUtils.findRenderedDOMComponentWithClass(result, 'c-error__message');
    expect(error).toBeTruthy();
  });
});
