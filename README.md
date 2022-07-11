# CASMI

**Cloud Agnostic Storage Management Interface (CASMI)**

CASMI is a NodeJS solution that enables cloud-agnostic file management. The CASMI server provides access-controlled APIs to interact with file storage services of different cloud providers. It currently supports Amazon S3, Google Cloud Storage, and Azure Blob Storage.

![CASMI architecture](./architecture.png "CASMI architecture")

<br/>

## Dependencies

-   .env
-   firebase.config.js

# Setup

### NodeJS

Developed and tested with - [v16.16.0](https://nodejs.org/dist/v16.16.0/docs/api/)

Steps:

1. Clone repository
2. Place dependent **.env** and **firebase.config.js** in the project root directory
3. Change directory to project root
4. Install node package dependencies using : `npm install`
5. Run node server : `npm start`

### Docker

```
docker run -d \
-p 80:8000 \
-v /path/to/firebase.config.js:/app/firebase.config.js \
-v /path/to/uploads:/app/uploads \
--env-file /path/to/.env \
--name casmi-server \
sureshrahul/casmi:<tag>
```

### Docker Compose

```
version: "3.1"
services:
    casmi-server:
        image: sureshrahul/casmi:<tag>
        container_name: casmi-server
        ports:
            - 80:8000
        volumes:
            - /path/to/firebase.config.js:/app/firebase.config.js
            - /path/to/.env:/app/.env
            - /path/to/uploads:/app/uploads
```
