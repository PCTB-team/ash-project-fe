
import {
  footerProducts,
  footerCommunity,
  footerSupport
} from '../utils/intro.mock';

export default function IntroFooter({ onNavigate }) {
  return (
    <footer className="bg-[#f5f5f7] py-16 border-t border-black/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12 text-left">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <span className="text-[16px] font-semibold text-black block tracking-tight">Capy Study</span>
            <p className="text-[12.5px] text-black/50 leading-relaxed font-medium">
              Nền tảng quản lý tài liệu và học tập thông minh dành cho sinh viên Việt Nam — được hỗ trợ bởi AI.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-black text-[13.5px] mb-5">Sản phẩm</h5>
            <ul className="space-y-3 text-[12.5px] text-black/55 font-medium">
              {footerProducts.map((item, i) => (
                <li key={i}><button onClick={() => onNavigate(item.action, item.redirect)} className="hover:text-black transition-colors cursor-pointer">{item.label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-black text-[13.5px] mb-5">Hỗ trợ</h5>
            <ul className="space-y-3 text-[12.5px] text-black/55 font-medium">
              {footerCommunity.map((item, i) => (
                <li key={i}><button onClick={() => onNavigate(item.action)} className="hover:text-black transition-colors cursor-pointer">{item.label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-black text-[13.5px] mb-5">Liên hệ</h5>
            <ul className="space-y-3 text-[12.5px] text-black/55 font-medium font-sans">
              {footerSupport.map((item, i) => (
                <li key={i}>
                  {item.color ? <span className={item.color}>{item.label}</span> : item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-black/45 font-medium">
          <p>© 2026 Capy Study — Đồ án môn học. Made with ❤️ by Team Capy.</p>
          <div className="flex gap-6">
            <span className="hover:text-black cursor-pointer transition-colors">Điều khoản</span>
            <span className="hover:text-black cursor-pointer transition-colors">Bảo mật</span>
            <span className="hover:text-black cursor-pointer transition-colors">Sơ đồ trang</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
