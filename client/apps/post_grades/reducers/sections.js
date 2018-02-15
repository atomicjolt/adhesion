import _ from 'lodash';
import { DONE } from 'atomic-fuel/libs/constants/wrapper';
import { listCourseSections } from 'atomic-canvas/libs/constants/sections';

const defaultState = {
  loading: true,
  data: {},
};

export default (state = defaultState, action) => {
  switch (action.type) {

    case listCourseSections.type + DONE: {
      const newSections = _.cloneDeep(state.data);
      _.forEach(action.payload, (section) => {
        newSections[section.id] = section;
      });
      return {
        ...state,
        ...{
          data: newSections,
          loading: false,
        },
      };
    }

    default:
      return state;
  }
};
