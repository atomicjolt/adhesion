import React from 'react';
import { shallow } from 'enzyme';
import FileUploadButton from './file_upload_button';

describe('File Upload Button', () => {
  let result;
  let called;

  beforeEach(() => {
    called = false;
    const props = {
      text: 'Button text',
      htmlId: 'quiz',
      selectFile: () => { called = true; },
    };

    result = shallow(<FileUploadButton {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });

  it('calls selectFile when a file is selected', () => {
    const input = result.find('input');
    input.simulate('change', { target: { files: ['file'] } });
    expect(called).toBeTruthy();
  });

  it('does not call selectFile when there are no files selected', () => {
    const input = result.find('input');
    input.simulate('change', { target: { files: [] } });
    expect(called).toBeFalsy();
  });
});
