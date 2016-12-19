//
// Admins
//
// Make an account admin
// Flag an existing user as an admin within the account.
//
// API Docs: https://canvas.instructure.com/doc/api/admins.html
// API Url: accounts/{account_id}/admins
//
// Example:
// const query = {
//   user_id (required)
//   role
//   role_id
//   send_confirmation
// }
// return canvasRequest(make_account_admin, {account_id}, query);
export const makeAccountAdmin = { type: 'MAKE_ACCOUNT_ADMIN', method: 'post', key: 'make_account_adminmake_account_admin_account_id', required: ['account_id'] };

// Remove account admin
// Remove the rights associated with an account admin role from a user.
//
// API Docs: https://canvas.instructure.com/doc/api/admins.html
// API Url: accounts/{account_id}/admins/{user_id}
//
// Example:
// const query = {
//   role
//   role_id
// }
// return canvasRequest(remove_account_admin, {account_id, user_id}, query);
export const removeAccountAdmin = { type: 'REMOVE_ACCOUNT_ADMIN', method: 'delete', key: 'remove_account_adminremove_account_admin_{account_id}_{user_id}', required: ['account_id', 'user_id'] };

// List account admins
// List the admins in the account
//
// API Docs: https://canvas.instructure.com/doc/api/admins.html
// API Url: accounts/{account_id}/admins
//
// Example:
// const query = {
//   user_id
// }
// return canvasRequest(list_account_admins, {account_id}, query);
export const listAccountAdmins = { type: 'LIST_ACCOUNT_ADMINS', method: 'get', key: 'list_account_adminslist_account_admins_account_id', required: ['account_id'] };