import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { GridLines } from "./components/UI";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { RecipeList } from "./components/RecipeList";
import { Footer } from "./components/Footer";
import { CreateRecipeModal } from "./components/modals/CreateRecipeModal";
import { AiGenerationModal } from "./components/modals/AiGenerationModal";
import { RecipeDetailModal } from "./components/modals/RecipeDetailModal";
import { CookingModeModal } from "./components/modals/CookingModeModal";
import { AuthModal } from "./components/modals/AuthModal";
import { UserProfileModal } from "./components/modals/UserProfileModal";
import { AiChatModal } from "./components/modals/AiChatModal";

export default function App() {
  const API_BASE = "https://culinaria-j6we.onrender.com";
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCuisine, setActiveCuisine] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Modals
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isCooking, setIsCooking] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [shoppingList, setShoppingList] = useState([]);
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [ratingForm, setRatingForm] = useState({ rating: 5, comment: "" });
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState([
    {
      role: "bot",
      text: "Greetings, Chef. I am your AI Sous-Chef. How can I assist you in the Atelier today?",
    },
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const chatEndRef = useRef(null);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    cooking_time: 30,
    servings: 2,
    difficulty: "Medium",
    category: "Dinner",
    cuisine: "Western",
    image_url: "",
  });

  const categories = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Vegan",
    "Chicken",
  ];
  const cuisines = [
    "All",
    "Indian",
    "Italian",
    "Chinese",
    "Japanese",
    "Western",
    "Eastern",
  ];

  useEffect(() => {
    fetchRecipes();
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      setUser(savedUser);
      setUserFavorites(savedUser.favorites || []);
    }
    const savedList = JSON.parse(localStorage.getItem("shoppingList"));
    if (savedList) setShoppingList(savedList);
  }, [activeCategory, activeCuisine]);

  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
  }, [shoppingList]);

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint =
      authMode === "login" ? `${API_BASE}/api/auth/login` : `${API_BASE}/api/auth/signup`;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authForm),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setUserFavorites(data.user.favorites || []);
        setAuthMode(null);
        setAuthForm({ email: "", password: "", name: "" });
      } else {
        setError(data.error);
      }
    } catch {
      setError("Authentication failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setUserFavorites([]);
    setShowProfile(false);
  };

  const toggleFavorite = async (recipeId, e) => {
    if (e) e.stopPropagation();
    if (!user) return setAuthMode("login");

    try {
      const res = await fetch(`${API_BASE}/api/recipes/${recipeId}/favorite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUserFavorites(data.favorites);
        const updatedUser = { ...user, favorites: data.favorites };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  const handleAiChat = async (e) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiThinking) return;

    const userMsg = aiInput;
    const history = aiMessages;
    setAiMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setAiInput("");
    setIsAiThinking(true);

    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history }),
      });

      if (!res.ok) throw new Error("Chat failed");
      const data = await res.json();
      setAiMessages((prev) => [...prev, { role: "bot", text: data.text }]);
    } catch (_err) {
      console.error("AI Error:", _err);
      setAiMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "My apologies, Chef. I&apos;ve encountered a momentary lapse in my culinary knowledge. Please try again.",
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const submitRating = async (recipeId) => {
    if (!user) return setAuthMode("login");
    try {
      const res = await fetch(`${API_BASE}/api/recipes/${recipeId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(ratingForm),
      });
      if (res.ok) {
        const updatedRecipe = await res.json();
        setSelectedRecipe(updatedRecipe);
        setRatingForm({ rating: 5, comment: "" });
        fetchRecipes();
      }
    } catch (_err) {
      console.error(_err);
    }
  };

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const catParam =
        activeCategory === "All" ? "" : `&category=${activeCategory}`;
      const cuiParam =
        activeCuisine === "All" ? "" : `&cuisine=${activeCuisine}`;
      const res = await fetch(
        `${API_BASE}/api/recipes?search=${search}${catParam}${cuiParam}`,
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch recipes");
      }

      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateAIRecipe = async () => {
    setIsGenerating(true);
    setIsAiModalOpen(false);

    try {
      const res = await fetch(`${API_BASE}/api/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const recipeData = await res.json();

      // 🔧 Transform AI recipe → backend schema
      const payload = {
        title:
          recipeData.title ||
          recipeData.name ||
          recipeData.recipe_name ||
          "Untitled Recipe",

        description: recipeData.description || "",

        ingredients: Array.isArray(recipeData.ingredients)
          ? recipeData.ingredients.map((i) => ({
            name: i.name || i.ingredient || "",
            quantity: i.quantity || "",
          }))
          : [],

        steps: Array.isArray(recipeData.instructions)
          ? recipeData.instructions
            .map((i) => (typeof i === "string" ? i : i.action))
            .filter(Boolean)
          : Array.isArray(recipeData.steps)
            ? recipeData.steps.filter(Boolean)
            : [],

        cooking_time: recipeData.cooking_time
          ? parseInt(recipeData.cooking_time)
          : null,

        servings: recipeData.servings || null,

        difficulty: recipeData.difficulty || "",
        category: recipeData.category || "",
        cuisine: recipeData.cuisine || "",
        image_url: recipeData.image_url || "",

        author_id: user?.id,
      };

      const saveRes = await fetch(`${API_BASE}/api/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (saveRes.ok) {
        fetchRecipes();
        setAiPrompt("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const addToShoppingList = (ingredients) => {
    setShoppingList((prev) => [...new Set([...prev, ...ingredients])]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewRecipe((prev) => ({ ...prev, image_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageUpload(e);
  };

  const handleCreateRecipe = async (e) => {
    e.preventDefault();
    try {
      const formattedRecipe = {
        ...newRecipe,
        ingredients: newRecipe.ingredients.split("\n").filter((i) => i.trim()),
        steps: newRecipe.steps.split("\n").filter((s) => s.trim()),
        author_id: user?.id,
      };

      const res = await fetch(`${API_BASE}/api/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedRecipe),
      });

      if (res.ok) {
        setIsCreating(false);
        setNewRecipe({
          title: "",
          description: "",
          ingredients: "",
          steps: "",
          cooking_time: 30,
          servings: 2,
          difficulty: "Medium",
          category: "Dinner",
          cuisine: "Western",
          image_url: "",
        });
        fetchRecipes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="noise-overlay" />
      <GridLines />

      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categories}
        activeCuisine={activeCuisine}
        setActiveCuisine={setActiveCuisine}
        cuisines={cuisines}
        search={search}
        setSearch={setSearch}
        fetchRecipes={fetchRecipes}
        user={user}
        setShowProfile={setShowProfile}
        setAuthMode={setAuthMode}
        shoppingList={shoppingList}
        setIsCreating={setIsCreating}
        setIsAiModalOpen={setIsAiModalOpen}
        isGenerating={isGenerating}
      />

      <Hero setIsAiModalOpen={setIsAiModalOpen} />

      <RecipeList
        error={error}
        loading={loading}
        recipes={recipes}
        userFavorites={userFavorites}
        toggleFavorite={toggleFavorite}
        setSelectedRecipe={setSelectedRecipe}
        generateAIRecipe={generateAIRecipe}
        isGenerating={isGenerating}
      />

      <Footer
        shoppingList={shoppingList}
        setShoppingList={setShoppingList}
      />

      {/* Modals */}
      <AnimatePresence>
        <CreateRecipeModal
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          handleCreateRecipe={handleCreateRecipe}
          newRecipe={newRecipe}
          setNewRecipe={setNewRecipe}
          categories={categories}
          cuisines={cuisines}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          isDragging={isDragging}
          handleImageUpload={handleImageUpload}
        />

        <AiGenerationModal
          isAiModalOpen={isAiModalOpen}
          setIsAiModalOpen={setIsAiModalOpen}
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          generateAIRecipe={generateAIRecipe}
          isGenerating={isGenerating}
        />

        <RecipeDetailModal
          selectedRecipe={selectedRecipe}
          setSelectedRecipe={setSelectedRecipe}
          toggleFavorite={toggleFavorite}
          userFavorites={userFavorites}
          user={user}
          setAuthMode={setAuthMode}
          ratingForm={ratingForm}
          setRatingForm={setRatingForm}
          submitRating={submitRating}
          addToShoppingList={addToShoppingList}
          setIsCooking={setIsCooking}
        />

        <CookingModeModal
          isCooking={isCooking}
          setIsCooking={setIsCooking}
          selectedRecipe={selectedRecipe}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />

        <AuthModal
          authMode={authMode}
          setAuthMode={setAuthMode}
          handleAuth={handleAuth}
          authForm={authForm}
          setAuthForm={setAuthForm}
        />

        <UserProfileModal
          showProfile={showProfile}
          setShowProfile={setShowProfile}
          user={user}
          handleLogout={handleLogout}
          recipes={recipes}
          userFavorites={userFavorites}
          setSelectedRecipe={setSelectedRecipe}
        />
      </AnimatePresence>

      <AiChatModal
        isAiChatOpen={isAiChatOpen}
        setIsAiChatOpen={setIsAiChatOpen}
        aiMessages={aiMessages}
        handleAiChat={handleAiChat}
        aiInput={aiInput}
        setAiInput={setAiInput}
        isAiThinking={isAiThinking}
        chatEndRef={chatEndRef}
      />
    </div>
  );
}
