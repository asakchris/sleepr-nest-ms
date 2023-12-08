## Description

Sleepr - API based application using Nest JS microservices.

## Installation

```bash
pnpm install
```

## How to start

### `.env` file

You need a `.env` file in the root directory of each module before starting the project.
Check the `.env.sample` file to know what to put in it.

### Create Stripe

Create an account in [Stripe](https://dashboard.stripe.com/) and get the API key. Add it in the `payments` module `.env` file.

### Create Google Auth Token
- Go to https://console.cloud.google.com/
  - Create new project
  - Select newly created project and go to APIs & Services
  - Go to OAuth consent screen tab
    - Select external and create new App
  - Go to Credentials tab
    - Create Credntials -> OAuth client ID
    - Application type: Web application
    - Authorized redirect uri: https://developers.google.com/oauthplayground
    - Now get the client id & secret and add it in `notification` module `.env` file
  - Go to https://developers.google.com/oauthplayground
    - Settings -> OAuth 2.0 configuration
      - Select Use your own OAuth credentials and copy the client id & secret created from previous step
    - Select Gmail API v1
      - Select https://mail.google.com/
      - Click Authorize APIs
      - Follow the steps to create refresh token

## Running the app

```bash
# development
pnpm run start <app_name>

# watch mode
pnpm run start:dev <app_name>

# production mode
pnpm run start:prod <app_name>
```

## Running all modules

```
pnpm run start:dev reservations
pnpm run start:dev auth
pnpm run start:dev payments
pnpm run start:dev notifications
```

## Test

```bash
# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# test coverage
pnpm run test:cov
```

## Nest CLI

```
nest new sleepr

nest generate library common
nest generate module database -p common
nest generate module config -p common

nest g app reservations
nest g resource reservations

nest g module logger

nest g app auth
nest g module users
nest g controller users
nest g service users

nest g app payments

nest g app notifications
```
