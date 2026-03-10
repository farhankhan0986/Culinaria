import { CheckCircle2 } from "lucide-react";
import { Button } from "./UI";

export function Footer({ shoppingList, setShoppingList }) {
    return (
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
    );
}
