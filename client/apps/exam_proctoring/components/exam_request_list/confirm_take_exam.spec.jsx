import React from 'react';
import { shallow } from 'enzyme';
import ConfirmExam from './confirm_take_exam';

describe('Confirm Take Exam', () => {
  let result;
  let props;
  let status;

  beforeEach(() => {
    status = null;
    props = {
      takeExam: () => { status = 'taking'; },
      closeModal: () => { status = 'closing'; },
    };
    result = shallow(<ConfirmExam {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });

  it('cancel button cancels', () => {
    const close = result.find('.qa-cancel-take-exam');
    close.simulate('click');
    expect(status).toBe('closing');
  });

  it('start button starts quiz', () => {
    const start = result.find('.qa-begin-take-exam');
    start.simulate('click');
    expect(status).toBe('taking');
  });
});
