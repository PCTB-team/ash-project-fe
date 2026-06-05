import { motion } from 'framer-motion';

/**
 * AuthLayout — Full-viewport centered layout with subtle ambient background.
 * Apple-style: minimal, clean, soft gradients. No split-panel.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen h-screen max-h-screen overflow-hidden flex items-center justify-center bg-[#fbfbfd] font-sans select-none relative">
      {/* Ambient glow — soft, Apple-event style */}
      <div className="absolute top-[-20%] right-[-5%] w-[50%] h-[50%] bg-gradient-to-bl from-[#ff5c00]/[0.04] to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-5%] w-[45%] h-[45%] bg-gradient-to-tr from-[#0071e3]/[0.03] to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[30%] h-[30%] bg-[#ff5c00]/[0.02] rounded-full blur-[80px] pointer-events-none" />

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="relative z-10 w-full max-w-[420px] mx-4"
      >
        {children}
      </motion.div>
    </div>
  );
}
