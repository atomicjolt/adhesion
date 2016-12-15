//
// Custom Gradebook Columns
//
// List custom gradebook columns
// List all custom gradebook columns for a course
//
// API Docs: https://canvas.instructure.com/doc/api/custom_gradebook_columns.html
// API Url: courses/{course_id}/custom_gradebook_columns
//
// Example:
// const query = {
//   include_hidden
// }
// return canvasRequest(list_custom_gradebook_columns, {course_id}, query);
export const listCustomGradebookColumns = { type: 'LIST_CUSTOM_GRADEBOOK_COLUMNS', method: 'get', key: 'list_custom_gradebook_columnslist_custom_gradebook_columns_course_id', required: ['course_id''] };

// Create a custom gradebook column
// Create a custom gradebook column
//
// API Docs: https://canvas.instructure.com/doc/api/custom_gradebook_columns.html
// API Url: courses/{course_id}/custom_gradebook_columns
//
// Example:
// const query = {
//   column[title] (required)
//   column[position]
//   column[hidden]
//   column[teacher_notes]
// }
// return canvasRequest(create_custom_gradebook_column, {course_id}, query);
export const createCustomGradebookColumn = { type: 'CREATE_CUSTOM_GRADEBOOK_COLUMN', method: 'post', key: 'create_custom_gradebook_columncreate_custom_gradebook_column_course_id', required: ['course_id''] };

// Update a custom gradebook column
// Accepts the same parameters as custom gradebook column creation
//
// API Docs: https://canvas.instructure.com/doc/api/custom_gradebook_columns.html
// API Url: courses/{course_id}/custom_gradebook_columns/{id}
//
// Example:
// return canvasRequest(update_custom_gradebook_column, {course_id, id});
export const updateCustomGradebookColumn = { type: 'UPDATE_CUSTOM_GRADEBOOK_COLUMN', method: 'put', key: 'update_custom_gradebook_columnupdate_custom_gradebook_column_{course_id}_{id}', required: ['course_id','id''] };

// Delete a custom gradebook column
// Permanently deletes a custom column and its associated data
//
// API Docs: https://canvas.instructure.com/doc/api/custom_gradebook_columns.html
// API Url: courses/{course_id}/custom_gradebook_columns/{id}
//
// Example:
// return canvasRequest(delete_custom_gradebook_column, {course_id, id});
export const deleteCustomGradebookColumn = { type: 'DELETE_CUSTOM_GRADEBOOK_COLUMN', method: 'delete', key: 'delete_custom_gradebook_columndelete_custom_gradebook_column_{course_id}_{id}', required: ['course_id','id''] };

// Reorder custom columns
// Puts the given columns in the specified order
// 
// <b>200 OK</b> is returned if successful
//
// API Docs: https://canvas.instructure.com/doc/api/custom_gradebook_columns.html
// API Url: courses/{course_id}/custom_gradebook_columns/reorder
//
// Example:
// const query = {
//   order (required)
// }
// return canvasRequest(reorder_custom_columns, {course_id}, query);
export const reorderCustomColumns = { type: 'REORDER_CUSTOM_COLUMNS', method: 'post', key: 'reorder_custom_columnsreorder_custom_columns_course_id', required: ['course_id''] };

// List entries for a column
// This does not list entries for students without associated data.
//
// API Docs: https://canvas.instructure.com/doc/api/custom_gradebook_columns.html
// API Url: courses/{course_id}/custom_gradebook_columns/{id}/data
//
// Example:
// const query = {
//   include_hidden
// }
// return canvasRequest(list_entries_for_column, {course_id, id}, query);
export const listEntriesForColumn = { type: 'LIST_ENTRIES_FOR_COLUMN', method: 'get', key: 'list_entries_for_columnlist_entries_for_column_{course_id}_{id}', required: ['course_id','id''] };

// Update column data
// Set the content of a custom column
//
// API Docs: https://canvas.instructure.com/doc/api/custom_gradebook_columns.html
// API Url: courses/{course_id}/custom_gradebook_columns/{id}/data/{user_id}
//
// Example:
// const query = {
//   column_data[content] (required)
// }
// return canvasRequest(update_column_data, {course_id, id, user_id}, query);
export const updateColumnData = { type: 'UPDATE_COLUMN_DATA', method: 'put', key: 'update_column_dataupdate_column_data_{course_id}_{id}_{user_id}', required: ['course_id','id','user_id''] };