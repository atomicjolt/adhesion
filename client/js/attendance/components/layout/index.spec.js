"use strict";

import React        from 'react';
import ReactDOM     from 'react-dom';
import TestUtils    from 'react/lib/ReactTestUtils';
import Index        from './index';

describe('index', function() {
  var result;
  var props;

  beforeEach(()=>{
    props = {};
    result = TestUtils.renderIntoDocument(<Index {...props} />);
  });

  it('renders the index', function() {
    expect(ReactDOM.findDOMNode(result)).toBeDefined();
  });
});
