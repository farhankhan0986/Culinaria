import { motion } from "motion/react";

export function Button({ variant = "primary", icon: Icon, children, className = "", ...props }) {
  const baseStyles = "relative h-12 px-8 flex items-center justify-center text-xs uppercase tracking-[0.2em] font-medium transition-all duration-500 overflow-hidden group";
  
  const variants = {
    primary: "bg-charcoal text-alabaster shadow-luxury-sm hover:shadow-luxury-lg",
    secondary: "border border-charcoal text-charcoal bg-transparent hover:bg-charcoal hover:text-alabaster",
    link: "h-auto px-0 text-charcoal hover:text-gold border-b border-transparent hover:border-gold",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {variant === "primary" && (
        <span className="absolute inset-0 bg-gold translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {Icon && <Icon size={14} strokeWidth={1.5} />}
      </span>
    </button>
  );
}

export function Input({ label, error, ...props }) {
  return (
    <div className="w-full space-y-1">
      <label className="text-[10px] uppercase tracking-[0.3em] text-warm-grey">{label}</label>
      <input
        className="w-full h-12 bg-transparent border-b border-charcoal/20 focus:border-gold outline-none transition-colors duration-500 text-sm placeholder:font-serif placeholder:italic placeholder:text-warm-grey/50"
        {...props}
      />
      {error && <p className="text-[10px] text-red-500 uppercase tracking-wider">{error}</p>}
    </div>
  );
}

export function Card({ children, className = "", featured = false }) {
  return (
    <div className={`group bg-transparent border-t ${featured ? 'border-t-4 border-t-gold' : 'border-t-charcoal/20'} p-8 md:p-12 hover:bg-alabaster/50 transition-all duration-700 shadow-luxury-sm hover:shadow-luxury-md ${className}`}>
      {children}
    </div>
  );
}

export function GridLines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <div className="h-full max-w-[1600px] mx-auto grid grid-cols-4 px-8 md:px-16">
        <div className="border-l border-charcoal/5 h-full" />
        <div className="border-l border-charcoal/5 h-full" />
        <div className="border-l border-charcoal/5 h-full" />
        <div className="border-l border-charcoal/5 h-full border-r" />
      </div>
    </div>
  );
}

export function ImageReveal({ src, alt, className = "", aspect = "aspect-[3/4]" }) {
  return (
    <div className={`relative overflow-hidden ${aspect} ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover scale-100 group-hover:scale-105 group-active:scale-105 transition-all duration-[2000ms] ease-out"
      />
      <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] pointer-events-none" />
    </div>
  );
}
