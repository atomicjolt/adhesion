import _ from 'lodash';

const defaultState = {
  testingCenterList: {},
};

export default function students(state = defaultState, action) {
  switch (action.type) {
    case 'GET_SUB_ACCOUNTS_OF_ACCOUNT_DONE': {
      const newState = _.cloneDeep(state);
      _.each(action.payload, (center) => {
        newState.testingCenterList[center.id] = center;
      });
      return newState;
    }

    default:
      return state;
  }
}
