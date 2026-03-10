import { motion, AnimatePresence } from "motion/react";
import { X, Bot, Send, MessageSquare } from "lucide-react";

export function AiChatModal({
    isAiChatOpen,
    setIsAiChatOpen,
    aiMessages,
    handleAiChat,
    aiInput,
    setAiInput,
    isAiThinking,
    chatEndRef,
}) {
    return (
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
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[80%] p-4 text-xs leading-relaxed ${msg.role === "user"
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
    );
}
