import _ from 'lodash';
import camelize from '../../../libs/camelizer';
import { DONE } from '../../../libs/constants/wrapper';
import { Constants as InfoConstants } from '../actions/sections_info';

export default (state = {}, action) => {
  switch (action.type) {

    case InfoConstants.SECTIONS_INFO + DONE: {
      const newState = _.cloneDeep(state);
      _.forEach(action.payload, (section) => {
        newState[section.lms_section_id] = camelize(section);
      });
      return newState;
    }

    case InfoConstants.UPDATE_SECTIONS_INFO + DONE: {
      const newState = _.cloneDeep(state);
      _.forEach(action.payload, (section) => {
        newState[section.lms_section_id] = camelize(section);
      });
      return newState;
    }

    default:
      return state;
  }
};
