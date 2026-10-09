import { useState } from "react";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { Sparkles, Flame, Waves, Palette, ArrowLeft, Move } from "lucide-react";
import { Link } from "react-router-dom";

export default function AnimatedGradientDemo() {
  const [variant, setVariant] = useState<"beige" | "mist" | "lava" | "vortex">("beige");
  const [speed, setSpeed] = useState<number>(0.25);
  const [opacity, setOpacity] = useState<number>(0.95);

  return (
    <AnimatedGradient
      variant={variant}
      speed={speed}
      opacity={opacity}
      className="relative w-full min-h-screen"
    >
      <div className="relative z-20 flex flex-col items-center justify-between min-h-screen p-6 sm:p-10 pointer-events-auto">
        {/* Header Navigation */}
        <div className="w-full max-w-5xl flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-slate-800 text-sm font-semibold border border-amber-900/10 shadow-sm backdrop-blur-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#A17619]" />
            <span>Back to Venues</span>
          </Link>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 backdrop-blur-md border border-[#E7CA70]/60 text-[#835D12] text-xs font-semibold shadow-sm">
            <Move className="w-3.5 h-3.5 text-[#A17619] animate-pulse" />
            <span>Touch & Drag Responsive</span>
          </div>
        </div>

        {/* Center Title & Showcase Cards */}
        <div className="w-full max-w-4xl my-auto py-8 flex flex-col items-center text-center space-y-6">
          <div className="space-y-2 select-none">
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#835D12] font-bold">
              Luxury Shader Canvas
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 font-serif drop-shadow-sm">
              Animated Beige Gradient
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
              GPU-accelerated ambient silk background with interactive touch & pointer physics.
            </p>
          </div>

          {/* Interactive Variant Selectors */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 bg-white/90 backdrop-blur-xl p-2 rounded-2xl border border-amber-900/10 shadow-md">
            <button
              onClick={() => setVariant("beige")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                variant === "beige"
                  ? "bg-[#C39626] text-white shadow-md shadow-amber-900/20 scale-105"
                  : "text-slate-700 hover:bg-amber-50"
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Royal Beige</span>
            </button>
            <button
              onClick={() => setVariant("mist")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                variant === "mist"
                  ? "bg-pink-600 text-white shadow-md shadow-pink-900/20 scale-105"
                  : "text-slate-700 hover:bg-amber-50"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Mist Ribbon</span>
            </button>
            <button
              onClick={() => setVariant("lava")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                variant === "lava"
                  ? "bg-amber-700 text-white shadow-md shadow-amber-900/20 scale-105"
                  : "text-slate-700 hover:bg-amber-50"
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Lava Glow</span>
            </button>
            <button
              onClick={() => setVariant("vortex")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                variant === "vortex"
                  ? "bg-slate-800 text-white shadow-md shadow-slate-900/20 scale-105"
                  : "text-slate-700 hover:bg-amber-50"
              }`}
            >
              <Waves className="w-4 h-4" />
              <span>Monochrome Vortex</span>
            </button>
          </div>

          {/* Unsplash Stock Venue Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <div className="group relative overflow-hidden rounded-2xl border border-amber-900/10 bg-white/85 backdrop-blur-md p-3 text-left transition-all hover:-translate-y-1 hover:shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80"
                alt="Grand Ballroom"
                className="w-full h-36 object-cover rounded-xl mb-3 group-hover:scale-[1.02] transition-transform duration-300"
              />
              <h3 className="text-slate-900 font-bold text-sm">Grand Imperial Ballroom</h3>
              <p className="text-slate-500 text-xs mt-0.5">Capacity: 800 guests</p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-amber-900/10 bg-white/85 backdrop-blur-md p-3 text-left transition-all hover:-translate-y-1 hover:shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80"
                alt="Floral Celebration Hall"
                className="w-full h-36 object-cover rounded-xl mb-3 group-hover:scale-[1.02] transition-transform duration-300"
              />
              <h3 className="text-slate-900 font-bold text-sm">Royal Pavilion</h3>
              <p className="text-slate-500 text-xs mt-0.5">Capacity: 450 guests</p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-amber-900/10 bg-white/85 backdrop-blur-md p-3 text-left transition-all hover:-translate-y-1 hover:shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1545232979-fbf68fe9f15b?auto=format&fit=crop&w=600&q=80"
                alt="Chandelier Hall"
                className="w-full h-36 object-cover rounded-xl mb-3 group-hover:scale-[1.02] transition-transform duration-300"
              />
              <h3 className="text-slate-900 font-bold text-sm">Crystal Banquet Suite</h3>
              <p className="text-slate-500 text-xs mt-0.5">Capacity: 300 guests</p>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-amber-900/10 flex items-center justify-around text-xs text-slate-700 shadow-md">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Speed:</span>
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="accent-[#C39626] w-24 cursor-pointer"
            />
            <span className="font-mono text-slate-900 font-bold">{speed}x</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Opacity:</span>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="accent-[#C39626] w-24 cursor-pointer"
            />
            <span className="font-mono text-slate-900 font-bold">{Math.round(opacity * 100)}%</span>
          </div>
        </div>
      </div>
    </AnimatedGradient>
  );
}
