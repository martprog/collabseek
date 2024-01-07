# Collabseek

## About

I have a background in music and I know how difficult it may be to be noticed and therefore being able to get a job. This app tries to help in that regard
providing a network of available musicians: each user can navigate through the site but must be logged in in order to interact with other artists.
If the user wishes to appear available for the community, they must create a page artist.

## Features

-   Free navigation through the page, but registration needed for interaction
-   User can provide and/or update information about themselves
-   User can provide new tags, add existing tags to their profile or remove them
-   Each accesed profile page show similar artists and links to them
-   Star rating system
-   Possibilty to add/remove from/to favorites
-   Notifications for new incoming messages with every login

## Cloning and Running the Project with Docker

### Prerequisites

-   [Docker](https://www.docker.com/get-started) installed on your machine.

### Clone the Repository

```bash
git clone https://github.com/martprog/collabseek.git
cd collabseek
```

### Running with Docker

-   For Windows users:

    -   Open a PowerShell or Command Prompt as an administrator and navigate to the project directory.

    ```bash
        docker-compose up -d
    ```

-   For other operating systems:

    ```bash
        docker-compose up -d
    ```

### Why Docker?

The reason for choosing Docker is to make the Collabseek app available without a lot of overhead. The Express app relies on a PostgreSQL database and uses AWS S3 for storage of profile images. Docker simplifies the deployment by packaging the app and its dependencies into containers. Specifically, a PostgreSQL server is included in the Docker setup, eliminating the need for users to install their own PostgreSQL server. Additionally, for AWS S3 functionality, a mock-up service, MINIO, is used to simulate AWS S3 without the need for AWS credentials (Because of this, feautures involving S3 may not be 100% functional).

### Usage

-   Access the Collabseek app through your web browser.
-   Navigate freely through the pages, but make sure to register to interact with other artists.
-   Create an artist page to appear available for the community.

## Worktools

<span><img src="https://img.shields.io/badge/React.js-black?style=flat-square&logo=react"></span>
<span><img src="https://img.shields.io/badge/Express-lightgrey?style=flat-square&logo=express"></span>
<span><img src="https://img.shields.io/badge/Node.js-green?style=flat-square&logo=nodedotjs"></span>
<span><img src="https://img.shields.io/badge/JavaScript-yellow?style=flat-square&logo=javascript&logoColor=white"></span>
<span><img src="https://img.shields.io/badge/-socket.io-black?style=flat-square&logo=socketdotio"></span>
<span><img src="https://img.shields.io/badge/PostgreSQL-9cf?style=flat-square&logo=postgresql"></span>
<span><img src="https://img.shields.io/badge/S3-important?style=flat-square&logo=amazons3&logoColor=white"></span>

## Preview

### Login and layout

![collabseek-login](https://user-images.githubusercontent.com/98027815/172364954-acaced00-49fa-4a93-b5d2-78d39c55d7ff.gif)

### Add/remove tags

![tag-edit](https://user-images.githubusercontent.com/98027815/172365951-323d1d36-8a1f-4246-b537-84049414c3ce.gif)
