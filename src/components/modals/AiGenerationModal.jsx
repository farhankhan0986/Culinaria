import { motion } from "motion/react";
import { X } from "lucide-react";
import { Button } from "../UI";

export function AiGenerationModal({
    isAiModalOpen,
    setIsAiModalOpen,
    aiPrompt,
    setAiPrompt,
    generateAIRecipe,
    isGenerating,
}) {
    if (!isAiModalOpen) return null;

    return (
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
                    <h2 className="text-3xl font-serif italic">What shall we create?</h2>
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
    );
}
