import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import CryptoJS from "crypto-js";
import {
  Search,
  User,
  Heart,
  ChevronRight,
  Clock,
  Star,
  Sparkles,
  X,
  ShoppingBag,
  Play,
  CheckCircle2,
  MessageSquare,
  Send,
  Bot,
} from "lucide-react";
import { Button, Input, Card, GridLines, ImageReveal } from "./components/UI";

export default function App() {
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

  const getGravatarUrl = (email) => {
    if (!email)
      return "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
    const hash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
    return `https://www.gravatar.com/avatar/${hash}?d=mp&s=200`;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint =
      authMode === "login" ? "/api/auth/login" : "/api/auth/signup";
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
      const res = await fetch(`/api/recipes/${recipeId}/favorite`, {
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
      const res = await fetch("/api/ai/chat", {
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
      const res = await fetch(`/api/recipes/${recipeId}/rate`, {
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
        `/api/recipes?search=${search}${catParam}${cuiParam}`,
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
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const recipeData = await res.json();

      const saveRes = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...recipeData, author_id: user?.id }),
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

      const res = await fetch("/api/recipes", {
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

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-alabaster/80 backdrop-blur-md border-b border-charcoal/10">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 h-20 flex items-center justify-between">
          <h1
            className="text-2xl tracking-tighter font-serif italic cursor-pointer"
            onClick={() => setActiveCategory("All")}
          >
            Culinaria
          </h1>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] uppercase tracking-[0.4em] text-warm-grey">
                Category
              </span>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-transparent border-none text-[10px] uppercase tracking-[0.3em] text-charcoal focus:ring-0 cursor-pointer hover:text-gold transition-colors appearance-none pr-4"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right center",
                }}
              >
                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-alabaster text-charcoal"
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-px h-8 bg-charcoal/10" />
            <div className="flex flex-col gap-1">
              <span className="text-[8px] uppercase tracking-[0.4em] text-warm-grey">
                Cuisine
              </span>
              <select
                value={activeCuisine}
                onChange={(e) => setActiveCuisine(e.target.value)}
                className="bg-transparent border-none text-[10px] uppercase tracking-[0.3em] text-charcoal focus:ring-0 cursor-pointer hover:text-gold transition-colors appearance-none pr-4"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right center",
                }}
              >
                {cuisines.map((cui) => (
                  <option
                    key={cui}
                    value={cui}
                    className="bg-alabaster text-charcoal"
                  >
                    {cui}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden sm:flex items-center">
              <input
                type="text"
                placeholder="Search Atelier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchRecipes()}
                className="bg-transparent border-b border-charcoal/10 py-1 pr-8 pl-2 text-[10px] uppercase tracking-widest outline-none focus:border-gold transition-colors w-32 md:w-48 placeholder:text-warm-grey/50"
              />
              <button
                className="absolute right-2 text-charcoal hover:text-gold transition-colors duration-500"
                onClick={fetchRecipes}
              >
                <Search size={14} strokeWidth={1.5} />
              </button>
            </div>
            <button
              className="text-charcoal hover:text-gold transition-colors duration-500"
              onClick={() =>
                user ? setShowProfile(true) : setAuthMode("login")
              }
            >
              {user ? (
                <img
                  src={getGravatarUrl(user.email)}
                  className="w-6 h-6 rounded-full border border-charcoal/10"
                />
              ) : (
                <User size={20} strokeWidth={1.5} />
              )}
            </button>
            <button
              className="relative text-charcoal hover:text-gold transition-colors duration-500"
              onClick={() =>
                document
                  .getElementById("shopping-list")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {shoppingList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                  {shoppingList.length}
                </span>
              )}
            </button>
            <Button
              variant="secondary"
              className="hidden md:flex"
              onClick={() => setIsCreating(true)}
            >
              Create
            </Button>
            <Button
              variant="primary"
              className="hidden md:flex"
              onClick={() => setIsAiModalOpen(true)}
              disabled={isGenerating}
            >
              {isGenerating ? "Curating..." : "AI Inspire"}
              {!isGenerating && <Sparkles size={14} className="ml-2" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-24 px-8 md:px-16 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-7">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold mb-6 block">
              Editorial / Vol. 01
            </span>
            <h2 className="text-6xl md:text-9xl font-serif leading-[0.9] tracking-tight mb-8">
              The Art of <br />
              <span className="italic text-gold">Slow</span> Cooking
            </h2>
            <p className="text-lg text-warm-grey max-w-md leading-relaxed drop-cap mb-8">
              Discover a curated collection of recipes designed for the
              deliberate cook. From heritage techniques to modern minimalism, we
              celebrate the beauty of ingredients in their purest form.
            </p>
            <Button
              variant="secondary"
              className="flex items-center gap-2"
              onClick={() => setIsAiModalOpen(true)}
            >
              <Sparkles size={16} />
              Collaborate with AI Sous-Chef
            </Button>
          </div>
          <div className="md:col-span-5 relative group">
            <ImageReveal
              src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1000"
              alt="Featured Recipe"
              aspect="aspect-[4/5]"
            />
          </div>
        </div>
      </header>

      {/* Recipe Grid */}
      <main className="pb-32 px-8 md:px-16 max-w-[1600px] mx-auto">
        {error && (
          <div className="mb-12 p-6 border border-red-500/20 bg-red-500/5 text-red-500 text-sm uppercase tracking-widest text-center">
            Error: {error}. Please ensure MONGODB_URI is set in your
            environment.
          </div>
        )}

        {loading ? (
          <div className="py-32 text-center">
            <div className="inline-block w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-warm-grey">
              Consulting the Atelier...
            </p>
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-charcoal/10 border border-charcoal/10">
            <AnimatePresence mode="popLayout">
              {recipes.map((recipe, idx) => (
                <motion.div
                  key={recipe._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7, delay: idx * 0.1 }}
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <Card className="h-full bg-alabaster cursor-pointer">
                    <div className="space-y-8">
                      <ImageReveal
                        src={
                          recipe.image_url ||
                          `https://picsum.photos/seed/${recipe._id}/800/1000`
                        }
                        alt={recipe.title}
                      />
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-gold">
                              {recipe.cuisine}
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-warm-grey">
                              / {recipe.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => toggleFavorite(recipe._id, e)}
                              className={`transition-colors duration-300 ${userFavorites.includes(recipe._id) ? "text-red-500" : "text-warm-grey hover:text-red-500"}`}
                            >
                              <Heart
                                size={14}
                                fill={
                                  userFavorites.includes(recipe._id)
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            </button>
                            <div className="flex items-center gap-1 text-gold">
                              <Star size={10} fill="currentColor" />
                              <span className="text-[10px] tracking-widest">
                                {recipe.ratings?.length > 0
                                  ? (
                                      recipe.ratings.reduce(
                                        (acc, curr) => acc + curr.rating,
                                        0,
                                      ) / recipe.ratings.length
                                    ).toFixed(1)
                                  : "4.8"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <h3 className="text-3xl font-serif group-hover:text-gold transition-colors duration-500">
                          {recipe.title}
                        </h3>
                        <p className="text-sm text-warm-grey line-clamp-2 leading-relaxed">
                          {recipe.description}
                        </p>
                        <div className="pt-6 flex items-center justify-between border-t border-charcoal/5">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-warm-grey">
                              <Clock size={12} />
                              <span className="text-[10px] tracking-widest">
                                {recipe.cooking_time}m
                              </span>
                            </div>
                          </div>
                          <Button variant="link" icon={ChevronRight}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-32 text-center border border-charcoal/10 bg-alabaster">
            <p className="font-serif italic text-3xl text-charcoal mb-4">
              The collection is currently empty.
            </p>
            <p className="text-xs uppercase tracking-widest text-warm-grey mb-8">
              Try adjusting your filters or use AI to inspire a new creation.
            </p>
            <Button
              variant="primary"
              onClick={generateAIRecipe}
              disabled={isGenerating}
            >
              {isGenerating ? "Curating..." : "AI Inspire"}
            </Button>
          </div>
        )}
      </main>

      {/* Create Recipe Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] bg-charcoal/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-alabaster w-full h-screen max-w-4xl p-8 md:p-16 relative shadow-luxury-lg my-8"
            >
              <button
                onClick={() => setIsCreating(false)}
                className="absolute top-8 right-8 text-charcoal hover:text-gold transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-12 text-center">
                <span className="text-[10px] uppercase tracking-[0.4em] text-gold mb-2 block">
                  New Creation
                </span>
                <h2 className="text-4xl font-serif">Add to the Atelier</h2>
              </div>

              <form
                onSubmit={handleCreateRecipe}
                className="grid grid-cols-1 md:grid-cols-2 gap-12"
              >
                <div className="space-y-6">
                  <Input
                    label="Recipe Title"
                    value={newRecipe.title}
                    onChange={(e) =>
                      setNewRecipe((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-warm-grey">
                      Description
                    </label>
                    <textarea
                      className="w-full bg-transparent border-b border-charcoal/20 focus:border-gold outline-none transition-colors duration-500 text-sm py-2 min-h-[80px] resize-none"
                      value={newRecipe.description}
                      onChange={(e) =>
                        setNewRecipe((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-warm-grey">
                        Category
                      </label>
                      <select
                        className="w-full bg-transparent border-b border-charcoal/20 py-2 text-xs uppercase tracking-widest outline-none"
                        value={newRecipe.category}
                        onChange={(e) =>
                          setNewRecipe((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                      >
                        {categories
                          .filter((c) => c !== "All")
                          .map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-warm-grey">
                        Cuisine
                      </label>
                      <select
                        className="w-full bg-transparent border-b border-charcoal/20 py-2 text-xs uppercase tracking-widest outline-none"
                        value={newRecipe.cuisine}
                        onChange={(e) =>
                          setNewRecipe((prev) => ({
                            ...prev,
                            cuisine: e.target.value,
                          }))
                        }
                      >
                        {cuisines
                          .filter((c) => c !== "All")
                          .map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <Input
                      label="Cooking Time (mins)"
                      type="number"
                      value={newRecipe.cooking_time}
                      onChange={(e) =>
                        setNewRecipe((prev) => ({
                          ...prev,
                          cooking_time: e.target.value,
                        }))
                      }
                    />
                    <Input
                      label="Servings"
                      type="number"
                      value={newRecipe.servings}
                      onChange={(e) =>
                        setNewRecipe((prev) => ({
                          ...prev,
                          servings: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-warm-grey">
                      Ingredients (One per line)
                    </label>
                    <textarea
                      className="w-full bg-transparent border border-charcoal/10 p-4 focus:border-gold outline-none transition-colors duration-500 text-sm min-h-[120px]"
                      value={newRecipe.ingredients}
                      onChange={(e) =>
                        setNewRecipe((prev) => ({
                          ...prev,
                          ingredients: e.target.value,
                        }))
                      }
                      placeholder="500g Flour&#10;2 Eggs&#10;..."
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-warm-grey">
                      Steps (One per line)
                    </label>
                    <textarea
                      className="w-full bg-transparent border border-charcoal/10 p-4 focus:border-gold outline-none transition-colors duration-500 text-sm min-h-[120px]"
                      value={newRecipe.steps}
                      onChange={(e) =>
                        setNewRecipe((prev) => ({
                          ...prev,
                          steps: e.target.value,
                        }))
                      }
                      placeholder="Mix ingredients&#10;Bake for 20 mins&#10;..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-warm-grey">
                      Recipe Image
                    </label>
                    <div
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      className={`relative group aspect-auto border border-dashed flex items-center justify-center overflow-hidden transition-all duration-500 ${isDragging ? "bg-gold/10 border-gold scale-[1.02]" : "bg-charcoal/5 border-charcoal/20"}`}
                    >
                      {newRecipe.image_url ? (
                        <img
                          src={newRecipe.image_url}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <ShoppingBag
                            className="mx-auto mb-2 opacity-20"
                            size={32}
                          />
                          <p className="text-[8px] uppercase tracking-widest text-warm-grey">
                            Click to upload or drag image
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <div className="md:col-span-2 pt-8 mb-10 relative -left-45 ">
                      <Button
                        variant="primary"
                        className="w-full"
                        type="submit"
                      >
                        Publish to Atelier
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Generation Modal */}
      <AnimatePresence>
        {isAiModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-charcoal/40 backdrop-blur-lg flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="bg-alabaster w-full max-w-md p-12 relative shadow-luxury-lg"
            >
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="absolute top-8 right-8 text-charcoal hover:text-gold transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-8 text-center">
                <span className="text-[10px] uppercase tracking-[0.4em] text-gold mb-2 block">
                  AI Sous-Chef
                </span>
                <h2 className="text-3xl font-serif italic">
                  What shall we create?
                </h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-warm-grey">
                    Your Inspiration
                  </label>
                  <textarea
                    className="w-full bg-transparent border-b border-charcoal/20 focus:border-gold outline-none transition-colors duration-500 text-sm py-2 min-h-[100px] resize-none"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., A fusion of Japanese and Italian flavors with seasonal spring vegetables..."
                  />
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={generateAIRecipe}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Curating..." : "Generate Recipe"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-charcoal/40 backdrop-blur-lg flex items-center justify-center p-4 md:p-12"
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="bg-alabaster w-full max-w-6xl h-full max-h-[90vh] overflow-y-auto relative shadow-luxury-lg"
            >
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-8 right-8 z-10 text-charcoal hover:text-gold transition-colors"
              >
                <X size={32} strokeWidth={1} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                <div className="h-64 md:h-full sticky top-0">
                  <img
                    src={selectedRecipe.image_url}
                    alt={selectedRecipe.title}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
                <div className="p-8 md:p-20 space-y-12">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4 items-center">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
                          {selectedRecipe.cuisine}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.4em] text-warm-grey">
                          / {selectedRecipe.category}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleFavorite(selectedRecipe._id)}
                        className={`transition-colors duration-300 ${userFavorites.includes(selectedRecipe._id) ? "text-red-500" : "text-warm-grey hover:text-red-500"}`}
                      >
                        <Heart
                          size={24}
                          fill={
                            userFavorites.includes(selectedRecipe._id)
                              ? "currentColor"
                              : "none"
                          }
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-serif leading-tight">
                      {selectedRecipe.title}
                    </h2>
                    <p className="text-lg text-warm-grey italic leading-relaxed">
                      {selectedRecipe.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-8 py-8 border-y border-charcoal/10">
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-widest text-warm-grey mb-2">
                        Time
                      </p>
                      <p className="font-serif text-2xl">
                        {selectedRecipe.cooking_time}m
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-widest text-warm-grey mb-2">
                        Serves
                      </p>
                      <p className="font-serif text-2xl">
                        {selectedRecipe.servings}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-widest text-warm-grey mb-2">
                        Level
                      </p>
                      <p className="font-serif text-2xl">
                        {selectedRecipe.difficulty}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xl font-serif">Ingredients</h4>
                      <Button
                        variant="link"
                        icon={ShoppingBag}
                        onClick={() =>
                          addToShoppingList(selectedRecipe.ingredients)
                        }
                      >
                        Add to List
                      </Button>
                    </div>
                    <ul className="space-y-4">
                      {selectedRecipe.ingredients.map((ing, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-4 text-sm text-warm-grey border-b border-charcoal/5 pb-2"
                        >
                          <span className="w-1.5 h-1.5 bg-gold" /> {ing}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ratings & Reviews */}
                  <div className="space-y-8 pt-12 border-t border-charcoal/10">
                    <h4 className="text-xl font-serif">Reviews</h4>

                    {user && (
                      <div className="bg-alabaster/50 p-6 space-y-4 border border-charcoal/5">
                        <p className="text-[10px] uppercase tracking-widest text-warm-grey">
                          Leave a Review
                        </p>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() =>
                                setRatingForm((prev) => ({
                                  ...prev,
                                  rating: star,
                                }))
                              }
                              className={
                                ratingForm.rating >= star
                                  ? "text-gold"
                                  : "text-warm-grey/30"
                              }
                            >
                              <Star
                                size={16}
                                fill={
                                  ratingForm.rating >= star
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            </button>
                          ))}
                        </div>
                        <textarea
                          className="w-full bg-transparent border-b border-charcoal/20 focus:border-gold outline-none text-sm py-2 min-h-[60px] resize-none"
                          placeholder="Share your experience..."
                          value={ratingForm.comment}
                          onChange={(e) =>
                            setRatingForm((prev) => ({
                              ...prev,
                              comment: e.target.value,
                            }))
                          }
                        />
                        <Button
                          variant="primary"
                          className="h-10 px-6"
                          onClick={() => submitRating(selectedRecipe._id)}
                        >
                          Submit
                        </Button>
                      </div>
                    )}

                    <div className="space-y-6">
                      {selectedRecipe.ratings?.length > 0 ? (
                        selectedRecipe.ratings.map((rev, i) => (
                          <div
                            key={i}
                            className="flex gap-4 items-start border-b border-charcoal/5 pb-6"
                          >
                            <img
                              src={getGravatarUrl(rev.user?.email)}
                              className="w-10 h-10 rounded-full border border-charcoal/10"
                            />
                            <div className="flex-1 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium">
                                  {rev.user?.name || "Anonymous"}
                                </span>
                                <div className="flex gap-1 text-gold">
                                  {[...Array(rev.rating)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={8}
                                      fill="currentColor"
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-warm-grey italic leading-relaxed">
                                &quot;{rev.comment}&quot;
                              </p>
                              <p className="text-[8px] uppercase tracking-widest text-warm-grey/50">
                                {new Date(rev.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-warm-grey italic">
                          No reviews yet. Be the first to share your thoughts.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-12">
                    <Button
                      variant="primary"
                      className="w-full"
                      icon={Play}
                      onClick={() => setIsCooking(true)}
                    >
                      Start Cooking Mode
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cooking Mode Modal */}
      <AnimatePresence>
        {isCooking && selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-alabaster flex flex-col"
          >
            <div className="h-20 border-b border-charcoal/10 flex items-center justify-between px-8 md:px-16">
              <h4 className="font-serif italic">{selectedRecipe.title}</h4>
              <button
                onClick={() => setIsCooking(false)}
                className="text-charcoal hover:text-gold"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center p-8 md:p-24">
              <div className="max-w-4xl w-full space-y-12">
                <span className="text-[10px] uppercase tracking-[0.5em] text-gold text-center block">
                  Step {currentStep + 1} of {selectedRecipe.steps.length}
                </span>
                <motion.h3
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-4xl md:text-6xl font-serif text-center leading-tight"
                >
                  {selectedRecipe.steps[currentStep]}
                </motion.h3>

                <div className="flex justify-center gap-8 pt-12">
                  <Button
                    variant="secondary"
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  {currentStep < selectedRecipe.steps.length - 1 ? (
                    <Button
                      variant="primary"
                      onClick={() => setCurrentStep((prev) => prev + 1)}
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      icon={CheckCircle2}
                      onClick={() => setIsCooking(false)}
                    >
                      Finish
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {authMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <Card className="bg-alabaster w-full max-w-md p-12 space-y-8 relative">
              <button
                onClick={() => setAuthMode(null)}
                className="absolute top-6 right-6"
              >
                <X size={20} />
              </button>
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-serif">
                  {authMode === "login" ? "Welcome Back" : "Join the Atelier"}
                </h3>
                <p className="text-xs uppercase tracking-widest text-warm-grey">
                  Access your curated collection
                </p>
              </div>
              <form onSubmit={handleAuth} className="space-y-6">
                {authMode === "signup" && (
                  <Input
                    label="Full Name"
                    value={authForm.name}
                    onChange={(e) =>
                      setAuthForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                )}
                <Input
                  label="Email Address"
                  type="email"
                  value={authForm.email}
                  onChange={(e) =>
                    setAuthForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  value={authForm.password}
                  onChange={(e) =>
                    setAuthForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
                <Button variant="primary" className="w-full" type="submit">
                  {authMode === "login" ? "Sign In" : "Create Account"}
                </Button>
              </form>
              <p className="text-center text-[10px] uppercase tracking-widest text-warm-grey">
                {authMode === "login"
                  ? "Don't have an account?"
                  : "Already a member?"}
                <button
                  className="ml-2 text-gold hover:underline"
                  onClick={() =>
                    setAuthMode(authMode === "login" ? "signup" : "login")
                  }
                >
                  {authMode === "login" ? "Sign Up" : "Log In"}
                </button>
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile Modal */}
      <AnimatePresence>
        {showProfile && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-charcoal/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-alabaster w-full max-w-2xl p-12 relative shadow-luxury-lg"
            >
              <button
                onClick={() => setShowProfile(false)}
                className="absolute top-8 right-8"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center text-center space-y-6 mb-12">
                <img
                  src={getGravatarUrl(user.email)}
                  className="w-24 h-24 rounded-full border-2 border-gold p-1"
                />
                <div className="space-y-1">
                  <h3 className="text-4xl font-serif">{user.name}</h3>
                  <p className="text-xs uppercase tracking-[0.3em] text-warm-grey">
                    {user.email}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="h-10 px-6"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </div>

              <div className="space-y-8">
                <h4 className="text-xl font-serif border-b border-charcoal/10 pb-4">
                  Your Favorites
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
                  {recipes
                    .filter((r) => userFavorites.includes(r._id))
                    .map((recipe) => (
                      <div
                        key={recipe._id}
                        className="group relative h-24 bg-charcoal/5 flex items-center gap-4 p-4 cursor-pointer hover:bg-charcoal/10 transition-colors"
                        onClick={() => {
                          setSelectedRecipe(recipe);
                          setShowProfile(false);
                        }}
                      >
                        <img
                          src={recipe.image_url}
                          className="w-16 h-16 object-cover grayscale group-hover:grayscale-0 transition-all"
                        />
                        <div>
                          <p className="text-sm font-serif line-clamp-1">
                            {recipe.title}
                          </p>
                          <p className="text-[8px] uppercase tracking-widest text-warm-grey">
                            {recipe.cuisine}
                          </p>
                        </div>
                      </div>
                    ))}
                  {userFavorites.length === 0 && (
                    <p className="col-span-2 text-sm text-warm-grey italic text-center py-8">
                      No favorites yet. Explore the atelier to find inspiration.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Sous-Chef Chat */}
      <div className="fixed bottom-8 right-8 z-[600]">
        <AnimatePresence>
          {isAiChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-20 right-0 w-[350px] md:w-[400px] bg-alabaster shadow-luxury-lg border border-charcoal/10 flex flex-col overflow-hidden"
            >
              <div className="bg-charcoal text-alabaster p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Bot size={20} className="text-gold" />
                  <div>
                    <h4 className="text-sm font-serif">AI Sous-Chef</h4>
                    <p className="text-[8px] uppercase tracking-widest text-gold">
                      Atelier Assistant
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAiChatOpen(false)}
                  className="hover:text-gold transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 h-[400px] overflow-y-auto p-6 space-y-6 bg-alabaster/50">
                {aiMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gold text-white rounded-l-xl rounded-tr-xl"
                          : "bg-charcoal/5 text-charcoal rounded-r-xl rounded-tl-xl border border-charcoal/5"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiThinking && (
                  <div className="flex justify-start">
                    <div className="bg-charcoal/5 p-4 rounded-r-xl rounded-tl-xl border border-charcoal/5">
                      <div className="flex gap-1">
                        <span className="w-1 h-1 bg-gold rounded-full animate-bounce" />
                        <span className="w-1 h-1 bg-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1 h-1 bg-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form
                onSubmit={handleAiChat}
                className="p-4 border-t border-charcoal/10 bg-alabaster flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask your Sous-Chef..."
                  className="flex-1 bg-charcoal/5 border-none outline-none px-4 py-2 text-xs focus:ring-1 focus:ring-gold"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={isAiThinking}
                  className="bg-charcoal text-alabaster p-2 hover:bg-gold transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsAiChatOpen(!isAiChatOpen)}
          className="w-14 h-14 bg-charcoal text-alabaster rounded-full flex items-center justify-center shadow-luxury hover:scale-110 transition-transform duration-500 group"
        >
          {isAiChatOpen ? (
            <X size={24} />
          ) : (
            <MessageSquare
              size={24}
              className="group-hover:text-gold transition-colors"
            />
          )}
          {!isAiChatOpen && (
            <span className="absolute -top-1 -right-1 bg-gold w-3 h-3 rounded-full animate-ping" />
          )}
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-charcoal text-alabaster py-32 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-4 space-y-8">
            <h2 className="text-4xl font-serif italic">Culinaria</h2>
            <p className="text-sm text-alabaster/60 leading-relaxed max-w-xs">
              A digital atelier for the modern epicurean. Curating the
              world&apos;s most thoughtful culinary experiences since 2024.
            </p>
          </div>
          <div className="md:col-span-4 space-y-6" id="shopping-list">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-gold">
              Shopping List
            </h4>
            {shoppingList.length > 0 ? (
              <ul className="space-y-2">
                {shoppingList.map((item, i) => (
                  <li
                    key={i}
                    className="text-xs text-alabaster/40 flex items-center gap-2"
                  >
                    <CheckCircle2 size={10} className="text-gold" /> {item}
                  </li>
                ))}
                <button
                  onClick={() => setShoppingList([])}
                  className="text-[10px] uppercase tracking-widest text-gold mt-4 hover:text-alabaster transition-colors"
                >
                  Clear List
                </button>
              </ul>
            ) : (
              <p className="text-xs text-alabaster/40 italic">
                Your list is currently empty.
              </p>
            )}
          </div>
          <div className="md:col-span-4 space-y-8">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-gold">
              Newsletter
            </h4>
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent border-b border-alabaster/20 py-3 text-sm outline-none focus:border-gold transition-colors"
              />
              <Button variant="primary" className="w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
