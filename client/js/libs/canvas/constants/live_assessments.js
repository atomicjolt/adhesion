//
// LiveAssessments
//
// Create live assessment results
// Creates live assessment results and adds them to a live assessment
//
// API Docs: https://canvas.instructure.com/doc/api/live_assessments.html
// API Url: courses/{course_id}/live_assessments/{assessment_id}/results
//
// Example:
// return canvasRequest(create_live_assessment_results, {course_id, assessment_id});
export const createLiveAssessmentResults = { type: 'CREATE_LIVE_ASSESSMENT_RESULTS', method: 'post', key: 'create_live_assessment_resultscreate_live_assessment_results_{course_id}_{assessment_id}', required: ['course_id', 'assessment_id'] };

// List live assessment results
// Returns a list of live assessment results
//
// API Docs: https://canvas.instructure.com/doc/api/live_assessments.html
// API Url: courses/{course_id}/live_assessments/{assessment_id}/results
//
// Example:
// const query = {
//   user_id
// }
// return canvasRequest(list_live_assessment_results, {course_id, assessment_id}, query);
export const listLiveAssessmentResults = { type: 'LIST_LIVE_ASSESSMENT_RESULTS', method: 'get', key: 'list_live_assessment_resultslist_live_assessment_results_{course_id}_{assessment_id}', required: ['course_id', 'assessment_id'] };

// Create or find a live assessment
// Creates or finds an existing live assessment with the given key and aligns it with
// the linked outcome
//
// API Docs: https://canvas.instructure.com/doc/api/live_assessments.html
// API Url: courses/{course_id}/live_assessments
//
// Example:
// return canvasRequest(create_or_find_live_assessment, {course_id});
export const createOrFindLiveAssessment = { type: 'CREATE_OR_FIND_LIVE_ASSESSMENT', method: 'post', key: 'create_or_find_live_assessmentcreate_or_find_live_assessment_course_id', required: ['course_id'] };

// List live assessments
// Returns a list of live assessments.
//
// API Docs: https://canvas.instructure.com/doc/api/live_assessments.html
// API Url: courses/{course_id}/live_assessments
//
// Example:
// return canvasRequest(list_live_assessments, {course_id});
export const listLiveAssessments = { type: 'LIST_LIVE_ASSESSMENTS', method: 'get', key: 'list_live_assessmentslist_live_assessments_course_id', required: ['course_id'] };