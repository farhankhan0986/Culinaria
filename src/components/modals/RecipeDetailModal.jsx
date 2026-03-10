import { motion, AnimatePresence } from "motion/react";
import { X, Heart, Star, ShoppingBag, Play } from "lucide-react";
import { Button } from "../UI";
import { getGravatarUrl } from "../../utils/userUtils";

export function RecipeDetailModal({
    selectedRecipe,
    setSelectedRecipe,
    toggleFavorite,
    userFavorites,
    user,
    setAuthMode,
    ratingForm,
    setRatingForm,
    submitRating,
    addToShoppingList,
    setIsCooking,
}) {
    if (!selectedRecipe) return null;

    return (
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
    );
}
