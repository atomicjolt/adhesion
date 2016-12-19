//
// Discussion Topics
//
// List discussion topics
// Returns the paginated list of discussion topics for this course or group.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics
//
// Example:
// const query = {
//   include
//   order_by
//   scope
//   only_announcements
//   search_term
//   exclude_context_module_locked_topics
// }
// return canvasRequest(list_discussion_topics_courses, {course_id}, query);
export const listDiscussionTopicsCourses = { type: 'LIST_DISCUSSION_TOPICS_COURSES', method: 'get', key: 'list_discussion_topics_courseslist_discussion_topics_courses_course_id', required: ['course_id'] };

// List discussion topics
// Returns the paginated list of discussion topics for this course or group.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics
//
// Example:
// const query = {
//   include
//   order_by
//   scope
//   only_announcements
//   search_term
//   exclude_context_module_locked_topics
// }
// return canvasRequest(list_discussion_topics_groups, {group_id}, query);
export const listDiscussionTopicsGroups = { type: 'LIST_DISCUSSION_TOPICS_GROUPS', method: 'get', key: 'list_discussion_topics_groupslist_discussion_topics_groups_group_id', required: ['group_id'] };

// Create a new discussion topic
// Create an new discussion topic for the course or group.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics
//
// Example:
// const query = {
//   title
//   message
//   discussion_type
//   published
//   delayed_post_at
//   lock_at
//   podcast_enabled
//   podcast_has_student_posts
//   require_initial_post
//   assignment
//   is_announcement
//   pinned
//   position_after
//   group_category_id
//   allow_rating
//   only_graders_can_rate
//   sort_by_rating
//   attachment
// }
// return canvasRequest(create_new_discussion_topic_courses, {course_id}, query);
export const createNewDiscussionTopicCourses = { type: 'CREATE_NEW_DISCUSSION_TOPIC_COURSES', method: 'post', key: 'create_new_discussion_topic_coursescreate_new_discussion_topic_courses_course_id', required: ['course_id'] };

// Create a new discussion topic
// Create an new discussion topic for the course or group.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics
//
// Example:
// const query = {
//   title
//   message
//   discussion_type
//   published
//   delayed_post_at
//   lock_at
//   podcast_enabled
//   podcast_has_student_posts
//   require_initial_post
//   assignment
//   is_announcement
//   pinned
//   position_after
//   group_category_id
//   allow_rating
//   only_graders_can_rate
//   sort_by_rating
//   attachment
// }
// return canvasRequest(create_new_discussion_topic_groups, {group_id}, query);
export const createNewDiscussionTopicGroups = { type: 'CREATE_NEW_DISCUSSION_TOPIC_GROUPS', method: 'post', key: 'create_new_discussion_topic_groupscreate_new_discussion_topic_groups_group_id', required: ['group_id'] };

// Update a topic
// Update an existing discussion topic for the course or group.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}
//
// Example:
// const query = {
//   title
//   message
//   discussion_type
//   published
//   delayed_post_at
//   lock_at
//   podcast_enabled
//   podcast_has_student_posts
//   require_initial_post
//   assignment
//   is_announcement
//   pinned
//   position_after
//   group_category_id
//   allow_rating
//   only_graders_can_rate
//   sort_by_rating
// }
// return canvasRequest(update_topic_courses, {course_id, topic_id}, query);
export const updateTopicCourses = { type: 'UPDATE_TOPIC_COURSES', method: 'put', key: 'update_topic_coursesupdate_topic_courses_{course_id}_{topic_id}', required: ['course_id', 'topic_id'] };

// Update a topic
// Update an existing discussion topic for the course or group.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}
//
// Example:
// const query = {
//   title
//   message
//   discussion_type
//   published
//   delayed_post_at
//   lock_at
//   podcast_enabled
//   podcast_has_student_posts
//   require_initial_post
//   assignment
//   is_announcement
//   pinned
//   position_after
//   group_category_id
//   allow_rating
//   only_graders_can_rate
//   sort_by_rating
// }
// return canvasRequest(update_topic_groups, {group_id, topic_id}, query);
export const updateTopicGroups = { type: 'UPDATE_TOPIC_GROUPS', method: 'put', key: 'update_topic_groupsupdate_topic_groups_{group_id}_{topic_id}', required: ['group_id', 'topic_id'] };

// Delete a topic
// Deletes the discussion topic. This will also delete the assignment, if it's
// an assignment discussion.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}
//
// Example:
// return canvasRequest(delete_topic_courses, {course_id, topic_id});
export const deleteTopicCourses = { type: 'DELETE_TOPIC_COURSES', method: 'delete', key: 'delete_topic_coursesdelete_topic_courses_{course_id}_{topic_id}', required: ['course_id', 'topic_id'] };

// Delete a topic
// Deletes the discussion topic. This will also delete the assignment, if it's
// an assignment discussion.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}
//
// Example:
// return canvasRequest(delete_topic_groups, {group_id, topic_id});
export const deleteTopicGroups = { type: 'DELETE_TOPIC_GROUPS', method: 'delete', key: 'delete_topic_groupsdelete_topic_groups_{group_id}_{topic_id}', required: ['group_id', 'topic_id'] };

// Reorder pinned topics
// Puts the pinned discussion topics in the specified order.
// All pinned topics should be included.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/reorder
//
// Example:
// const query = {
//   order (required)
// }
// return canvasRequest(reorder_pinned_topics_courses, {course_id}, query);
export const reorderPinnedTopicsCourses = { type: 'REORDER_PINNED_TOPICS_COURSES', method: 'post', key: 'reorder_pinned_topics_coursesreorder_pinned_topics_courses_course_id', required: ['course_id'] };

// Reorder pinned topics
// Puts the pinned discussion topics in the specified order.
// All pinned topics should be included.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/reorder
//
// Example:
// const query = {
//   order (required)
// }
// return canvasRequest(reorder_pinned_topics_groups, {group_id}, query);
export const reorderPinnedTopicsGroups = { type: 'REORDER_PINNED_TOPICS_GROUPS', method: 'post', key: 'reorder_pinned_topics_groupsreorder_pinned_topics_groups_group_id', required: ['group_id'] };

// Update an entry
// Update an existing discussion entry.
// 
// The entry must have been created by the current user, or the current user
// must have admin rights to the discussion. If the edit is not allowed, a 401 will be returned.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}/entries/{id}
//
// Example:
// const query = {
//   message
// }
// return canvasRequest(update_entry_courses, {course_id, topic_id, id}, query);
export const updateEntryCourses = { type: 'UPDATE_ENTRY_COURSES', method: 'put', key: 'update_entry_coursesupdate_entry_courses_{course_id}_{topic_id}_{id}', required: ['course_id', 'topic_id', 'id'] };

// Update an entry
// Update an existing discussion entry.
// 
// The entry must have been created by the current user, or the current user
// must have admin rights to the discussion. If the edit is not allowed, a 401 will be returned.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}/entries/{id}
//
// Example:
// const query = {
//   message
// }
// return canvasRequest(update_entry_groups, {group_id, topic_id, id}, query);
export const updateEntryGroups = { type: 'UPDATE_ENTRY_GROUPS', method: 'put', key: 'update_entry_groupsupdate_entry_groups_{group_id}_{topic_id}_{id}', required: ['group_id', 'topic_id', 'id'] };

// Delete an entry
// Delete a discussion entry.
// 
// The entry must have been created by the current user, or the current user
// must have admin rights to the discussion. If the delete is not allowed, a 401 will be returned.
// 
// The discussion will be marked deleted, and the user_id and message will be cleared out.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}/entries/{id}
//
// Example:
// return canvasRequest(delete_entry_courses, {course_id, topic_id, id});
export const deleteEntryCourses = { type: 'DELETE_ENTRY_COURSES', method: 'delete', key: 'delete_entry_coursesdelete_entry_courses_{course_id}_{topic_id}_{id}', required: ['course_id', 'topic_id', 'id'] };

// Delete an entry
// Delete a discussion entry.
// 
// The entry must have been created by the current user, or the current user
// must have admin rights to the discussion. If the delete is not allowed, a 401 will be returned.
// 
// The discussion will be marked deleted, and the user_id and message will be cleared out.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}/entries/{id}
//
// Example:
// return canvasRequest(delete_entry_groups, {group_id, topic_id, id});
export const deleteEntryGroups = { type: 'DELETE_ENTRY_GROUPS', method: 'delete', key: 'delete_entry_groupsdelete_entry_groups_{group_id}_{topic_id}_{id}', required: ['group_id', 'topic_id', 'id'] };

// Get a single topic
// Returns data on an individual discussion topic. See the List action for the response formatting.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}
//
// Example:
// return canvasRequest(get_single_topic_courses, {course_id, topic_id});
export const getSingleTopicCourses = { type: 'GET_SINGLE_TOPIC_COURSES', method: 'get', key: 'get_single_topic_coursesget_single_topic_courses_{course_id}_{topic_id}', required: ['course_id', 'topic_id'] };

// Get a single topic
// Returns data on an individual discussion topic. See the List action for the response formatting.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}
//
// Example:
// return canvasRequest(get_single_topic_groups, {group_id, topic_id});
export const getSingleTopicGroups = { type: 'GET_SINGLE_TOPIC_GROUPS', method: 'get', key: 'get_single_topic_groupsget_single_topic_groups_{group_id}_{topic_id}', required: ['group_id', 'topic_id'] };

// Get the full topic
// Return a cached structure of the discussion topic, containing all entries,
// their authors, and their message bodies.
// 
// May require (depending on the topic) that the user has posted in the topic.
// If it is required, and the user has not posted, will respond with a 403
// Forbidden status and the body 'require_initial_post'.
// 
// In some rare situations, this cached structure may not be available yet. In
// that case, the server will respond with a 503 error, and the caller should
// try again soon.
// 
// The response is an object containing the following keys:
// * "participants": A list of summary information on users who have posted to
//   the discussion. Each value is an object containing their id, display_name,
//   and avatar_url.
// * "unread_entries": A list of entry ids that are unread by the current
//   user. this implies that any entry not in this list is read.
// * "entry_ratings": A map of entry ids to ratings by the current user. Entries
//   not in this list have no rating. Only populated if rating is enabled.
// * "forced_entries": A list of entry ids that have forced_read_state set to
//   true. This flag is meant to indicate the entry's read_state has been
//   manually set to 'unread' by the user, so the entry should not be
//   automatically marked as read.
// * "view": A threaded view of all the entries in the discussion, containing
//   the id, user_id, and message.
// * "new_entries": Because this view is eventually consistent, it's possible
//   that newly created or updated entries won't yet be reflected in the view.
//   If the application wants to also get a flat list of all entries not yet
//   reflected in the view, pass include_new_entries=1 to the request and this
//   array of entries will be returned. These entries are returned in a flat
//   array, in ascending created_at order.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}/view
//
// Example:
// return canvasRequest(get_full_topic_courses, {course_id, topic_id});
export const getFullTopicCourses = { type: 'GET_FULL_TOPIC_COURSES', method: 'get', key: 'get_full_topic_coursesget_full_topic_courses_{course_id}_{topic_id}', required: ['course_id', 'topic_id'] };

// Get the full topic
// Return a cached structure of the discussion topic, containing all entries,
// their authors, and their message bodies.
// 
// May require (depending on the topic) that the user has posted in the topic.
// If it is required, and the user has not posted, will respond with a 403
// Forbidden status and the body 'require_initial_post'.
// 
// In some rare situations, this cached structure may not be available yet. In
// that case, the server will respond with a 503 error, and the caller should
// try again soon.
// 
// The response is an object containing the following keys:
// * "participants": A list of summary information on users who have posted to
//   the discussion. Each value is an object containing their id, display_name,
//   and avatar_url.
// * "unread_entries": A list of entry ids that are unread by the current
//   user. this implies that any entry not in this list is read.
// * "entry_ratings": A map of entry ids to ratings by the current user. Entries
//   not in this list have no rating. Only populated if rating is enabled.
// * "forced_entries": A list of entry ids that have forced_read_state set to
//   true. This flag is meant to indicate the entry's read_state has been
//   manually set to 'unread' by the user, so the entry should not be
//   automatically marked as read.
// * "view": A threaded view of all the entries in the discussion, containing
//   the id, user_id, and message.
// * "new_entries": Because this view is eventually consistent, it's possible
//   that newly created or updated entries won't yet be reflected in the view.
//   If the application wants to also get a flat list of all entries not yet
//   reflected in the view, pass include_new_entries=1 to the request and this
//   array of entries will be returned. These entries are returned in a flat
//   array, in ascending created_at order.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}/view
//
// Example:
// return canvasRequest(get_full_topic_groups, {group_id, topic_id});
export const getFullTopicGroups = { type: 'GET_FULL_TOPIC_GROUPS', method: 'get', key: 'get_full_topic_groupsget_full_topic_groups_{group_id}_{topic_id}', required: ['group_id', 'topic_id'] };

// Post an entry
// Create a new entry in a discussion topic. Returns a json representation of
// the created entry (see documentation for 'entries' method) on success.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}/entries
//
// Example:
// const query = {
//   message
//   attachment
// }
// return canvasRequest(post_entry_courses, {course_id, topic_id}, query);
export const postEntryCourses = { type: 'POST_ENTRY_COURSES', method: 'post', key: 'post_entry_coursespost_entry_courses_{course_id}_{topic_id}', required: ['course_id', 'topic_id'] };

// Post an entry
// Create a new entry in a discussion topic. Returns a json representation of
// the created entry (see documentation for 'entries' method) on success.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}/entries
//
// Example:
// const query = {
//   message
//   attachment
// }
// return canvasRequest(post_entry_groups, {group_id, topic_id}, query);
export const postEntryGroups = { type: 'POST_ENTRY_GROUPS', method: 'post', key: 'post_entry_groupspost_entry_groups_{group_id}_{topic_id}', required: ['group_id', 'topic_id'] };

// List topic entries
// Retrieve the (paginated) top-level entries in a discussion topic.
// 
// May require (depending on the topic) that the user has posted in the topic.
// If it is required, and the user has not posted, will respond with a 403
// Forbidden status and the body 'require_initial_post'.
// 
// Will include the 10 most recent replies, if any, for each entry returned.
// 
// If the topic is a root topic with children corresponding to groups of a
// group assignment, entries from those subtopics for which the user belongs
// to the corresponding group will be returned.
// 
// Ordering of returned entries is newest-first by posting timestamp (reply
// activity is ignored).
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}/entries
//
// Example:
// return canvasRequest(list_topic_entries_courses, {course_id, topic_id});
export const listTopicEntriesCourses = { type: 'LIST_TOPIC_ENTRIES_COURSES', method: 'get', key: 'list_topic_entries_courseslist_topic_entries_courses_{course_id}_{topic_id}', required: ['course_id', 'topic_id'] };

// List topic entries
// Retrieve the (paginated) top-level entries in a discussion topic.
// 
// May require (depending on the topic) that the user has posted in the topic.
// If it is required, and the user has not posted, will respond with a 403
// Forbidden status and the body 'require_initial_post'.
// 
// Will include the 10 most recent replies, if any, for each entry returned.
// 
// If the topic is a root topic with children corresponding to groups of a
// group assignment, entries from those subtopics for which the user belongs
// to the corresponding group will be returned.
// 
// Ordering of returned entries is newest-first by posting timestamp (reply
// activity is ignored).
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}/entries
//
// Example:
// return canvasRequest(list_topic_entries_groups, {group_id, topic_id});
export const listTopicEntriesGroups = { type: 'LIST_TOPIC_ENTRIES_GROUPS', method: 'get', key: 'list_topic_entries_groupslist_topic_entries_groups_{group_id}_{topic_id}', required: ['group_id', 'topic_id'] };

// Post a reply
// Add a reply to an entry in a discussion topic. Returns a json
// representation of the created reply (see documentation for 'replies'
// method) on success.
// 
// May require (depending on the topic) that the user has posted in the topic.
// If it is required, and the user has not posted, will respond with a 403
// Forbidden status and the body 'require_initial_post'.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}/entries/{entry_id}/replies
//
// Example:
// const query = {
//   message
//   attachment
// }
// return canvasRequest(post_reply_courses, {course_id, topic_id, entry_id}, query);
export const postReplyCourses = { type: 'POST_REPLY_COURSES', method: 'post', key: 'post_reply_coursespost_reply_courses_{course_id}_{topic_id}_{entry_id}', required: ['course_id', 'topic_id', 'entry_id'] };

// Post a reply
// Add a reply to an entry in a discussion topic. Returns a json
// representation of the created reply (see documentation for 'replies'
// method) on success.
// 
// May require (depending on the topic) that the user has posted in the topic.
// If it is required, and the user has not posted, will respond with a 403
// Forbidden status and the body 'require_initial_post'.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}/entries/{entry_id}/replies
//
// Example:
// const query = {
//   message
//   attachment
// }
// return canvasRequest(post_reply_groups, {group_id, topic_id, entry_id}, query);
export const postReplyGroups = { type: 'POST_REPLY_GROUPS', method: 'post', key: 'post_reply_groupspost_reply_groups_{group_id}_{topic_id}_{entry_id}', required: ['group_id', 'topic_id', 'entry_id'] };

// List entry replies
// Retrieve the (paginated) replies to a top-level entry in a discussion
// topic.
// 
// May require (depending on the topic) that the user has posted in the topic.
// If it is required, and the user has not posted, will respond with a 403
// Forbidden status and the body 'require_initial_post'.
// 
// Ordering of returned entries is newest-first by creation timestamp.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}/entries/{entry_id}/replies
//
// Example:
// return canvasRequest(list_entry_replies_courses, {course_id, topic_id, entry_id});
export const listEntryRepliesCourses = { type: 'LIST_ENTRY_REPLIES_COURSES', method: 'get', key: 'list_entry_replies_courseslist_entry_replies_courses_{course_id}_{topic_id}_{entry_id}', required: ['course_id', 'topic_id', 'entry_id'] };

// List entry replies
// Retrieve the (paginated) replies to a top-level entry in a discussion
// topic.
// 
// May require (depending on the topic) that the user has posted in the topic.
// If it is required, and the user has not posted, will respond with a 403
// Forbidden status and the body 'require_initial_post'.
// 
// Ordering of returned entries is newest-first by creation timestamp.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}/entries/{entry_id}/replies
//
// Example:
// return canvasRequest(list_entry_replies_groups, {group_id, topic_id, entry_id});
export const listEntryRepliesGroups = { type: 'LIST_ENTRY_REPLIES_GROUPS', method: 'get', key: 'list_entry_replies_groupslist_entry_replies_groups_{group_id}_{topic_id}_{entry_id}', required: ['group_id', 'topic_id', 'entry_id'] };

// List entries
// Retrieve a paginated list of discussion entries, given a list of ids.
// 
// May require (depending on the topic) that the user has posted in the topic.
// If it is required, and the user has not posted, will respond with a 403
// Forbidden status and the body 'require_initial_post'.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}/entry_list
//
// Example:
// const query = {
//   ids
// }
// return canvasRequest(list_entries_courses, {course_id, topic_id}, query);
export const listEntriesCourses = { type: 'LIST_ENTRIES_COURSES', method: 'get', key: 'list_entries_courseslist_entries_courses_{course_id}_{topic_id}', required: ['course_id', 'topic_id'] };

// List entries
// Retrieve a paginated list of discussion entries, given a list of ids.
// 
// May require (depending on the topic) that the user has posted in the topic.
// If it is required, and the user has not posted, will respond with a 403
// Forbidden status and the body 'require_initial_post'.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}/entry_list
//
// Example:
// const query = {
//   ids
// }
// return canvasRequest(list_entries_groups, {group_id, topic_id}, query);
export const listEntriesGroups = { type: 'LIST_ENTRIES_GROUPS', method: 'get', key: 'list_entries_groupslist_entries_groups_{group_id}_{topic_id}', required: ['group_id', 'topic_id'] };

// Mark topic as read
// Mark the initial text of the discussion topic as read.
// 
// No request fields are necessary.
// 
// On success, the response will be 204 No Content with an empty body.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}/read
//
// Example:
// return canvasRequest(mark_topic_as_read_courses, {course_id, topic_id});
export const markTopicAsReadCourses = { type: 'MARK_TOPIC_AS_READ_COURSES', method: 'put', key: 'mark_topic_as_read_coursesmark_topic_as_read_courses_{course_id}_{topic_id}', required: ['course_id', 'topic_id'] };

// Mark topic as read
// Mark the initial text of the discussion topic as read.
// 
// No request fields are necessary.
// 
// On success, the response will be 204 No Content with an empty body.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}/read
//
// Example:
// return canvasRequest(mark_topic_as_read_groups, {group_id, topic_id});
export const markTopicAsReadGroups = { type: 'MARK_TOPIC_AS_READ_GROUPS', method: 'put', key: 'mark_topic_as_read_groupsmark_topic_as_read_groups_{group_id}_{topic_id}', required: ['group_id', 'topic_id'] };

// Mark topic as unread
// Mark the initial text of the discussion topic as unread.
// 
// No request fields are necessary.
// 
// On success, the response will be 204 No Content with an empty body.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}/read
//
// Example:
// return canvasRequest(mark_topic_as_unread_courses, {course_id, topic_id});
export const markTopicAsUnreadCourses = { type: 'MARK_TOPIC_AS_UNREAD_COURSES', method: 'delete', key: 'mark_topic_as_unread_coursesmark_topic_as_unread_courses_{course_id}_{topic_id}', required: ['course_id', 'topic_id'] };

// Mark topic as unread
// Mark the initial text of the discussion topic as unread.
// 
// No request fields are necessary.
// 
// On success, the response will be 204 No Content with an empty body.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}/read
//
// Example:
// return canvasRequest(mark_topic_as_unread_groups, {group_id, topic_id});
export const markTopicAsUnreadGroups = { type: 'MARK_TOPIC_AS_UNREAD_GROUPS', method: 'delete', key: 'mark_topic_as_unread_groupsmark_topic_as_unread_groups_{group_id}_{topic_id}', required: ['group_id', 'topic_id'] };

// Mark all entries as read
// Mark the discussion topic and all its entries as read.
// 
// No request fields are necessary.
// 
// On success, the response will be 204 No Content with an empty body.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}/read_all
//
// Example:
// const query = {
//   forced_read_state
// }
// return canvasRequest(mark_all_entries_as_read_courses, {course_id, topic_id}, query);
export const markAllEntriesAsReadCourses = { type: 'MARK_ALL_ENTRIES_AS_READ_COURSES', method: 'put', key: 'mark_all_entries_as_read_coursesmark_all_entries_as_read_courses_{course_id}_{topic_id}', required: ['course_id', 'topic_id'] };

// Mark all entries as read
// Mark the discussion topic and all its entries as read.
// 
// No request fields are necessary.
// 
// On success, the response will be 204 No Content with an empty body.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}/read_all
//
// Example:
// const query = {
//   forced_read_state
// }
// return canvasRequest(mark_all_entries_as_read_groups, {group_id, topic_id}, query);
export const markAllEntriesAsReadGroups = { type: 'MARK_ALL_ENTRIES_AS_READ_GROUPS', method: 'put', key: 'mark_all_entries_as_read_groupsmark_all_entries_as_read_groups_{group_id}_{topic_id}', required: ['group_id', 'topic_id'] };

// Mark all entries as unread
// Mark the discussion topic and all its entries as unread.
// 
// No request fields are necessary.
// 
// On success, the response will be 204 No Content with an empty body.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}/read_all
//
// Example:
// const query = {
//   forced_read_state
// }
// return canvasRequest(mark_all_entries_as_unread_courses, {course_id, topic_id}, query);
export const markAllEntriesAsUnreadCourses = { type: 'MARK_ALL_ENTRIES_AS_UNREAD_COURSES', method: 'delete', key: 'mark_all_entries_as_unread_coursesmark_all_entries_as_unread_courses_{course_id}_{topic_id}', required: ['course_id', 'topic_id'] };

// Mark all entries as unread
// Mark the discussion topic and all its entries as unread.
// 
// No request fields are necessary.
// 
// On success, the response will be 204 No Content with an empty body.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}/read_all
//
// Example:
// const query = {
//   forced_read_state
// }
// return canvasRequest(mark_all_entries_as_unread_groups, {group_id, topic_id}, query);
export const markAllEntriesAsUnreadGroups = { type: 'MARK_ALL_ENTRIES_AS_UNREAD_GROUPS', method: 'delete', key: 'mark_all_entries_as_unread_groupsmark_all_entries_as_unread_groups_{group_id}_{topic_id}', required: ['group_id', 'topic_id'] };

// Mark entry as read
// Mark a discussion entry as read.
// 
// No request fields are necessary.
// 
// On success, the response will be 204 No Content with an empty body.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}/entries/{entry_id}/read
//
// Example:
// const query = {
//   forced_read_state
// }
// return canvasRequest(mark_entry_as_read_courses, {course_id, topic_id, entry_id}, query);
export const markEntryAsReadCourses = { type: 'MARK_ENTRY_AS_READ_COURSES', method: 'put', key: 'mark_entry_as_read_coursesmark_entry_as_read_courses_{course_id}_{topic_id}_{entry_id}', required: ['course_id', 'topic_id', 'entry_id'] };

// Mark entry as read
// Mark a discussion entry as read.
// 
// No request fields are necessary.
// 
// On success, the response will be 204 No Content with an empty body.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}/entries/{entry_id}/read
//
// Example:
// const query = {
//   forced_read_state
// }
// return canvasRequest(mark_entry_as_read_groups, {group_id, topic_id, entry_id}, query);
export const markEntryAsReadGroups = { type: 'MARK_ENTRY_AS_READ_GROUPS', method: 'put', key: 'mark_entry_as_read_groupsmark_entry_as_read_groups_{group_id}_{topic_id}_{entry_id}', required: ['group_id', 'topic_id', 'entry_id'] };

// Mark entry as unread
// Mark a discussion entry as unread.
// 
// No request fields are necessary.
// 
// On success, the response will be 204 No Content with an empty body.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}/entries/{entry_id}/read
//
// Example:
// const query = {
//   forced_read_state
// }
// return canvasRequest(mark_entry_as_unread_courses, {course_id, topic_id, entry_id}, query);
export const markEntryAsUnreadCourses = { type: 'MARK_ENTRY_AS_UNREAD_COURSES', method: 'delete', key: 'mark_entry_as_unread_coursesmark_entry_as_unread_courses_{course_id}_{topic_id}_{entry_id}', required: ['course_id', 'topic_id', 'entry_id'] };

// Mark entry as unread
// Mark a discussion entry as unread.
// 
// No request fields are necessary.
// 
// On success, the response will be 204 No Content with an empty body.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}/entries/{entry_id}/read
//
// Example:
// const query = {
//   forced_read_state
// }
// return canvasRequest(mark_entry_as_unread_groups, {group_id, topic_id, entry_id}, query);
export const markEntryAsUnreadGroups = { type: 'MARK_ENTRY_AS_UNREAD_GROUPS', method: 'delete', key: 'mark_entry_as_unread_groupsmark_entry_as_unread_groups_{group_id}_{topic_id}_{entry_id}', required: ['group_id', 'topic_id', 'entry_id'] };

// Rate entry
// Rate a discussion entry.
// 
// On success, the response will be 204 No Content with an empty body.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}/entries/{entry_id}/rating
//
// Example:
// const query = {
//   rating
// }
// return canvasRequest(rate_entry_courses, {course_id, topic_id, entry_id}, query);
export const rateEntryCourses = { type: 'RATE_ENTRY_COURSES', method: 'post', key: 'rate_entry_coursesrate_entry_courses_{course_id}_{topic_id}_{entry_id}', required: ['course_id', 'topic_id', 'entry_id'] };

// Rate entry
// Rate a discussion entry.
// 
// On success, the response will be 204 No Content with an empty body.
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}/entries/{entry_id}/rating
//
// Example:
// const query = {
//   rating
// }
// return canvasRequest(rate_entry_groups, {group_id, topic_id, entry_id}, query);
export const rateEntryGroups = { type: 'RATE_ENTRY_GROUPS', method: 'post', key: 'rate_entry_groupsrate_entry_groups_{group_id}_{topic_id}_{entry_id}', required: ['group_id', 'topic_id', 'entry_id'] };

// Subscribe to a topic
// Subscribe to a topic to receive notifications about new entries
// 
// On success, the response will be 204 No Content with an empty body
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}/subscribed
//
// Example:
// return canvasRequest(subscribe_to_topic_courses, {course_id, topic_id});
export const subscribeToTopicCourses = { type: 'SUBSCRIBE_TO_TOPIC_COURSES', method: 'put', key: 'subscribe_to_topic_coursessubscribe_to_topic_courses_{course_id}_{topic_id}', required: ['course_id', 'topic_id'] };

// Subscribe to a topic
// Subscribe to a topic to receive notifications about new entries
// 
// On success, the response will be 204 No Content with an empty body
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}/subscribed
//
// Example:
// return canvasRequest(subscribe_to_topic_groups, {group_id, topic_id});
export const subscribeToTopicGroups = { type: 'SUBSCRIBE_TO_TOPIC_GROUPS', method: 'put', key: 'subscribe_to_topic_groupssubscribe_to_topic_groups_{group_id}_{topic_id}', required: ['group_id', 'topic_id'] };

// Unsubscribe from a topic
// Unsubscribe from a topic to stop receiving notifications about new entries
// 
// On success, the response will be 204 No Content with an empty body
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: courses/{course_id}/discussion_topics/{topic_id}/subscribed
//
// Example:
// return canvasRequest(unsubscribe_from_topic_courses, {course_id, topic_id});
export const unsubscribeFromTopicCourses = { type: 'UNSUBSCRIBE_FROM_TOPIC_COURSES', method: 'delete', key: 'unsubscribe_from_topic_coursesunsubscribe_from_topic_courses_{course_id}_{topic_id}', required: ['course_id', 'topic_id'] };

// Unsubscribe from a topic
// Unsubscribe from a topic to stop receiving notifications about new entries
// 
// On success, the response will be 204 No Content with an empty body
//
// API Docs: https://canvas.instructure.com/doc/api/discussion_topics.html
// API Url: groups/{group_id}/discussion_topics/{topic_id}/subscribed
//
// Example:
// return canvasRequest(unsubscribe_from_topic_groups, {group_id, topic_id});
export const unsubscribeFromTopicGroups = { type: 'UNSUBSCRIBE_FROM_TOPIC_GROUPS', method: 'delete', key: 'unsubscribe_from_topic_groupsunsubscribe_from_topic_groups_{group_id}_{topic_id}', required: ['group_id', 'topic_id'] };