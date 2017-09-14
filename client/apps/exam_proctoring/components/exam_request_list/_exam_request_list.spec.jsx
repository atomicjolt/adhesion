import React from 'react';
import { shallow } from 'enzyme';
import { BaseExamRequestList } from './_exam_request_list';

describe('Base Exam Assignment List', () => {
  let result;
  let props;
  let willDownload;
  let examId;
  let examBody;

  beforeEach(() => {
    props = {
      lmsUserId: '1',
      loadExamRequests: () => {},
      testingCentersAccountSetup: () => {},
      examRequestList: [{
        student_name: 'Picard',
        status: 'requested',
        student_id: 1,
        exam_name: 'Whos that pokemon',
        id: 100,
      }, {
        student_name: 'James',
        status: 'scheduled',
        student_id: 2,
        exam_name: 'Whos that pokemon',
        id: 99,
      }],
      getSignedUrl: () => {},
      createProctorConversation: () => {},
      canvasRequest: () => {},
      finishExam: () => {},
      enterAnswers: () => {},
      startExam: () => {},
      hideModal: () => {},
      showModal: () => {},
      exportExamsAsCSV: () => { willDownload = true; },
      needProctorCode: false,
      currentAccountId: '123',
      toolConsumerInstanceName: 'Consumer name',
      scheduleExam: (id, body) => { examId = id; examBody = body; },
    };
    result = shallow(<BaseExamRequestList {...props} />);
  });

  it('displays all', () => {
    const element = result.find('ExamRequest');
    expect(element.length).toBe(2);
  });

  it('filters on search', () => {
    result.setState({ searchVal: 'scheduled' });
    const element = result.find('ExamRequest');
    expect(element.length).toBe(1);
  });

  it('download', () => {
    result.instance().onDownload('yesterday', 'tomorrow');
    expect(willDownload).toBeTruthy();
  });

  it('schedule an exam', () => {
    result.instance().scheduleExam('123', 'scheduled for yesterday', 'did you not know?');
    expect(examId).toBeDefined();
    expect(examBody).toBeDefined();
  });
});
