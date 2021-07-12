# fampay-be-service

The API server runs on the PORT 3000

# Code Structure

The entire codebase has 4 main parts i.e. controllers, models, repositories, services

controller is responsible for busness logic
models contains the Collection
repository is responsible to do the DB level operation
services are the providers which can be inject into any controller

# Framework

Loopback 4

# Database

MongoDB - main database to save the record
ElasticSearch - used to for searching

# Dependencies

To start the application, .env file is required which is not available within the codebase for security concerns.

# Prerequisite
Docker is needed to the start entire project. Please make sure docker is running in the system and 3000 port is free to use.

# Project building

Once docker is up, in the bash terminal please run `bash start.sh` to start the application and once the build is fininshed please open `http://localhost:3000`.

# Swagger Documentation

Open `http://localhost:3000/explorer` to read the swagger documentation

# Assumption

if there is no seeding data, system is desinged in such a was it'll fetch the results for last one hour
A cron job is added which run every 30 seconds to fetch latest data
search query can be set usisng the .env file dfault is `football`

# Limitations
once the API key is exhausted, job will fail

# Improvements
Support for multiple API keys
Job can be deployed as a K8s cron job, so that auto scaling can be done for the deployment.
