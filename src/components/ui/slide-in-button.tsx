import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface SlideInButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
}

export const SlideInButton = React.forwardRef<HTMLButtonElement, SlideInButtonProps>(
  ({ children, href, className, ...props }, ref) => {
    const [hovered, setHovered] = React.useState(false);

    const buttonContent = (
      <motion.button
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-10 py-6 text-lg font-semibold text-black shadow-lg transition-all duration-300 ${className || ''}`}
        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255, 215, 0, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...props}
      >
        {/* Animated background layer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-400"
          initial={{ x: "-100%" }}
          animate={{ x: hovered ? "0%" : "-100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        
        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
          <motion.div
            animate={{ x: hovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowRight className="h-5 w-5" />
          </motion.div>
        </span>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: hovered ? ["-200%", "200%"] : "-200%",
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
        />
      </motion.button>
    );

    if (href) {
      return (
        <a href={href} className="inline-block">
          {buttonContent}
        </a>
      );
    }

    return buttonContent;
  }
);

SlideInButton.displayName = "SlideInButton";
