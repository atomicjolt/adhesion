//
// PollSubmissions
//
// Get a single poll submission
// Returns the poll submission with the given id
//
// API Docs: https://canvas.instructure.com/doc/api/poll_submissions.html
// API Url: polls/{poll_id}/poll_sessions/{poll_session_id}/poll_submissions/{id}
//
// Example:
// return canvasRequest(get_single_poll_submission, {poll_id, poll_session_id, id});
export const getSinglePollSubmission = { type: "GET_SINGLE_POLL_SUBMISSION", method: "get", key: "get_single_poll_submissionget_single_poll_submission_{poll_id}_{poll_session_id}_{id}", required: ["poll_id","poll_session_id","id"] };

// Create a single poll submission
// Create a new poll submission for this poll session
//
// API Docs: https://canvas.instructure.com/doc/api/poll_submissions.html
// API Url: polls/{poll_id}/poll_sessions/{poll_session_id}/poll_submissions
//
// Example:
// const query = {
//   poll_submissions[poll_choice_id] (required)
// }
// return canvasRequest(create_single_poll_submission, {poll_id, poll_session_id}, query);
export const createSinglePollSubmission = { type: "CREATE_SINGLE_POLL_SUBMISSION", method: "post", key: "create_single_poll_submissioncreate_single_poll_submission_{poll_id}_{poll_session_id}", required: ["poll_id","poll_session_id"] };