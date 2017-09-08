import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import Helper from '../../../../specs_support/helper';
import Index from './index';

describe('index', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      children: <div className="testy">Im a test</div>,
    };
    const component = <Provider store={Helper.makeStore()}><Index {...props} /></Provider>;
    result = TestUtils.renderIntoDocument(component);
  });

  it('renders the index', () => {
    const child = TestUtils.findRenderedDOMComponentWithClass(result, 'testy');
    expect(child).toBeDefined();
  });
});
