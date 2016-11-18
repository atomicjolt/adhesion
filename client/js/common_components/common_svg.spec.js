import React     from 'react';
import ReactDOM  from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';
import CommonSvg from './common_svg';

describe('common svg', () => {
  let props, result, node;
  beforeEach(()=>{
    props = {
      className: "IMASPEC",
      type: "drop"
    };
    result = TestUtils.renderIntoDocument(<div><CommonSvg {...props}/></div>);
    node = ReactDOM.findDOMNode(result);
  });

  it('renders the svg with the correct class', () => {
    expect(node.getElementsByClassName("IMASPEC").length).toBe(1);
  });

  it('renders the correct icon given the type property', ()=>{
    let path = node.getElementsByClassName("c-path")[0];
    expect(path.getAttribute("d")).toBe("M14 20l10 10 10-10z");
  });
});
