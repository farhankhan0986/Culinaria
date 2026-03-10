<div align="center">

# 🍽️ Culinaria

**AI-Powered Culinary Platform**  
_Your intelligent Sous-Chef for discovering, creating, and managing recipes with community and AI features!_

[![Live Frontend](https://img.shields.io/badge/Frontend-Live-green?style=for-the-badge&logo=vercel&logoColor=white)](https://culinaria-editorial.vercel.app)
[![Live Backend](https://img.shields.io/badge/Backend-API-blue?style=for-the-badge&logo=render&logoColor=white)](https://culinaria-j6we.onrender.com)
![MERN Stack](https://img.shields.io/badge/Full%20Stack-MERN-green?style=for-the-badge)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3-FF6B35?style=for-the-badge)](https://groq.com)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB-informational?style=for-the-badge&logo=mongodb)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Hosting-black?style=for-the-badge&logo=vercel&logoColor=white)
[![Render](https://img.shields.io/badge/Render-API-blue?style=for-the-badge&logo=render&logoColor=white)

</div>

---

## 🌟 Overview

Culinaria is an AI-powered culinary platform where users can discover, create, and manage recipes—all while collaborating with an intelligent AI Sous-Chef chatbot.  
The application brings together a modern, editorial-style UI with a robust backend (MERN stack + Groq LLMs) to deliver social, smart, and personalized cooking experiences.

---

## 🧠 Key Features

- **🤖 AI Sous-Chef**
  - Chat with an AI cooking assistant
  - Get ingredient suggestions and recipe ideas on demand
  - Generate new recipes with Groq LLM
- **🍳 Recipe Management**
  - Discover trending, category, and cuisine-based recipes
  - Search recipes by ingredients or title
  - Create and publish custom personal recipes
  - Detailed step-by-step instructions for every dish
- **⭐ Personalization**
  - Save favorite recipes
  - Rate and comment on recipes
  - Maintain your own shopping list
- **🔐 Authentication**
  - User signup & login
  - JWT-based secure sessions
  - Personalized user experience
- **🎨 Modern UI**
  - Clean, editorial layout
  - Fully responsive (works beautifully on mobile & desktop)
  - Smooth animations & modal interactions

---

## 🏗️ Architecture

```
Frontend (React + Vite)
       ↓
REST API (Express)
       ↓
MongoDB Atlas
       ↓
Groq AI API (LLM)
```

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion (Vercel)
- **Backend:** Express.js, Node.js, MongoDB Atlas, Mongoose (Render)
- **AI:** Groq API, Llama 3.3 70B (for recipe generation, chat, suggestions)
- **Authentication:** JWT

---

## 🛠️ Tech Stack

| Stack      | Tech Used                                         |
|------------|---------------------------------------------------|
| Frontend   | React, Vite, Tailwind CSS, Framer Motion          |
| Backend    | Node.js, Express.js, MongoDB Atlas, Mongoose, JWT |
| AI         | Groq API, Llama 3.3 70B                           |
| Deployment | Vercel (Frontend), Render (Backend), Atlas (DB)   |

---

## 📁 Project Structure

```
Culinaria/
├── src/
│   ├── components/
│   │   ├── UI/
│   │   ├── Navbar/
│   │   ├── RecipeList/
│   │   └── modals/
│   ├── data/
│   │   └── initialRecipes.js
│   ├── assets/
│   └── App.jsx
├── server.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/farhankhan0986/Culinaria.git
cd Culinaria
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the environment

Create a `.env` file with:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
GROQ_API_KEY=your_groq_key
```

### 4. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📸 Screenshots

Add screenshots here for maximum impact:

- **Home Page**
- **Recipe Details**
- **AI Sous-Chef Chat**
- **Recipe Creation**

---

## 👨‍💻 Author

**Farhan Abid**

- GitHub: [@farhankhan0986](https://github.com/farhankhan0986)
- LinkedIn: [Farhan Abid](https://linkedin.com/in/farhan-abid-38967a259)
- Email: [farhankhan080304@gmail.com](mailto:farhankhan080304@gmail.com)

---

## 📈 Why This Project Matters

Culinaria demonstrates:

- Real-world full-stack MERN development
- Modern AI/LLM integration in applications
- RESTful API and authentication design
- Clean, user-centered UI/UX with React and Tailwind
- End-to-end production deployment across multiple platforms

---

<div align="center">

⭐️ _If you like this project, consider giving it a star!_ ⭐️

</div>
