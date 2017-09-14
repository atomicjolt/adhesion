import React from 'react';
import { shallow } from 'enzyme';
import ExportCSV from './export_modal';


const mockedDate = new Date('2016-01-01T00:00:00.000Z');
global.Date = jest.fn(() => mockedDate);

describe('Export CSV', () => {
  let modalClosed;
  let props;
  beforeEach(() => {
    modalClosed = false;
    props = {
      apiUrl: '',
      lmsCourseId: '123',
      downloadFile: () => {},
      onExport: () => {},
      closeModal: () => { modalClosed = true; },
    };
  });

  it('renders', () => {
    const result = shallow(<ExportCSV {...props} />);
    expect(result).toMatchSnapshot();
  });

  it('should close modal on button click', () => {
    const result = shallow(<ExportCSV {...props} />);

    result.find('.c-btn--cancel').simulate('click');

    expect(modalClosed).toBeTruthy();
  });

  it('should call onOut when someone clicks outside', () => {
    expect(modalClosed).toBeFalsy();

    const result = shallow(<ExportCSV {...props} />);
    result.find('.c-popup--outside').simulate('click');
    expect(modalClosed).toBeTruthy();
  });
});
