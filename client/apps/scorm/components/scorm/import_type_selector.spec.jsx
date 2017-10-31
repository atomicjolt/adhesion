import React from 'react';
import { shallow } from 'enzyme';
import ImportTypeSelector from './import_type_selector';

describe('import type selector', () => {
  let props;
  let result;

  beforeEach(() => {
    props = {
      handleSelectChange: (e) => { props.handleSelectChange = e.target.value; },
      handleGoClick: () => { props.isGoBtnActive = true; },
      isGoBtnActive: false,
    };

    result = shallow(<ImportTypeSelector {...props} />);
  });

  it('Go button calls callback on click', () => {
    expect(props.isGoBtnActive).toBeFalsy();
    const button = result.find('.c-btn--go');
    button.simulate('click');
    expect(props.isGoBtnActive).toBeTruthy();
  });

  it('select change activated on change', () => {
    const selection = result.find('select');
    selection.simulate('change', { target: { value: 'Graded Assignment' } });
    expect(props.handleSelectChange).toEqual('Graded Assignment');
    selection.simulate('change', { target: { value: 'Ungraded Assignment' } });
    expect(props.handleSelectChange).toEqual('Ungraded Assignment');
    selection.simulate('change', { target: { value: 0 } });
    expect(props.handleSelectChange).toEqual(0);
  });
});
