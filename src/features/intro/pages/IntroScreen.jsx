/**
 * IntroScreen — Capy Study Landing Page
 * Redesigned to showcase actual dashboard features
 */

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from 'antd';
import {
  dashboardPreviewFiles
} from '../utils/intro.mock';
import IntroHeader from '../components/IntroHeader';
import IntroFooter from '../components/IntroFooter';
import './intro_styles.css';
import { useNavigate } from 'react-router-dom';

/* ── Reusable fade-in variant ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
});

/* ── Animated Stat Counter ── */
function StatItem({ item, index }) {
  return (
    <motion.div {...fadeUp(index * 0.1)} className="text-center px-4 py-3">
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <i className={`bi ${item.icon} text-[#ff5c00] text-[18px]`} />
        <span className="text-[28px] md:text-[34px] font-bold bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] bg-clip-text text-transparent stat-value">
          {item.value}
        </span>
      </div>
      <p className="text-[12px] font-semibold text-black/45">{item.label}</p>
    </motion.div>
  );
}

/* ── Dashboard Mockup Component ── */
function DashboardMockup() {
  const fileTypeColors = { pdf: '#ff3b30', docx: '#007aff', pptx: '#ff9500' };
  return (
    <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] overflow-hidden animate-float relative">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.04] bg-[#fafafb]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff453a]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffcc00]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#32d74b]" />
          </div>
          <span className="text-[10px] font-semibold text-black/30 ml-2">Tài liệu của tôi</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-[#1d1d1f] text-white text-[8px] font-semibold">Tất cả</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 text-[8px] font-medium">Tài liệu</span>
          <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-500 text-[8px] font-medium">Hình ảnh</span>
        </div>
      </div>
      {/* File rows */}
      <div className="divide-y divide-black/[0.03]">
        {dashboardPreviewFiles.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
            className="flex items-center gap-3 px-4 py-2.5 mockup-row-shimmer hover:bg-black/[0.015] transition-colors"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold`}
              style={{ backgroundColor: fileTypeColors[f.type] || '#8e8e93' }}>
              {f.type.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-black truncate">{f.name}</p>
              <p className="text-[9px] text-black/35 font-medium">{f.time}</p>
            </div>
            <span className="text-[9px] text-black/30 font-medium flex-shrink-0">{f.size}</span>
          </motion.div>
        ))}
      </div>
      {/* Bottom bar */}
      <div className="px-4 py-2 border-t border-black/[0.04] bg-[#fafafb] flex items-center justify-between">
        <span className="text-[8px] text-black/25 font-semibold">4 tài liệu · Trang 1/1</span>
        <div className="flex items-center gap-1">
          <span className="w-5 h-5 rounded bg-[#ff5c00] text-white text-[8px] font-bold flex items-center justify-center">1</span>
        </div>
      </div>
    </div>
  );
}

/* ── Feature Card ── */
function FeatureCard({ feature, index }) {
  const navigate = useNavigate();
  const colorClass = ['feature-card-blue', 'feature-card-orange', 'feature-card-green'][index] || '';
  const redirectMap = { dashboard: '/dashboard', ai: '/dashboard/ai', community: '/dashboard/group' };

  return (
    <motion.div
      {...fadeUp(index * 0.15)}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/login?redirect=${encodeURIComponent(redirectMap[feature.view] || '/dashboard')}`)}
      className={`bg-white p-7 md:p-8 rounded-3xl border border-black/[0.05] cursor-pointer group hover-card-depth shadow-sm relative overflow-hidden ${colorClass}`}
    >
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ backgroundColor: `${feature.color}10` }} />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-sm border transition-all duration-300 group-hover:scale-110"
          style={{
            backgroundColor: `${feature.color}10`,
            borderColor: `${feature.color}20`,
            color: feature.color
          }}>
          <i className={`bi ${feature.icon} text-xl`} />
        </div>

        <h3 className="text-[19px] font-semibold text-[#1d1d1f] mb-3 group-hover:text-[#ff5c00] transition-colors">
          {feature.title}
        </h3>
        <p className="text-[13.5px] text-black/50 leading-relaxed font-medium mb-5">
          {feature.desc}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {(typeof feature.highlights === 'string' ? feature.highlights.split(',') : (feature.highlights || [])).map((h, i) => (
            <span key={i} className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-black/[0.06] bg-black/[0.01] text-black/50">
              {typeof h === 'string' ? h.trim() : h}
            </span>
          ))}
        </div>

        <div className="text-[12.5px] font-semibold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ color: feature.color }}>
          {feature.link} <i className="bi bi-arrow-right text-[11px] group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   MAIN INTRO SCREEN
   ══════════════════════════════════════ */
export default function IntroScreen() {
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  const [config, setConfig] = useState({
    heroBadge: 'Nền tảng học tập thông minh',
    heroTitle1: 'Quản lý tài liệu.',
    heroTitle2: 'Học cùng AI.',
    heroTitle3: 'Kết nối tri thức.',
    heroDesc: 'Capy Study giúp sinh viên lưu trữ tài liệu tập trung, tra cứu thông minh với AI, và học nhóm hiệu quả — tất cả trong một nền tảng duy nhất.',
    primaryBtnText: 'Bắt đầu miễn phí',
    bgStyle: 'default',
    stats: [
      { value: '1,000+', label: 'Tài liệu đã lưu trữ', icon: 'bi-file-earmark-text' },
      { value: '500+', label: 'Sinh viên tin dùng', icon: 'bi-people' },
      { value: '24/7', label: 'Trợ lý AI luôn sẵn sàng', icon: 'bi-robot' },
      { value: '100%', label: 'Miễn phí sử dụng', icon: 'bi-shield-check' },
    ],
    features: [
      {
        icon: 'bi-folder2-open', color: '#007aff', title: 'Quản lý tài liệu thông minh', desc: 'Tải lên PDF, DOCX, hình ảnh, video bài giảng — tất cả được tổ chức khoa học trong một nơi duy nhất. Phân loại tự động theo định dạng, tìm kiếm tức thì, quản lý thư mục lồng nhau.', highlights: 'Upload kéo thả, Phân loại tự động, Tìm kiếm thông minh, Quản lý folder', link: 'Quản lý ngay', view: 'dashboard'
      },
      {
        icon: 'bi-stars', color: '#ff5c00', title: 'Trợ lý AI học thuật', desc: 'Đặt câu hỏi, tóm tắt giáo trình hàng trăm trang chỉ trong vài giây. AI hiểu ngữ cảnh tài liệu của bạn, hỗ trợ giải đáp và tạo đề ôn thi cá nhân hóa.', highlights: 'Tóm tắt tài liệu, Giải đáp câu hỏi, Tạo đề ôn thi, Phân tích nội dung', link: 'Trò chuyện với AI', view: 'ai'
      },
      {
        icon: 'bi-people-fill', color: '#34c759', title: 'Nhóm học tập', desc: 'Tạo nhóm riêng, mời bạn bè bằng link, chia sẻ tài liệu và cùng thảo luận. Kết nối tri thức cùng đồng đội trong nhóm học tập trực tuyến.', highlights: 'Tạo nhóm học tập, Chia sẻ qua link, Thảo luận nhóm, Quản lý thành viên', link: 'Vào nhóm học tập', view: 'community'
      }
    ],
    steps: [
      { step: 1, icon: 'bi-person-plus-fill', title: 'Đăng ký tài khoản', desc: 'Tạo tài khoản miễn phí chỉ trong 30 giây với email hoặc tài khoản Google.' },
      { step: 2, icon: 'bi-cloud-arrow-up-fill', title: 'Tải lên tài liệu', desc: 'Upload giáo trình, slide, bài giảng — hệ thống tự động phân loại và lưu trữ đám mây an toàn.' },
      { step: 3, icon: 'bi-lightning-charge-fill', title: 'Học thông minh với AI', desc: 'Đặt câu hỏi cho AI, tóm tắt tài liệu, tham gia nhóm học tập — tất cả trên một nền tảng.' }
    ],
    ctaTitle: 'Sẵn sàng nâng cấp cách học?',
    ctaDesc: 'Tham gia cùng hàng trăm sinh viên đang sử dụng Capy Study để quản lý tài liệu và học tập hiệu quả hơn mỗi ngày.',
    ctaBtn: 'Đăng ký miễn phí'
  });

  useEffect(() => {
    const saved = localStorage.getItem('capy_intro_config');
    if (saved) {
      try {
        setConfig(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {}
    }
  }, []);

  let bgBlooms = (
    <>
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-[#ff5c00]/3 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse duration-[8s]" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[#007aff]/3 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-[10s]" />
      <div className="absolute top-[35%] left-[20%] w-[40%] h-[40%] bg-[#a855f7]/2 rounded-full blur-[100px] pointer-events-none -z-10" />
    </>
  );
  if (config.bgStyle === 'orange') {
    bgBlooms = (
      <>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#ff5c00]/6 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse duration-[8s]" />
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] bg-[#ffaa00]/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-[10s]" />
      </>
    );
  } else if (config.bgStyle === 'purple') {
     bgBlooms = (
       <>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#a855f7]/6 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse duration-[8s]" />
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] bg-[#c084fc]/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-[10s]" />
       </>
     );
  } else if (config.bgStyle === 'blue') {
     bgBlooms = (
       <>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#0ea5e9]/6 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse duration-[8s]" />
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] bg-[#0284c7]/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-[10s]" />
       </>
     );
  } else if (config.bgStyle === 'mono') {
     bgBlooms = (
       <>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#94a3b8]/6 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse duration-[8s]" />
       </>
     );
  }

  return (
    <div className="bg-[#fafafb] text-[#1d1d1f] min-h-screen flex flex-col font-sans relative overflow-hidden select-none">

      {/* Background Blooms */}
      {bgBlooms}

      <IntroHeader />

      <main className="pt-[68px] flex-1">

        {/* ═══ SECTION 1: HERO ═══ */}
        <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid lg:grid-cols-12 gap-12 items-center">

            {/* Left: Copy */}
            <div className="z-10 text-left lg:col-span-6 space-y-6">
              <motion.span {...fadeUp(0)}
                className="bg-[#ff5c00]/10 border border-[#ff5c00]/20 text-[#ff5c00] font-semibold text-[10.5px] px-4 py-2 rounded-full inline-flex items-center gap-2 uppercase backdrop-blur-md shadow-sm">
                <i className="bi bi-mortarboard-fill text-[#ff5c00]" /> {config.heroBadge}
              </motion.span>

              <motion.h1 {...fadeUp(0.1)}
                className="text-[42px] md:text-[50px] lg:text-[60px] font-semibold text-[#1d1d1f] leading-[1.05]">
                {config.heroTitle1}{' '}
                <span className="bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] bg-clip-text text-transparent">{config.heroTitle2}</span>{' '}
                <span className="block mt-1 text-[#1d1d1f]">{config.heroTitle3}</span>
              </motion.h1>

              <motion.p {...fadeUp(0.2)}
                className="text-[15.5px] lg:text-[17px] text-black/50 max-w-lg leading-relaxed font-medium">
                {config.heroDesc}
              </motion.p>

              <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-4 pt-2">
                <Button type="primary" shape="round" size="large"
                  onClick={() => navigate('/register')}
                  className="group !h-12 !px-8 !text-white !bg-gradient-to-b !from-[#ff7a00] !to-[#ff5c00] !font-medium !text-[14px] !border-none !shadow-[0_1px_3px_rgba(255,92,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] orange-glow hover:!brightness-110 hover:!shadow-[0_8px_24px_rgba(255,92,0,0.4)] transition-all duration-300 flex items-center gap-2">
                  {config.primaryBtnText} <i className="bi bi-arrow-right text-[15px] group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button shape="round" size="large"
                  onClick={() => navigate('/login')}
                  className="!h-12 !px-8 !border !border-[#ff5c00]/30 hover:!border-[#ff5c00] !bg-[#ff5c00]/[0.02] hover:!bg-[#ff5c00]/[0.08] !shadow-sm transition-all duration-300 group">
                  <span className="font-semibold text-[#ff5c00] group-hover:text-[#ff3b00] transition-colors text-[14px]">
                    Đã có tài khoản
                  </span>
                </Button>
              </motion.div>
            </div>

            {/* Right: Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="relative lg:col-span-6 flex justify-center z-10"
            >
              {/* Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#ff5c00]/10 via-[#a855f7]/5 to-[#007aff]/10 rounded-full blur-[80px] pointer-events-none -z-10" />

              <DashboardMockup />

              {/* Floating Badges */}
              <div className="absolute -top-2 -right-2 md:top-2 md:-right-6 animate-badge-1">
                <div className="bg-white/90 backdrop-blur-md border border-black/[0.06] rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
                  <span className="text-[14px]">🤖</span>
                  <span className="text-[10px] font-semibold text-black/60">AI Ready</span>
                </div>
              </div>
              <div className="absolute -bottom-2 -left-2 md:bottom-6 md:-left-6 animate-badge-2">
                <div className="bg-white/90 backdrop-blur-md border border-black/[0.06] rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
                  <span className="text-[14px]">☁️</span>
                  <span className="text-[10px] font-semibold text-black/60">Cloud Sync</span>
                </div>
              </div>
              <div className="absolute top-1/2 -right-4 md:-right-10 animate-badge-3 hidden md:block">
                <div className="bg-white/90 backdrop-blur-md border border-black/[0.06] rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
                  <span className="text-[14px]">👥</span>
                  <span className="text-[10px] font-semibold text-black/60">Study Groups</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ SECTION 2: STATS BAR ═══ */}
        <section ref={statsRef} className="py-10 bg-white border-y border-black/[0.04]">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 ${statsInView ? 'opacity-100' : 'opacity-0 translate-y-5'}`}>
              {(config.stats || []).map((item, i) => (
                <StatItem key={i} item={item} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SECTION 3: FEATURES SHOWCASE ═══ */}
        <section id="features-section" className="py-24 md:py-28 bg-[#fafafb]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div {...fadeUp(0)} className="text-center mb-16">
              <h2 className="text-[30px] md:text-[38px] font-semibold text-[#1d1d1f] mb-4">
                Mọi thứ bạn cần, trên một nền tảng
              </h2>
              <p className="text-black/45 max-w-lg mx-auto text-[15px] font-medium">
                Ba tính năng cốt lõi được thiết kế để nâng cấp trải nghiệm học tập của bạn.
              </p>
              <div className="w-16 h-[3px] bg-[#ff5c00] mx-auto rounded-full mt-5" />
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {(config.features || []).map((f, i) => (
                <FeatureCard key={i} feature={f} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SECTION 4: HOW IT WORKS ═══ */}
        <section className="py-24 md:py-28 bg-[#f5f5f7] border-y border-black/[0.04]">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <motion.div {...fadeUp(0)} className="text-center mb-16">
              <h2 className="text-[30px] md:text-[38px] font-semibold text-[#1d1d1f] mb-4">
                Bắt đầu chỉ trong 3 bước
              </h2>
              <p className="text-black/45 max-w-lg mx-auto text-[15px] font-medium">
                Không cần cài đặt phức tạp. Đăng ký, tải lên và bắt đầu học ngay.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting line (desktop only) */}
              <div className="hidden md:block absolute top-[52px] left-[16.67%] right-[16.67%] h-[2px] bg-gradient-to-r from-[#ff5c00]/20 via-[#ff5c00] to-[#ff5c00]/20 z-0" />

              {(config.steps || []).map((step, i) => (
                <motion.div key={i} {...fadeUp(i * 0.15)} className="relative z-10 text-center">
                  {/* Step circle */}
                  <div className="w-[72px] h-[72px] mx-auto mb-6 rounded-2xl bg-white border border-black/[0.06] shadow-md flex items-center justify-center relative">
                    <i className={`bi ${step.icon} text-[28px] text-[#ff5c00]`} />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-b from-[#ff7a00] to-[#ff5c00] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                      {i + 1}
                    </span>
                  </div>
                  <h4 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">{step.title}</h4>
                  <p className="text-[13px] text-black/45 font-medium leading-relaxed max-w-[280px] mx-auto">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SECTION 5: CTA ═══ */}
        <section className="py-20 md:py-24 cta-gradient">
          <div className="max-w-3xl mx-auto px-6 md:px-12 text-center relative z-10">
            <motion.div {...fadeUp(0)}>
              <h2 className="text-[30px] md:text-[40px] font-semibold text-white mb-4">
                {config.ctaTitle}
              </h2>
              <p className="text-white/80 text-[15px] md:text-[16px] font-medium mb-8 max-w-lg mx-auto leading-relaxed">
                {config.ctaDesc}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button shape="round" size="large"
                  onClick={() => navigate('/register')}
                  className="group !h-12 !px-8 !bg-white !text-[#ff5c00] !font-semibold !text-[14px] !border-none !shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:!shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:!scale-105 transition-all duration-300 flex items-center gap-2">
                  {config.ctaBtn} <i className="bi bi-arrow-right text-[15px] group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button shape="round" size="large"
                  onClick={() => { document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="!h-12 !px-8 !bg-white/15 !text-white !font-medium !text-[14px] !border !border-white/30 hover:!bg-white/25 !backdrop-blur-md !shadow-none transition-all duration-300">
                  Tìm hiểu thêm
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      <IntroFooter />
    </div>
  );
}
