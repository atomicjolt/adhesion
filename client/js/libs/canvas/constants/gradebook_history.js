//
// Gradebook History
//
// Days in gradebook history for this course
// Returns a map of dates to grader/assignment groups
//
// API Docs: https://canvas.instructure.com/doc/api/gradebook_history.html
// API Url: courses/{course_id}/gradebook_history/days
//
// Example:
// return canvasRequest(days_in_gradebook_history_for_this_course, {course_id});
export const daysInGradebookHistoryForThisCourse = { type: "DAYS_IN_GRADEBOOK_HISTORY_FOR_THIS_COURSE", method: "get", key: "days_in_gradebook_history_for_this_coursedays_in_gradebook_history_for_this_course_course_id", required: ["course_id"] };

// Details for a given date in gradebook history for this course
// Returns the graders who worked on this day, along with the assignments they worked on.
// More details can be obtained by selecting a grader and assignment and calling the
// 'submissions' api endpoint for a given date.
//
// API Docs: https://canvas.instructure.com/doc/api/gradebook_history.html
// API Url: courses/{course_id}/gradebook_history/{date}
//
// Example:
// return canvasRequest(details_for_given_date_in_gradebook_history_for_this_course, {course_id, date});
export const detailsForGivenDateInGradebookHistoryForThisCourse = { type: "DETAILS_FOR_GIVEN_DATE_IN_GRADEBOOK_HISTORY_FOR_THIS_COURSE", method: "get", key: "details_for_given_date_in_gradebook_history_for_this_coursedetails_for_given_date_in_gradebook_history_for_this_course_{course_id}_{date}", required: ["course_id","date"] };

// Lists submissions
// Gives a nested list of submission versions
//
// API Docs: https://canvas.instructure.com/doc/api/gradebook_history.html
// API Url: courses/{course_id}/gradebook_history/{date}/graders/{grader_id}/assignments/{assignment_id}/submissions
//
// Example:
// return canvasRequest(lists_submissions, {course_id, date, grader_id, assignment_id});
export const listsSubmissions = { type: "LISTS_SUBMISSIONS", method: "get", key: "lists_submissionslists_submissions_{course_id}_{date}_{grader_id}_{assignment_id}", required: ["course_id","date","grader_id","assignment_id"] };

// List uncollated submission versions
// Gives a paginated, uncollated list of submission versions for all matching
// submissions in the context. This SubmissionVersion objects will not include
// the +new_grade+ or +previous_grade+ keys, only the +grade+; same for
// +graded_at+ and +grader+.
//
// API Docs: https://canvas.instructure.com/doc/api/gradebook_history.html
// API Url: courses/{course_id}/gradebook_history/feed
//
// Example:
// const query = {
//   assignment_id
//   user_id
//   ascending
// }
// return canvasRequest(list_uncollated_submission_versions, {course_id}, query);
export const listUncollatedSubmissionVersions = { type: "LIST_UNCOLLATED_SUBMISSION_VERSIONS", method: "get", key: "list_uncollated_submission_versionslist_uncollated_submission_versions_course_id", required: ["course_id"] };