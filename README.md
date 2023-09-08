# Transcendence

Transcendence is the final project for 42 Wolfsburg, a full-stack web application that consists of a frontend and a backend.

## Project Description

Transcendence is a web application that allows users to create and manage their own profiles, connect with other users, and play a multiplayer game together. The project is built using Node.js, React, and TypeScript.

## Installation and Usage

To run this project, follow these steps:

1. Make sure you have both Docker and Make installed on your machine. You can download Docker from the official website (`https://www.docker.com/`) and Make from the GNU website (`https://www.gnu.org/software/make/`). Also, make sure you have `npm` installed (`https://nodejs.org/en/download/`).
2. Go to the root folder and type `make`.
3. To run with Docker, choose `y` (this will simulate an eval). Alternatively, to run locally both the frontend and the backend, choose `n` (for local development). This will run 'npm install' for both backend and also frontend.
4. Go to either pong_backend or pong_frontend and run 'npm start' for local instances of either or both frontend and backend.

## Backend

The backend of Transcendence has Swagger installed in order to test the REST API.  To view the methods or test them, go to `http://localhost:3000/api/` and check whichever method you wish.

## Frontend

The frontend of Transcendence includes a user API that fetches users from the backend URL. The user data is then rendered in the UI. From the /api/ directory, where we have the results of our APIs from the backend, we move forward and render them in components.
Deployed using Vercel: <https://transcendence-one.vercel.app/app>

## Additional Notes

Please note that this project was developed as a final project for 42 Wolfsburg and is intended for educational purposes only.
