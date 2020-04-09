import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import Index from './index';

jest.mock('./errors');

describe('index', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {};
    result = ReactTestUtils.renderIntoDocument(<Index {...props} />);
  });

  it('renders the index', () => {
    // eslint-disable-next-line react/no-find-dom-node
    expect(ReactDOM.findDOMNode(result)).toBeDefined();
  });
});
