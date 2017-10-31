import React from 'react';
import { shallow } from 'enzyme';
import ExportButton from './export_button';

describe('export button', () => {
  let output;
  let result;
  let props;

  beforeEach(() => {
    output = null;
    props = {
      onExport: (options) => { output = options; },
      downloadOptions: { america: 'the beautiful' },
      ariaPosinset: 0,
    };
    result = shallow(<ExportButton {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });

  it('should pass the options into the onExport function', () => {
    const buttons = result.find('button');
    buttons.first().simulate('click');
    expect(output.america).toBe('the beautiful');
  });
});
