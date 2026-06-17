import { useState } from 'react';
import { Button } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../../../assets/logo.png';

import { useNavigate } from 'react-router-dom';

export default function IntroHeader() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Navigation Bar — Ultra Frosted Premium glass */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 h-[68px] premium-glass border-b border-black/[0.04] flex justify-between items-center px-4 md:px-12 z-50 shadow-sm bg-white/70 backdrop-blur-xl"
      >
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            navigate('/');
          }}
        >
          <div className="relative w-10 h-10 shrink-0 group-hover:scale-105 transition-all duration-500">
            {/* Glowing Aura */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] rounded-[14px] blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
            {/* Main Logo Container */}
            <div className="relative w-full h-full bg-gradient-to-b from-[#ffffff] to-[#fff5eb] border-[1.5px] border-white rounded-[14px] shadow-sm overflow-hidden flex items-center justify-center z-10">
              <img src={logoImg} alt="Capy Study Logo" className="w-full h-full object-cover object-[center_2%] scale-[1.6]" />
            </div>
          </div>
          <span className="text-[24px] font-extrabold tracking-tighter drop-shadow-sm mt-0.5 ml-1">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#432c1a] to-[#734b2f]">Capy</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#ff5c00] to-[#ffaa00] ml-1">Study</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-[13.5px] font-medium text-[#1d1d1f]/60">
          <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/'); }} className="hover:text-[#ff5c00] transition-colors cursor-pointer">Trang chủ</button>
          <a href="#features-section" className="text-[#1d1d1f]/60 hover:text-[#ff5c00] transition-colors cursor-pointer no-underline">Tính năng</a>
          <button onClick={() => navigate('/login?redirect=/dashboard')} className="hover:text-[#ff5c00] transition-colors cursor-pointer">Tài liệu</button>
          <button onClick={() => navigate('/login?redirect=/dashboard/group')} className="hover:text-[#ff5c00] transition-colors cursor-pointer">Nhóm học tập</button>
          <button onClick={() => navigate('/login?redirect=/dashboard/ai')} className="hover:text-[#ff5c00] transition-colors cursor-pointer">Trợ lý AI</button>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button type="text" shape="round" onClick={() => navigate('/login')} className="!font-medium !text-[13.5px] !text-black/75 hover:!text-black">
            Đăng nhập
          </Button>
          <Button
            type="primary"
            shape="round"
            onClick={() => navigate('/register')}
            className="!bg-gradient-to-b !from-[#ff7a00] !to-[#ff5c00] !border-none !text-white !font-medium !text-[13.5px] !h-10 !px-5 !shadow-[0_1px_3px_rgba(255,92,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] hover:!brightness-110 hover:!shadow-[0_4px_14px_rgba(255,92,0,0.35)] transition-all duration-300"
          >
            Đăng ký ngay
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[26px] text-[#1d1d1f] cursor-pointer bg-transparent border-none p-1 transition-transform active:scale-95"
          >
            <i className={`bi ${isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'}`} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-[68px] left-0 right-0 bg-white/95 backdrop-blur-3xl border-b border-black/[0.04] p-6 flex flex-col gap-6 z-40 shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-5 text-[15px] font-medium text-[#1d1d1f]/70">
              <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/'); setIsMobileMenuOpen(false); }} className="text-left hover:text-[#ff5c00] transition-colors py-2 border-b border-black/[0.03]">Trang chủ</button>
              <a href="#features-section" onClick={() => setIsMobileMenuOpen(false)} className="text-left text-[#1d1d1f]/70 hover:text-[#ff5c00] transition-colors py-2 border-b border-black/[0.03] no-underline">Tính năng</a>
              <button onClick={() => { navigate('/login?redirect=/dashboard'); setIsMobileMenuOpen(false); }} className="text-left hover:text-[#ff5c00] transition-colors py-2 border-b border-black/[0.03]">Thư viện</button>
              <button onClick={() => { navigate('/login?redirect=/dashboard/group'); setIsMobileMenuOpen(false); }} className="text-left hover:text-[#ff5c00] transition-colors py-2 border-b border-black/[0.03]">Nhóm học tập</button>
              <button onClick={() => { navigate('/login?redirect=/dashboard/ai'); setIsMobileMenuOpen(false); }} className="text-left hover:text-[#ff5c00] transition-colors py-2 border-b border-black/[0.03]">Trợ lý AI</button>
            </div>
            <div className="flex flex-col gap-3 mt-2">
              <Button type="text" block shape="round" size="large" onClick={() => navigate('/login')} className="!h-12 !text-black !bg-black/[0.04] hover:!bg-black/[0.08] !font-medium !text-[15px] !border-none transition-colors">
                Đăng nhập
              </Button>
              <Button type="primary" block shape="round" size="large" onClick={() => navigate('/register')} className="!h-12 !text-white !bg-gradient-to-b !from-[#ff7a00] !to-[#ff5c00] !font-medium !text-[15px] !border-none !shadow-[0_4px_10px_rgba(255,92,0,0.3)] hover:!brightness-110 transition-all">
                Đăng ký ngay
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
