import _ from 'lodash';

const defaultState = {
  examList: {},
  assignedExams: {},
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

    case 'LOAD_ASSIGNED_EXAMS_DONE': {
      const newState = _.cloneDeep(state);
      _.forEach(action.payload, (assignedExam) => {
        const { exam_id } = assignedExam;
        newState.assignedExams[exam_id] = assignedExam;
      });
      newState.ready = true;
      return newState;
    }
    case 'REASSIGN_EXAM_DONE':
    case 'ASSIGN_EXAM_DONE': {
      const newState = _.cloneDeep(state);
      newState.assignedExams[action.payload.student_id] = action.payload;
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
