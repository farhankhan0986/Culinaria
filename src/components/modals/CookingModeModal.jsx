import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2 } from "lucide-react";
import { Button } from "../UI";

export function CookingModeModal({
    isCooking,
    setIsCooking,
    selectedRecipe,
    currentStep,
    setCurrentStep,
}) {
    if (!isCooking || !selectedRecipe) return null;

    return (
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
    );
}
