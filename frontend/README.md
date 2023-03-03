# Reddit Clone

## Overview
This project is a clone of the popular social media platform Reddit. Users can create an account, submit posts, and upvote or downvote content.

## Architecture
The application is built using a microservices architecture. The main components are:

- **Frontend**: Built using React and Recoil for state management. Communicates with the backend through RESTful APIs.
- **Backend**: Consists of several microservices built using firebase. Each microservice is responsible for a specific functionality such as authentication, post management, and voting.
- **Database**: Firebase is used as the primary database to store user information and post data.

## Setup
To run the application locally:
1. Clone this repository
2. Install dependencies: `npm install`
3. Start the frontend: `npm start`
4. Start each microservice individually: `node server.js`

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

