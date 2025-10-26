import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface GooeyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const GooeyButton = React.forwardRef<HTMLButtonElement, GooeyButtonProps>(
  ({ children, className, ...props }, ref) => {
    const [hovered, setHovered] = React.useState(false);

    return (
      <motion.button
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative px-10 py-6 text-lg font-semibold text-black rounded-full overflow-hidden group bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg"
        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255, 215, 0, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {/* Blobs animation */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <motion.div
            className="absolute top-0 left-0 w-40 h-40 bg-yellow-300 rounded-full opacity-60 blur-xl"
            animate={{
              x: hovered ? [0, 30, 0] : 0,
              y: hovered ? [0, 20, 0] : 0,
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-48 h-48 bg-yellow-600 rounded-full opacity-50 blur-xl"
            animate={{
              x: hovered ? [0, -40, 0] : 0,
              y: hovered ? [0, -30, 0] : 0,
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-36 h-36 bg-yellow-400 rounded-full opacity-40 blur-2xl"
            animate={{
              x: hovered ? [0, -20, 0] : 0,
              y: hovered ? [0, 25, 0] : 0,
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        {/* Text content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </motion.button>
    );
  }
);

GooeyButton.displayName = "GooeyButton";
