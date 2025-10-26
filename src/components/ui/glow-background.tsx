import { cn } from "@/lib/utils";

interface GlowBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowBackground({ children, className }: GlowBackgroundProps) {
  return (
    <div className={cn("min-h-screen w-full relative", className)}>
      {/* Black background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Orange Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, rgba(255, 140, 0, 0.4) 0%, transparent 70%)
          `,
          opacity: 0.8,
          mixBlendMode: "screen",
        }}
      />
      
      {/* Your Content/Components */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
