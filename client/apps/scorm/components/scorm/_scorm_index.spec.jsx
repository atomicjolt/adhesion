/* global describe beforeEach it expect */

import React from 'react';
import { shallow } from 'enzyme';
import { ScormIndex } from './_scorm_index';

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
      replacePackage: () => {},
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
    result = shallow(<ScormIndex {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });

  it('renders no lists when no scormFiles exist', () => {
    expect(result.scormFile).toBeFalsy();
    const li = result.find('.c-list-item__title');
    expect(li.length).toBe(0);
  });

  it('renders error message when SCORM goes down', () => {
    props.loadError = true;
    result = shallow(<ScormIndex {...props} />);
    const error = result.find('.c-error__message');
    expect(error).toBeTruthy();
  });
});
