import _ from 'lodash';
import { DONE } from '../../../libs/constants/wrapper';
import { listCourseSections } from '../../../libs/canvas/constants/sections';

export default (state = {}, action) => {
  switch (action.type) {

    case listCourseSections.type + DONE: {
      const newState = _.cloneDeep(state);
      _.forEach(action.payload, (section) => {
        newState[section.id] = section;
      });
      return newState;
    }

    default:
      return state;
  }
};
