import _ from 'lodash';

const defaultState = {
  examList: [],
  assignedExams: {},
  ready: false,
};

export default function exams(state = defaultState, action) {
  switch (action.type) {
    case 'LIST_QUIZZES_IN_COURSE_DONE':
      return { ...state, examList: _.filter(action.payload, exam => exam.published) };

    case 'LOAD_ASSIGNED_EXAMS_DONE': {
      const newState = _.cloneDeep(state);
      _.forEach(action.payload, (assignedExam) => {
        newState.assignedExams[assignedExam.student_id] = assignedExam;
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

    default:
      return state;
  }
}
