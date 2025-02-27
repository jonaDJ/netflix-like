# Netflix-like Streaming Platform 🎥

A Netflix-inspired streaming platform with a modern tech stack, featuring cross-browser compatibility, dynamic content from TMDB, and plans for collaboration features. Built with **Next.js (Tailwind CSS)** for the frontend and **Express + GraphQL** for the backend.

---

## Features ✨

### Frontend (Next.js + Tailwind CSS)
- **Watch Page**: Video playback with `react-player`.
- **Search Page**: Dynamic search functionality.
- **Sliders**: Responsive movie/TV show carousels.
- **Cross-Browser Support**: Optimized for Chrome, Firefox, Safari, and Edge.

### Backend (Express + GraphQL)
- **TMDB Integration**: Fetch movies/shows from TMDB API.
- **GraphQL API**: Efficient data querying for frontend.
- **Basic Database**: Storing user preferences (to be expanded).

### Future Plans 🚧
1. **User Authentication**: Firebase Auth or JWT-based login.
2. **Profiles**: Multi-user profiles with parental controls (Kid Version).
3. **Database Expansion**: Add MongoDB/Firestore for user data.
4. **Collaboration**: Watch parties with real-time sync (WebSocket/Socket.io).
5. **Advanced Queries**: Recommendations, watch history, and reviews.

---

## Installation ⚙️

### Prerequisites
- Node.js v18+
- TMDB API Key (register at [TMDB](https://www.themoviedb.org/))
- Firebase Account (optional, for future auth/storage)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/netflix-like.git
   cd netflix-like
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Set up environment variables:
   - **Frontend**: Create `.env.local` in the root:
     ```env
     NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key
     NEXT_PUBLIC_GRAPHQL_API_URL=http://localhost:5000/graphql
     ```
   - **Backend**: Create `.env` in the `backend` folder:
     ```env
     PORT=5000
     TMDB_API_KEY=your_tmdb_key
     TMDB_BASE_URL=https://api.themoviedb.org/3
     ```

5. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

6. Start the frontend (in a new terminal):
   ```bash
   cd ..
   npm run dev
   ```

7. Open `http://localhost:3000` in your browser.

---

## Tech Stack 🔧

| **Frontend**       | **Backend**         | **Tools**              |
|---------------------|---------------------|------------------------|
| Next.js (React)     | Express.js          | Git + GitHub           |
| Tailwind CSS        | GraphQL             | Firebase               |
| Apollo Client       | TMDB API            | Postman (API Testing)  |
| react-player        | Axios               | ESLint/Prettier        |

---

## FAQ ❓

**Q: How do I add a new GraphQL query?**  
A: Update the backend schema in `backend/src/schemas` and write resolvers in `backend/src/resolvers`.


---

## License 📄

MIT License. See `LICENSE` for details.

---
