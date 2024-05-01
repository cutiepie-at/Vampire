export default {
  server: {
    host: 'localhost',
    port: 3000,
    baseUrl: 'http://localhost:3000/',
    features: {
      auth: {
        enable: true,
        register: true, // allow users to register themselves
      },
    },
    session: { // see https://expressjs.com/en/resources/middleware/session.html
      secret: 'insert some random generated string in here',

      /**
       * The name of the session ID cookie to set in the response (and read from in the request).
       * The default value is 'connect.sid'.
       *
       * Note if you have multiple apps running on the same hostname (this is just the name, i.e. `localhost` or `127.0.0.1`; different schemes and ports do not name a different hostname),
       *   then you need to separate the session cookies from each other.
       * The simplest method is to simply set different names per app.
       */
      name: 'sid', // values: string | undefined;

      // Cookie settings
      cookie: {
        /**
         * Specifies the number (in milliseconds) to use when calculating the `Expires Set-Cookie` attribute.
         * This is done by taking the current server time and adding `maxAge` milliseconds to the value to calculate an `Expires` datetime. By default, no maximum age is set.
         */
        maxAge: 15 * 60 * 1000, // values: number | undefined

        /**
         * Specifies the value for the `Path Set-Cookie` attribute.
         * By default, this is set to '/', which is the root path of the domain.
         */
        path: '/', // values: string | undefined;

        /**
         * Specifies the value for the `Domain Set-Cookie` attribute.
         * By default, no domain is set, and most clients will consider the cookie to apply to only the current domain.
         */
        domain: undefined, // values: string | undefined;

        /**
         * Specifies the boolean value for the `Secure Set-Cookie` attribute. When truthy, the `Secure` attribute is set, otherwise it is not. By default, the `Secure` attribute is not set.
         * Be careful when setting this to true, as compliant clients will not send the cookie back to the server in the future if the browser does not have an HTTPS connection.
         *
         * Please note that `secure: true` is a **recommended option**.
         * However, it requires an https-enabled website, i.e., HTTPS is necessary for secure cookies.
         * If `secure` is set, and you access your site over HTTP, **the cookie will not be set**.
         *
         * The cookie.secure option can also be set to the special value `auto` to have this setting automatically match the determined security of the connection.
         * Be careful when using this setting if the site is available both as HTTP and HTTPS, as once the cookie is set on HTTPS, it will no longer be visible over HTTP.
         * This is useful when the Express "trust proxy" setting is properly setup to simplify development vs production configuration.
         *
         * If you have your node.js behind a proxy and are using `secure: true`, you need to set "trust proxy" in express. Please see the [README](https://github.com/expressjs/session) for details.
         *
         * Please see the [README](https://github.com/expressjs/session) for an example of using secure cookies in production, but allowing for testing in development based on NODE_ENV.
         */
        secure: false, // TL;DR set to true if site is served via TLS, values: boolean | 'auto' | undefined;

        /**
         * Specifies the boolean or string to be the value for the `SameSite Set-Cookie` attribute.
         * - `true` will set the `SameSite` attribute to `Strict` for strict same site enforcement.
         * - `false` will not set the `SameSite` attribute.
         * - `lax` will set the `SameSite` attribute to `Lax` for lax same site enforcement.
         * - `none` will set the `SameSite` attribute to `None` for an explicit cross-site cookie.
         * - `strict` will set the `SameSite` attribute to `Strict` for strict same site enforcement.
         *
         * More information about the different enforcement levels can be found in the specification.
         *
         * **Note:** This is an attribute that has not yet been fully standardized, and may change in the future.
         * This also means many clients may ignore this attribute until they understand it.
         */
        sameSite: 'strict', // values: boolean | 'lax' | 'strict' | 'none' | undefined;
      },

      /**
       * Force the session identifier cookie to be set on every response. The expiration is reset to the original `maxAge`, resetting the expiration countdown.
       * The default value is `false`.
       *
       * With this enabled, the session identifier cookie will expire in `maxAge` *since the last response was sent* instead of in `maxAge` *since the session was last modified by the server*.
       * This is typically used in conjuction with short, non-session-length `maxAge` values to provide a quick timeout of the session data
       *   with reduced potential of it occurring during on going server interactions.
       *
       * Note that when this option is set to `true` but the `saveUninitialized` option is set to `false`, the cookie will not be set on a response with an uninitialized session.
       * This option only modifies the behavior when an existing session was loaded for the request.
       */
      rolling: true, // TL;DR re-set cookie on every request, values: true | false

      /**
       * Trust the reverse proxy when setting secure cookies (via the "X-Forwarded-Proto" header).
       * The default value is undefined.
       *
       * - `true`: The `X-Forwarded-Proto` header will be used.
       * - `false`: All headers are ignored and the connection is considered secure only if there is a direct TLS/SSL connection.
       * - `undefined`: Uses the "trust proxy" setting from express
       */
      proxy: false, // TL;DR trust the reverse proxy (TLS stripping), values: true | false | undefined
    },
  },
  database: {
    use: 'mysql2', // which of the config sections should be used for db connections
    mysql2: { // see knex config
      client: 'mysql2',
      connection: {
        host: 'localhost',
        port: 3306,
        database: 'vampire',
        user: 'user',
        password: 'password',
      },
      pool: {
        min: 2,
        max: 10,
      },
    },
    sqlite: { // see knex config
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: './vampire.db',
      },
    },
  },
};