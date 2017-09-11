import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import UploadButton     from './upload_button';
import Stub             from '../../../../specs_support/stub';

jest.mock('../../libs/assets');

describe('Upload Button', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      isConverting: false,
      canSubmit: false,
    };

    result = TestUtils.renderIntoDocument(<Stub><UploadButton {...props} /></Stub>);
  });

  it('renders the button', () => {
    const button = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    expect(button.textContent).toContain('Upload Files');
  });

  it('shows the spinner when isConverting is true', () => {
    props.isConverting = true;
    result = TestUtils.renderIntoDocument(<Stub><UploadButton {...props} /></Stub>);
    const spinner = TestUtils.findRenderedDOMComponentWithTag(result, 'img');
    expect(spinner).toBeDefined();
  });
});
