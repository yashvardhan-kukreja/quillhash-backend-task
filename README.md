[![Build Status](https://travis-ci.com/yashvardhan-kukreja/quillhash-backend-task.svg?token=xkGWiw62FsqB4JqveXu3&branch=master)](https://travis-ci.com/yashvardhan-kukreja/quillhash-backend-task)
# QuillHash Technologies - Backend Task
## Introduction: 
Developed Server Side Code for a basic dating app<br>
### Tech stack used:
 - **Server-Side Runtime Environment** - NodeJS
 - **Server-Side Framework** - ExpressJS 
 - **Database** - MongoDB
 - **Testing** - chai framework, travis
 - **DevOps** - Docker (containerization)
 - **Deployment** - AWS EC2 and Heroku
-------
## Base URLs (Deployed on AWS and Heroku)
  - **AWS URL** - http://ec2-34-207-165-245.compute-1.amazonaws.com/
  - **Heroku URL** - https://quillhash-dating.herokuapp.com/
------

## Running the app:
Two ways to run the app (https://localhost:8000/)
- ```docker-compose up --build``` -> **Preferred**
- Go to .env file and **NODE_ENV=production**<br>
  ``` npm install ```<br>
  ``` npm start ```
-------
## Running the test suite:
Two ways to run the test suite
 - ```docker-compose -f docker-compose-dev.yml up --build``` -> **Preferred**
 - Go to .env file and **NODE_ENV=test**<br>
   ```npm install```<br>
   ```npm test``` 
## API Endpoints:
### Authentication routes:
 - Register a user<br>
 ```POST /auth/register - body(name, email, contact, password)```
 
 - Login<br>
 ```POST /auth/login - body(email, password)```
 
 ### User routes:
  - Fetch my profile details<br>
  ``` GET /profile/me - header("x-access-token": <jwt token received after login>)```
  
  - Fetch other user's profile details if not blocked<br>
  ```GET /profile?id=<user_id_1212> - query("id": <id of the required user >)header("x-access-token": <jwt token received after login>)```
  
  - Block a user<br>
  ```PUT /block - body(id: <user_id of the user to be blocked>) - header("x-access-token": <jwt token received after login>)```
  
  - Unblock a user<br>
  ```PUT /unblock - body(id: <user_id of the user to be unblocked>) - header("x-access-token": <jwt token received after login>)```
  
  - Post an image for my profile (Content-Type: null)<br>
  ```PUT /image - file(image: <image to be uploaded>) - header("Content-Type": null, "x-access-token": <jwt token received after login>)```
  
  - Like an image (normal or super like)<br>
  ```PUT /image/like - body(image_id: <id of the image to be liked>, like_type: <normal or super>) - header("x-access-token": <jwt token received after login>)```
--------
Screenshots depicting manual route testing on POSTman, and AWS terminal in the "screenshots" folder
