import { motion } from "motion/react";
import { X } from "lucide-react";
import { Button } from "../UI";
import { getGravatarUrl } from "../../utils/userUtils";

export function UserProfileModal({
    showProfile,
    setShowProfile,
    user,
    handleLogout,
    recipes,
    userFavorites,
    setSelectedRecipe,
}) {
    if (!showProfile || !user) return null;

    return (
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
                        alt="User Avatar"
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
                                        alt={recipe.title}
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
    );
}
