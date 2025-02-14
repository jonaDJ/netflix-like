# Streaming platform(Netflix-like)

## Overview

This is a Netflix-like streaming platform (currently without login/auth) built using **Next.js** on the frontend and **Express.js** on the backend. The application allows users to browse movies, view details, and stream video content—all while providing a modern, responsive UI.

## Project Goals

- **Responsive Design:** Build a fully responsive user interface with a Netflix-inspired look and feel.
- **Feature-rich UI:** Implement features such as a carousel for featured movies, movie grids, hover effects, and smooth transitions.
- **Robust Streaming:** Stream video content using a custom VideoPlayer built with Video.js.
- **Modular Architecture:** Keep frontend and backend concerns separated for better maintainability and scalability.
- **Extensibility:** Prepare the codebase for future expansion (search, filtering, user ratings, etc.).

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Video.js
- **Backend:** Express.js, Node.js
- **Data Storage:** JSON file (`backend/data/movies.json`)- mainly focus on UI.
- **Testing:** Jest, React Testing Library, Supertest (for backend testing)

## Setup Instructions

### Prerequisites

- **Node.js** (version 14 or above)
- **npm** or **yarn**

### Backend Setup

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm start
   ```
4. The API is available at: http://localhost:5000/api/movies

### Frontend Setup

1. From the project root, install the dependencies:
   ```bash
   npm install
   ```
2. Create a .env.local file in the root directory and add your environment variables
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
4. The application will be available at: http://localhost:3000

## Additional Information

**Styling:** This project uses Tailwind CSS for styling. Global styles are located in src/styles/globals.css.
**Video Streaming:** Video playback is powered by Video.js in the src/components/VideoPlayer.tsx component.
**API:** All movie data is served from the Express backend via the /api/movies endpoints.

## License

This project is licensed under the MIT License.
