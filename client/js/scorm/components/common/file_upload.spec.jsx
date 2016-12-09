/* global describe beforeEach it expect */

import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import FileUpload from './file_upload';
import Stub from '../../../../specs_support/stub';

describe('File Upload', () => {
  let props;
  let result;
  let uploading;

  beforeEach(() => {
    uploading = false;

    props = {
      uploadPackage: () => { uploading = true; },
    };

    result = TestUtils.renderIntoDocument(<Stub><FileUpload {...props} /></Stub>);
  });

  it('calls upload file', () => {
    const fileIn = TestUtils.findRenderedDOMComponentWithTag(result, 'input');
    TestUtils.Simulate.change(fileIn, { target: { files: ['file'] } });
    expect(uploading).toBeTruthy();
  });

  it('wont upload if no files are present', () => {
    const fileIn = TestUtils.findRenderedDOMComponentWithTag(result, 'input');
    TestUtils.Simulate.change(fileIn, { target: { files: [] } });
    expect(uploading).toBeFalsy();
  });
});
