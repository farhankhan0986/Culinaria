import { Sparkles } from "lucide-react";
import { Button, ImageReveal } from "./UI";

export function Hero({ setIsAiModalOpen }) {
    return (
        <header className="pt-40 pb-24 px-8 md:px-16 max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
                <div className="md:col-span-7 lg:ml-12 ml-0">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-gold mb-6 block">
                        Editorial / Vol. 01
                    </span>
                    <h2 className="text-6xl md:text-8xl font-serif leading-[0.9] tracking-tight mb-8">
                        The Art of <br />
                        <span className="italic text-gold">Slow</span> Cooking
                    </h2>
                    <p className="text-lg text-warm-grey max-w-md leading-relaxed drop-cap mb-8">
                        Discover a curated collection of recipes designed for the
                        deliberate cook. From heritage techniques to modern minimalism, we
                        celebrate the beauty of ingredients in their purest form.
                    </p>
                    <Button
                        variant="secondary"
                        className="flex items-center gap-2"
                        onClick={() => setIsAiModalOpen(true)}
                    >
                        <Sparkles size={16} />
                        Collaborate with AI Sous-Chef
                    </Button>
                </div>
                <div className="md:col-span-4 relative group">
                    <ImageReveal
                        src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1000"
                        alt="Featured Recipe"
                        aspect="aspect-[3/4]"
                    />
                </div>
            </div>
        </header>
    );
}
