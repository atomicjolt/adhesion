//
// Groups
//
// List your groups
// Returns a list of active groups for the current user.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: users/self/groups
//
// Example:
// const query = {
//   context_type
//   include
// }
// return canvasRequest(list_your_groups, {}, query);
export const listYourGroups = { type: 'LIST_YOUR_GROUPS', method: 'get', key: 'list_your_groups', required: [] };

// List the groups available in a context.
// Returns the list of active groups in the given context that are visible to user.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: accounts/{account_id}/groups
//
// Example:
// const query = {
//   only_own_groups
//   include
// }
// return canvasRequest(list_groups_available_in_context_accounts, {account_id}, query);
export const listGroupsAvailableInContextAccounts = { type: 'LIST_GROUPS_AVAILABLE_IN_CONTEXT_ACCOUNTS', method: 'get', key: 'list_groups_available_in_context_accountslist_groups_available_in_context_accounts_account_id', required: ['account_id'] };

// List the groups available in a context.
// Returns the list of active groups in the given context that are visible to user.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: courses/{course_id}/groups
//
// Example:
// const query = {
//   only_own_groups
//   include
// }
// return canvasRequest(list_groups_available_in_context_courses, {course_id}, query);
export const listGroupsAvailableInContextCourses = { type: 'LIST_GROUPS_AVAILABLE_IN_CONTEXT_COURSES', method: 'get', key: 'list_groups_available_in_context_courseslist_groups_available_in_context_courses_course_id', required: ['course_id'] };

// Get a single group
// Returns the data for a single group, or a 401 if the caller doesn't have
// the rights to see it.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups/{group_id}
//
// Example:
// const query = {
//   include
// }
// return canvasRequest(get_single_group, {group_id}, query);
export const getSingleGroup = { type: 'GET_SINGLE_GROUP', method: 'get', key: 'get_single_groupget_single_group_group_id', required: ['group_id'] };

// Create a group
// Creates a new group. Groups created using the "/api/v1/groups/"
// endpoint will be community groups.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups
//
// Example:
// const query = {
//   name
//   description
//   is_public
//   join_level
//   storage_quota_mb
// }
// return canvasRequest(create_group_groups, {}, query);
export const createGroupGroups = { type: 'CREATE_GROUP_GROUPS', method: 'post', key: 'create_group_groups', required: [] };

// Create a group
// Creates a new group. Groups created using the "/api/v1/groups/"
// endpoint will be community groups.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: group_categories/{group_category_id}/groups
//
// Example:
// const query = {
//   name
//   description
//   is_public
//   join_level
//   storage_quota_mb
// }
// return canvasRequest(create_group_group_categories, {group_category_id}, query);
export const createGroupGroupCategories = { type: 'CREATE_GROUP_GROUP_CATEGORIES', method: 'post', key: 'create_group_group_categoriescreate_group_group_categories_group_category_id', required: ['group_category_id'] };

// Edit a group
// Modifies an existing group.  Note that to set an avatar image for the
// group, you must first upload the image file to the group, and the use the
// id in the response as the argument to this function.  See the
// {file:file_uploads.html File Upload Documentation} for details on the file
// upload workflow.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups/{group_id}
//
// Example:
// const query = {
//   name
//   description
//   is_public
//   join_level
//   avatar_id
//   storage_quota_mb
//   members
// }
// return canvasRequest(edit_group, {group_id}, query);
export const editGroup = { type: 'EDIT_GROUP', method: 'put', key: 'edit_groupedit_group_group_id', required: ['group_id'] };

// Delete a group
// Deletes a group and removes all members.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups/{group_id}
//
// Example:
// return canvasRequest(delete_group, {group_id});
export const deleteGroup = { type: 'DELETE_GROUP', method: 'delete', key: 'delete_groupdelete_group_group_id', required: ['group_id'] };

// Invite others to a group
// Sends an invitation to all supplied email addresses which will allow the
// receivers to join the group.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups/{group_id}/invite
//
// Example:
// const query = {
//   invitees (required)
// }
// return canvasRequest(invite_others_to_group, {group_id}, query);
export const inviteOthersToGroup = { type: 'INVITE_OTHERS_TO_GROUP', method: 'post', key: 'invite_others_to_groupinvite_others_to_group_group_id', required: ['group_id'] };

// List group's users
// Returns a list of users in the group.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups/{group_id}/users
//
// Example:
// const query = {
//   search_term
//   include
// }
// return canvasRequest(list_group_s_users, {group_id}, query);
export const listGroupSUsers = { type: 'LIST_GROUP_S_USERS', method: 'get', key: 'list_group_s_userslist_group_s_users_group_id', required: ['group_id'] };

// Upload a file
// Upload a file to the group.
// 
// This API endpoint is the first step in uploading a file to a group.
// See the {file:file_uploads.html File Upload Documentation} for details on
// the file upload workflow.
// 
// Only those with the "Manage Files" permission on a group can upload files
// to the group. By default, this is anybody participating in the
// group, or any admin over the group.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups/{group_id}/files
//
// Example:
// return canvasRequest(groups_upload_file, {group_id});
export const groupsUploadFile = { type: 'GROUPS_UPLOAD_FILE', method: 'post', key: 'groups_upload_filegroups_upload_file_group_id', required: ['group_id'] };

// Preview processed html
// Preview html content processed for this group
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups/{group_id}/preview_html
//
// Example:
// const query = {
//   html
// }
// return canvasRequest(groups_preview_processed_html, {group_id}, query);
export const groupsPreviewProcessedHtml = { type: 'GROUPS_PREVIEW_PROCESSED_HTML', method: 'post', key: 'groups_preview_processed_htmlgroups_preview_processed_html_group_id', required: ['group_id'] };

// Group activity stream
// Returns the current user's group-specific activity stream, paginated.
// 
// For full documentation, see the API documentation for the user activity
// stream, in the user api.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups/{group_id}/activity_stream
//
// Example:
// return canvasRequest(group_activity_stream, {group_id});
export const groupActivityStream = { type: 'GROUP_ACTIVITY_STREAM', method: 'get', key: 'group_activity_streamgroup_activity_stream_group_id', required: ['group_id'] };

// Group activity stream summary
// Returns a summary of the current user's group-specific activity stream.
// 
// For full documentation, see the API documentation for the user activity
// stream summary, in the user api.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups/{group_id}/activity_stream/summary
//
// Example:
// return canvasRequest(group_activity_stream_summary, {group_id});
export const groupActivityStreamSummary = { type: 'GROUP_ACTIVITY_STREAM_SUMMARY', method: 'get', key: 'group_activity_stream_summarygroup_activity_stream_summary_group_id', required: ['group_id'] };

// List group memberships
// List the members of a group.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups/{group_id}/memberships
//
// Example:
// const query = {
//   filter_states
// }
// return canvasRequest(list_group_memberships, {group_id}, query);
export const listGroupMemberships = { type: 'LIST_GROUP_MEMBERSHIPS', method: 'get', key: 'list_group_membershipslist_group_memberships_group_id', required: ['group_id'] };

// Get a single group membership
// Returns the group membership with the given membership id or user id.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups/{group_id}/memberships/{membership_id}
//
// Example:
// return canvasRequest(get_single_group_membership_memberships, {group_id, membership_id});
export const getSingleGroupMembershipMemberships = { type: 'GET_SINGLE_GROUP_MEMBERSHIP_MEMBERSHIPS', method: 'get', key: 'get_single_group_membership_membershipsget_single_group_membership_memberships_{group_id}_{membership_id}', required: ['group_id', 'membership_id'] };

// Get a single group membership
// Returns the group membership with the given membership id or user id.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups/{group_id}/users/{user_id}
//
// Example:
// return canvasRequest(get_single_group_membership_users, {group_id, user_id});
export const getSingleGroupMembershipUsers = { type: 'GET_SINGLE_GROUP_MEMBERSHIP_USERS', method: 'get', key: 'get_single_group_membership_usersget_single_group_membership_users_{group_id}_{user_id}', required: ['group_id', 'user_id'] };

// Create a membership
// Join, or request to join, a group, depending on the join_level of the
// group.  If the membership or join request already exists, then it is simply
// returned
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups/{group_id}/memberships
//
// Example:
// const query = {
//   user_id
// }
// return canvasRequest(create_membership, {group_id}, query);
export const createMembership = { type: 'CREATE_MEMBERSHIP', method: 'post', key: 'create_membershipcreate_membership_group_id', required: ['group_id'] };

// Update a membership
// Accept a membership request, or add/remove moderator rights.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups/{group_id}/memberships/{membership_id}
//
// Example:
// const query = {
//   workflow_state
//   moderator
// }
// return canvasRequest(update_membership_memberships, {group_id, membership_id}, query);
export const updateMembershipMemberships = { type: 'UPDATE_MEMBERSHIP_MEMBERSHIPS', method: 'put', key: 'update_membership_membershipsupdate_membership_memberships_{group_id}_{membership_id}', required: ['group_id', 'membership_id'] };

// Update a membership
// Accept a membership request, or add/remove moderator rights.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups/{group_id}/users/{user_id}
//
// Example:
// const query = {
//   workflow_state
//   moderator
// }
// return canvasRequest(update_membership_users, {group_id, user_id}, query);
export const updateMembershipUsers = { type: 'UPDATE_MEMBERSHIP_USERS', method: 'put', key: 'update_membership_usersupdate_membership_users_{group_id}_{user_id}', required: ['group_id', 'user_id'] };

// Leave a group
// Leave a group if you are allowed to leave (some groups, such as sets of
// course groups created by teachers, cannot be left). You may also use 'self'
// in place of a membership_id.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups/{group_id}/memberships/{membership_id}
//
// Example:
// return canvasRequest(leave_group_memberships, {group_id, membership_id});
export const leaveGroupMemberships = { type: 'LEAVE_GROUP_MEMBERSHIPS', method: 'delete', key: 'leave_group_membershipsleave_group_memberships_{group_id}_{membership_id}', required: ['group_id', 'membership_id'] };

// Leave a group
// Leave a group if you are allowed to leave (some groups, such as sets of
// course groups created by teachers, cannot be left). You may also use 'self'
// in place of a membership_id.
//
// API Docs: https://canvas.instructure.com/doc/api/groups.html
// API Url: groups/{group_id}/users/{user_id}
//
// Example:
// return canvasRequest(leave_group_users, {group_id, user_id});
export const leaveGroupUsers = { type: 'LEAVE_GROUP_USERS', method: 'delete', key: 'leave_group_usersleave_group_users_{group_id}_{user_id}', required: ['group_id', 'user_id'] };