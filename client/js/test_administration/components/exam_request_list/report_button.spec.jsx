import React        from 'react';
import TestUtils    from 'react-addons-test-utils';
import Stub         from '../../../../specs_support/stub';
import ReportButton from './report_button';

describe('report button', () => {

  let result;
  let props;
  let didChange;

  beforeEach(() => {
    didChange = false;
    props = {
      text: '',
      onExport: () => { didChange = true; },
      downloadOptions: {}
    };

    result = TestUtils.renderIntoDocument(
      <Stub>
        <ReportButton {...props} />
      </Stub>
    );
  });

  it('did click button', () => {
    const button = TestUtils.findRenderedDOMComponentWithClass(result, 'c-btn  c-btn--export');
    TestUtils.Simulate.click(button);
    expect(didChange).toBeTruthy();
  });
});
