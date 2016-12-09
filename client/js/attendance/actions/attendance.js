import wrapper from '../../constants/wrapper';
import Network from '../../constants/network';

// Local actions
const actions = [];

// Actions that make an api request
const requests = [
  'GET_STUDENT_ATTENDANCE',
  'DOWNLOAD_FILE',
  'UPDATE_STATUS',
];

export const Constants = wrapper(actions, requests);

export const getStudentAttendance = (date, lmsCourseId) => ({
  type: Constants.GET_STUDENT_ATTENDANCE,
  method: Network.GET,
  url: `api/courses/${lmsCourseId}/attendances/search`,
  params: { date },
  date,
});

export const markStudents = (students, lmsCourseId, date, status) => {
  return {
    type: Constants.UPDATE_STATUS,
    method: Network.POST,
    url: `api/courses/${lmsCourseId}/attendances`,
    body: {
      students,
      lms_course_id: lmsCourseId,
      date,
      status,
    },
  };
};


export const downloadFile = (lms_course_id, startDate, endDate) => {
  const url = `courses/${lms_course_id}/exports/attendances.csv`;
  return {
    type: Constants.DOWNLOAD_FILE,
    method: Network.GET,
    url,
    params: {
      startDate,
      endDate
    }
  };
};
