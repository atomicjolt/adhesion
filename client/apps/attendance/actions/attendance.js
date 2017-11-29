import wrapper from 'atomic-fuel/libs/constants/wrapper';
import Network from 'atomic-fuel/libs/constants/network';

// Local actions
const actions = [];

// Actions that make an api request
const requests = [
  'GET_STUDENT_ATTENDANCE',
  'DOWNLOAD_FILE',
  'UPDATE_STATUS',
  'TOGGLE_ISLARGEDOWNLOAD'
];

export const Constants = wrapper(actions, requests);

export const getStudentAttendance = (date, lmsCourseId) => ({
  type: Constants.GET_STUDENT_ATTENDANCE,
  method: Network.GET,
  url: `api/courses/${lmsCourseId}/attendances/search`,
  params: { date },
  date,
});

export const markStudents = (students, lmsCourseId, date, status) => ({
  type: Constants.UPDATE_STATUS,
  method: Network.POST,
  url: `api/courses/${lmsCourseId}/attendances`,
  body: {
    students,
    lms_course_id: lmsCourseId,
    date,
    status,
  },
});

export const downloadFile = (lmsCourseId, startDate, endDate) => ({
  type: Constants.DOWNLOAD_FILE,
  method: Network.GET,
  url: `courses/${lmsCourseId}/exports/attendances.csv`,
  params: {
    start_date: startDate,
    end_date: endDate,
  },
  filename: 'attendance.csv'
});

export const toggleIsLargeDownload = () => ({
  type: Constants.TOGGLE_ISLARGEDOWNLOAD,
});
