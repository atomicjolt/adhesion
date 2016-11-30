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

  it('renders error message when error exists', () => {
    let uploadError = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-upload-error');
    expect(uploadError.length).toBe(1);
  });

  it('renders blue loader animation when no error exists', () => {
    let loader = TestUtils.scryRenderedDOMComponentsWithClass(result, 'loader');
    expect(loader.length).toBe(0);
    props.error = false;
    result = TestUtils.renderIntoDocument(<Uploader {...props} />);
    loader = TestUtils.scryRenderedDOMComponentsWithClass(result, 'loader');
    expect(loader.length).toBe(1);

  });

  it('renders the correct scormFile name', () => {
    let title = TestUtils.findRenderedDOMComponentWithClass(result, 'c-list-item__title');
    expect(title.textContent).toContain('IMASPEC')
  });
});
