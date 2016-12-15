//
// ePub Exports
//
// Show ePub export
// Get information about a single ePub export.
//
// API Docs: https://canvas.instructure.com/doc/api/e_pub_exports.html
// API Url: courses/{course_id}/epub_exports/{id}
//
// Example:
// return canvasRequest(show_epub_export, {course_id, id});
export const showEpubExport = { type: 'SHOW_EPUB_EXPORT', method: 'get', key: 'show_epub_exportshow_epub_export_{course_id}_{id}', required: ['course_id','id'] };