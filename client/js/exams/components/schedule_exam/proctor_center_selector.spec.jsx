import React     from 'react';
import TestUtils from 'react-addons-test-utils';
import ProctorCenterSelector  from './proctor_center_selector';
import Stub      from '../../../../specs_support/stub';

describe('Schedule Exam Proctor Center Selector', () => {
  let props;
  let result;

  beforeEach(() => {
    props = {
      testingCenterList: [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }],
      onChange: () => {},
    };
    result = TestUtils.renderIntoDocument(<Stub><ProctorCenterSelector {...props} /></Stub>);
  });

  it('renders the search divs', () => {
    const elements = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div');
    expect(elements.length).toBe(4);
  });

  it('renders the search with the correct placeholder', () => {
    const elements = TestUtils.scryRenderedDOMComponentsWithClass(result, 'select-search-box__search');
    expect(elements.length).toBe(1);
    expect(elements[0].placeholder).toBe('Select a testing center');
  });
});
