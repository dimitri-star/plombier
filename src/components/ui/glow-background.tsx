import { cn } from "@/lib/utils";

interface GlowBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowBackground({ children, className }: GlowBackgroundProps) {
  return (
    <div className={cn("min-h-screen w-full relative", className)}>
      {/* Fond sombre base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black" />
      
      {/* Effet métallique bleu/gris pour thème plombier */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(30, 64, 175, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(148, 163, 184, 0.08) 0%, transparent 70%)
          `,
          opacity: 1,
        }}
      />
      
      {/* Texture métallique subtile */}
      <div 
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(148, 163, 184, 0.03) 2px,
              rgba(148, 163, 184, 0.03) 4px
            )
          `
        }}
      />
      
      {/* Your Content/Components */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
