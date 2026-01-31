🎸 Tab Tracker

Tab Tracker is a full-stack web application for guitar players that helps you store, organize, practice, and track progress on your favorite guitar tabs — all in one place.

The app is built with a Vue.js frontend and a Node.js / Express backend, with authentication and user-owned content.

## 🌐 Live Demo
Frontend (GitHub Pages):  
👉 https://vaninadzhuteva.github.io/tab-tracker/

✨ Features
🔐 Authentication

 - User registration & login

 - JWT-based authentication

 - Protected routes

 - Each user sees only their own songs

🎵 Songs Management

 - Create, edit, delete songs

 - Each song belongs to a logged-in user

 - Fields include:

 - Title

 - Artist

 - Tab content

 - Difficulty level (Beginner / Intermediate / Advanced)

 - Tags / genres

 - Favorite flag ⭐

 - Practice progress

 - Last practiced date

📄 PDF Tabs

 - Upload PDF tabs

 - Preview PDFs inline

 - Open PDFs in a new tab

⭐ Favorites & Practice

 - Mark songs as favorites

 - Track practice progress

 - “Practice now” action updates last practiced date

Filter & sort songs by:

 - Favorites

 - Difficulty

 - Tags

 - Recently practiced

👤 Profile Page

 - View user information

 - See personal song statistics

 - Quick overview of owned songs

🚀 Getting Started

1️⃣ Clone the repository

git clone https://github.com/VaninaDzhuteva/tab-tracker.git
cd tab-tracker

2️⃣ Install dependencies

cd server
npm install

cd client
npm install

3️⃣ Run the application

cd server
npm start
Backend runs on:
http://localhost:8081

cd client
npm run serve

Frontend runs on:
http://localhost:8080
