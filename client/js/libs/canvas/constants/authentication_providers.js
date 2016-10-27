//
// Authentication Providers
//
// List authentication providers
// Returns the list of authentication providers
//
// API Docs: https://canvas.instructure.com/doc/api/authentication_providers.html
// API Url: accounts/{account_id}/authentication_providers
//
// Example:
// return canvasRequest(list_authentication_providers_authentication_providers, {account_id});
export const list_authentication_providers_authentication_providers = { type: "LIST_AUTHENTICATION_PROVIDERS_AUTHENTICATION_PROVIDERS", method: "get", key: "list_authentication_providers_authentication_providerslist_authentication_providers_authentication_providers_account_id", required: ["account_id"] };

// List authentication providers
// Returns the list of authentication providers
//
// API Docs: https://canvas.instructure.com/doc/api/authentication_providers.html
// API Url: accounts/{account_id}/account_authorization_configs
//
// Example:
// return canvasRequest(list_authentication_providers_account_authorization_configs, {account_id});
export const list_authentication_providers_account_authorization_configs = { type: "LIST_AUTHENTICATION_PROVIDERS_ACCOUNT_AUTHORIZATION_CONFIGS", method: "get", key: "list_authentication_providers_account_authorization_configslist_authentication_providers_account_authorization_configs_account_id", required: ["account_id"] };

// Add authentication provider
// Add external authentication provider(s) for the account.
// Services may be CAS, Facebook, GitHub, Google, LDAP, LinkedIn,
// Microsoft, OpenID Connect, SAML, or Twitter.
// 
// Each authentication provider is specified as a set of parameters as
// described below. A provider specification must include an 'auth_type'
// parameter with a value of 'canvas', 'cas', 'clever', 'facebook', 'github', 'google',
// 'ldap', 'linkedin', 'microsoft', 'openid_connect', 'saml', or 'twitter'. The other
// recognized parameters depend on this auth_type; unrecognized parameters are discarded.
// Provider specifications not specifying a valid auth_type are ignored.
// 
// _Deprecated_[2015-05-08] Any provider specification may include an
// optional 'login_handle_name' parameter. This parameter specifies the
// label used for unique login identifiers; for example: 'Login',
// 'Username', 'Student ID', etc. The default is 'Email'.
// _Deprecated_[2015-05-20] Any provider specification besides LDAP may include
// an optional 'unknown_user_url' parameters. This parameters specifies a url
// to redirect to when a user is authorized but is not found in Canvas.
// _Deprecated_ [Use update_sso_settings instead]
// 
// You can set the 'position' for any configuration. The config in the 1st position
// is considered the default. You can set 'jit_provisioning' for any configuration
// besides Canvas.
// 
// For Canvas, the additional recognized parameter is:
// 
// - self_registration
// 
//   'all', 'none', or 'observer' - who is allowed to register as a new user
// 
// For CAS, the additional recognized parameters are:
// 
// - auth_base
// 
//   The CAS server's URL.
// 
// - log_in_url [Optional]
// 
//   An alternate SSO URL for logging into CAS. You probably should not set
//   this.
// 
// - unknown_user_url [Optional] _Deprecated_ [2015-05-20: use update_sso_settings instead]
// 
//   A url to redirect to when a user is authorized through CAS but is not
//   found in Canvas.
// 
// For Clever, the additional recognized parameters are:
// 
// - client_id [Required]
// 
//   The Clever application's Client ID. Not available if configured globally
//   for Canvas.
// 
// - client_secret [Required]
// 
//   The Clever application's Client Secret. Not available if configured
//   globally for Canvas.
// 
// - district_id [Optional]
// 
//   A district's Clever ID. Leave this blank to let Clever handle the details
//   with its District Picker. This is required for Clever Instant Login to
//   work in a multi-tenant environment.
// 
// - login_attribute [Optional]
// 
//   The attribute to use to look up the user's login in Canvas. Either
//   'id' (the default), 'sis_id', 'email', 'student_number', or
//   'teacher_number'. Note that some fields may not be populated for
//   all users at Clever.
// 
// For Facebook, the additional recognized parameters are:
// 
// - app_id [Required]
// 
//   The Facebook App ID. Not available if configured globally for Canvas.
// 
// - app_secret [Required]
// 
//   The Facebook App Secret. Not available if configured globally for Canvas.
// 
// - login_attribute [Optional]
// 
//   The attribute to use to look up the user's login in Canvas. Either
//   'id' (the default), or 'email'
// 
// - federated_attributes [Optional]
// 
//   See FederatedAttributesConfig. Valid provider attributes are 'email',
//   'first_name', 'id', 'last_name', 'locale', and 'name'.
// 
// For GitHub, the additional recognized parameters are:
// 
// - domain [Optional]
// 
//   The domain of a GitHub Enterprise installation. I.e.
//   github.mycompany.com. If not set, it will default to the public
//   github.com.
// 
// - client_id [Required]
// 
//   The GitHub application's Client ID. Not available if configured globally
//   for Canvas.
// 
// - client_secret [Required]
// 
//   The GitHub application's Client Secret. Not available if configured
//   globally for Canvas.
// 
// - login_attribute [Optional]
// 
//   The attribute to use to look up the user's login in Canvas. Either
//   'id' (the default), or 'login'
// 
// For Google, the additional recognized parameters are:
// 
// - client_id [Required]
// 
//   The Google application's Client ID. Not available if configured globally
//   for Canvas.
// 
// - client_secret [Required]
// 
//   The Google application's Client Secret. Not available if configured
//   globally for Canvas.
// 
// - hosted_domain [Optional]
// 
//   A Google Apps domain to restrict logins to. See
//   https://developers.google.com/identity/protocols/OpenIDConnect?hl=en#hd-param
// 
// - login_attribute [Optional]
// 
//   The attribute to use to look up the user's login in Canvas. Either
//   'sub' (the default), or 'email'
// 
// For LDAP, the additional recognized parameters are:
// 
// - auth_host
// 
//   The LDAP server's URL.
// 
// - auth_port [Optional, Integer]
// 
//   The LDAP server's TCP port. (default: 389)
// 
// - auth_over_tls [Optional]
// 
//   Whether to use TLS. Can be '', 'simple_tls', or 'start_tls'. For backwards
//   compatibility, booleans are also accepted, with true meaning simple_tls.
//   If not provided, it will default to start_tls.
// 
// - auth_base [Optional]
// 
//   A default treebase parameter for searches performed against the LDAP
//   server.
// 
// - auth_filter
// 
//   LDAP search filter. Use !{{login}} as a placeholder for the username
//   supplied by the user. For example: "(sAMAccountName=!{{login}})".
// 
// - identifier_format [Optional]
// 
//   The LDAP attribute to use to look up the Canvas login. Omit to use
//   the username supplied by the user.
// 
// - auth_username
// 
//   Username
// 
// - auth_password
// 
//   Password
// 
// - change_password_url [Optional] _Deprecated_ [2015-05-08: use update_sso_settings instead]
// 
//   Forgot Password URL. Leave blank for default Canvas behavior.
// 
// For LinkedIn, the additional recognized parameters are:
// 
// - client_id [Required]
// 
//   The LinkedIn application's Client ID. Not available if configured globally
//   for Canvas.
// 
// - client_secret [Required]
// 
//   The LinkedIn application's Client Secret. Not available if configured
//   globally for Canvas.
// 
// - login_attribute [Optional]
// 
//   The attribute to use to look up the user's login in Canvas. Either
//   'id' (the default), or 'emailAddress'
// 
// - federated_attributes [Optional]
// 
//   See FederatedAttributesConfig. Valid provider attributes are 'emailAddress',
//   'firstName', 'id', 'formattedName', and 'lastName'.
// 
// For Microsoft, the additional recognized parameters are:
// 
// - application_id [Required]
// 
//   The application's ID.
// 
// - application_secret [Required]
// 
//   The application's Client Secret (Password)
// 
// - tenant [Optional]
// 
//   See https://azure.microsoft.com/en-us/documentation/articles/active-directory-v2-protocols/
//   Valid values are 'common', 'organizations', 'consumers', or an Azure Active Directory Tenant
//   (as either a UUID or domain, such as contoso.onmicrosoft.com). Defaults to 'common'
// 
// - login_attribute [Optional]
// 
//   See https://azure.microsoft.com/en-us/documentation/articles/active-directory-v2-tokens/#idtokens
//   Valid values are 'sub', 'email', 'oid', or 'preferred_username'. Note
//   that email may not always be populated in the user's profile at
//   Microsoft. Oid will not be populated for personal Microsoft accounts.
//   Defaults to 'sub'
// 
// For OpenID Connect, the additional recognized parameters are:
// 
// - client_id [Required]
// 
//   The application's Client ID.
// 
// - client_secret [Required]
// 
//   The application's Client Secret.
// 
// - authorize_url [Required]
// 
//   The URL for getting starting the OAuth 2.0 web flow
// 
// - token_url [Required]
// 
//   The URL for exchanging the OAuth 2.0 authorization code for an access
//   token and id token
// 
// - scope [Optional]
// 
//   Space separated additional scopes to request for the token.
// 
// - end_session_endpoint [Optional]
// 
//   URL to send the end user to after logging out of Canvas. See
//   https://openid.net/specs/openid-connect-session-1_0.html#RPLogout
// 
// - login_attribute [Optional]
// 
//   The attribute of the ID token to look up the user's login in Canvas.
//   Defaults to 'sub'.
// 
// For SAML, the additional recognized parameters are:
// 
// - metadata [Optional]
// 
//   An XML document to parse as SAML metadata, and automatically populate idp_entity_id,
//   log_in_url, log_out_url, certificate_fingerprint, and identifier_format
// 
// - metadata_uri [Optional]
// 
//   A URI to download the SAML metadata from, and automatically populate idp_entity_id,
//   log_in_url, log_out_url, certificate_fingerprint, and identifier_format. This URI
//   will also be saved, and the metadata periodically refreshed, automatically. If
//   the metadata contains multiple entities, also supply idp_entity_id to distinguish
//   which one you want (otherwise the only entity in the metadata will be inferred).
//   If you provide the URI 'urn:mace:incommon', the InCommon metadata aggregate will
//   be used instead, and additional validation checks will happen (including
//   validating that the metadata has been properly signed with the InCommon key).
// 
// - idp_entity_id
// 
//   The SAML IdP's entity ID
// 
// - log_in_url
// 
//   The SAML service's SSO target URL
// 
// - log_out_url [Optional]
// 
//   The SAML service's SLO target URL
// 
// - certificate_fingerprint
// 
//   The SAML service's certificate fingerprint.
// 
// - change_password_url [Optional] _Deprecated_ [2015-05-08: use update_sso_settings instead]
// 
//   Forgot Password URL. Leave blank for default Canvas behavior.
// 
// - unknown_user_url [Optional] _Deprecated_ [2015-05-20: use update_sso_settings instead]
// 
//   A url to redirect to when a user is authorized through SAML but is not
//   found in Canvas.
// 
// - identifier_format
// 
//   The SAML service's identifier format. Must be one of:
// 
//   - urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
//   - urn:oasis:names:tc:SAML:2.0:nameid-format:entity
//   - urn:oasis:names:tc:SAML:2.0:nameid-format:kerberos
//   - urn:oasis:names:tc:SAML:2.0:nameid-format:persistent
//   - urn:oasis:names:tc:SAML:2.0:nameid-format:transient
//   - urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified
//   - urn:oasis:names:tc:SAML:1.1:nameid-format:WindowsDomainQualifiedName
//   - urn:oasis:names:tc:SAML:1.1:nameid-format:X509SubjectName
// 
// - requested_authn_context [Optional]
// 
//   The SAML AuthnContext
// 
// - federated_attributes [Optional]
// 
//   See FederatedAttributesConfig. Any value is allowed for the provider attribute names.
// 
// For Twitter, the additional recognized parameters are:
// 
// - consumer_key [Required]
// 
//   The Twitter Consumer Key. Not available if configured globally for Canvas.
// 
// - consumer_secret [Required]
// 
//   The Twitter Consumer Secret. Not available if configured globally for Canvas.
// 
// - login_attribute [Optional]
// 
//   The attribute to use to look up the user's login in Canvas. Either
//   'user_id' (the default), or 'screen_name'
// 
// - parent_registration [Optional]
// 
//   Accepts a boolean value, true designates the authentication service
//   for use on parent registrations.  Only one service can be selected
//   at a time so if set to true all others will be set to false
//
// API Docs: https://canvas.instructure.com/doc/api/authentication_providers.html
// API Url: accounts/{account_id}/authentication_providers
//
// Example:
// return canvasRequest(add_authentication_provider_authentication_providers, {account_id});
export const add_authentication_provider_authentication_providers = { type: "ADD_AUTHENTICATION_PROVIDER_AUTHENTICATION_PROVIDERS", method: "post", key: "add_authentication_provider_authentication_providersadd_authentication_provider_authentication_providers_account_id", required: ["account_id"] };

// Add authentication provider
// Add external authentication provider(s) for the account.
// Services may be CAS, Facebook, GitHub, Google, LDAP, LinkedIn,
// Microsoft, OpenID Connect, SAML, or Twitter.
// 
// Each authentication provider is specified as a set of parameters as
// described below. A provider specification must include an 'auth_type'
// parameter with a value of 'canvas', 'cas', 'clever', 'facebook', 'github', 'google',
// 'ldap', 'linkedin', 'microsoft', 'openid_connect', 'saml', or 'twitter'. The other
// recognized parameters depend on this auth_type; unrecognized parameters are discarded.
// Provider specifications not specifying a valid auth_type are ignored.
// 
// _Deprecated_[2015-05-08] Any provider specification may include an
// optional 'login_handle_name' parameter. This parameter specifies the
// label used for unique login identifiers; for example: 'Login',
// 'Username', 'Student ID', etc. The default is 'Email'.
// _Deprecated_[2015-05-20] Any provider specification besides LDAP may include
// an optional 'unknown_user_url' parameters. This parameters specifies a url
// to redirect to when a user is authorized but is not found in Canvas.
// _Deprecated_ [Use update_sso_settings instead]
// 
// You can set the 'position' for any configuration. The config in the 1st position
// is considered the default. You can set 'jit_provisioning' for any configuration
// besides Canvas.
// 
// For Canvas, the additional recognized parameter is:
// 
// - self_registration
// 
//   'all', 'none', or 'observer' - who is allowed to register as a new user
// 
// For CAS, the additional recognized parameters are:
// 
// - auth_base
// 
//   The CAS server's URL.
// 
// - log_in_url [Optional]
// 
//   An alternate SSO URL for logging into CAS. You probably should not set
//   this.
// 
// - unknown_user_url [Optional] _Deprecated_ [2015-05-20: use update_sso_settings instead]
// 
//   A url to redirect to when a user is authorized through CAS but is not
//   found in Canvas.
// 
// For Clever, the additional recognized parameters are:
// 
// - client_id [Required]
// 
//   The Clever application's Client ID. Not available if configured globally
//   for Canvas.
// 
// - client_secret [Required]
// 
//   The Clever application's Client Secret. Not available if configured
//   globally for Canvas.
// 
// - district_id [Optional]
// 
//   A district's Clever ID. Leave this blank to let Clever handle the details
//   with its District Picker. This is required for Clever Instant Login to
//   work in a multi-tenant environment.
// 
// - login_attribute [Optional]
// 
//   The attribute to use to look up the user's login in Canvas. Either
//   'id' (the default), 'sis_id', 'email', 'student_number', or
//   'teacher_number'. Note that some fields may not be populated for
//   all users at Clever.
// 
// For Facebook, the additional recognized parameters are:
// 
// - app_id [Required]
// 
//   The Facebook App ID. Not available if configured globally for Canvas.
// 
// - app_secret [Required]
// 
//   The Facebook App Secret. Not available if configured globally for Canvas.
// 
// - login_attribute [Optional]
// 
//   The attribute to use to look up the user's login in Canvas. Either
//   'id' (the default), or 'email'
// 
// - federated_attributes [Optional]
// 
//   See FederatedAttributesConfig. Valid provider attributes are 'email',
//   'first_name', 'id', 'last_name', 'locale', and 'name'.
// 
// For GitHub, the additional recognized parameters are:
// 
// - domain [Optional]
// 
//   The domain of a GitHub Enterprise installation. I.e.
//   github.mycompany.com. If not set, it will default to the public
//   github.com.
// 
// - client_id [Required]
// 
//   The GitHub application's Client ID. Not available if configured globally
//   for Canvas.
// 
// - client_secret [Required]
// 
//   The GitHub application's Client Secret. Not available if configured
//   globally for Canvas.
// 
// - login_attribute [Optional]
// 
//   The attribute to use to look up the user's login in Canvas. Either
//   'id' (the default), or 'login'
// 
// For Google, the additional recognized parameters are:
// 
// - client_id [Required]
// 
//   The Google application's Client ID. Not available if configured globally
//   for Canvas.
// 
// - client_secret [Required]
// 
//   The Google application's Client Secret. Not available if configured
//   globally for Canvas.
// 
// - hosted_domain [Optional]
// 
//   A Google Apps domain to restrict logins to. See
//   https://developers.google.com/identity/protocols/OpenIDConnect?hl=en#hd-param
// 
// - login_attribute [Optional]
// 
//   The attribute to use to look up the user's login in Canvas. Either
//   'sub' (the default), or 'email'
// 
// For LDAP, the additional recognized parameters are:
// 
// - auth_host
// 
//   The LDAP server's URL.
// 
// - auth_port [Optional, Integer]
// 
//   The LDAP server's TCP port. (default: 389)
// 
// - auth_over_tls [Optional]
// 
//   Whether to use TLS. Can be '', 'simple_tls', or 'start_tls'. For backwards
//   compatibility, booleans are also accepted, with true meaning simple_tls.
//   If not provided, it will default to start_tls.
// 
// - auth_base [Optional]
// 
//   A default treebase parameter for searches performed against the LDAP
//   server.
// 
// - auth_filter
// 
//   LDAP search filter. Use !{{login}} as a placeholder for the username
//   supplied by the user. For example: "(sAMAccountName=!{{login}})".
// 
// - identifier_format [Optional]
// 
//   The LDAP attribute to use to look up the Canvas login. Omit to use
//   the username supplied by the user.
// 
// - auth_username
// 
//   Username
// 
// - auth_password
// 
//   Password
// 
// - change_password_url [Optional] _Deprecated_ [2015-05-08: use update_sso_settings instead]
// 
//   Forgot Password URL. Leave blank for default Canvas behavior.
// 
// For LinkedIn, the additional recognized parameters are:
// 
// - client_id [Required]
// 
//   The LinkedIn application's Client ID. Not available if configured globally
//   for Canvas.
// 
// - client_secret [Required]
// 
//   The LinkedIn application's Client Secret. Not available if configured
//   globally for Canvas.
// 
// - login_attribute [Optional]
// 
//   The attribute to use to look up the user's login in Canvas. Either
//   'id' (the default), or 'emailAddress'
// 
// - federated_attributes [Optional]
// 
//   See FederatedAttributesConfig. Valid provider attributes are 'emailAddress',
//   'firstName', 'id', 'formattedName', and 'lastName'.
// 
// For Microsoft, the additional recognized parameters are:
// 
// - application_id [Required]
// 
//   The application's ID.
// 
// - application_secret [Required]
// 
//   The application's Client Secret (Password)
// 
// - tenant [Optional]
// 
//   See https://azure.microsoft.com/en-us/documentation/articles/active-directory-v2-protocols/
//   Valid values are 'common', 'organizations', 'consumers', or an Azure Active Directory Tenant
//   (as either a UUID or domain, such as contoso.onmicrosoft.com). Defaults to 'common'
// 
// - login_attribute [Optional]
// 
//   See https://azure.microsoft.com/en-us/documentation/articles/active-directory-v2-tokens/#idtokens
//   Valid values are 'sub', 'email', 'oid', or 'preferred_username'. Note
//   that email may not always be populated in the user's profile at
//   Microsoft. Oid will not be populated for personal Microsoft accounts.
//   Defaults to 'sub'
// 
// For OpenID Connect, the additional recognized parameters are:
// 
// - client_id [Required]
// 
//   The application's Client ID.
// 
// - client_secret [Required]
// 
//   The application's Client Secret.
// 
// - authorize_url [Required]
// 
//   The URL for getting starting the OAuth 2.0 web flow
// 
// - token_url [Required]
// 
//   The URL for exchanging the OAuth 2.0 authorization code for an access
//   token and id token
// 
// - scope [Optional]
// 
//   Space separated additional scopes to request for the token.
// 
// - end_session_endpoint [Optional]
// 
//   URL to send the end user to after logging out of Canvas. See
//   https://openid.net/specs/openid-connect-session-1_0.html#RPLogout
// 
// - login_attribute [Optional]
// 
//   The attribute of the ID token to look up the user's login in Canvas.
//   Defaults to 'sub'.
// 
// For SAML, the additional recognized parameters are:
// 
// - metadata [Optional]
// 
//   An XML document to parse as SAML metadata, and automatically populate idp_entity_id,
//   log_in_url, log_out_url, certificate_fingerprint, and identifier_format
// 
// - metadata_uri [Optional]
// 
//   A URI to download the SAML metadata from, and automatically populate idp_entity_id,
//   log_in_url, log_out_url, certificate_fingerprint, and identifier_format. This URI
//   will also be saved, and the metadata periodically refreshed, automatically. If
//   the metadata contains multiple entities, also supply idp_entity_id to distinguish
//   which one you want (otherwise the only entity in the metadata will be inferred).
//   If you provide the URI 'urn:mace:incommon', the InCommon metadata aggregate will
//   be used instead, and additional validation checks will happen (including
//   validating that the metadata has been properly signed with the InCommon key).
// 
// - idp_entity_id
// 
//   The SAML IdP's entity ID
// 
// - log_in_url
// 
//   The SAML service's SSO target URL
// 
// - log_out_url [Optional]
// 
//   The SAML service's SLO target URL
// 
// - certificate_fingerprint
// 
//   The SAML service's certificate fingerprint.
// 
// - change_password_url [Optional] _Deprecated_ [2015-05-08: use update_sso_settings instead]
// 
//   Forgot Password URL. Leave blank for default Canvas behavior.
// 
// - unknown_user_url [Optional] _Deprecated_ [2015-05-20: use update_sso_settings instead]
// 
//   A url to redirect to when a user is authorized through SAML but is not
//   found in Canvas.
// 
// - identifier_format
// 
//   The SAML service's identifier format. Must be one of:
// 
//   - urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
//   - urn:oasis:names:tc:SAML:2.0:nameid-format:entity
//   - urn:oasis:names:tc:SAML:2.0:nameid-format:kerberos
//   - urn:oasis:names:tc:SAML:2.0:nameid-format:persistent
//   - urn:oasis:names:tc:SAML:2.0:nameid-format:transient
//   - urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified
//   - urn:oasis:names:tc:SAML:1.1:nameid-format:WindowsDomainQualifiedName
//   - urn:oasis:names:tc:SAML:1.1:nameid-format:X509SubjectName
// 
// - requested_authn_context [Optional]
// 
//   The SAML AuthnContext
// 
// - federated_attributes [Optional]
// 
//   See FederatedAttributesConfig. Any value is allowed for the provider attribute names.
// 
// For Twitter, the additional recognized parameters are:
// 
// - consumer_key [Required]
// 
//   The Twitter Consumer Key. Not available if configured globally for Canvas.
// 
// - consumer_secret [Required]
// 
//   The Twitter Consumer Secret. Not available if configured globally for Canvas.
// 
// - login_attribute [Optional]
// 
//   The attribute to use to look up the user's login in Canvas. Either
//   'user_id' (the default), or 'screen_name'
// 
// - parent_registration [Optional]
// 
//   Accepts a boolean value, true designates the authentication service
//   for use on parent registrations.  Only one service can be selected
//   at a time so if set to true all others will be set to false
//
// API Docs: https://canvas.instructure.com/doc/api/authentication_providers.html
// API Url: accounts/{account_id}/account_authorization_configs
//
// Example:
// return canvasRequest(add_authentication_provider_account_authorization_configs, {account_id});
export const add_authentication_provider_account_authorization_configs = { type: "ADD_AUTHENTICATION_PROVIDER_ACCOUNT_AUTHORIZATION_CONFIGS", method: "post", key: "add_authentication_provider_account_authorization_configsadd_authentication_provider_account_authorization_configs_account_id", required: ["account_id"] };

// Update authentication provider
// Update an authentication provider using the same options as the create endpoint.
// You can not update an existing provider to a new authentication type.
//
// API Docs: https://canvas.instructure.com/doc/api/authentication_providers.html
// API Url: accounts/{account_id}/authentication_providers/{id}
//
// Example:
// return canvasRequest(update_authentication_provider_authentication_providers, {account_id, id});
export const update_authentication_provider_authentication_providers = { type: "UPDATE_AUTHENTICATION_PROVIDER_AUTHENTICATION_PROVIDERS", method: "put", key: "update_authentication_provider_authentication_providersupdate_authentication_provider_authentication_providers_{account_id}_{id}", required: ["account_id","id"] };

// Update authentication provider
// Update an authentication provider using the same options as the create endpoint.
// You can not update an existing provider to a new authentication type.
//
// API Docs: https://canvas.instructure.com/doc/api/authentication_providers.html
// API Url: accounts/{account_id}/account_authorization_configs/{id}
//
// Example:
// return canvasRequest(update_authentication_provider_account_authorization_configs, {account_id, id});
export const update_authentication_provider_account_authorization_configs = { type: "UPDATE_AUTHENTICATION_PROVIDER_ACCOUNT_AUTHORIZATION_CONFIGS", method: "put", key: "update_authentication_provider_account_authorization_configsupdate_authentication_provider_account_authorization_configs_{account_id}_{id}", required: ["account_id","id"] };

// Get authentication provider
// Get the specified authentication provider
//
// API Docs: https://canvas.instructure.com/doc/api/authentication_providers.html
// API Url: accounts/{account_id}/authentication_providers/{id}
//
// Example:
// return canvasRequest(get_authentication_provider_authentication_providers, {account_id, id});
export const get_authentication_provider_authentication_providers = { type: "GET_AUTHENTICATION_PROVIDER_AUTHENTICATION_PROVIDERS", method: "get", key: "get_authentication_provider_authentication_providersget_authentication_provider_authentication_providers_{account_id}_{id}", required: ["account_id","id"] };

// Get authentication provider
// Get the specified authentication provider
//
// API Docs: https://canvas.instructure.com/doc/api/authentication_providers.html
// API Url: accounts/{account_id}/account_authorization_configs/{id}
//
// Example:
// return canvasRequest(get_authentication_provider_account_authorization_configs, {account_id, id});
export const get_authentication_provider_account_authorization_configs = { type: "GET_AUTHENTICATION_PROVIDER_ACCOUNT_AUTHORIZATION_CONFIGS", method: "get", key: "get_authentication_provider_account_authorization_configsget_authentication_provider_account_authorization_configs_{account_id}_{id}", required: ["account_id","id"] };

// Delete authentication provider
// Delete the config
//
// API Docs: https://canvas.instructure.com/doc/api/authentication_providers.html
// API Url: accounts/{account_id}/authentication_providers/{id}
//
// Example:
// return canvasRequest(delete_authentication_provider_authentication_providers, {account_id, id});
export const delete_authentication_provider_authentication_providers = { type: "DELETE_AUTHENTICATION_PROVIDER_AUTHENTICATION_PROVIDERS", method: "delete", key: "delete_authentication_provider_authentication_providersdelete_authentication_provider_authentication_providers_{account_id}_{id}", required: ["account_id","id"] };

// Delete authentication provider
// Delete the config
//
// API Docs: https://canvas.instructure.com/doc/api/authentication_providers.html
// API Url: accounts/{account_id}/account_authorization_configs/{id}
//
// Example:
// return canvasRequest(delete_authentication_provider_account_authorization_configs, {account_id, id});
export const delete_authentication_provider_account_authorization_configs = { type: "DELETE_AUTHENTICATION_PROVIDER_ACCOUNT_AUTHORIZATION_CONFIGS", method: "delete", key: "delete_authentication_provider_account_authorization_configsdelete_authentication_provider_account_authorization_configs_{account_id}_{id}", required: ["account_id","id"] };

// GET discovery url _Deprecated_[2015-05-08]
// Get the discovery url _Deprecated_[2015-05-08]
// 
// [Use update_sso_settings instead]
//
// API Docs: https://canvas.instructure.com/doc/api/authentication_providers.html
// API Url: accounts/{account_id}/account_authorization_configs/discovery_url
//
// Example:
// return canvasRequest(get_discovery_url_deprecated, {account_id});
export const get_discovery_url_deprecated = { type: "GET_DISCOVERY_URL_DEPRECATED", method: "get", key: "get_discovery_url_deprecatedget_discovery_url_deprecated_account_id", required: ["account_id"] };

// Set discovery url _Deprecated_[2015-05-08]
// [Use update_sso_settings instead]
// 
// If you have multiple IdPs configured, you can set a `discovery_url`.
// If that is set, canvas will forward all users to that URL when they need to
// be authenticated. That page will need to then help the user figure out where
// they need to go to log in.
// 
// If no discovery url is configured, the 1st auth config will be used to
// attempt to authenticate the user.
//
// API Docs: https://canvas.instructure.com/doc/api/authentication_providers.html
// API Url: accounts/{account_id}/account_authorization_configs/discovery_url
//
// Example:
// return canvasRequest(set_discovery_url_deprecated, {account_id});
export const set_discovery_url_deprecated = { type: "SET_DISCOVERY_URL_DEPRECATED", method: "put", key: "set_discovery_url_deprecatedset_discovery_url_deprecated_account_id", required: ["account_id"] };

// Delete discovery url _Deprecated_[2015-05-08]
// Clear discovery url _Deprecated_[2015-05-08]
// 
// [Use update_sso_settings instead]
//
// API Docs: https://canvas.instructure.com/doc/api/authentication_providers.html
// API Url: accounts/{account_id}/account_authorization_configs/discovery_url
//
// Example:
// return canvasRequest(delete_discovery_url_deprecated, {account_id});
export const delete_discovery_url_deprecated = { type: "DELETE_DISCOVERY_URL_DEPRECATED", method: "delete", key: "delete_discovery_url_deprecateddelete_discovery_url_deprecated_account_id", required: ["account_id"] };

// show account auth settings
// The way to get the current state of each account level setting
// that's relevant to Single Sign On configuration
// 
// You can list the current state of each setting with "update_sso_settings"
//
// API Docs: https://canvas.instructure.com/doc/api/authentication_providers.html
// API Url: accounts/{account_id}/sso_settings
//
// Example:
// return canvasRequest(show_account_auth_settings, {account_id});
export const show_account_auth_settings = { type: "SHOW_ACCOUNT_AUTH_SETTINGS", method: "get", key: "show_account_auth_settingsshow_account_auth_settings_account_id", required: ["account_id"] };

// update account auth settings
// For various cases of mixed SSO configurations, you may need to set some
// configuration at the account level to handle the particulars of your
// setup.
// 
// This endpoint accepts a PUT request to set several possible account
// settings. All setting are optional on each request, any that are not
// provided at all are simply retained as is.  Any that provide the key but
// a null-ish value (blank string, null, undefined) will be UN-set.
// 
// You can list the current state of each setting with "show_sso_settings"
//
// API Docs: https://canvas.instructure.com/doc/api/authentication_providers.html
// API Url: accounts/{account_id}/sso_settings
//
// Example:
// return canvasRequest(update_account_auth_settings, {account_id});
export const update_account_auth_settings = { type: "UPDATE_ACCOUNT_AUTH_SETTINGS", method: "put", key: "update_account_auth_settingsupdate_account_auth_settings_account_id", required: ["account_id"] };