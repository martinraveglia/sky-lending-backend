# [Please read this section to properly run the application](#about-environmental-variables)

<br />

<div align="center">
  <h3 align="center">SkyLending Server</h3>
  <p align="center">
    Welcome to the Sky Lending Server codebase.
  </p>
</div>

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#potential-improvements-to-the-application">Improvements to the Application</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#about-environmental-variables">Environmental Variables</a></li>
        <li><a href="#about-admin-accounts">Admin Accounts</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#api-documentation">API Documentation</a>
      <ul>
        <li><a href="#authentication-endpoints">Authentication Endpoints</a></li>
        <li><a href="#user-endpoints">User Endpoints</a></li>
      </ul>
    </li>
  </ol>
</details>

## About The Project

This project is a backend User managing tool, integrating with a MongoDB database and adding proper validations and testing to each endpoint developed. Authentication is solved as well, having protected routes for any role related action. Available roles are `admin` and `user`, admin accounts cannot be created through the application logic, those are created directly on the database.

Users have the capability to create an account, logIn, update and retrieve their personal information. Admins, in the other hand, have the capability to retrieve information on every user in the database.

Six different endpoints had been developed:

- [`POST /api/auth/sign-up`](#sign-up) - Create new user accounts
- [`POST /api/auth/log-in`](#log-in) - Log in both users and admins
- [`GET /api/user`](#show-all-users) - Retrieve all users information (admin only)
- [`GET /api/user/personal-information`](#show-current-user-information) - Retrieve own user information (user only)
- [`POST /api/user/personal-information`](#create-current-user-information) - Add personal information to user account (user only)
- [`PATCH /api/user/personal-information`](#update-current-user-information) - Update personal information of user account (user only)

### Built With

This repository was made using the following technology stack:

- NodeJS
- ExpressJS
- Typescript
- ESLint w/Prettier
- MongoDB w/Mongoose
- Jest w/SuperTest
- YUP
- Husky w/LintStaged
- JWT

## Potential Improvements to the application

- **Swagger** - Adding Swagger would help on documenting the API being this documentation reviewable on PRs, therefore making the documentation an easy to review requirement of new endpoints.
- **Winston Logger** - Adding a logging system capable of transporting the logs to a third-party service (as MongoDB or CloudWatch) is a great addition for debugging and keeping track of application behavior.
- **API Rate Limit** - Limiting requests by IP is a good start point to secure the application from attacks and limiting CPU usage.
- **Firebase Authentication** - Adding a third-party authentication service might improve application security robustness and improve developing effort as features like Social LogIn and refresh tokens are already solved.

## Getting Started

### About environmental variables

In order to be able to run this application, a healthy `.env` file is needed. To the purpose of this demonstration, a `.env.example` file is loaded into this repo with every key needed to run the application, just rename the file from `.env.example` to `.env`.

Take in mind that, in a real project, this is far from being a good practice. Instead, a tool as [git-secret](https://sobolevn.me/git-secret/) can be used to store encrypted env variables on the codebase.

### About Admin Accounts

Admin accounts can not be created through an endpoint, those are created modifying directly the database. An already created admin account is,

```json
{
  "username": "admin",
  "password": "Admin1234"
}
```

### Installation

Use the package manager [yarn](https://yarnpkg.com/) to install SkyLending Server.

1. Clone the repo
   ```
   git clone https://github.com/martinraveglia/sky-lending-backend.git
   ```
2. Install NPM packages
   ```
   yarn install
   ```

---

### Run with Docker

This project can be started using docker, as a docker image is properly configured. In order to do so follow these steps,

1. Be sure to have [Docker](https://docs.docker.com/desktop/install/mac-install/) installed
2. In a terminal, move to the project root folder
3. Build the docker image
   ```
   docker build . -t <docker-image-tag>
   ```
4. Run the docker image
   ```
   docker run -p 4000:4000 -d <docker-image-tag>
   ```
   Take in mind that `<docker-image-tag>` can be any name of your choose, e.g. `sky-lending-server`

## API Documentation

Protected endpoints expect a bearer token on the authorization header of the request. If the access token retrieved from an authentication endpoint is ${ACCESS_TOKEN}, the authorization header for protected routes should be,

```json
{
  "Authorization": "Bearer ${ACCESS_TOKEN}"
}
```

### Authentication Endpoints

- [Sign Up](#sign-up) - `POST /api/auth/sign-up`
- [Log In](#log-in) - `POST /api/auth/log-in`

---

### Sign Up

Used to create a new user.

**URL** : `/api/auth/sign-up`

**Method** : `POST`

**Auth required** : NO

**Payload Example**

```json
{
  "username": "username1234",
  "password": "Password1234"
}
```

**Data constraints**
| Keys | Constraints |
|----------|--------------------------------------------------------------------|
| username | Required |
| | Minimum 2 characters |
| | Maximum 30 characters |
| password | Required |
| | Minimum 8 characters |
| | Maximum 50 characters |
| | At least one lowercase letter, one uppercase letter and one number |

**Response Example**

```json
{
  "token": "ACCESS_TOKEN"
}
```

---

### Log In

Used to log in a registered user, collecting a token.

**URL** : `/api/auth/log-in`

**Method** : `POST`

**Auth required** : NO

**Payload Example**

```json
{
  "username": "username1234",
  "password": "Password1234"
}
```

**Data constraints**
| Keys | Constraints |
|----------|--------------------------------------------------------------------|
| username | Required |
| | Unique |
| | Minimum 2 characters |
| | Maximum 30 characters |
| password | Required |
| | Minimum 8 characters |
| | Maximum 50 characters |
| | At least one lowercase letter, one uppercase letter and one number |

**Response Example**

```json
{
  "token": "ACCESS_TOKEN",
  "userCreated": "false"
}
```

userCreated can be `false` or an `ObjectId`,

- if the user has already added their personal information an id to the personal information document is returned
- if the user has not added their personal information yet, false is returned

---

### User Endpoints

- [Show All Users](#show-all-users) - `GET /api/user`
- [Show Current User Information](#show-current-user-information) - `GET /api/user/personal-information`
- [Create Current User Information](#create-current-user-information) - `POST /api/user/personal-information`
- [Update Current User Information](#update-current-user-information) - `PATCH /api/user/personal-information`

---

### Show All Users

Show all User accounts in the database.

**URL** : `/api/user/`

**Method** : `GET`

**Auth required** : YES

**Role required** : `ADMIN`

**Response Example**

```json
[
  {
    "username": "john123",
    "firstName": "John",
    "lastName": "Doe",
    "SSN": 123456789,
    "phone": "+543413491237",
    "DoB": "1995-03-02T03:00:00.000Z"
  }
]
```

---

### Show Current User Information

Show information of the currently Authenticated User.

**URL** : `/api/user/personal-information`

**Method** : `GET`

**Auth required** : YES

**Role required** : `USER`

**Response Example**

```json
{
  "username": "john123",
  "firstName": "John",
  "lastName": "Doe",
  "SSN": 123456789,
  "phone": "+543413491237",
  "DoB": "1995-03-02T03:00:00.000Z"
}
```

---

### Create Current User Information

Add personal information of the Currently Authenticated User.

**URL** : `/api/user/personal-information`

**Method** : `POST`

**Auth required** : YES

**Role required** : `USER`

**Payload Example**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "DoB": "03/02/1995",
  "phone": "+543413491237",
  "SSN": "123456789"
}
```

**Data constraints**
| Keys | Constraints |
|-----------|--------------------------------|
| firstName | Required |
| | Minimum 2 characters |
| | Maximum 30 characters |
| lastName | Required |
| | Minimum 2 characters |
| | Maximum 30 characters |
| phone | Required |
| | Unique |
| | Starts with + |
| | Total length between 12 and 14 |
| | Phone verified with Numverify API |
| SSN | Required |
| | Unique |
| | 9 digits |
| DoB | Required |
| | Format "mm/dd/yyyy" |
| | Before today |

**Response Example**

```json
{
  "message": "SUCCESS"
}
```

---

### Update Current User Information

Update personal information of the Currently Authenticated User.

**URL** : `/api/user/personal-information`

**Method** : `PATCH`

**Auth required** : YES

**Role required** : `USER`

**Payload Example**

```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```

**Data constraints**
| Keys | Constraints |
|-----------|--------------------------------|
| firstName | Minimum 2 characters |
| | Maximum 30 characters |
| lastName | Minimum 2 characters |
| | Maximum 30 characters |
| phone | Unique |
| | Starts with + |
| | Total length between 12 and 14 |
| | Phone verified with Numverify API |
| SSN | Unique |
| | 9 digits |
| DoB | Format "mm/dd/yyyy" |
| | Before today |

**Response Example**

```json
{
  "message": "SUCCESS"
}
```

<p align="right"><a href="#please-read-this-section-to-properly-run-the-application">🔼 Back to top</a></p>
