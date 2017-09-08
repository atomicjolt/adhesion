import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ExportCSV from './export_modal';

describe('Export CSV', () => {
  const props = {
    apiUrl: '',
    lmsCourseId: '123',
    downloadFile: () => {},
    onExport: () => {},
    closeModal: () => {},
  };

  it('renders', () => {
    const result = TestUtils.renderIntoDocument(<ExportCSV {...props} />);
    expect(result).toBeDefined();
  });

  it('should call onExport when export button is clicked', () => {
    const result = TestUtils.renderIntoDocument(<ExportCSV {...props} />);

    spyOn(result, 'onExport');
    const button1 = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-btn--export')[0];
    const button2 = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-btn--export')[1];

    TestUtils.Simulate.click(button1);
    TestUtils.Simulate.click(button2);

    expect(result.onExport).toHaveBeenCalledTimes(2);
  });

  it('should call onOut when someone clicks outside', () => {
    spyOn(props, 'closeModal');
    const result = TestUtils.renderIntoDocument(<ExportCSV {...props} />);
    const outside = TestUtils.findRenderedDOMComponentWithClass(result, 'c-popup--outside');
    TestUtils.Simulate.click(outside);
    expect(props.closeModal).toHaveBeenCalled();
  });
});
