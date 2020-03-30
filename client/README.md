# Project Skeleton Client

The client was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) (CRA) and includes all of capabilities provided by CRA. Some built-in functionality of that skeleton was stripped out, specifically the [offline caching](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app).

## Setup

You should install the dependencies via `npm install` in this directory (or `npm install --prefix client` from the "top-level" directory).

The development server will attempt to proxy API requests to the server specified in the `package.json` "proxy" field. The application has been configured to proxy requests to the associated server at http://localhost:3001.

## Development

### Testing

The tests use both Jest and Enzyme has described in the [CRA documentation](https://facebook.github.io/create-react-app/docs/running-tests).

For reference Enzyme was installed with:

```
npm install --save-dev enzyme enzyme-adapter-react-16 react-test-renderer
```

### Linting

You can run the linter with `npm run lint` or `npx eslint src`.

For reference the ESLint configuration is customized according to CRA [recommendations](https://create-react-app.dev/docs/setting-up-your-editor#experimental-extending-the-eslint-config) (note that is a experimental feature).  We installed the Prettier ESlint configuration to prevent conflicts with that tool via

```
npm install --save-dev eslint-config-prettier
```

and updated the `"eslintConfig"` field in `package.json`.

### Managing Secrets

Note that CRA [manages secrets](https://create-react-app.dev/docs/adding-custom-environment-variables#adding-development-environment-variables-in-env) in a more complicated manner (than generally, and used in the server). In short environment variables that are not secrets, e.g. configuration parameters, should be placed in the `.env` file, *which is checked in to version control*, and secrets should be placed in `.env.local`, *which is not checked in to version control*. If your secrets are needed by your tests, you will need to [add them to your repository in Travis-CI](https://docs.travis-ci.com/user/environment-variables/).