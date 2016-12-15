//
// Quiz Questions
//
// List questions in a quiz or a submission
// Returns the list of QuizQuestions in this quiz.
//
// API Docs: https://canvas.instructure.com/doc/api/quiz_questions.html
// API Url: courses/{course_id}/quizzes/{quiz_id}/questions
//
// Example:
// const query = {
//   quiz_submission_id
//   quiz_submission_attempt
// }
// return canvasRequest(list_questions_in_quiz_or_submission, {course_id, quiz_id}, query);
export const listQuestionsInQuizOrSubmission = { type: 'LIST_QUESTIONS_IN_QUIZ_OR_SUBMISSION', method: 'get', key: 'list_questions_in_quiz_or_submissionlist_questions_in_quiz_or_submission_{course_id}_{quiz_id}', required: ['course_id','quiz_id'] };

// Get a single quiz question
// Returns the quiz question with the given id
//
// API Docs: https://canvas.instructure.com/doc/api/quiz_questions.html
// API Url: courses/{course_id}/quizzes/{quiz_id}/questions/{id}
//
// Example:
// return canvasRequest(get_single_quiz_question, {course_id, quiz_id, id});
export const getSingleQuizQuestion = { type: 'GET_SINGLE_QUIZ_QUESTION', method: 'get', key: 'get_single_quiz_questionget_single_quiz_question_{course_id}_{quiz_id}_{id}', required: ['course_id','quiz_id','id'] };

// Create a single quiz question
// Create a new quiz question for this quiz
//
// API Docs: https://canvas.instructure.com/doc/api/quiz_questions.html
// API Url: courses/{course_id}/quizzes/{quiz_id}/questions
//
// Example:
// const query = {
//   question[question_name]
//   question[question_text]
//   question[quiz_group_id]
//   question[question_type]
//   question[position]
//   question[points_possible]
//   question[correct_comments]
//   question[incorrect_comments]
//   question[neutral_comments]
//   question[text_after_answers]
//   question[answers]
// }
// return canvasRequest(create_single_quiz_question, {course_id, quiz_id}, query);
export const createSingleQuizQuestion = { type: 'CREATE_SINGLE_QUIZ_QUESTION', method: 'post', key: 'create_single_quiz_questioncreate_single_quiz_question_{course_id}_{quiz_id}', required: ['course_id','quiz_id'] };

// Update an existing quiz question
// Updates an existing quiz question for this quiz
//
// API Docs: https://canvas.instructure.com/doc/api/quiz_questions.html
// API Url: courses/{course_id}/quizzes/{quiz_id}/questions/{id}
//
// Example:
// const query = {
//   question[question_name]
//   question[question_text]
//   question[quiz_group_id]
//   question[question_type]
//   question[position]
//   question[points_possible]
//   question[correct_comments]
//   question[incorrect_comments]
//   question[neutral_comments]
//   question[text_after_answers]
//   question[answers]
// }
// return canvasRequest(update_existing_quiz_question, {course_id, quiz_id, id}, query);
export const updateExistingQuizQuestion = { type: 'UPDATE_EXISTING_QUIZ_QUESTION', method: 'put', key: 'update_existing_quiz_questionupdate_existing_quiz_question_{course_id}_{quiz_id}_{id}', required: ['course_id','quiz_id','id'] };

// Delete a quiz question
// <b>204 No Content</b> response code is returned if the deletion was successful.
//
// API Docs: https://canvas.instructure.com/doc/api/quiz_questions.html
// API Url: courses/{course_id}/quizzes/{quiz_id}/questions/{id}
//
// Example:
// return canvasRequest(delete_quiz_question, {course_id, quiz_id, id});
export const deleteQuizQuestion = { type: 'DELETE_QUIZ_QUESTION', method: 'delete', key: 'delete_quiz_questiondelete_quiz_question_{course_id}_{quiz_id}_{id}', required: ['course_id','quiz_id','id'] };