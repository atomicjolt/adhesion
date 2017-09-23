import wrapper from '../../../libs/constants/wrapper';
import Network from '../../../libs/constants/network';

// Local actions
const actions = [];

// Actions that make an api request
const requests = [
  'SECTIONS_INFO',
  'UPDATE_SECTIONS_INFO',
];

export const Constants = wrapper(actions, requests);

export const createSectionInfo = (sectionIds, lmsCourseId) => ({
  type: Constants.SECTIONS_INFO,
  method: Network.POST,
  url: 'api/section_metadata/',
  body: {
    lms_section_ids: sectionIds,
    lms_course_id: lmsCourseId,
  }
});

export const updateSectionMetadata = (sections, lmsCourseId, type) => ({
  type: Constants.UPDATE_SECTIONS_INFO,
  method: Network.POST,
  url: 'api/section_metadata/',
  body: {
    type,
    sections,
    lms_course_id: lmsCourseId,
    updater: true,
  }
});
