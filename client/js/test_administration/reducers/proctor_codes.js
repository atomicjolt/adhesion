import _ from 'lodash';

const defaultState = {
  proctorCodeList: {}
};

export default function exams(state = defaultState, action) {
  switch (action.type) {

    case 'LOAD_PROCTOR_CODES_DONE': {
      const newState = _.cloneDeep(state);
      _.forEach(action.payload, (proctorCode) => {
        newState.proctorCodeList[proctorCode.id] = proctorCode;
      });
      return newState;
    }

    default:
      return state;
  }
}
