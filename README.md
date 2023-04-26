# Transcendence

Transcendence is the final project for 42 Wolfsburg, a full-stack web application that consists of a frontend and a backend.

## Project Description

Transcendence is a web application that allows users to create and manage their own profiles, connect with other users, and play a multiplayer game together. The project is built using Node.js, React, and TypeScript.

## Installation and Usage

To run this project, follow these steps:

1. Make sure you have both Docker and Make installed on your machine. You can download Docker from the official website (`https://www.docker.com/`) and Make from the GNU website (`https://www.gnu.org/software/make/`). Also, make sure you have `npm` installed (`https://nodejs.org/en/download/`).
2. Go to the root folder and type `make`.
3. To run with Docker, choose `y` (this will simulate an eval). Alternatively, to run locally both the frontend and the backend, choose `n` (for local development).
4. If you wish to run either the frontend or the backend without the other one running:
   1. Go to each root folder and type `npm install` to make sure you have all the required libraries installed. You only need to do this once.
   2. Run `npm start`.

## Backend

The backend of Transcendence includes a "get users" endpoint, which can be found in the `app.controller.ts` file. To view the user data, go to `http://localhost:3000/api/users`.

## Frontend

The frontend of Transcendence includes a user API that fetches users from the backend URL. The user data is then rendered using the `userList` component in the `components` folder.

## Additional Notes

Please note that this project was developed as a final project for 42 Wolfsburg and is intended for educational purposes only.