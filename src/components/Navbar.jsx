import { Search, User, ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "./UI";
import { getGravatarUrl } from "../utils/userUtils";

export function Navbar({
    activeCategory,
    setActiveCategory,
    categories,
    activeCuisine,
    setActiveCuisine,
    cuisines,
    search,
    setSearch,
    fetchRecipes,
    user,
    setShowProfile,
    setAuthMode,
    shoppingList,
    setIsCreating,
    setIsAiModalOpen,
    isGenerating,
}) {
    return (
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
                        onClick={() => (user ? setShowProfile(true) : setAuthMode("login"))}
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
    );
}
