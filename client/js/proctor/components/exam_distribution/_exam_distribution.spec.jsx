import React                    from 'react';
import TestUtils                from 'react-addons-test-utils';
import { BaseExamDistribution } from './_exam_distribution';
import appHistory               from '../../../history';

describe('Exam list', () => {
  let result;

  beforeEach(() => {
    const props = {
      canvasRequest: () => {},
      lmsCourseId: '1',
      lmsUserId: '1',
      exam: { title: 'America' },
      studentList: {
        1: {
          id: 1,
          name: 'Ben'
        },
        2: {
          id: 2,
          name: 'Joseph'
        }
      },
      testingCenterList: {
        1: {
          id: 1,
          name: 'Georgia'
        },
        2: {
          id: 2,
          name: 'Alabama'
        }
      },
      instructorName: 'Justin',
      params: { id: '1' },
      assignExam: () => {},
      reassignExam: () => {},
      loadAssignedExams: () => {},
      testingCentersAccountId: 1,
      assignedExams: {
        1: {
          id: 1,
          status: 'assigned',
          updated_at: '1 Dec 15'
        }
      },
      ready: true,
    };
    result = TestUtils.renderIntoDocument(<BaseExamDistribution {...props} />);
  });

  it('puts the unassigned students at the top of the list', () => {
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'table');
    expect(element.textContent).toContain('JosephGeorgiaAlabama -  Unassigned Ben');
  });

  it('orders the list by student name', () => {
    const button = TestUtils.findRenderedDOMComponentWithClass(result, 'spec_name');
    TestUtils.Simulate.click(button);
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'table');
    expect(element.textContent).toContain('BenGeorgiaAlabama01 DEC 15 0:0 -  Assigned Joseph');
  });

  it('goes back to exam list page with a click of the back button', () => {
    spyOn(appHistory, 'push');
    const button = TestUtils.findRenderedDOMComponentWithClass(result, 'spec_back');
    TestUtils.Simulate.click(button);
    expect(appHistory.push).toHaveBeenCalledWith('/');
  });
});
