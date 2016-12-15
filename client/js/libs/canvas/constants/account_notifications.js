//
// Account Notifications
//
// Index of active global notification for the user
// Returns a list of all global notifications in the account for this user
// Any notifications that have been closed by the user will not be returned
//
// API Docs: https://canvas.instructure.com/doc/api/account_notifications.html
// API Url: accounts/{account_id}/users/{user_id}/account_notifications
//
// Example:
// return canvasRequest(index_of_active_global_notification_for_user, {account_id, user_id});
export const indexOfActiveGlobalNotificationForUser = { type: 'INDEX_OF_ACTIVE_GLOBAL_NOTIFICATION_FOR_USER', method: 'get', key: 'index_of_active_global_notification_for_userindex_of_active_global_notification_for_user_{account_id}_{user_id}', required: ['account_id','user_id'] };

// Show a global notification
// Returns a global notification
// A notification that has been closed by the user will not be returned
//
// API Docs: https://canvas.instructure.com/doc/api/account_notifications.html
// API Url: accounts/{account_id}/users/{user_id}/account_notifications/{id}
//
// Example:
// return canvasRequest(show_global_notification, {account_id, user_id, id});
export const showGlobalNotification = { type: 'SHOW_GLOBAL_NOTIFICATION', method: 'get', key: 'show_global_notificationshow_global_notification_{account_id}_{user_id}_{id}', required: ['account_id','user_id','id'] };

// Close notification for user
// If the user no long wants to see this notification it can be excused with this call
//
// API Docs: https://canvas.instructure.com/doc/api/account_notifications.html
// API Url: accounts/{account_id}/users/{user_id}/account_notifications/{id}
//
// Example:
// return canvasRequest(close_notification_for_user, {account_id, user_id, id});
export const closeNotificationForUser = { type: 'CLOSE_NOTIFICATION_FOR_USER', method: 'delete', key: 'close_notification_for_userclose_notification_for_user_{account_id}_{user_id}_{id}', required: ['account_id','user_id','id'] };

// Create a global notification
// Create and return a new global notification for an account.
//
// API Docs: https://canvas.instructure.com/doc/api/account_notifications.html
// API Url: accounts/{account_id}/account_notifications
//
// Example:
// const query = {
//   account_notification[subject] (required)
//   account_notification[message] (required)
//   account_notification[start_at] (required)
//   account_notification[end_at] (required)
//   account_notification[icon]
//   account_notification_roles
// }
// return canvasRequest(create_global_notification, {account_id}, query);
export const createGlobalNotification = { type: 'CREATE_GLOBAL_NOTIFICATION', method: 'post', key: 'create_global_notificationcreate_global_notification_account_id', required: ['account_id'] };

// Update a global notification
// Update global notification for an account.
//
// API Docs: https://canvas.instructure.com/doc/api/account_notifications.html
// API Url: accounts/{account_id}/account_notifications/{id}
//
// Example:
// const query = {
//   account_notification[subject]
//   account_notification[message]
//   account_notification[start_at]
//   account_notification[end_at]
//   account_notification[icon]
//   account_notification_roles
// }
// return canvasRequest(update_global_notification, {account_id, id}, query);
export const updateGlobalNotification = { type: 'UPDATE_GLOBAL_NOTIFICATION', method: 'put', key: 'update_global_notificationupdate_global_notification_{account_id}_{id}', required: ['account_id','id'] };