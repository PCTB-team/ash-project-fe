
import {
  footerProducts,
  footerProjectInfo,
  footerContact
} from '../utils/intro.mock';

import { useNavigate } from 'react-router-dom';

export default function IntroFooter() {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#f5f5f7] py-16 border-t border-black/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12 text-left">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <span className="text-[16px] font-semibold text-black block">Capy Study</span>
            <p className="text-[12.5px] text-black/50 leading-relaxed font-medium">
              Nền tảng quản lý tài liệu và học tập thông minh dành cho sinh viên Việt Nam — được hỗ trợ bởi AI.
            </p>
          </div>

          {/* Sản phẩm — real links that redirect to login */}
          <div>
            <h5 className="font-semibold text-black text-[13.5px] mb-5">Sản phẩm</h5>
            <ul className="space-y-3 text-[12.5px] text-black/55 font-medium">
              {footerProducts.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => navigate(`/login?redirect=${encodeURIComponent(item.redirect)}`)}
                    className="hover:text-[#ff5c00] transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Dự án — static info, no dead links */}
          <div>
            <h5 className="font-semibold text-black text-[13.5px] mb-5">Công nghệ</h5>
            <ul className="space-y-3 text-[12.5px] text-black/55 font-medium">
              {footerProjectInfo.map((item, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <i className="bi bi-check2 text-[#34c759] text-[10px]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h5 className="font-semibold text-black text-[13.5px] mb-5">Liên hệ</h5>
            <ul className="space-y-3 text-[12.5px] text-black/55 font-medium">
              {footerContact.map((item, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  {item.type === 'email' ? (
                    <a href={`mailto:${item.label}`} className={`${item.color || ''} hover:underline transition-colors`}>
                      {item.label}
                    </a>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-black/45 font-medium">
          <p>© 2026 Capy Study — Đồ án môn học. Made with ❤️ by Team Capy.</p>
          <div className="flex gap-6">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-black cursor-pointer transition-colors">
              Về đầu trang ↑
            </button>
            <button onClick={() => navigate('/login')} className="hover:text-[#ff5c00] cursor-pointer transition-colors">
              Đăng nhập
            </button>
            <button onClick={() => navigate('/register')} className="hover:text-[#ff5c00] cursor-pointer transition-colors">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
