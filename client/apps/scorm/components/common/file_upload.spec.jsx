/* global describe beforeEach it expect */

import React from 'react';
import { mount } from 'enzyme';
import FileUpload from './file_upload';

describe('File Upload', () => {
  let props;
  let result;
  let uploading;

  beforeEach(() => {
    uploading = false;

    props = {
      processPackage: () => { uploading = true; },
    };

    result = mount(<FileUpload {...props} />);
  });

  it('calls upload file', () => {
    const fileIn = result.find('input');
    fileIn.simulate('change', { target: { files: ['file'] } });
    expect(uploading).toBeTruthy();
  });

  it('wont upload if no files are present', () => {
    const fileIn = result.find('input');
    fileIn.simulate('change', { target: { files: [] } });
    expect(uploading).toBeFalsy();
  });
});
