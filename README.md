# Mirahi/rn-template

This repo contains the template we use at [Mirahi](https;//mirahi.io) to start our React Native projects.
It is based on an [Nx](https://nx.dev) monorepo that can contain web and native applications sharing code code between each other.

## Getting started

### Create a new Nx workspace:

```sh
npx create-nx-workspace --cli=nx --preset=empty
```

### Install the plugin

```sh
# Using npm
npm install --save-dev @xorob0/rn-template@0.0.1

# Using yarn
yarn add -D @xorob0/rn-template@0.0.1
```
TODO: publish under `@mirahi`

### Create an app

To create a react native app use
```sh
npx nx g @xorob0/rn-template:app <app-name>
```
Of course you can still use 
```sh
nx generate @nrwl/react:app <app-name>
```
to create a react web application

### Start the JavaScript bundler

```sh
npx nx start <app-name>
```

This will start the bundler at `http://localhost:8081`.

### Run on devices

Make sure the bundler server is running.

**Android:**

```sh
npx nx run-android <app-name>
```

**iOS:** (Mac only)

```sh
npx nx run-ios <app-name> --install
```

Note: The `--install` flag installs Xcode dependencies before building the iOS app. This option keeps dependencies up to date.

### Release build

**Android:**

```sh
npx nx build-android <app-name>
```

**iOS:** (Mac only)

No CLI support yet. Run in the Xcode project. See: https://reactnative.dev/docs/running-on-device

### Test/lint the app

```sh
npx nx test <app-name>
npx nx lint <app-name>
```

## Using components from React library

You can use a component from React library generated using Nx package for React. Once you run:

```sh
npx nx g @xorob0/rn-template:lib ui
```

This will generate the `Ui` library, which you can use in your native app and your web app.

```jsx
import { Button } from '@myorg/ui/native';
```

```jsx
import { Button } from '@myorg/ui/web';
```

## CLI Commands and Options

Usage:

```sh
npx nx [command] [app] [...options]
```

### `start`

Starts the JS bundler that communicates with connected devices.

#### `--port [number]`

The port to listen on.

### `run-ios`

Builds your app and starts it on iOS simulator.

#### `--port [number]`

The port of the JS bundler.

#### `--install`

Install dependencies for the Xcode project before building iOS app.

#### `--sync`

Sync app dependencies to its `package.json`. On by default, use `--no-sync` to turn it off.

### `run-android`

Builds your app and starts it on iOS simulator.

#### `--port [number]`

The port of the JS bundler.

#### `--sync`

Sync app dependencies to its `package.json`. On by default, use `--no-sync` to turn it off.

### `sync-deps`

Sync app dependencies to its `package.json`.

#### `--include [string]`

A comma-separate list of additional packages to include.

e.g. `nx sync-deps [app] --include react-native-gesture,react-native-safe-area-context`


# References
This template is based on [`@nrwl/nx-react-native`](https://github.com/nrwl/nx-react-native)

Visit the [Nx Documentation](https://nx.dev) to learn more.
