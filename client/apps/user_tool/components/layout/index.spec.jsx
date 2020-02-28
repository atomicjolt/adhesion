import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import Index from './index';

describe('index', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {};
    result = ReactTestUtils.renderIntoDocument(<Index {...props} />);
  });

  it('renders the index', () => {
    expect(ReactDOM.findDOMNode(result)).toBeDefined();
  });
});
