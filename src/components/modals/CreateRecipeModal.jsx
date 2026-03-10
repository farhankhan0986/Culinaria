import { motion } from "motion/react";
import { X, ShoppingBag } from "lucide-react";
import { Input, Button } from "../UI";

export function CreateRecipeModal({
    isCreating,
    setIsCreating,
    handleCreateRecipe,
    newRecipe,
    setNewRecipe,
    categories,
    cuisines,
    onDragOver,
    onDragLeave,
    onDrop,
    isDragging,
    handleImageUpload,
}) {
    if (!isCreating) return null;

    return (
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
    );
}
