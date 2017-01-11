import wrapper from '../../constants/wrapper';
import Network from '../../constants/network';

// Actions that make an api request
const requests = [
  'CONVERT_QUIZ'
];

export const Constants = wrapper([], requests);

export const importQuiz = (lmsCourseId, quizFile, answerFile) => {
  const form = new FormData();
  form.append('quiz_doc', quizFile);
  form.append('answer_key', answerFile);

  return {
    method: Network.POST,
    type: Constants.CONVERT_QUIZ,
    url: '/api/quiz_conversions',
    params: { lms_course_id: lmsCourseId },
    body: form,
    timeout: 100000,
  };
};
