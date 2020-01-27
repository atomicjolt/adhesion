import React from 'react';
import { shallow } from 'enzyme';
import ReportWindow from './report_window';

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
    };

    result = shallow(<ReportWindow {...props} />);
  });

  it('did click cancel', () => {
    const buttons = result.find('button.qa-cancel-report-btn');
    const cancelButton = buttons;
    cancelButton.simulate('click');
    expect(didCancel).toBeTruthy();
  });

  it('did click download', () => {
    const downloadButton = result.find('button.qa-download-report-btn');
    downloadButton.simulate('click');
    expect(didDownload).toBeTruthy();
    expect(startDate).toEqual(jasmine.any(Object));
    expect(endDate).toEqual(jasmine.any(Object));
  });
});
