import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Star, Clock, ChevronRight, ChevronLeft } from "lucide-react";
import { Card, ImageReveal, Button } from "./UI";

export function RecipeList({
    error,
    loading,
    recipes,
    userFavorites,
    toggleFavorite,
    setSelectedRecipe,
    generateAIRecipe,
    isGenerating,
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const recipesPerPage = 9;

    useEffect(() => {
        setCurrentPage(1);
    }, [recipes]);

    const totalPages = Math.ceil(recipes.length / recipesPerPage);
    const startIndex = (currentPage - 1) * recipesPerPage;
    const currentRecipes = recipes.slice(startIndex, startIndex + recipesPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        const yOffset = -100; // offset for sticky navbar
        const element = document.getElementById("recipe-grid");
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <main id="recipe-grid" className="pb-32 px-8 md:px-16 max-w-[1600px] mx-auto">
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
                <div className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-charcoal/10 border border-charcoal/10">
                        <AnimatePresence mode="popLayout">
                            {currentRecipes.map((recipe, idx) => (
                                <motion.div
                                    key={recipe._id || recipe.id}
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
                    {totalPages > 1 && (
                        <div className="mt-20 flex justify-center items-center gap-6">
                            <Button
                                variant="secondary"
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                                <span className="flex items-center gap-2"><ChevronLeft size={14} /> Previous</span>
                            </Button>
                            <span className="text-[10px] uppercase tracking-widest text-charcoal font-medium">
                                {currentPage} / {totalPages}
                            </span>
                            <Button
                                variant="secondary"
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <span className="flex items-center gap-2">Next <ChevronRight size={14} /></span>
                            </Button>
                        </div>
                    )}
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
    );
}
