interface assoc {
    [key: string]: any;
}

export class AppwriteException extends Error {
    code: number;
    response: string;
    constructor(message: string, code: number = 0, response: string = '') {
        super(message);
        this.name = 'AppwriteException';
        this.message = message;
        this.code = code;
        this.response = response;
    }
}

export class Appwrite {
    constructor () {
        
    }
    config = {
        endpoint: 'https://appwrite.io/v1',
        project: '',
        locale: '',
    };
    headers: Headers = new Headers({
        'x-sdk-version': 'appwrite:web:2.0.0',
    });

    /**
     * Set Endpoint
     *
     * Your project ID
     *
     * @param {string} endpoint
     *
     * @returns {this}
     */
    setEndpoint(endpoint: string): this {
        this.config.endpoint = endpoint;

        return this;
    }

    /**
     * Set Project
     *
     * Your project ID
     *
     * @param value string
     *
     * @return this
     */
    setProject = (value: string): this => {
        this.headers.set('X-Appwrite-Project', value);
        this.config.project = value;
        return this;
    };

    /**
     * Set Locale
     *
     * @param value string
     *
     * @return this
     */
    setLocale = (value: string): this => {
        this.headers.set('X-Appwrite-Locale', value);
        this.config.locale = value;
        return this;
    };

    async call(method: string, url: URL, headers: Headers = new Headers(), params:assoc = {}): Promise<any> {
        method = method.toUpperCase();
        this.headers.forEach((value, key) => {
            headers.set(key, value);
        });
        let options: RequestInit = {
            method,
            headers,
            credentials: 'include'
        };

        if (window.localStorage) {
            headers.set('X-Fallback-Cookies', window.localStorage.getItem('cookieFallback') ?? "");
        }

        if (method === 'GET') {
            url.search = new URLSearchParams(this.flatten(params)).toString();
        } else {
            switch (headers.get('content-type')) {
                case 'application/json':
                    options.body = JSON.stringify(params);
                break;

                case 'multipart/form-data':
                    let formData = new FormData();

                    for (const key in params) {
                        formData.append(key + (Array.isArray(params[key]) ? '[]' : ''), params[key]);
                    }

                    options.body = formData;
                    headers.delete('content-type');
                break;
            }
        }

        try {
            const response = await fetch(url.toString(), options);
            const data = await response.json();
            if (400 <= response.status) {
                throw new AppwriteException(data.message, response.status, data);
            }

            const cookieFallback = response.headers.get('X-Fallback-Cookies');
        
            if (window.localStorage && cookieFallback) {
                window.console.warn('Appwrite is using localStorage for session management. Increase your security by adding a custom domain as your API endpoint.');
                window.localStorage.setItem('cookieFallback', cookieFallback);
            }

            return data;
        } catch (e) {
            throw new AppwriteException(e.message);
        }
    }

    private flatten(data: assoc, prefix = ''): assoc {
        let output: assoc = {};

        for (const key in data) {
            let value = data[key];
            let finalKey = prefix ? prefix + '[' + key +']' : key;

            if (Array.isArray(value)) {
                output = Object.assign(output, this.flatten(value, finalKey)); // @todo: handle name collision here if needed
            }
            else {
                output[finalKey] = value;
            }
        }

        return output;
    }

    account = {

        /**
         * Get Account
         *
         * Get currently logged in user data as JSON object.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        get: async (): Promise<any> => {
            let path = '/account';

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        create: async (email: string, password: string, name: string = ''): Promise<any> => {
            if (email === undefined) {
                throw new AppwriteException('Missing required parameter: "email"');
            }
            
            if (password === undefined) {
                throw new AppwriteException('Missing required parameter: "password"');
            }
            
            let path = '/account';

            let payload: assoc = {};
            if (typeof email !== 'undefined') {
                payload['email'] = email;
            }

            if (typeof password !== 'undefined') {
                payload['password'] = password;
            }

            if (typeof name !== 'undefined') {
                payload['name'] = name;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('post', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        delete: async (): Promise<any> => {
            let path = '/account';

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('delete', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        updateEmail: async (email: string, password: string): Promise<any> => {
            if (email === undefined) {
                throw new AppwriteException('Missing required parameter: "email"');
            }
            
            if (password === undefined) {
                throw new AppwriteException('Missing required parameter: "password"');
            }
            
            let path = '/account/email';

            let payload: assoc = {};
            if (typeof email !== 'undefined') {
                payload['email'] = email;
            }

            if (typeof password !== 'undefined') {
                payload['password'] = password;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('patch', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

        /**
         * Get Account Logs
         *
         * Get currently logged in user list of latest security activity logs. Each
         * log returns user IP address, location and date and time of log.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getLogs: async (): Promise<any> => {
            let path = '/account/logs';

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

        /**
         * Update Account Name
         *
         * Update currently logged in user account name.
         *
         * @param {string} name
         * @throws {AppwriteException}
         * @return {Promise}
         */
        updateName: async (name: string): Promise<any> => {
            if (name === undefined) {
                throw new AppwriteException('Missing required parameter: "name"');
            }
            
            let path = '/account/name';

            let payload: assoc = {};
            if (typeof name !== 'undefined') {
                payload['name'] = name;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('patch', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        updatePassword: async (password: string, oldPassword: string): Promise<any> => {
            if (password === undefined) {
                throw new AppwriteException('Missing required parameter: "password"');
            }
            
            if (oldPassword === undefined) {
                throw new AppwriteException('Missing required parameter: "oldPassword"');
            }
            
            let path = '/account/password';

            let payload: assoc = {};
            if (typeof password !== 'undefined') {
                payload['password'] = password;
            }

            if (typeof oldPassword !== 'undefined') {
                payload['oldPassword'] = oldPassword;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('patch', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

        /**
         * Get Account Preferences
         *
         * Get currently logged in user preferences as a key-value object.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getPrefs: async (): Promise<any> => {
            let path = '/account/prefs';

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        updatePrefs: async (prefs: object): Promise<any> => {
            if (prefs === undefined) {
                throw new AppwriteException('Missing required parameter: "prefs"');
            }
            
            let path = '/account/prefs';

            let payload: assoc = {};
            if (typeof prefs !== 'undefined') {
                payload['prefs'] = prefs;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('patch', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        createRecovery: async (email: string, url: string): Promise<any> => {
            if (email === undefined) {
                throw new AppwriteException('Missing required parameter: "email"');
            }
            
            if (url === undefined) {
                throw new AppwriteException('Missing required parameter: "url"');
            }
            
            let path = '/account/recovery';

            let payload: assoc = {};
            if (typeof email !== 'undefined') {
                payload['email'] = email;
            }

            if (typeof url !== 'undefined') {
                payload['url'] = url;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('post', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        updateRecovery: async (userId: string, secret: string, password: string, passwordAgain: string): Promise<any> => {
            if (userId === undefined) {
                throw new AppwriteException('Missing required parameter: "userId"');
            }
            
            if (secret === undefined) {
                throw new AppwriteException('Missing required parameter: "secret"');
            }
            
            if (password === undefined) {
                throw new AppwriteException('Missing required parameter: "password"');
            }
            
            if (passwordAgain === undefined) {
                throw new AppwriteException('Missing required parameter: "passwordAgain"');
            }
            
            let path = '/account/recovery';

            let payload: assoc = {};
            if (typeof userId !== 'undefined') {
                payload['userId'] = userId;
            }

            if (typeof secret !== 'undefined') {
                payload['secret'] = secret;
            }

            if (typeof password !== 'undefined') {
                payload['password'] = password;
            }

            if (typeof passwordAgain !== 'undefined') {
                payload['passwordAgain'] = passwordAgain;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('put', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

        /**
         * Get Account Sessions
         *
         * Get currently logged in user list of active sessions across different
         * devices.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getSessions: async (): Promise<any> => {
            let path = '/account/sessions';

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        createSession: async (email: string, password: string): Promise<any> => {
            if (email === undefined) {
                throw new AppwriteException('Missing required parameter: "email"');
            }
            
            if (password === undefined) {
                throw new AppwriteException('Missing required parameter: "password"');
            }
            
            let path = '/account/sessions';

            let payload: assoc = {};
            if (typeof email !== 'undefined') {
                payload['email'] = email;
            }

            if (typeof password !== 'undefined') {
                payload['password'] = password;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('post', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

        /**
         * Delete All Account Sessions
         *
         * Delete all sessions from the user account and remove any sessions cookies
         * from the end client.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        deleteSessions: async (): Promise<any> => {
            let path = '/account/sessions';

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('delete', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        createOAuth2Session:  (provider: string, success: string = 'https://appwrite.io/auth/oauth2/success', failure: string = 'https://appwrite.io/auth/oauth2/failure', scopes: string[] = []): void => {
            if (provider === undefined) {
                throw new AppwriteException('Missing required parameter: "provider"');
            }
            
            let path = '/account/sessions/oauth2/{provider}'.replace(new RegExp('{provider}', 'g'), provider);

            let payload: assoc = {};
            if (success) {
                payload['success'] = success;
            }

            if (failure) {
                payload['failure'] = failure;
            }

            if (scopes) {
                payload['scopes'] = scopes;
            }

            const uri = new URL(this.config.endpoint + path);
            payload['project'] = this.config.project;


            const query = new URLSearchParams(payload);
            uri.search = query.toString();
            window.location.href = uri.toString();
        },

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
        deleteSession: async (sessionId: string): Promise<any> => {
            if (sessionId === undefined) {
                throw new AppwriteException('Missing required parameter: "sessionId"');
            }
            
            let path = '/account/sessions/{sessionId}'.replace(new RegExp('{sessionId}', 'g'), sessionId);

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('delete', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        createVerification: async (url: string): Promise<any> => {
            if (url === undefined) {
                throw new AppwriteException('Missing required parameter: "url"');
            }
            
            let path = '/account/verification';

            let payload: assoc = {};
            if (typeof url !== 'undefined') {
                payload['url'] = url;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('post', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        updateVerification: async (userId: string, secret: string): Promise<any> => {
            if (userId === undefined) {
                throw new AppwriteException('Missing required parameter: "userId"');
            }
            
            if (secret === undefined) {
                throw new AppwriteException('Missing required parameter: "secret"');
            }
            
            let path = '/account/verification';

            let payload: assoc = {};
            if (typeof userId !== 'undefined') {
                payload['userId'] = userId;
            }

            if (typeof secret !== 'undefined') {
                payload['secret'] = secret;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('put', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        }
    };

    avatars = {

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
        getBrowser:  (code: string, width: number = 100, height: number = 100, quality: number = 100): URL => {
            if (code === undefined) {
                throw new AppwriteException('Missing required parameter: "code"');
            }
            
            let path = '/avatars/browsers/{code}'.replace(new RegExp('{code}', 'g'), code);

            let payload: assoc = {};
            if (width) {
                payload['width'] = width;
            }

            if (height) {
                payload['height'] = height;
            }

            if (quality) {
                payload['quality'] = quality;
            }

            const uri = new URL(this.config.endpoint + path);
            payload['project'] = this.config.project;


            const query = new URLSearchParams(payload);
            uri.search = query.toString();
            return uri;
        },

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
        getCreditCard:  (code: string, width: number = 100, height: number = 100, quality: number = 100): URL => {
            if (code === undefined) {
                throw new AppwriteException('Missing required parameter: "code"');
            }
            
            let path = '/avatars/credit-cards/{code}'.replace(new RegExp('{code}', 'g'), code);

            let payload: assoc = {};
            if (width) {
                payload['width'] = width;
            }

            if (height) {
                payload['height'] = height;
            }

            if (quality) {
                payload['quality'] = quality;
            }

            const uri = new URL(this.config.endpoint + path);
            payload['project'] = this.config.project;


            const query = new URLSearchParams(payload);
            uri.search = query.toString();
            return uri;
        },

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
        getFavicon:  (url: string): URL => {
            if (url === undefined) {
                throw new AppwriteException('Missing required parameter: "url"');
            }
            
            let path = '/avatars/favicon';

            let payload: assoc = {};
            if (url) {
                payload['url'] = url;
            }

            const uri = new URL(this.config.endpoint + path);
            payload['project'] = this.config.project;


            const query = new URLSearchParams(payload);
            uri.search = query.toString();
            return uri;
        },

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
        getFlag:  (code: string, width: number = 100, height: number = 100, quality: number = 100): URL => {
            if (code === undefined) {
                throw new AppwriteException('Missing required parameter: "code"');
            }
            
            let path = '/avatars/flags/{code}'.replace(new RegExp('{code}', 'g'), code);

            let payload: assoc = {};
            if (width) {
                payload['width'] = width;
            }

            if (height) {
                payload['height'] = height;
            }

            if (quality) {
                payload['quality'] = quality;
            }

            const uri = new URL(this.config.endpoint + path);
            payload['project'] = this.config.project;


            const query = new URLSearchParams(payload);
            uri.search = query.toString();
            return uri;
        },

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
        getImage:  (url: string, width: number = 400, height: number = 400): URL => {
            if (url === undefined) {
                throw new AppwriteException('Missing required parameter: "url"');
            }
            
            let path = '/avatars/image';

            let payload: assoc = {};
            if (url) {
                payload['url'] = url;
            }

            if (width) {
                payload['width'] = width;
            }

            if (height) {
                payload['height'] = height;
            }

            const uri = new URL(this.config.endpoint + path);
            payload['project'] = this.config.project;


            const query = new URLSearchParams(payload);
            uri.search = query.toString();
            return uri;
        },

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
        getInitials:  (name: string = '', width: number = 500, height: number = 500, color: string = '', background: string = ''): URL => {
            let path = '/avatars/initials';

            let payload: assoc = {};
            if (name) {
                payload['name'] = name;
            }

            if (width) {
                payload['width'] = width;
            }

            if (height) {
                payload['height'] = height;
            }

            if (color) {
                payload['color'] = color;
            }

            if (background) {
                payload['background'] = background;
            }

            const uri = new URL(this.config.endpoint + path);
            payload['project'] = this.config.project;


            const query = new URLSearchParams(payload);
            uri.search = query.toString();
            return uri;
        },

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
        getQR:  (text: string, size: number = 400, margin: number = 1, download: boolean = false): URL => {
            if (text === undefined) {
                throw new AppwriteException('Missing required parameter: "text"');
            }
            
            let path = '/avatars/qr';

            let payload: assoc = {};
            if (text) {
                payload['text'] = text;
            }

            if (size) {
                payload['size'] = size;
            }

            if (margin) {
                payload['margin'] = margin;
            }

            if (download) {
                payload['download'] = download;
            }

            const uri = new URL(this.config.endpoint + path);
            payload['project'] = this.config.project;


            const query = new URLSearchParams(payload);
            uri.search = query.toString();
            return uri;
        }
    };

    database = {

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
        listDocuments: async (collectionId: string, filters: string[] = [], limit: number = 25, offset: number = 0, orderField: string = '', orderType: string = 'ASC', orderCast: string = 'string', search: string = ''): Promise<any> => {
            if (collectionId === undefined) {
                throw new AppwriteException('Missing required parameter: "collectionId"');
            }
            
            let path = '/database/collections/{collectionId}/documents'.replace(new RegExp('{collectionId}', 'g'), collectionId);

            let payload: assoc = {};
            if (filters) {
                payload['filters'] = filters;
            }

            if (limit) {
                payload['limit'] = limit;
            }

            if (offset) {
                payload['offset'] = offset;
            }

            if (orderField) {
                payload['orderField'] = orderField;
            }

            if (orderType) {
                payload['orderType'] = orderType;
            }

            if (orderCast) {
                payload['orderCast'] = orderCast;
            }

            if (search) {
                payload['search'] = search;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        createDocument: async (collectionId: string, data: object, read: string[], write: string[], parentDocument: string = '', parentProperty: string = '', parentPropertyType: string = 'assign'): Promise<any> => {
            if (collectionId === undefined) {
                throw new AppwriteException('Missing required parameter: "collectionId"');
            }
            
            if (data === undefined) {
                throw new AppwriteException('Missing required parameter: "data"');
            }
            
            if (read === undefined) {
                throw new AppwriteException('Missing required parameter: "read"');
            }
            
            if (write === undefined) {
                throw new AppwriteException('Missing required parameter: "write"');
            }
            
            let path = '/database/collections/{collectionId}/documents'.replace(new RegExp('{collectionId}', 'g'), collectionId);

            let payload: assoc = {};
            if (typeof data !== 'undefined') {
                payload['data'] = data;
            }

            if (typeof read !== 'undefined') {
                payload['read'] = read;
            }

            if (typeof write !== 'undefined') {
                payload['write'] = write;
            }

            if (typeof parentDocument !== 'undefined') {
                payload['parentDocument'] = parentDocument;
            }

            if (typeof parentProperty !== 'undefined') {
                payload['parentProperty'] = parentProperty;
            }

            if (typeof parentPropertyType !== 'undefined') {
                payload['parentPropertyType'] = parentPropertyType;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('post', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        getDocument: async (collectionId: string, documentId: string): Promise<any> => {
            if (collectionId === undefined) {
                throw new AppwriteException('Missing required parameter: "collectionId"');
            }
            
            if (documentId === undefined) {
                throw new AppwriteException('Missing required parameter: "documentId"');
            }
            
            let path = '/database/collections/{collectionId}/documents/{documentId}'.replace(new RegExp('{collectionId}', 'g'), collectionId).replace(new RegExp('{documentId}', 'g'), documentId);

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        updateDocument: async (collectionId: string, documentId: string, data: object, read: string[], write: string[]): Promise<any> => {
            if (collectionId === undefined) {
                throw new AppwriteException('Missing required parameter: "collectionId"');
            }
            
            if (documentId === undefined) {
                throw new AppwriteException('Missing required parameter: "documentId"');
            }
            
            if (data === undefined) {
                throw new AppwriteException('Missing required parameter: "data"');
            }
            
            if (read === undefined) {
                throw new AppwriteException('Missing required parameter: "read"');
            }
            
            if (write === undefined) {
                throw new AppwriteException('Missing required parameter: "write"');
            }
            
            let path = '/database/collections/{collectionId}/documents/{documentId}'.replace(new RegExp('{collectionId}', 'g'), collectionId).replace(new RegExp('{documentId}', 'g'), documentId);

            let payload: assoc = {};
            if (typeof data !== 'undefined') {
                payload['data'] = data;
            }

            if (typeof read !== 'undefined') {
                payload['read'] = read;
            }

            if (typeof write !== 'undefined') {
                payload['write'] = write;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('patch', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        deleteDocument: async (collectionId: string, documentId: string): Promise<any> => {
            if (collectionId === undefined) {
                throw new AppwriteException('Missing required parameter: "collectionId"');
            }
            
            if (documentId === undefined) {
                throw new AppwriteException('Missing required parameter: "documentId"');
            }
            
            let path = '/database/collections/{collectionId}/documents/{documentId}'.replace(new RegExp('{collectionId}', 'g'), collectionId).replace(new RegExp('{documentId}', 'g'), documentId);

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('delete', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        }
    };

    functions = {

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
        listExecutions: async (functionId: string, search: string = '', limit: number = 25, offset: number = 0, orderType: string = 'ASC'): Promise<any> => {
            if (functionId === undefined) {
                throw new AppwriteException('Missing required parameter: "functionId"');
            }
            
            let path = '/functions/{functionId}/executions'.replace(new RegExp('{functionId}', 'g'), functionId);

            let payload: assoc = {};
            if (search) {
                payload['search'] = search;
            }

            if (limit) {
                payload['limit'] = limit;
            }

            if (offset) {
                payload['offset'] = offset;
            }

            if (orderType) {
                payload['orderType'] = orderType;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        createExecution: async (functionId: string): Promise<any> => {
            if (functionId === undefined) {
                throw new AppwriteException('Missing required parameter: "functionId"');
            }
            
            let path = '/functions/{functionId}/executions'.replace(new RegExp('{functionId}', 'g'), functionId);

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('post', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        getExecution: async (functionId: string, executionId: string): Promise<any> => {
            if (functionId === undefined) {
                throw new AppwriteException('Missing required parameter: "functionId"');
            }
            
            if (executionId === undefined) {
                throw new AppwriteException('Missing required parameter: "executionId"');
            }
            
            let path = '/functions/{functionId}/executions/{executionId}'.replace(new RegExp('{functionId}', 'g'), functionId).replace(new RegExp('{executionId}', 'g'), executionId);

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        }
    };

    locale = {

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
        get: async (): Promise<any> => {
            let path = '/locale';

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

        /**
         * List Continents
         *
         * List of all continents. You can use the locale header to get the data in a
         * supported language.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getContinents: async (): Promise<any> => {
            let path = '/locale/continents';

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

        /**
         * List Countries
         *
         * List of all countries. You can use the locale header to get the data in a
         * supported language.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getCountries: async (): Promise<any> => {
            let path = '/locale/countries';

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

        /**
         * List EU Countries
         *
         * List of all countries that are currently members of the EU. You can use the
         * locale header to get the data in a supported language.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getCountriesEU: async (): Promise<any> => {
            let path = '/locale/countries/eu';

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

        /**
         * List Countries Phone Codes
         *
         * List of all countries phone codes. You can use the locale header to get the
         * data in a supported language.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getCountriesPhones: async (): Promise<any> => {
            let path = '/locale/countries/phones';

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        getCurrencies: async (): Promise<any> => {
            let path = '/locale/currencies';

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

        /**
         * List Languages
         *
         * List of all languages classified by ISO 639-1 including 2-letter code, name
         * in English, and name in the respective language.
         *
         * @throws {AppwriteException}
         * @return {Promise}
         */
        getLanguages: async (): Promise<any> => {
            let path = '/locale/languages';

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        }
    };

    storage = {

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
        listFiles: async (search: string = '', limit: number = 25, offset: number = 0, orderType: string = 'ASC'): Promise<any> => {
            let path = '/storage/files';

            let payload: assoc = {};
            if (search) {
                payload['search'] = search;
            }

            if (limit) {
                payload['limit'] = limit;
            }

            if (offset) {
                payload['offset'] = offset;
            }

            if (orderType) {
                payload['orderType'] = orderType;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        createFile: async (file: File, read: string[], write: string[]): Promise<any> => {
            if (file === undefined) {
                throw new AppwriteException('Missing required parameter: "file"');
            }
            
            if (read === undefined) {
                throw new AppwriteException('Missing required parameter: "read"');
            }
            
            if (write === undefined) {
                throw new AppwriteException('Missing required parameter: "write"');
            }
            
            let path = '/storage/files';

            let payload: assoc = {};
            if (typeof file !== 'undefined') {
                payload['file'] = file;
            }

            if (typeof read !== 'undefined') {
                payload['read'] = read;
            }

            if (typeof write !== 'undefined') {
                payload['write'] = write;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('post', uri, new Headers(
                    {
                    'content-type': 'multipart/form-data',
                    }
                ), payload);
        },

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
        getFile: async (fileId: string): Promise<any> => {
            if (fileId === undefined) {
                throw new AppwriteException('Missing required parameter: "fileId"');
            }
            
            let path = '/storage/files/{fileId}'.replace(new RegExp('{fileId}', 'g'), fileId);

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        updateFile: async (fileId: string, read: string[], write: string[]): Promise<any> => {
            if (fileId === undefined) {
                throw new AppwriteException('Missing required parameter: "fileId"');
            }
            
            if (read === undefined) {
                throw new AppwriteException('Missing required parameter: "read"');
            }
            
            if (write === undefined) {
                throw new AppwriteException('Missing required parameter: "write"');
            }
            
            let path = '/storage/files/{fileId}'.replace(new RegExp('{fileId}', 'g'), fileId);

            let payload: assoc = {};
            if (typeof read !== 'undefined') {
                payload['read'] = read;
            }

            if (typeof write !== 'undefined') {
                payload['write'] = write;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('put', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        deleteFile: async (fileId: string): Promise<any> => {
            if (fileId === undefined) {
                throw new AppwriteException('Missing required parameter: "fileId"');
            }
            
            let path = '/storage/files/{fileId}'.replace(new RegExp('{fileId}', 'g'), fileId);

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('delete', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        getFileDownload:  (fileId: string): URL => {
            if (fileId === undefined) {
                throw new AppwriteException('Missing required parameter: "fileId"');
            }
            
            let path = '/storage/files/{fileId}/download'.replace(new RegExp('{fileId}', 'g'), fileId);

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            payload['project'] = this.config.project;


            const query = new URLSearchParams(payload);
            uri.search = query.toString();
            return uri;
        },

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
        getFilePreview:  (fileId: string, width: number = 0, height: number = 0, quality: number = 100, background: string = '', output: string = ''): URL => {
            if (fileId === undefined) {
                throw new AppwriteException('Missing required parameter: "fileId"');
            }
            
            let path = '/storage/files/{fileId}/preview'.replace(new RegExp('{fileId}', 'g'), fileId);

            let payload: assoc = {};
            if (width) {
                payload['width'] = width;
            }

            if (height) {
                payload['height'] = height;
            }

            if (quality) {
                payload['quality'] = quality;
            }

            if (background) {
                payload['background'] = background;
            }

            if (output) {
                payload['output'] = output;
            }

            const uri = new URL(this.config.endpoint + path);
            payload['project'] = this.config.project;


            const query = new URLSearchParams(payload);
            uri.search = query.toString();
            return uri;
        },

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
        getFileView:  (fileId: string): URL => {
            if (fileId === undefined) {
                throw new AppwriteException('Missing required parameter: "fileId"');
            }
            
            let path = '/storage/files/{fileId}/view'.replace(new RegExp('{fileId}', 'g'), fileId);

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            payload['project'] = this.config.project;


            const query = new URLSearchParams(payload);
            uri.search = query.toString();
            return uri;
        }
    };

    teams = {

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
        list: async (search: string = '', limit: number = 25, offset: number = 0, orderType: string = 'ASC'): Promise<any> => {
            let path = '/teams';

            let payload: assoc = {};
            if (search) {
                payload['search'] = search;
            }

            if (limit) {
                payload['limit'] = limit;
            }

            if (offset) {
                payload['offset'] = offset;
            }

            if (orderType) {
                payload['orderType'] = orderType;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        create: async (name: string, roles: string[] = ["owner"]): Promise<any> => {
            if (name === undefined) {
                throw new AppwriteException('Missing required parameter: "name"');
            }
            
            let path = '/teams';

            let payload: assoc = {};
            if (typeof name !== 'undefined') {
                payload['name'] = name;
            }

            if (typeof roles !== 'undefined') {
                payload['roles'] = roles;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('post', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        get: async (teamId: string): Promise<any> => {
            if (teamId === undefined) {
                throw new AppwriteException('Missing required parameter: "teamId"');
            }
            
            let path = '/teams/{teamId}'.replace(new RegExp('{teamId}', 'g'), teamId);

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        update: async (teamId: string, name: string): Promise<any> => {
            if (teamId === undefined) {
                throw new AppwriteException('Missing required parameter: "teamId"');
            }
            
            if (name === undefined) {
                throw new AppwriteException('Missing required parameter: "name"');
            }
            
            let path = '/teams/{teamId}'.replace(new RegExp('{teamId}', 'g'), teamId);

            let payload: assoc = {};
            if (typeof name !== 'undefined') {
                payload['name'] = name;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('put', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        delete: async (teamId: string): Promise<any> => {
            if (teamId === undefined) {
                throw new AppwriteException('Missing required parameter: "teamId"');
            }
            
            let path = '/teams/{teamId}'.replace(new RegExp('{teamId}', 'g'), teamId);

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('delete', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        getMemberships: async (teamId: string, search: string = '', limit: number = 25, offset: number = 0, orderType: string = 'ASC'): Promise<any> => {
            if (teamId === undefined) {
                throw new AppwriteException('Missing required parameter: "teamId"');
            }
            
            let path = '/teams/{teamId}/memberships'.replace(new RegExp('{teamId}', 'g'), teamId);

            let payload: assoc = {};
            if (search) {
                payload['search'] = search;
            }

            if (limit) {
                payload['limit'] = limit;
            }

            if (offset) {
                payload['offset'] = offset;
            }

            if (orderType) {
                payload['orderType'] = orderType;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('get', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        createMembership: async (teamId: string, email: string, roles: string[], url: string, name: string = ''): Promise<any> => {
            if (teamId === undefined) {
                throw new AppwriteException('Missing required parameter: "teamId"');
            }
            
            if (email === undefined) {
                throw new AppwriteException('Missing required parameter: "email"');
            }
            
            if (roles === undefined) {
                throw new AppwriteException('Missing required parameter: "roles"');
            }
            
            if (url === undefined) {
                throw new AppwriteException('Missing required parameter: "url"');
            }
            
            let path = '/teams/{teamId}/memberships'.replace(new RegExp('{teamId}', 'g'), teamId);

            let payload: assoc = {};
            if (typeof email !== 'undefined') {
                payload['email'] = email;
            }

            if (typeof name !== 'undefined') {
                payload['name'] = name;
            }

            if (typeof roles !== 'undefined') {
                payload['roles'] = roles;
            }

            if (typeof url !== 'undefined') {
                payload['url'] = url;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('post', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        deleteMembership: async (teamId: string, inviteId: string): Promise<any> => {
            if (teamId === undefined) {
                throw new AppwriteException('Missing required parameter: "teamId"');
            }
            
            if (inviteId === undefined) {
                throw new AppwriteException('Missing required parameter: "inviteId"');
            }
            
            let path = '/teams/{teamId}/memberships/{inviteId}'.replace(new RegExp('{teamId}', 'g'), teamId).replace(new RegExp('{inviteId}', 'g'), inviteId);

            let payload: assoc = {};
            const uri = new URL(this.config.endpoint + path);
            return await this.call('delete', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        },

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
        updateMembershipStatus: async (teamId: string, inviteId: string, userId: string, secret: string): Promise<any> => {
            if (teamId === undefined) {
                throw new AppwriteException('Missing required parameter: "teamId"');
            }
            
            if (inviteId === undefined) {
                throw new AppwriteException('Missing required parameter: "inviteId"');
            }
            
            if (userId === undefined) {
                throw new AppwriteException('Missing required parameter: "userId"');
            }
            
            if (secret === undefined) {
                throw new AppwriteException('Missing required parameter: "secret"');
            }
            
            let path = '/teams/{teamId}/memberships/{inviteId}/status'.replace(new RegExp('{teamId}', 'g'), teamId).replace(new RegExp('{inviteId}', 'g'), inviteId);

            let payload: assoc = {};
            if (typeof userId !== 'undefined') {
                payload['userId'] = userId;
            }

            if (typeof secret !== 'undefined') {
                payload['secret'] = secret;
            }

            const uri = new URL(this.config.endpoint + path);
            return await this.call('patch', uri, new Headers(
                    {
                    'content-type': 'application/json',
                    }
                ), payload);
        }
    };

};
