import React from 'react';
import { shallow } from 'enzyme';
import UploadButton from './upload_button';

jest.mock('../../libs/assets');

describe('Upload Button', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      isConverting: false,
      canSubmit: false,
    };

    result = shallow(<UploadButton {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });

  it('shows the spinner when isConverting is true', () => {
    props.isConverting = true;
    result = shallow(<UploadButton {...props} />);
    const spinner = result.find('img');
    expect(spinner).toBeDefined();
  });
});
