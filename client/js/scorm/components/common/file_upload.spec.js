import React      from 'react';
import ReactDOM   from 'react-dom';
import TestUtils  from 'react/lib/ReactTestUtils';
import FileUpload from './file_upload';

describe('common svg', () => {
  let props, result, node;
  beforeEach(()=>{
    props = {
      className: "IMASPEC",
      type: "drop"
    };
    result = TestUtils.renderIntoDocument(<div><FileUpload {...props}/></div>);
    node = ReactDOM.findDOMNode(result);
  });

  it('renders the svg with the correct class', () => {
    expect(node.getElementsByClassName("IMASPEC").length).toBe(1);
  });
});
