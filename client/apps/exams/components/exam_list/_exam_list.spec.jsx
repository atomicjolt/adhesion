import React from 'react';
import { shallow } from 'enzyme';
import { BaseExamList } from './_exam_list';

describe('Exam list', () => {
  let result;

  beforeEach(() => {
    const props = {
      canvasRequest: () => {},
      loadExamRequests: () => {},
      getTestingCentersAccount: () => {},
      lmsCourseId: '1',
      examList: [{ title: 'america', id: 1, access_code: 'proctored-exam-asdfasdf' }],
      examRequests: {
        1: {
          status: 'requested'
        }
      },
      lmsUserId: 'lms user id',
      toolConsumerInstanceName: 'instance name'
    };
    result = shallow(<BaseExamList {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
