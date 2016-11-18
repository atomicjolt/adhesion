import React        from 'react';
import TestUtils    from 'react/lib/ReactTestUtils';
import Stub         from '../../../../specs_support/stub';
import ExportButton from './export_button';

describe('export button', ()=>{
  let output, result, props;
  beforeEach(()=>{
    output = null;
    props = {
      onExport: (options)=>{output = options;},
      downloadOptions: {america: 'the beautiful'}
    };
    result = TestUtils.renderIntoDocument(<Stub><ExportButton {...props} / ></Stub>);
  });
  it('should pass the options into the onExport function', ()=>{
    let buttons = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    TestUtils.Simulate.click(buttons[0]);
    expect(output.america).toBe('the beautiful');
  });
});
