import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { Card, Input, Button } from "../UI";

export function AuthModal({
    authMode,
    setAuthMode,
    handleAuth,
    authForm,
    setAuthForm,
}) {
    if (!authMode) return null;

    return (
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
    );
}
