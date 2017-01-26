import _ from 'lodash';

const defaultState = {
  examList: {},
  examRequests: {},
  ready: false,
};

export default function exams(state = defaultState, action) {
  switch (action.type) {
    case 'LIST_QUIZZES_IN_COURSE_DONE': {
      const newState = _.cloneDeep(state);
      const list = _.filter(action.payload, exam => exam.published);
      _.forEach(list, (exam) => {
        newState.examList[exam.id] = exam;
      });
      return newState;
    }

    case 'LOAD_EXAM_REQUESTS_DONE': {
      const newState = _.cloneDeep(state);
      _.forEach(action.payload, (examRequest) => {
        const { exam_id } = examRequest;
        newState.examRequests[exam_id] = examRequest;
      });
      newState.ready = true;
      return newState;
    }
    case 'REASSIGN_EXAM_DONE':
    case 'REQUEST_EXAM_DONE': {
      const newState = _.cloneDeep(state);
      newState.examRequests[action.payload.exam_id] = action.payload;
      return newState;
    }

    case 'UNASSIGN_EXAM_DONE': {
      const newState = _.cloneDeep(state);
      delete newState.assignedExams[action.payload.student_id];
      return newState;
    }
    case 'CLEAR_STATE':
      return defaultState;

    default:
      return state;
  }
}
