export const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

export const ANIM = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: [0.25, 1, 0.5, 1] },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.97 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.97 },
    transition: { duration: 0.25 },
  },
  stagger: { animate: { transition: { staggerChildren: 0.05 } } },
  child: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } },
  },
};

export const INPUT_CLS =
  'w-full bg-[#f5f5f7] border border-transparent rounded-[12px] pl-10 pr-4 py-[10px] text-[#1d1d1f] text-[13.5px] font-normal placeholder-black/30 outline-none focus:bg-white focus:border-[#0071e3]/40 focus:ring-[3px] focus:ring-[#0071e3]/[0.08] transition-all duration-200';

export const INPUT_CLS_PR =
  'w-full bg-[#f5f5f7] border border-transparent rounded-[12px] pl-10 pr-11 py-[10px] text-[#1d1d1f] text-[13.5px] font-normal placeholder-black/30 outline-none focus:bg-white focus:border-[#0071e3]/40 focus:ring-[3px] focus:ring-[#0071e3]/[0.08] transition-all duration-200';

export const LABEL_CLS = 'block text-[11px] font-medium text-black/40 tracking-wide mb-1.5 pl-0.5';

export const ICON_WRAP = 'absolute left-3 top-1/2 -translate-y-1/2 text-black/25 transition-colors duration-200';
