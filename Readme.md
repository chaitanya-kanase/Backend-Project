# Playora — Video Platform Backend

Playora is a RESTful backend for a video-sharing platform built using **Node.js, Express.js, and MongoDB**.

It provides backend functionality for user authentication, video management, comments, likes, tweets, subscriptions, playlists, and channel statistics.

The project follows a modular backend architecture with separate routes, controllers, models, middleware, and reusable utilities.

## Features

### 1. User Authentication
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected routes

### 2. Video Management
- Create and manage videos
- Fetch video details
- Update and delete videos
- Retrieve channel videos
- Paginated video retrieval

### 3. Comments
- Add comments to videos
- Update and delete comments
- Retrieve video comments

### 4. Likes
- Toggle likes on videos
- Toggle likes on comments
- Toggle likes on tweets
- Retrieve liked videos

### 5. Tweets
- Create tweets
- Update tweets
- Delete tweets
- Retrieve tweets
- Like and unlike tweets

### 6. Subscriptions
- Subscribe to channels
- Manage subscriptions
- Retrieve channel subscribers
- Retrieve subscribed channels

### 7. Playlists
- Create playlists
- Add videos to playlists
- Remove videos from playlists
- Retrieve user playlists
- Update and delete playlists

### 8. Channel Dashboard
- Total uploaded videos
- Total video views
- Total subscribers
- Total likes received on videos

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| JWT | Authentication |
| bcrypt | Password hashing |
| JavaScript | Backend development |

## Project Architecture

```text
PLAYORA-BACKEND/
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   ├── utils/
│   ├── db/
│   │
│   ├── app.js
│   ├── constants.js
│   └── index.js
│
├── public/
│
├── .env.sample
├── .prettierrc
├── .gitignore
├── package.json
└── README.md
```

*The structure is illustrative. Adjust directory names if your actual repository differs.*

### Main Application Files

- **app.js:** Configures the Express application, middleware, and API routes.
- **constants.js:** Stores reusable project constants.
- **index.js:** Application entry point, responsible for initializing the server and database connection.

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the project

```bash
cd PLAYORA-BACKEND
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file using the provided `.env.sample` as a reference.

```bash
cp .env.sample .env
```

Configure the required values in your `.env` file, including database connection details, authentication secrets, and other application settings.

**Never commit your actual `.env` file or expose your secret keys.**

### 5. Run the development server

```bash
npm run dev
```

Check `package.json` for the exact available scripts.

## API Modules

The application organizes API functionality into separate route and controller modules:

- User
- Video
- Comment
- Like
- Tweet
- Subscription
- Playlist
- Dashboard

## Development Practices

- Modular project structure
- Reusable middleware and utility functions
- JWT-based authentication
- Password hashing
- RESTful API design
- MongoDB data modeling
- Code formatting using Prettier

## Future Improvements

- Automated API testing
- Request validation
- Docker containerization
- Cloud deployment
- Logging and monitoring
- CI/CD integration
- Database query optimization

## Author

**Chaitanya Dipak Kanase**

Computer Science and Engineering Student

## License

This project is available for educational and portfolio purposes. Add an open-source license if you intend to distribute it under specific license terms.