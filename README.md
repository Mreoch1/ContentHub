# ContentHub

ContentHub is a full-stack web application that aggregates content from YouTube and Reddit, allowing users to search, save, and manage their favorite content in one place.

## Features

- User authentication (register, login, logout)
- Combined YouTube video and Reddit thread search
- Infinite scrolling for search results
- Save and manage favorite content
- Dark mode toggle
- Responsive design with a cyberpunk-inspired UI
- Recent searches display

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express.js
- Database: MongoDB
- Authentication: JSON Web Tokens (JWT)

## Deployment

This application is deployed using the following free services:

1. Frontend: Netlify
2. Backend: Render
3. Database: MongoDB Atlas

### Deployment Instructions

1. Frontend (Netlify):
   - Fork this repository
   - Sign up for a Netlify account
   - Connect your GitHub account to Netlify
   - Create a new site from Git in Netlify, selecting the forked repository
   - Set build command to `cd frontend && npm install && npm run build`
   - Set publish directory to `frontend/build`
   - Add environment variables in Netlify (REACT_APP_API_BASE_URL)

2. Backend (Render):
   - Sign up for a Render account
   - Create a new Web Service in Render
   - Connect your GitHub repository
   - Set build command to `npm install`
   - Set start command to `npm start`
   - Add environment variables in Render (PORT, MONGO_URI, JWT_SECRET, YOUTUBE_API_KEY)

3. Database (MongoDB Atlas):
   - Sign up for a MongoDB Atlas account
   - Create a new cluster (free tier)
   - Set up database access and network access
   - Obtain the connection string and use it as MONGO_URI in your backend environment variables

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```
3. Set up environment variables (create a .env file in the root and frontend directories)
4. Run the development server:
   ```bash
   npm run dev
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
