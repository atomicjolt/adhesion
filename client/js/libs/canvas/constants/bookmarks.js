//
// Bookmarks
//
// List bookmarks
// Returns the list of bookmarks.
//
// API Docs: https://canvas.instructure.com/doc/api/bookmarks.html
// API Url: users/self/bookmarks
//
// Example:
// return canvasRequest(list_bookmarks, {});
export const listBookmarks = { type: 'LIST_BOOKMARKS', method: 'get', key: 'list_bookmarks', required: [] };

// Create bookmark
// Creates a bookmark.
//
// API Docs: https://canvas.instructure.com/doc/api/bookmarks.html
// API Url: users/self/bookmarks
//
// Example:
// const query = {
//   name
//   url
//   position
//   data
// }
// return canvasRequest(create_bookmark, {}, query);
export const createBookmark = { type: 'CREATE_BOOKMARK', method: 'post', key: 'create_bookmark', required: [] };

// Get bookmark
// Returns the details for a bookmark.
//
// API Docs: https://canvas.instructure.com/doc/api/bookmarks.html
// API Url: users/self/bookmarks/{id}
//
// Example:
// return canvasRequest(get_bookmark, {id});
export const getBookmark = { type: 'GET_BOOKMARK', method: 'get', key: 'get_bookmarkget_bookmark_id', required: ['id''] };

// Update bookmark
// Updates a bookmark
//
// API Docs: https://canvas.instructure.com/doc/api/bookmarks.html
// API Url: users/self/bookmarks/{id}
//
// Example:
// const query = {
//   name
//   url
//   position
//   data
// }
// return canvasRequest(update_bookmark, {id}, query);
export const updateBookmark = { type: 'UPDATE_BOOKMARK', method: 'put', key: 'update_bookmarkupdate_bookmark_id', required: ['id''] };

// Delete bookmark
// Deletes a bookmark
//
// API Docs: https://canvas.instructure.com/doc/api/bookmarks.html
// API Url: users/self/bookmarks/{id}
//
// Example:
// return canvasRequest(delete_bookmark, {id});
export const deleteBookmark = { type: 'DELETE_BOOKMARK', method: 'delete', key: 'delete_bookmarkdelete_bookmark_id', required: ['id''] };