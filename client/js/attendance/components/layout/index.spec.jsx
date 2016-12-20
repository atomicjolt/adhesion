import React        from 'react';
import ReactDOM     from 'react-dom';
import TestUtils    from 'react-addons-test-utils';
import Index        from './index';

describe('index', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {};
    result = TestUtils.renderIntoDocument(<Index {...props} />);
  });

  it('renders the index', () => {
    expect(ReactDOM.findDOMNode(result)).toBeDefined();
  });
});
