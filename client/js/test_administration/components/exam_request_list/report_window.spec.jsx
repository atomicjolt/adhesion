import React from 'react';
import TestUtils        from 'react-addons-test-utils';
// import Stub             from '../../../../specs_support/stub';
import ReportWindow from './report_window';
import { Provider }  from 'react-redux';

describe('report window', () => {
  
  let result;
  let props;
  let didCancel;
  let didDownload;
  let startDate;
  let endDate;

  beforeEach(() => {
    didCancel = false;
    didDownload = false;
    props = {
      onCancel: () => { didCancel = true; },
      onDownload: (start, end) => { 
        didDownload = true; 
        startDate = start;
        endDate = end;
       },
      currentAccoundId: 123
    };

    result = TestUtils.renderIntoDocument(<ReportWindow {...props} />);
  });

  it('did click cancel', () => {
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    const cancelButton = buttons[2];
    TestUtils.Simulate.click(cancelButton);
    expect(didCancel).toBeTruthy();
  });

  it('did click download', () => {
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    const downloadButton = buttons[3];
    TestUtils.Simulate.click(downloadButton);
    expect(didDownload).toBeTruthy();
    expect(startDate).toEqual(jasmine.any(Object));
    expect(endDate).toEqual(jasmine.any(Object));
  });
});