# BioT mobile app

[![CircleCI](https://circleci.com/gh/B-IoT/mobile-app.svg?style=svg&circle-token=b35bec0e14f0006328c68b47829a5fa53efec6dc)](https://app.circleci.com/pipelines/github/B-IoT) [![codecov](https://codecov.io/gh/B-IoT/mobile-app/branch/main/graph/badge.svg?token=jI0TLUXYqG)](https://codecov.io/gh/B-IoT/mobile-app)

## Deployment

The app is automatically built and published (on Expo channels) by [CircleCI](https://app.circleci.com/pipelines/github/B-IoT/mobile-app).

## Project structure

### ./app directory

The inside of the src directory looks similar to the following:

```
app
│── components
│── i18n
├── models
├── navigators
├── screens
├── services
├── theme
├── utils
└── app.tsx
```

**components**
This is where the React components live. Each component has a directory containing the `.tsx` file, and optionally `.presets`, and `.props` files for larger components.

**i18n**
This is where the translations live for internalization.

**models**
This is where the app's models live. Each model has a directory which contains the `mobx-state-tree` model file, test file, and any other supporting files like actions, types, etc.

**navigators**
This is where the `react-navigation` navigators live.

**screens**
This is where the screen components lives. A screen is a React component which takes up the entire screen and is part of the navigation hierarchy. Each screen has have a directory containing the `.tsx` file, along with any assets or other helper files.

**services**
Any services that interface with the outside world live here (think REST APIs, Push Notifications, etc.).

**theme**
Here lives the theme for the application, including spacing, colors, and typography.

**utils**
This is a great place to put miscellaneous helpers and utilities. Things like date helpers, formatters, etc. are often found here. However, it should only be used for things that are truly shared across the application. If a helper or utility is only used by a specific component or model, consider co-locating your helper with that component or model.

**app.tsx** This is the entry point to the app. This is where you find the main App component which renders the rest of the application.

### ./ignite directory

The `ignite` directory stores all things Ignite, including CLI and boilerplate items. Here you find generators, plugins and examples to help you get started with React Native.

### ./test directory

This directory holds your Jest configs and mocks.

## Running e2e tests

Read [e2e setup instructions](./e2e/README.md).
