import React                      from 'react';
import TestUtils                  from 'react-addons-test-utils';
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
    result = TestUtils.renderIntoDocument(<BaseExamRequestList {...props} />);
  });

  it('filters on search', () => {
    result.setState({ searchVal: 'scheduled' });
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'table');
    expect(element.textContent).toContain('James');
    expect(element.textContent).not.toContain('Picard');
  });

  it('download', () => {
    result.onDownload('yesterday', 'tomorrow');
    expect(willDownload).toBeTruthy();
  });

  it('schedule an exam', () => {
    result.scheduleExam('123', 'scheduled for yesterday', 'did you not know?');
    expect(examId).toBeDefined();
    expect(examBody).toBeDefined();
  });
});
