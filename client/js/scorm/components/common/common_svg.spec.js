import React     from 'react';
import ReactDOM  from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';
import CommonSvg from './common_svg';
import Stub      from '../../../../specs_support/stub.jsx';

describe('common svg', () => {
  let props, result, node;

  beforeEach(()=>{
    props = {
      className: "IMASPEC",
      type: "drop"
    };
    result = TestUtils.renderIntoDocument(<Stub><CommonSvg {...props}/></Stub>);
    node = ReactDOM.findDOMNode(result);
  });

  it('renders the svg with the correct class', () => {
    debugger;
    const elements = TestUtils.scryRenderedDOMComponentsWithClass(result, "IMASPEC");
    debugger;
    expect(elements.length).toBe(1);
  });

  it('renders the correct icon given the type property', ()=>{
    let path = node.getElementsByClassName("c-path")[0];
    expect(path.getAttribute("d")).toBe("M14 20l10 10 10-10z");
  });

  it("uses the default className when no class is provided", ()=>{
    props.className = null;
    result = TestUtils.renderIntoDocument(<div><CommonSvg {...props}/></div>);
    node = ReactDOM.findDOMNode(result);
    expect(node.getElementsByClassName("c-icon").length).toBe(1);
  });
});
