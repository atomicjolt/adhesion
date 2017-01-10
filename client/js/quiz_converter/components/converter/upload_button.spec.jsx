import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import UploadButton     from './upload_button';
import Stub             from '../../../../specs_support/stub';

describe('Upload Button', () => {
  let result;
  let called;

  beforeEach(() => {
    const props = {
      text: 'Button text',
      htmlId: 'quiz',
      selectFile: () => { called = true; },
    };

    result = TestUtils.renderIntoDocument(<Stub><UploadButton {...props} /></Stub>);
    called = false;
  });

  it('renders the button', () => {
    const label = TestUtils.findRenderedDOMComponentWithTag(result, 'label');
    expect(label.textContent).toContain('Button text');
  });

  it('calls selectFile when a file is selected', () => {
    const input = TestUtils.findRenderedDOMComponentWithTag(result, 'input');
    TestUtils.Simulate.change(input, { target: { files: ['file'] } });
    expect(called).toBeTruthy();
  });

  it ('does not call selectFile when there are no files selected', () => {
    const input = TestUtils.findRenderedDOMComponentWithTag(result, 'input');
    TestUtils.Simulate.change(input, { target: { files: [] } });
    expect(called).toBeFalsy();
  });
});
