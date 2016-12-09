/* global describe beforeEach it expect */

import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import ImportTypeSelector from './import_type_selector';
import Stub from '../../../../specs_support/stub';

describe('import type selector', () => {
  let props;
  let result;

  beforeEach(() => {
    props = {
      handleSelectChange: (e) => { props.handleSelectChange = e.target.value; },
      handleGoClick: () => { props.isGoBtnActive = true; },
      isGoBtnActive: false,
    };

    result = TestUtils.renderIntoDocument(<Stub><ImportTypeSelector {...props} /></Stub>);
  });

  it('Go button calls callback on click', () => {
    expect(props.isGoBtnActive).toBeFalsy();
    const button = TestUtils.findRenderedDOMComponentWithClass(result, 'c-btn--go');
    TestUtils.Simulate.click(button);
    expect(props.isGoBtnActive).toBeTruthy();
  });

  it('select change activated on change', () => {
    const selection = TestUtils.findRenderedDOMComponentWithTag(result, 'select');
    TestUtils.Simulate.change(selection, { target: { value: 'Graded Assignment' } });
    expect(props.handleSelectChange).toEqual('Graded Assignment');
    TestUtils.Simulate.change(selection, { target: { value: 'Ungraded Assignment' } });
    expect(props.handleSelectChange).toEqual('Ungraded Assignment');
    TestUtils.Simulate.change(selection, { target: { value: 0 } });
    expect(props.handleSelectChange).toEqual(0);
  });
});
