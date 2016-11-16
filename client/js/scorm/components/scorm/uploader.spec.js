/* global describe beforeEach it expect */

import React      from 'react';
import TestUtils  from 'react/lib/ReactTestUtils';
import { Uploader } from './uploader';

describe('Uploader', () =>{
  let props, result;
  beforeEach(() => {
    props = {
    	error: true,
    	scormFile: {name: 'IMASPEC'}
    }
    result = TestUtils.renderIntoDocument(<Uploader {...props}/>);
  });

  it('renders red progress bar when error exists', () => {
    let uploadError = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-upload-error');
    let upload = TestUtils.scryRenderedDOMComponentsWithClass(result, 'blue');
    expect(uploadError.length).toBe(1);
    expect(upload.length).toBe(0);
  });

  it('renders blue progress bar when no error exists', () => {
    props.error = false;
    result = TestUtils.renderIntoDocument(<Uploader {...props}/>);
    let upload = TestUtils.scryRenderedDOMComponentsWithClass(result, 'blue');
    let uploadError = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-upload-error');
    expect(upload.length).toBe(1);
    expect(uploadError.length).toBe(0);
  });

  it('renders the correct scormFile name', () => {
    let title = TestUtils.findRenderedDOMComponentWithClass(result, 'c-list-item__title');
    expect(title.textContent).toContain('IMASPEC')
  });
});
