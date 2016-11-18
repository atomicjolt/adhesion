import React        from 'react';
import ReactDOM     from 'react-dom';
import TestUtils    from 'react/lib/ReactTestUtils';
import ExportCSV    from './export_modal';

describe('Export CSV', () => {
  var props = {
    apiUrl: '',
    lmsCourseId:"123",
    downloadFile: () => {},
    onExport: () => {},
    onOutsideClick: () => {}
  };

  it('renders', () => {
    const result = TestUtils.renderIntoDocument(<ExportCSV {...props} />);
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
    spyOn(props, 'onOutsideClick');
    const result = TestUtils.renderIntoDocument(<ExportCSV {...props} />);
    const outside = TestUtils.findRenderedDOMComponentWithClass(result, "c-popup--outside");
    TestUtils.Simulate.click(outside);
    expect(props.onOutsideClick).toHaveBeenCalled();
  });
});
