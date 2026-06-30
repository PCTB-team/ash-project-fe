import { motion } from 'framer-motion';

export default function GlobalLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfcfd]">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
            className="w-3 h-3 bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] rounded-full shadow-md"
          />
        ))}
      </div>
      <p className="mt-4 text-[13px] font-medium text-black/40 animate-pulse">
        Đang tải trang...
      </p>
    </div>
  );
}
