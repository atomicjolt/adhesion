//
// Modules
//
// List modules
// List the modules in a course
//
// API Docs: https://canvas.instructure.com/doc/api/modules.html
// API Url: courses/{course_id}/modules
//
// Example:
// const query = {
//   include
//   search_term
//   student_id
// }
// return canvasRequest(list_modules, {course_id}, query);
export const list_modules = { type: "LIST_MODULES", method: "get", key: "list_moduleslist_modules_course_id", required: ["course_id"] };

// Show module
// Get information about a single module
//
// API Docs: https://canvas.instructure.com/doc/api/modules.html
// API Url: courses/{course_id}/modules/{id}
//
// Example:
// const query = {
//   include
//   student_id
// }
// return canvasRequest(show_module, {course_id, id}, query);
export const show_module = { type: "SHOW_MODULE", method: "get", key: "show_moduleshow_module_{course_id}_{id}", required: ["course_id","id"] };

// Create a module
// Create and return a new module
//
// API Docs: https://canvas.instructure.com/doc/api/modules.html
// API Url: courses/{course_id}/modules
//
// Example:
// const query = {
//   module[name] (required)
//   module[unlock_at]
//   module[position]
//   module[require_sequential_progress]
//   module[prerequisite_module_ids]
//   module[publish_final_grade]
// }
// return canvasRequest(create_module, {course_id}, query);
export const create_module = { type: "CREATE_MODULE", method: "post", key: "create_modulecreate_module_course_id", required: ["course_id"] };

// Update a module
// Update and return an existing module
//
// API Docs: https://canvas.instructure.com/doc/api/modules.html
// API Url: courses/{course_id}/modules/{id}
//
// Example:
// const query = {
//   module[name]
//   module[unlock_at]
//   module[position]
//   module[require_sequential_progress]
//   module[prerequisite_module_ids]
//   module[publish_final_grade]
//   module[published]
// }
// return canvasRequest(update_module, {course_id, id}, query);
export const update_module = { type: "UPDATE_MODULE", method: "put", key: "update_moduleupdate_module_{course_id}_{id}", required: ["course_id","id"] };

// Delete module
// Delete a module
//
// API Docs: https://canvas.instructure.com/doc/api/modules.html
// API Url: courses/{course_id}/modules/{id}
//
// Example:
// return canvasRequest(delete_module, {course_id, id});
export const delete_module = { type: "DELETE_MODULE", method: "delete", key: "delete_moduledelete_module_{course_id}_{id}", required: ["course_id","id"] };

// Re-lock module progressions
// Resets module progressions to their default locked state and
// recalculates them based on the current requirements.
// 
// Adding progression requirements to an active course will not lock students
// out of modules they have already unlocked unless this action is called.
//
// API Docs: https://canvas.instructure.com/doc/api/modules.html
// API Url: courses/{course_id}/modules/{id}/relock
//
// Example:
// return canvasRequest(re_lock_module_progressions, {course_id, id});
export const re_lock_module_progressions = { type: "RE_LOCK_MODULE_PROGRESSIONS", method: "put", key: "re_lock_module_progressionsre_lock_module_progressions_{course_id}_{id}", required: ["course_id","id"] };

// List module items
// List the items in a module
//
// API Docs: https://canvas.instructure.com/doc/api/modules.html
// API Url: courses/{course_id}/modules/{module_id}/items
//
// Example:
// const query = {
//   include
//   search_term
//   student_id
// }
// return canvasRequest(list_module_items, {course_id, module_id}, query);
export const list_module_items = { type: "LIST_MODULE_ITEMS", method: "get", key: "list_module_itemslist_module_items_{course_id}_{module_id}", required: ["course_id","module_id"] };

// Show module item
// Get information about a single module item
//
// API Docs: https://canvas.instructure.com/doc/api/modules.html
// API Url: courses/{course_id}/modules/{module_id}/items/{id}
//
// Example:
// const query = {
//   include
//   student_id
// }
// return canvasRequest(show_module_item, {course_id, module_id, id}, query);
export const show_module_item = { type: "SHOW_MODULE_ITEM", method: "get", key: "show_module_itemshow_module_item_{course_id}_{module_id}_{id}", required: ["course_id","module_id","id"] };

// Create a module item
// Create and return a new module item
//
// API Docs: https://canvas.instructure.com/doc/api/modules.html
// API Url: courses/{course_id}/modules/{module_id}/items
//
// Example:
// const query = {
//   module_item[title]
//   module_item[type] (required)
//   module_item[content_id] (required)
//   module_item[position]
//   module_item[indent]
//   module_item[page_url]
//   module_item[external_url]
//   module_item[new_tab]
//   module_item[completion_requirement][type]
//   module_item[completion_requirement][min_score]
// }
// return canvasRequest(create_module_item, {course_id, module_id}, query);
export const create_module_item = { type: "CREATE_MODULE_ITEM", method: "post", key: "create_module_itemcreate_module_item_{course_id}_{module_id}", required: ["course_id","module_id"] };

// Update a module item
// Update and return an existing module item
//
// API Docs: https://canvas.instructure.com/doc/api/modules.html
// API Url: courses/{course_id}/modules/{module_id}/items/{id}
//
// Example:
// const query = {
//   module_item[title]
//   module_item[position]
//   module_item[indent]
//   module_item[external_url]
//   module_item[new_tab]
//   module_item[completion_requirement][type]
//   module_item[completion_requirement][min_score]
//   module_item[published]
//   module_item[module_id]
// }
// return canvasRequest(update_module_item, {course_id, module_id, id}, query);
export const update_module_item = { type: "UPDATE_MODULE_ITEM", method: "put", key: "update_module_itemupdate_module_item_{course_id}_{module_id}_{id}", required: ["course_id","module_id","id"] };

// Select a mastery path
// Select a mastery path when module item includes several possible paths.
// Requires Mastery Paths feature to be enabled.  Returns the assignments
// which are included in the given path.
//
// API Docs: https://canvas.instructure.com/doc/api/modules.html
// API Url: courses/{course_id}/modules/{module_id}/items/{id}/select_mastery_path
//
// Example:
// const query = {
//   assignment_set_id
//   student_id
// }
// return canvasRequest(select_mastery_path, {course_id, module_id, id}, query);
export const select_mastery_path = { type: "SELECT_MASTERY_PATH", method: "post", key: "select_mastery_pathselect_mastery_path_{course_id}_{module_id}_{id}", required: ["course_id","module_id","id"] };

// Delete module item
// Delete a module item
//
// API Docs: https://canvas.instructure.com/doc/api/modules.html
// API Url: courses/{course_id}/modules/{module_id}/items/{id}
//
// Example:
// return canvasRequest(delete_module_item, {course_id, module_id, id});
export const delete_module_item = { type: "DELETE_MODULE_ITEM", method: "delete", key: "delete_module_itemdelete_module_item_{course_id}_{module_id}_{id}", required: ["course_id","module_id","id"] };

// Mark module item as done/not done
// Mark a module item as done/not done. Use HTTP method PUT to mark as done,
// and DELETE to mark as not done.
//
// API Docs: https://canvas.instructure.com/doc/api/modules.html
// API Url: courses/{course_id}/modules/{module_id}/items/{id}/done
//
// Example:
// return canvasRequest(mark_module_item_as_done_not_done, {course_id, module_id, id});
export const mark_module_item_as_done_not_done = { type: "MARK_MODULE_ITEM_AS_DONE_NOT_DONE", method: "put", key: "mark_module_item_as_done_not_donemark_module_item_as_done_not_done_{course_id}_{module_id}_{id}", required: ["course_id","module_id","id"] };

// Get module item sequence
// Given an asset in a course, find the ModuleItem it belongs to, and also the previous and next Module Items
// in the course sequence.
//
// API Docs: https://canvas.instructure.com/doc/api/modules.html
// API Url: courses/{course_id}/module_item_sequence
//
// Example:
// const query = {
//   asset_type
//   asset_id
// }
// return canvasRequest(get_module_item_sequence, {course_id}, query);
export const get_module_item_sequence = { type: "GET_MODULE_ITEM_SEQUENCE", method: "get", key: "get_module_item_sequenceget_module_item_sequence_course_id", required: ["course_id"] };

// Mark module item read
// Fulfills "must view" requirement for a module item. It is generally not necessary to do this explicitly,
// but it is provided for applications that need to access external content directly (bypassing the html_url
// redirect that normally allows Canvas to fulfill "must view" requirements).
// 
// This endpoint cannot be used to complete requirements on locked or unpublished module items.
//
// API Docs: https://canvas.instructure.com/doc/api/modules.html
// API Url: courses/{course_id}/modules/{module_id}/items/{id}/mark_read
//
// Example:
// return canvasRequest(mark_module_item_read, {course_id, module_id, id});
export const mark_module_item_read = { type: "MARK_MODULE_ITEM_READ", method: "post", key: "mark_module_item_readmark_module_item_read_{course_id}_{module_id}_{id}", required: ["course_id","module_id","id"] };