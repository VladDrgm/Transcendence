# Transcendence
Final project for 42 Wolfsburg.


To run this, follow these steps:

* To run it without Docker:
    1) make sure you have npm installed; If npm is not installed, install it on your machine;
        * you can find details at https://www.npmjs.com/
  
    2) install nest js; You can do this by running the command: 
          ``` npm install -g npm@latest```

    3) go into the backend folder and type:
          ``` npm build  && npm start ```
          
    4) you can go to the url indicated in the terminal by the application and check the results; At this point, a simple 'Hello, world!'should be displayed.

* Or make sure you have both Docker and Make installed on your machine; (https://www.docker.com/ ;  https://www.gnu.org/software/make/ )
    1) go to the root folder and type 'make'

______________________________________________________________

Backend: the get users endpoint is in the app.controller.ts (data can be seen: http://localhost:3000/api/users)
Frontend:
in userApi -> fetching users from backend url
in components -> userList component to render all the mock users and their data
