export declare class AppwriteException extends Error {
    code: number;
    response: string;
    constructor(message: string, code?: number, response?: string);
}
export declare class Appwrite {
    constructor();
    config: {
        endpoint: string;
        project: string;
        locale: string;
    };
    headers: Headers;
    /**
     * Set Endpoint
     *
     * Your project ID
     *
     * @param {string} endpoint
     *
     * @returns {this}
     */
    setEndpoint(endpoint: string): this;
    /**
     * Set Project
     *
     * Your project ID
     *
     * @param value string
     *
     * @return this
     */
    setProject(value: string): this;
    /**
     * Set Locale
     *
     * @param value string
     *
     * @return this
     */
    setLocale: (value: string) => this;
    private call;
    private flatten;
    account: {
        /**
         * Get Account
         *
         * Get currently logged in user data as JSON object.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        get: () => Promise<any>;
        /**
         * Create Account
         *
         * Use this endpoint to allow a new user to register a new account in your
         * project. After the user registration completes successfully, you can use
         * the [/account/verfication](/docs/client/account#accountCreateVerification)
         * route to start verifying the user email address. To allow the new user to
         * login to their new account, you need to create a new [account
         * session](/docs/client/account#accountCreateSession).
         *
         * @param {string} email
         * @param {string} password
         * @param {string} name
         * @throws {AppwriteException}
         * @return {Promise}
         */
        create: (email: string, password: string, name?: string) => Promise<any>;
        /**
         * Delete Account
         *
         * Delete a currently logged in user account. Behind the scene, the user
         * record is not deleted but permanently blocked from any access. This is done
         * to avoid deleted accounts being overtaken by new users with the same email
         * address. Any user-related resources like documents or storage files should
         * be deleted separately.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        delete: () => Promise<any>;
        /**
         * Update Account Email
         *
         * Update currently logged in user account email address. After changing user
         * address, user confirmation status is being reset and a new confirmation
         * mail is sent. For security measures, user password is required to complete
         * this request.
         *
         * @param {string} email
         * @param {string} password
         * @throws {AppwriteException}
         * @return {Promise}
         */
        updateEmail: (email: string, password: string) => Promise<any>;
        /**
         * Get Account Logs
         *
         * Get currently logged in user list of latest security activity logs. Each
         * log returns user IP address, location and date and time of log.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getLogs: () => Promise<any>;
        /**
         * Update Account Name
         *
         * Update currently logged in user account name.
         *
         * @param {string} name
         * @throws {AppwriteException}
         * @return {Promise}
         */
        updateName: (name: string) => Promise<any>;
        /**
         * Update Account Password
         *
         * Update currently logged in user password. For validation, user is required
         * to pass the password twice.
         *
         * @param {string} password
         * @param {string} oldPassword
         * @throws {AppwriteException}
         * @return {Promise}
         */
        updatePassword: (password: string, oldPassword: string) => Promise<any>;
        /**
         * Get Account Preferences
         *
         * Get currently logged in user preferences as a key-value object.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getPrefs: () => Promise<any>;
        /**
         * Update Account Preferences
         *
         * Update currently logged in user account preferences. You can pass only the
         * specific settings you wish to update.
         *
         * @param {object} prefs
         * @throws {AppwriteException}
         * @return {Promise}
         */
        updatePrefs: (prefs: object) => Promise<any>;
        /**
         * Create Password Recovery
         *
         * Sends the user an email with a temporary secret key for password reset.
         * When the user clicks the confirmation link he is redirected back to your
         * app password reset URL with the secret key and email address values
         * attached to the URL query string. Use the query string params to submit a
         * request to the [PUT
         * /account/recovery](/docs/client/account#accountUpdateRecovery) endpoint to
         * complete the process.
         *
         * @param {string} email
         * @param {string} url
         * @throws {AppwriteException}
         * @return {Promise}
         */
        createRecovery: (email: string, url: string) => Promise<any>;
        /**
         * Complete Password Recovery
         *
         * Use this endpoint to complete the user account password reset. Both the
         * **userId** and **secret** arguments will be passed as query parameters to
         * the redirect URL you have provided when sending your request to the [POST
         * /account/recovery](/docs/client/account#accountCreateRecovery) endpoint.
         *
         * Please note that in order to avoid a [Redirect
         * Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md)
         * the only valid redirect URLs are the ones from domains you have set when
         * adding your platforms in the console interface.
         *
         * @param {string} userId
         * @param {string} secret
         * @param {string} password
         * @param {string} passwordAgain
         * @throws {AppwriteException}
         * @return {Promise}
         */
        updateRecovery: (userId: string, secret: string, password: string, passwordAgain: string) => Promise<any>;
        /**
         * Get Account Sessions
         *
         * Get currently logged in user list of active sessions across different
         * devices.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getSessions: () => Promise<any>;
        /**
         * Create Account Session
         *
         * Allow the user to login into their account by providing a valid email and
         * password combination. This route will create a new session for the user.
         *
         * @param {string} email
         * @param {string} password
         * @throws {AppwriteException}
         * @return {Promise}
         */
        createSession: (email: string, password: string) => Promise<any>;
        /**
         * Delete All Account Sessions
         *
         * Delete all sessions from the user account and remove any sessions cookies
         * from the end client.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        deleteSessions: () => Promise<any>;
        /**
         * Create Account Session with OAuth2
         *
         * Allow the user to login to their account using the OAuth2 provider of their
         * choice. Each OAuth2 provider should be enabled from the Appwrite console
         * first. Use the success and failure arguments to provide a redirect URL's
         * back to your app when login is completed.
         *
         * @param {string} provider
         * @param {string} success
         * @param {string} failure
         * @param {string[]} scopes
         * @throws {AppwriteException}
         * @return {Promise}
         */
        createOAuth2Session: (provider: string, success?: string, failure?: string, scopes?: string[]) => void;
        /**
         * Delete Account Session
         *
         * Use this endpoint to log out the currently logged in user from all their
         * account sessions across all of their different devices. When using the
         * option id argument, only the session unique ID provider will be deleted.
         *
         * @param {string} sessionId
         * @throws {AppwriteException}
         * @return {Promise}
         */
        deleteSession: (sessionId: string) => Promise<any>;
        /**
         * Create Email Verification
         *
         * Use this endpoint to send a verification message to your user email address
         * to confirm they are the valid owners of that address. Both the **userId**
         * and **secret** arguments will be passed as query parameters to the URL you
         * have provided to be attached to the verification email. The provided URL
         * should redirect the user back to your app and allow you to complete the
         * verification process by verifying both the **userId** and **secret**
         * parameters. Learn more about how to [complete the verification
         * process](/docs/client/account#accountUpdateVerification).
         *
         * Please note that in order to avoid a [Redirect
         * Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md),
         * the only valid redirect URLs are the ones from domains you have set when
         * adding your platforms in the console interface.
         *
         *
         * @param {string} url
         * @throws {AppwriteException}
         * @return {Promise}
         */
        createVerification: (url: string) => Promise<any>;
        /**
         * Complete Email Verification
         *
         * Use this endpoint to complete the user email verification process. Use both
         * the **userId** and **secret** parameters that were attached to your app URL
         * to verify the user email ownership. If confirmed this route will return a
         * 200 status code.
         *
         * @param {string} userId
         * @param {string} secret
         * @throws {AppwriteException}
         * @return {Promise}
         */
        updateVerification: (userId: string, secret: string) => Promise<any>;
    };
    avatars: {
        /**
         * Get Browser Icon
         *
         * You can use this endpoint to show different browser icons to your users.
         * The code argument receives the browser code as it appears in your user
         * /account/sessions endpoint. Use width, height and quality arguments to
         * change the output settings.
         *
         * @param {string} code
         * @param {number} width
         * @param {number} height
         * @param {number} quality
         * @throws {AppwriteException}
         * @return {string}
         */
        getBrowser: (code: string, width?: number, height?: number, quality?: number) => URL;
        /**
         * Get Credit Card Icon
         *
         * The credit card endpoint will return you the icon of the credit card
         * provider you need. Use width, height and quality arguments to change the
         * output settings.
         *
         * @param {string} code
         * @param {number} width
         * @param {number} height
         * @param {number} quality
         * @throws {AppwriteException}
         * @return {string}
         */
        getCreditCard: (code: string, width?: number, height?: number, quality?: number) => URL;
        /**
         * Get Favicon
         *
         * Use this endpoint to fetch the favorite icon (AKA favicon) of any remote
         * website URL.
         *
         *
         * @param {string} url
         * @throws {AppwriteException}
         * @return {string}
         */
        getFavicon: (url: string) => URL;
        /**
         * Get Country Flag
         *
         * You can use this endpoint to show different country flags icons to your
         * users. The code argument receives the 2 letter country code. Use width,
         * height and quality arguments to change the output settings.
         *
         * @param {string} code
         * @param {number} width
         * @param {number} height
         * @param {number} quality
         * @throws {AppwriteException}
         * @return {string}
         */
        getFlag: (code: string, width?: number, height?: number, quality?: number) => URL;
        /**
         * Get Image from URL
         *
         * Use this endpoint to fetch a remote image URL and crop it to any image size
         * you want. This endpoint is very useful if you need to crop and display
         * remote images in your app or in case you want to make sure a 3rd party
         * image is properly served using a TLS protocol.
         *
         * @param {string} url
         * @param {number} width
         * @param {number} height
         * @throws {AppwriteException}
         * @return {string}
         */
        getImage: (url: string, width?: number, height?: number) => URL;
        /**
         * Get User Initials
         *
         * Use this endpoint to show your user initials avatar icon on your website or
         * app. By default, this route will try to print your logged-in user name or
         * email initials. You can also overwrite the user name if you pass the 'name'
         * parameter. If no name is given and no user is logged, an empty avatar will
         * be returned.
         *
         * You can use the color and background params to change the avatar colors. By
         * default, a random theme will be selected. The random theme will persist for
         * the user's initials when reloading the same theme will always return for
         * the same initials.
         *
         * @param {string} name
         * @param {number} width
         * @param {number} height
         * @param {string} color
         * @param {string} background
         * @throws {AppwriteException}
         * @return {string}
         */
        getInitials: (name?: string, width?: number, height?: number, color?: string, background?: string) => URL;
        /**
         * Get QR Code
         *
         * Converts a given plain text to a QR code image. You can use the query
         * parameters to change the size and style of the resulting image.
         *
         * @param {string} text
         * @param {number} size
         * @param {number} margin
         * @param {boolean} download
         * @throws {AppwriteException}
         * @return {string}
         */
        getQR: (text: string, size?: number, margin?: number, download?: boolean) => URL;
    };
    database: {
        /**
         * List Documents
         *
         * Get a list of all the user documents. You can use the query params to
         * filter your results. On admin mode, this endpoint will return a list of all
         * of the project's documents. [Learn more about different API
         * modes](/docs/admin).
         *
         * @param {string} collectionId
         * @param {string[]} filters
         * @param {number} limit
         * @param {number} offset
         * @param {string} orderField
         * @param {string} orderType
         * @param {string} orderCast
         * @param {string} search
         * @throws {AppwriteException}
         * @return {Promise}
         */
        listDocuments: (collectionId: string, filters?: string[], limit?: number, offset?: number, orderField?: string, orderType?: string, orderCast?: string, search?: string) => Promise<any>;
        /**
         * Create Document
         *
         * Create a new Document. Before using this route, you should create a new
         * collection resource using either a [server
         * integration](/docs/server/database#databaseCreateCollection) API or
         * directly from your database console.
         *
         * @param {string} collectionId
         * @param {object} data
         * @param {string[]} read
         * @param {string[]} write
         * @param {string} parentDocument
         * @param {string} parentProperty
         * @param {string} parentPropertyType
         * @throws {AppwriteException}
         * @return {Promise}
         */
        createDocument: (collectionId: string, data: object, read: string[], write: string[], parentDocument?: string, parentProperty?: string, parentPropertyType?: string) => Promise<any>;
        /**
         * Get Document
         *
         * Get a document by its unique ID. This endpoint response returns a JSON
         * object with the document data.
         *
         * @param {string} collectionId
         * @param {string} documentId
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getDocument: (collectionId: string, documentId: string) => Promise<any>;
        /**
         * Update Document
         *
         * Update a document by its unique ID. Using the patch method you can pass
         * only specific fields that will get updated.
         *
         * @param {string} collectionId
         * @param {string} documentId
         * @param {object} data
         * @param {string[]} read
         * @param {string[]} write
         * @throws {AppwriteException}
         * @return {Promise}
         */
        updateDocument: (collectionId: string, documentId: string, data: object, read: string[], write: string[]) => Promise<any>;
        /**
         * Delete Document
         *
         * Delete a document by its unique ID. This endpoint deletes only the parent
         * documents, its attributes and relations to other documents. Child documents
         * **will not** be deleted.
         *
         * @param {string} collectionId
         * @param {string} documentId
         * @throws {AppwriteException}
         * @return {Promise}
         */
        deleteDocument: (collectionId: string, documentId: string) => Promise<any>;
    };
    functions: {
        /**
         * List Executions
         *
         * Get a list of all the current user function execution logs. You can use the
         * query params to filter your results. On admin mode, this endpoint will
         * return a list of all of the project's teams. [Learn more about different
         * API modes](/docs/admin).
         *
         * @param {string} functionId
         * @param {string} search
         * @param {number} limit
         * @param {number} offset
         * @param {string} orderType
         * @throws {AppwriteException}
         * @return {Promise}
         */
        listExecutions: (functionId: string, search?: string, limit?: number, offset?: number, orderType?: string) => Promise<any>;
        /**
         * Create Execution
         *
         * Trigger a function execution. The returned object will return you the
         * current execution status. You can ping the `Get Execution` endpoint to get
         * updates on the current execution status. Once this endpoint is called, your
         * function execution process will start asynchronously.
         *
         * @param {string} functionId
         * @throws {AppwriteException}
         * @return {Promise}
         */
        createExecution: (functionId: string) => Promise<any>;
        /**
         * Get Execution
         *
         * Get a function execution log by its unique ID.
         *
         * @param {string} functionId
         * @param {string} executionId
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getExecution: (functionId: string, executionId: string) => Promise<any>;
    };
    locale: {
        /**
         * Get User Locale
         *
         * Get the current user location based on IP. Returns an object with user
         * country code, country name, continent name, continent code, ip address and
         * suggested currency. You can use the locale header to get the data in a
         * supported language.
         *
         * ([IP Geolocation by DB-IP](https://db-ip.com))
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        get: () => Promise<any>;
        /**
         * List Continents
         *
         * List of all continents. You can use the locale header to get the data in a
         * supported language.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getContinents: () => Promise<any>;
        /**
         * List Countries
         *
         * List of all countries. You can use the locale header to get the data in a
         * supported language.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getCountries: () => Promise<any>;
        /**
         * List EU Countries
         *
         * List of all countries that are currently members of the EU. You can use the
         * locale header to get the data in a supported language.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getCountriesEU: () => Promise<any>;
        /**
         * List Countries Phone Codes
         *
         * List of all countries phone codes. You can use the locale header to get the
         * data in a supported language.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getCountriesPhones: () => Promise<any>;
        /**
         * List Currencies
         *
         * List of all currencies, including currency symbol, name, plural, and
         * decimal digits for all major and minor currencies. You can use the locale
         * header to get the data in a supported language.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getCurrencies: () => Promise<any>;
        /**
         * List Languages
         *
         * List of all languages classified by ISO 639-1 including 2-letter code, name
         * in English, and name in the respective language.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getLanguages: () => Promise<any>;
    };
    storage: {
        /**
         * List Files
         *
         * Get a list of all the user files. You can use the query params to filter
         * your results. On admin mode, this endpoint will return a list of all of the
         * project's files. [Learn more about different API modes](/docs/admin).
         *
         * @param {string} search
         * @param {number} limit
         * @param {number} offset
         * @param {string} orderType
         * @throws {AppwriteException}
         * @return {Promise}
         */
        listFiles: (search?: string, limit?: number, offset?: number, orderType?: string) => Promise<any>;
        /**
         * Create File
         *
         * Create a new file. The user who creates the file will automatically be
         * assigned to read and write access unless he has passed custom values for
         * read and write arguments.
         *
         * @param {File} file
         * @param {string[]} read
         * @param {string[]} write
         * @throws {AppwriteException}
         * @return {Promise}
         */
        createFile: (file: File, read: string[], write: string[]) => Promise<any>;
        /**
         * Get File
         *
         * Get a file by its unique ID. This endpoint response returns a JSON object
         * with the file metadata.
         *
         * @param {string} fileId
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getFile: (fileId: string) => Promise<any>;
        /**
         * Update File
         *
         * Update a file by its unique ID. Only users with write permissions have
         * access to update this resource.
         *
         * @param {string} fileId
         * @param {string[]} read
         * @param {string[]} write
         * @throws {AppwriteException}
         * @return {Promise}
         */
        updateFile: (fileId: string, read: string[], write: string[]) => Promise<any>;
        /**
         * Delete File
         *
         * Delete a file by its unique ID. Only users with write permissions have
         * access to delete this resource.
         *
         * @param {string} fileId
         * @throws {AppwriteException}
         * @return {Promise}
         */
        deleteFile: (fileId: string) => Promise<any>;
        /**
         * Get File for Download
         *
         * Get a file content by its unique ID. The endpoint response return with a
         * 'Content-Disposition: attachment' header that tells the browser to start
         * downloading the file to user downloads directory.
         *
         * @param {string} fileId
         * @throws {AppwriteException}
         * @return {string}
         */
        getFileDownload: (fileId: string) => URL;
        /**
         * Get File Preview
         *
         * Get a file preview image. Currently, this method supports preview for image
         * files (jpg, png, and gif), other supported formats, like pdf, docs, slides,
         * and spreadsheets, will return the file icon image. You can also pass query
         * string arguments for cutting and resizing your preview image.
         *
         * @param {string} fileId
         * @param {number} width
         * @param {number} height
         * @param {number} quality
         * @param {string} background
         * @param {string} output
         * @throws {AppwriteException}
         * @return {string}
         */
        getFilePreview: (fileId: string, width?: number, height?: number, quality?: number, background?: string, output?: string) => URL;
        /**
         * Get File for View
         *
         * Get a file content by its unique ID. This endpoint is similar to the
         * download method but returns with no  'Content-Disposition: attachment'
         * header.
         *
         * @param {string} fileId
         * @throws {AppwriteException}
         * @return {string}
         */
        getFileView: (fileId: string) => URL;
    };
    teams: {
        /**
         * List Teams
         *
         * Get a list of all the current user teams. You can use the query params to
         * filter your results. On admin mode, this endpoint will return a list of all
         * of the project's teams. [Learn more about different API
         * modes](/docs/admin).
         *
         * @param {string} search
         * @param {number} limit
         * @param {number} offset
         * @param {string} orderType
         * @throws {AppwriteException}
         * @return {Promise}
         */
        list: (search?: string, limit?: number, offset?: number, orderType?: string) => Promise<any>;
        /**
         * Create Team
         *
         * Create a new team. The user who creates the team will automatically be
         * assigned as the owner of the team. The team owner can invite new members,
         * who will be able add new owners and update or delete the team from your
         * project.
         *
         * @param {string} name
         * @param {string[]} roles
         * @throws {AppwriteException}
         * @return {Promise}
         */
        create: (name: string, roles?: string[]) => Promise<any>;
        /**
         * Get Team
         *
         * Get a team by its unique ID. All team members have read access for this
         * resource.
         *
         * @param {string} teamId
         * @throws {AppwriteException}
         * @return {Promise}
         */
        get: (teamId: string) => Promise<any>;
        /**
         * Update Team
         *
         * Update a team by its unique ID. Only team owners have write access for this
         * resource.
         *
         * @param {string} teamId
         * @param {string} name
         * @throws {AppwriteException}
         * @return {Promise}
         */
        update: (teamId: string, name: string) => Promise<any>;
        /**
         * Delete Team
         *
         * Delete a team by its unique ID. Only team owners have write access for this
         * resource.
         *
         * @param {string} teamId
         * @throws {AppwriteException}
         * @return {Promise}
         */
        delete: (teamId: string) => Promise<any>;
        /**
         * Get Team Memberships
         *
         * Get a team members by the team unique ID. All team members have read access
         * for this list of resources.
         *
         * @param {string} teamId
         * @param {string} search
         * @param {number} limit
         * @param {number} offset
         * @param {string} orderType
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getMemberships: (teamId: string, search?: string, limit?: number, offset?: number, orderType?: string) => Promise<any>;
        /**
         * Create Team Membership
         *
         * Use this endpoint to invite a new member to join your team. An email with a
         * link to join the team will be sent to the new member email address if the
         * member doesn't exist in the project it will be created automatically.
         *
         * Use the 'URL' parameter to redirect the user from the invitation email back
         * to your app. When the user is redirected, use the [Update Team Membership
         * Status](/docs/client/teams#teamsUpdateMembershipStatus) endpoint to allow
         * the user to accept the invitation to the team.
         *
         * Please note that in order to avoid a [Redirect
         * Attacks](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md)
         * the only valid redirect URL's are the once from domains you have set when
         * added your platforms in the console interface.
         *
         * @param {string} teamId
         * @param {string} email
         * @param {string[]} roles
         * @param {string} url
         * @param {string} name
         * @throws {AppwriteException}
         * @return {Promise}
         */
        createMembership: (teamId: string, email: string, roles: string[], url: string, name?: string) => Promise<any>;
        /**
         * Delete Team Membership
         *
         * This endpoint allows a user to leave a team or for a team owner to delete
         * the membership of any other team member. You can also use this endpoint to
         * delete a user membership even if it is not accepted.
         *
         * @param {string} teamId
         * @param {string} inviteId
         * @throws {AppwriteException}
         * @return {Promise}
         */
        deleteMembership: (teamId: string, inviteId: string) => Promise<any>;
        /**
         * Update Team Membership Status
         *
         * Use this endpoint to allow a user to accept an invitation to join a team
         * after being redirected back to your app from the invitation email recieved
         * by the user.
         *
         * @param {string} teamId
         * @param {string} inviteId
         * @param {string} userId
         * @param {string} secret
         * @throws {AppwriteException}
         * @return {Promise}
         */
        updateMembershipStatus: (teamId: string, inviteId: string, userId: string, secret: string) => Promise<any>;
    };
}
