import _ from 'lodash';
import { DONE } from 'atomic-fuel/libs/constants/wrapper';
import { Constants as InfoConstants } from '../actions/sections_info';

const defaultState = {
  sectionMetadataSubmitted: false,
  data: {},
};

export default (state = defaultState, action) => {
  switch (action.type) {

    case InfoConstants.SECTIONS_INFO + DONE: {
      const newSectionsInfo = _.cloneDeep(state.data);
      _.forEach(action.payload, (section) => {
        newSectionsInfo[section.lms_section_id] = section;
      });
      return {
        ...state,
        ...{
          data: newSectionsInfo,
        },
      };
    }

    case InfoConstants.UPDATE_SECTIONS_INFO + DONE: {
      const newSectionsInfo = _.cloneDeep(state.data);
      _.forEach(action.payload, (section) => {
        newSectionsInfo[section.lms_section_id] = section;
      });
      const status = action.response ? action.response.status : '';
      let sectionMetadataSubmitted = false;
      if (status === 200) {
        sectionMetadataSubmitted = true;
      }
      return {
        ...state,
        ...{
          data: newSectionsInfo,
          showError: action.error,
          statusCode: status,
          sectionMetadataSubmitted,
        }
      };
    }

    default:
      return state;
  }
};
