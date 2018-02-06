import _ from 'lodash';
import { DONE } from 'atomic-fuel/libs/constants/wrapper';
import { listCourseSections } from 'atomic-canvas/libs/constants/sections';

const defaultState = {
  loading: true,
  sections: {},
};

export default (state = defaultState, action) => {
  switch (action.type) {

    case listCourseSections.type + DONE: {
      const newSections = _.cloneDeep(state.sections);
      _.forEach(action.payload, (section) => {
        newSections[section.id] = section;
      });
      return {
        ...state,
        ...{
          sections: newSections,
          loading: false,
        },
      };
    }

    default:
      return state;
  }
};
