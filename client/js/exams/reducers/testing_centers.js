import _ from 'lodash';

const defaultState = {
  testingCenterList: {},
  testingCentersAccount: {},
};

export default function testingCenters(state = defaultState, action) {
  switch (action.type) {
    case 'GET_TESTING_CENTERS_ACCOUNT_DONE': {
      return { ...state, testingCentersAccount: action.payload };
    }
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
