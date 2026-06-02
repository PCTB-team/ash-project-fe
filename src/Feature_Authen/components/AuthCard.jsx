import { AnimatePresence, motion } from 'framer-motion';
import { ANIM } from '../utils/constants';

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
          <div className="w-9 h-9 bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] rounded-[11px] flex items-center justify-center shadow-sm shadow-[#ff5c00]/10 group-hover:scale-[1.04] transition-transform duration-300 text-white">
            <i className="bi bi-stars text-[17px]" />
          </div>
          <span className="text-[19px] font-semibold text-[#1d1d1f] tracking-tight">{title || 'AI Study Hub'}</span>
        </div>
        <p className="text-[13px] font-normal text-black/40 leading-relaxed">
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
        <p className="text-[12.5px] text-black/35 text-center mt-6 font-normal">
          {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
          <button
            onClick={onToggleMode}
            className="text-[#0071e3] font-medium hover:text-[#0077ED] cursor-pointer transition-colors"
          >
            {isRegister ? 'Đăng nhập' : 'Đăng ký miễn phí'}
          </button>
        </p>
      )}

      {/* ── Footer ── */}
      {!hideFooter && (
        <div className="mt-5 flex items-center justify-center gap-3 text-[10px] text-black/20 font-medium tracking-wide">
          <button onClick={() => onNavigate('landing')} className="hover:text-black/50 cursor-pointer transition-colors">Trang chủ</button>
          <span className="w-[3px] h-[3px] rounded-full bg-black/10" />
          <button className="hover:text-black/50 cursor-pointer transition-colors">Điều khoản</button>
          <span className="w-[3px] h-[3px] rounded-full bg-black/10" />
          <button className="hover:text-black/50 cursor-pointer transition-colors">Bảo mật</button>
        </div>
      )}
    </div>
  );
}
