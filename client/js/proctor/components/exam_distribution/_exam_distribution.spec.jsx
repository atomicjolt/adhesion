import React                    from 'react';
import TestUtils                from 'react-addons-test-utils';
import { BaseExamDistribution } from './_exam_distribution';

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
          name: 'Joseph'
        },
        2: {
          id: 2,
          name: 'Ben'
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
        }
      },
      ready: true,
    };
    result = TestUtils.renderIntoDocument(<BaseExamDistribution {...props} />);
  });

  it('puts the unassigned students at the top of the list', () => {
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'table');
    expect(element.textContent).toContain('BenGeorgiaAlabama -  Unassigned Joseph');
  });
});
