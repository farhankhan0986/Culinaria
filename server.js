import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import cors from "cors";
import Groq from "groq-sdk";
import { fileURLToPath } from "url";
import { getInitialRecipes } from "./src/data/initialRecipes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/culinaria";
const JWT_SECRET = process.env.JWT_SECRET || "editorial-secret-key";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* ===============================
   MongoDB Connection
================================ */

if (!process.env.MONGODB_URI) {
  console.warn(
    "MONGODB_URI not found in environment variables. Using local memory database."
  );
}

mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error(
      "MongoDB connection error. The app will run in limited mode:",
      err.message
    );
  });

mongoose.set("bufferCommands", false);

/* ===============================
   Schemas
================================ */

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  bio: String,
  avatar: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
});

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  ingredients: [
    {
      name: String,
      quantity: String
    }
  ],
  steps: [String],
  cooking_time: Number,
  servings: Number,
  difficulty: String,
  category: String,
  cuisine: String,
  image_url: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ratings: {
    type: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
const Recipe = mongoose.model("Recipe", RecipeSchema);

/* ===============================
   Database Seed
================================ */

async function seedDatabase() {
  try {
    const author = await User.findOneAndUpdate(
      { email: "editor@culinaria.com" },
      {
        $setOnInsert: {
          password: await bcrypt.hash("password123", 10),
          name: "Editorial Team",
          bio: "Curating the finest culinary experiences.",
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    const count = await Recipe.countDocuments();

    if (count < 30) {
      console.log("Seeding database...");

      const initialRecipes = getInitialRecipes(author._id);

      await Recipe.insertMany(initialRecipes);

      console.log("Database seeded successfully.");
    }
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

/* ===============================
   Server
================================ */

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  mongoose.connection.once("open", seedDatabase);

  /* ===============================
     Auth Middleware
  ================================ */

  const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  /* ===============================
     Auth Routes
  ================================ */

  app.post("/api/auth/signup", async (req, res) => {
    const { email, password, name } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        email,
        password: hashedPassword,
        name,
      });

      await user.save();

      const token = jwt.sign({ id: user._id, email }, JWT_SECRET);

      res.json({
        token,
        user: {
          id: user._id,
          email,
          name,
          favorites: [],
        },
      });
    } catch {
      res.status(400).json({ error: "User already exists or invalid data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        favorites: user.favorites || [],
      },
    });
  });

  /* ===============================
     Recipes API
  ================================ */

  app.get("/api/recipes", async (req, res) => {
    try {
      const { search, category, cuisine } = req.query;

      if (mongoose.connection.readyState !== 1) {
        return res
          .status(503)
          .json({ error: "Database not connected." });
      }

      const count = await Recipe.countDocuments();
      if (count === 0) {
        await seedDatabase();
      }

      let filter = {};

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { "ingredients.name": { $regex: search, $options: "i" } },
          { cuisine: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ];
      }

      if (category && category !== "All") {
        filter.category = category;
      }

      if (cuisine && cuisine !== "All") {
        filter.cuisine = cuisine;
      }

      const recipes = await Recipe.find(filter)
        .populate("author", "name")
        .sort({ created_at: -1 });

      res.json(recipes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/recipes", async (req, res) => {
    try {

      const title =
        req.body.title ||
        req.body.recipe_name ||
        req.body.name ||
        "Untitled Recipe";

      const steps =
        req.body.steps ||
        req.body.instructions ||
        [];

      const ingredients =
        Array.isArray(req.body.ingredients)
          ? req.body.ingredients
          : [];

      const recipe = new Recipe({
        title,
        description: req.body.description || "",
        ingredients,
        steps,
        cooking_time: parseInt(req.body.cooking_time) || null,
        servings: req.body.servings || null,
        difficulty: req.body.difficulty || "",
        category: req.body.category || "",
        cuisine: req.body.cuisine || "",
        image_url: req.body.image_url || "",
        author: req.body.author_id || null
      });

      await recipe.save();

      res.status(201).json(recipe);

    } catch (err) {
      console.error("Recipe creation error:", err);

      res.status(500).json({
        error: "Failed to create recipe",
        details: err.message
      });
    }
  });

  app.post("/api/recipes/:id/favorite", authenticate, async (req, res) => {
    try {
      const recipeId = req.params.id;
      const userId = req.user.id;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const index = user.favorites.indexOf(recipeId);

      if (index === -1) {
        user.favorites.push(recipeId);
      } else {
        user.favorites.splice(index, 1);
      }

      await user.save();

      res.json({
        favorites: user.favorites
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/recipes/:id/rate", authenticate, async (req, res) => {
    try {
      const recipeId = req.params.id;
      const userId = req.user.id;
      const { rating, comment } = req.body;

      const recipe = await Recipe.findById(recipeId);

      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      // Ensure ratings array exists
      if (!recipe.ratings) {
        recipe.ratings = [];
      }

      const existingRating = recipe.ratings.find(
        (r) => r.user && r.user.toString() === userId
      );

      if (existingRating) {
        existingRating.rating = rating;
        existingRating.comment = comment;
      } else {
        recipe.ratings.push({
          user: userId,
          rating,
          comment
        });
      }

      await recipe.save({ validateBeforeSave: false });

      const updatedRecipe = await Recipe.findById(recipeId).populate(
        "author",
        "name"
      );

      res.json(updatedRecipe);

    } catch (err) {
      console.error("Rating error:", err);
      res.status(500).json({
        error: "Server error",
        details: err.message
      });
    }
  });


  /* ===============================
     AI Routes
  ================================ */

  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { prompt } = req.body;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `
You are a world-class luxury chef.

Return ONLY valid JSON in this exact format:

{
  "title": "Recipe name",
  "description": "Short description",
  "ingredients": [
    { "name": "ingredient name", "quantity": "amount" }
  ],
  "instructions": [
    { "step": 1, "action": "instruction text" }
  ],
  "cooking_time": "30 minutes",
  "servings": 4,
  "difficulty": "Easy",
  "category": "Dinner",
  "cuisine": "Italian",
  "image_url": ""
}

Do not include any text outside the JSON.
`,
          },
          {
            role: "user",
            content: `Generate a recipe based on: "${prompt}"`,
          },
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content?.trim() || "{}";
      const recipeData = JSON.parse(content);

      res.json(recipeData);
    } catch (err) {
      console.error("Groq error:", err);
      res.status(500).json({ error: "AI generation failed" });
    }
  });


  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      const messages = [
        {
          role: "system",
          content:
            "You are an expert culinary AI assistant helping chefs with recipes, cooking techniques, and ingredients.",
        },
        ...history.map((m) => ({
          role: m.role === "bot" ? "assistant" : "user",
          content: m.text,
        })),
        {
          role: "user",
          content: message,
        },
      ];

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages,
      });

      const text = completion.choices[0]?.message?.content || "No response";

      res.json({ text });
    } catch (err) {
      console.error("AI chat error:", err);
      res.status(500).json({ error: "AI chat failed" });
    }
  });

  /* ===============================
     Vite Middleware
  ================================ */

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();