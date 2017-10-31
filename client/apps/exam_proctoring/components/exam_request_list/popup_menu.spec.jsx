import React from 'react';
import { shallow } from 'enzyme';
import PopupMenu from './popup_menu';

describe('popup menu', () => {
  let result;
  let props;
  let examHasStarted;
  let examHasFinished;
  let examModal;
  let message;
  beforeEach(() => {

    examHasStarted = false;
    examHasFinished = false;

    props = {
      status: 'scheduled',
      studentHasExamStarted: false,
      startExam: () => { examHasStarted = true; },
      finishExam: () => { examHasFinished = true; },
      openExamModal: () => { examModal = 1; },
      openMessageModal: () => { message = "If you're reading this, I'm too late"; },
    };

    result = shallow(<PopupMenu {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
