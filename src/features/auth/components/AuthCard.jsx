import { AnimatePresence, motion } from 'framer-motion';
import { ANIM } from '../utils/constants';
import logoImg from "../../../assets/logo.png";

/**
 * AuthCard — Apple-style centered card with brand, error alert, toggle, and footer.
 */
export default function AuthCard({ children, isRegister, errorMsg, onNavigate, onToggleMode, title, subtitle, hideToggle, hideFooter }) {
  return (
    <div className="bg-white/80 backdrop-blur-2xl border border-black/[0.06] rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] px-8 py-8 sm:px-10 sm:py-9">

      {/* ── Brand ── */}
      <div className="flex flex-col items-center text-center mb-7">
        <div
          className="flex items-center gap-2.5 cursor-pointer group mb-3"
          onClick={() => onNavigate('landing')}
        >
          <div className="relative w-10 h-10 shrink-0 group-hover:scale-105 transition-all duration-500">
            {/* Glowing Aura */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] rounded-[14px] blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
            {/* Main Logo Container */}
            <div className="relative w-full h-full bg-gradient-to-b from-[#ffffff] to-[#fff5eb] border-[1.5px] border-white rounded-[14px] shadow-sm overflow-hidden flex items-center justify-center z-10">
              <img src={logoImg} alt="Capy Study Logo" className="w-full h-full object-cover object-[center_2%] scale-[1.6]" />
            </div>
          </div>
          {title && title !== 'AI Study Hub' ? (
             <span className="text-[24px] font-semibold text-[#1d1d1f] tracking-tight">{title}</span>
          ) : (
             <span className="text-[26px] font-extrabold tracking-tighter drop-shadow-sm mt-0.5">
               <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#432c1a] to-[#734b2f]">Capy</span>
               <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#ff5c00] to-[#ffaa00] ml-1">Study</span>
             </span>
          )}
        </div>
        <p className="text-[13.5px] font-medium text-black/55 leading-relaxed">
          {subtitle || (isRegister ? 'Tạo tài khoản để bắt đầu học tập' : 'Đăng nhập vào tài khoản của bạn')}
        </p>
      </div>

      {/* ── Error ── */}
      <AnimatePresence mode="wait">
        {errorMsg && (
          <motion.div
            {...ANIM.scaleIn}
            className="rounded-[12px] py-2.5 px-3.5 bg-[#ff3b30]/[0.06] text-[#ff3b30] flex items-center gap-2.5 mb-5"
          >
            <i className="bi bi-exclamation-circle-fill text-[13px] shrink-0" />
            <span className="text-[12px] font-medium leading-snug">{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content ── */}
      {children}

      {/* ── Toggle ── */}
      {!hideToggle && (
        <p className="text-[12.5px] text-black/55 text-center mt-6 font-semibold">
          {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
          <button
            onClick={onToggleMode}
            className="text-[#ff5c00] font-semibold hover:text-[#ff8a00] cursor-pointer transition-colors"
          >
            {isRegister ? 'Đăng nhập' : 'Đăng ký miễn phí'}
          </button>
        </p>
      )}

      {/* ── Footer ── */}
      {!hideFooter && (
        <div className="mt-5 flex items-center justify-center gap-3 text-[10.5px] text-black/40 font-semibold tracking-wide">
          <button onClick={() => onNavigate('landing')} className="hover:text-black/70 cursor-pointer transition-colors">Trang chủ</button>
          <span className="w-[3px] h-[3px] rounded-full bg-black/10" />
          <button className="hover:text-black/70 cursor-pointer transition-colors">Điều khoản</button>
          <span className="w-[3px] h-[3px] rounded-full bg-black/10" />
          <button className="hover:text-black/70 cursor-pointer transition-colors">Bảo mật</button>
        </div>
      )}
    </div>
  );
}
