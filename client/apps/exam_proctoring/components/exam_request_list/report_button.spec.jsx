import React from 'react';
import { shallow } from 'enzyme';
import ReportButton from './report_button';

describe('report button', () => {

  let result;
  let props;
  let didChange;

  beforeEach(() => {
    didChange = false;
    props = {
      text: '',
      onExport: () => { didChange = true; },
      downloadOptions: {}
    };

    result = shallow(<ReportButton {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });

  it('did click button', () => {
    const button = result.find('.c-btn--export');
    button.simulate('click');
    expect(didChange).toBeTruthy();
  });
});
