/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'antd';
import {
  simulationData,
  problemsList,
  solutionsList,
  featuresList
} from '../utils/intro.mock';
import IntroHeader from '../components/IntroHeader';
import IntroFooter from '../components/IntroFooter';
import './intro_styles.css';

export default function IntroScreen({ onNavigate }) {
  // Live breathing AI terminal simulation states
  const [terminalLines, setTerminalLines] = useState([simulationData[0]]);
  const terminalIndexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (terminalIndexRef.current + 1) % (simulationData.length / 2);
      terminalIndexRef.current = nextIndex;
      const userMsg = simulationData[nextIndex * 2];
      const aiMsg = simulationData[nextIndex * 2 + 1];

      // Append messages with staggered delay
      setTerminalLines([userMsg]);
      setTimeout(() => {
        setTerminalLines([userMsg, aiMsg]);
      }, 1000);
    }, 7000);

    return () => clearInterval(interval);
  }, []);



  return (
    <div className="bg-[#fafafb] text-[#1d1d1f] min-h-screen flex flex-col font-sans relative overflow-hidden select-none">

      {/* Visual lighting background blooms - Soft luxury Apple-style HSL glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-[#ff5c00]/3 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse duration-[8s]" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[#007aff]/3 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-[10s]" />
      <div className="absolute top-[35%] left-[20%] w-[40%] h-[40%] bg-[#a855f7]/2 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Top Navigation Bar Component */}
      <IntroHeader onNavigate={onNavigate} />

      {/* Main Content */}
      <main className="pt-[68px] flex-1">

        {/* HERO SECTION */}
        <section className="relative min-h-[640px] lg:min-h-[760px] flex items-center overflow-hidden py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Copywriting */}
            <motion.div
              className="z-10 text-left lg:col-span-7 space-y-7"
            >
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#ff5c00]/10 border border-[#ff5c00]/20 text-[#ff5c00] font-semibold text-[10.5px] px-4 py-2 rounded-full inline-flex items-center gap-2 tracking-wider uppercase backdrop-blur-md shadow-sm"
              >
                <i className="bi bi-rocket-takeoff text-[#ff5c00] animate-bounce" /> Đón đầu công nghệ AI trong giáo dục
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="text-[46px] md:text-[54px] lg:text-[66px] font-semibold tracking-tight text-[#1d1d1f] mb-3 leading-[1.03]"
              >
                Học tập thông minh hơn với{' '}
                <span className="bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] bg-clip-text text-transparent block mt-2">Trí tuệ nhân tạo</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="text-[16px] lg:text-[18.5px] text-black/55 max-w-xl leading-relaxed font-medium"
              >
                Nền tảng quản trị tài liệu học tập tập trung kết hợp trợ lý AI thế hệ mới. Giải pháp số hóa giúp bạn lưu trữ, tra cứu và tương tác với tri thức nhanh gọn, hiệu quả nhất.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  onClick={() => onNavigate('login')}
                  className="group !h-12 !px-8 !text-white !bg-gradient-to-b !from-[#ff7a00] !to-[#ff5c00] !font-medium !text-[14px] !border-none !shadow-[0_1px_3px_rgba(255,92,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] orange-glow hover:!brightness-110 hover:!shadow-[0_8px_24px_rgba(255,92,0,0.4)] transition-all duration-300 flex items-center gap-2"
                >
                  Khám phá ngay <i className="bi bi-arrow-right text-[15px] group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button
                  shape="round"
                  size="large"
                  onClick={() => onNavigate('login')}
                  className="!h-12 !px-8 !border !border-[#ff5c00]/30 hover:!border-[#ff5c00] !bg-[#ff5c00]/[0.02] hover:!bg-[#ff5c00]/[0.08] !shadow-sm transition-all duration-300 group"
                >
                  <span className="font-semibold text-[#ff5c00] group-hover:text-[#ff3b00] transition-colors text-[14px]">
                    Tài khoản dùng thử
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column: Breathtaking Interactive AI Terminal Simulator Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative lg:col-span-5 flex justify-center z-10"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-[#ff5c00]/15 via-[#a855f7]/10 to-[#007aff]/15 rounded-full blur-[70px] pointer-events-none -z-10 animate-pulse duration-[4s]" />
              <div className="w-full max-w-[450px] bg-[#1c1c1e] rounded-3xl p-4 shadow-2xl relative overflow-hidden border border-white/[0.08] hover-card-depth transition-transform">
                {/* Terminal top header */}
                <div className="flex justify-between items-center pb-3 border-b border-white/[0.06] mb-4">
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff453a] inline-block" />
                    <span className="w-3 h-3 rounded-full bg-[#ffcc00] inline-block" />
                    <span className="w-3 h-3 rounded-full bg-[#32d74b] inline-block" />
                  </div>
                  <span className="text-[10px] text-white/40 font-semibold uppercase tracking-widest font-mono">Capy Study • Terminal</span>
                </div>

                {/* Simulated message logs */}
                <div className="space-y-4 font-mono text-[12px] h-[260px] overflow-hidden flex flex-col justify-start">
                  <AnimatePresence mode="popLayout">
                    {terminalLines.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-left space-y-1.5"
                      >
                        <div className="font-semibold flex items-center gap-1.5 mb-1.5">
                          {line.type === 'user' ? (
                            <>
                              <span className="drop-shadow-sm">🧑‍🎓</span>
                              <span className="bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-transparent bg-clip-text tracking-wide drop-shadow-sm">Tài khoản Sinh viên</span>
                            </>
                          ) : (
                            <>
                              <span className="drop-shadow-sm">🤖</span>
                              <span className="text-[#30d158] tracking-wide">Trợ lý AI</span>
                            </>
                          )}
                        </div>
                        <p className="text-white/80 whitespace-pre-wrap pl-2 leading-relaxed bg-white/[0.02] p-2 rounded-xl border border-white/[0.03]">
                          {line.text}
                          {i === terminalLines.length - 1 && line.type === 'ai' && (
                            <span className="inline-block w-1.5 h-3 ml-1 bg-white/60 animate-pulse relative top-0.5" />
                          )}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Active connection light */}
                <div className="pt-3 border-t border-white/[0.06] mt-4 flex items-center justify-between text-[10px] font-semibold font-mono text-white/30">
                  <span>SYSTEM: CONNECTED</span>
                  <span className="flex items-center gap-1.5 text-[#30d158]">
                    <span className="w-2 h-2 rounded-full bg-[#30d158] animate-ping" />
                    STANDBY
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* SECTION: PROBLEM VS SOLUTION */}
        <section className="py-28 bg-[#f5f5f7] border-y border-black/[0.04] relative">
          <div className="max-w-7xl mx-auto px-6 md:px-12">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h2 className="text-[32px] md:text-[40px] font-semibold text-[#1d1d1f] mb-4 tracking-tight">
                Giải quyết trọn vẹn rào cản ôn tập
              </h2>
              <p className="text-black/50 max-w-xl mx-auto text-[15px] font-semibold">
                Chúng tôi tái định nghĩa cách tiếp cận tri thức đại học cho sinh viên kỷ nguyên số.
              </p>
              <div className="w-16 h-[3px] bg-[#ff5c00] mx-auto rounded-full mt-4" />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">

              {/* Problem Panel */}
              <motion.div
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 md:p-10 rounded-3xl border border-black/5 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-8 text-[#ff3b30]">
                    <div className="w-10 h-10 bg-[#ff3b30]/10 rounded-xl flex items-center justify-center border border-[#ff3b30]/20 shadow-sm">
                      <i className="bi bi-x-circle-fill text-[20px]" />
                    </div>
                    <h3 className="text-[21px] font-semibold text-black tracking-tight">Khó khăn thường gặp</h3>
                  </div>
                  <ul className="space-y-6 text-left">
                    {problemsList.map((text, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-[#ff3b30]/10 border border-[#ff3b30]/20 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          <i className="bi bi-x text-[#ff3b30] text-[14px]" />
                        </div>
                        <p className="text-[14px] font-medium text-black/55 leading-relaxed">{text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 border-t border-black/5 pt-4 text-[10.5px] font-semibold text-black/30 uppercase tracking-widest text-right">
                  Quy trình ôn thi phân tán, thiếu liên kết
                </div>
              </motion.div>

              {/* Solution Panel */}
              <motion.div
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 md:p-10 rounded-3xl border border-[#ff5c00]/15 flex flex-col justify-between shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff5c00]/4 rounded-full blur-3xl pointer-events-none" />
                <div>
                  <div className="flex items-center gap-3.5 mb-8 text-[#34c759]">
                    <div className="w-10 h-10 bg-[#34c759]/10 rounded-xl flex items-center justify-center border border-[#34c759]/20 shadow-sm">
                      <i className="bi bi-check-circle-fill text-[20px]" />
                    </div>
                    <h3 className="text-[21px] font-semibold text-black tracking-tight">Giải pháp từ Capy Study</h3>
                  </div>
                  <ul className="space-y-6 text-left">
                    {solutionsList.map((text, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-[#34c759]/10 border border-[#34c759]/20 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          <i className="bi bi-check2 text-[#34c759] text-[14px]" />
                        </div>
                        <p className="text-[14px] font-medium text-black/75 leading-relaxed">{text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 border-t border-black/5 pt-4 text-[10.5px] font-semibold text-[#ff5c00] uppercase tracking-widest text-right">
                  Hệ sinh thái tri thức tích hợp AI
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* SECTION: PREMIUM FEATURES GRID */}
        <section id="features-section" className="py-28 bg-[#fafafb]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h2 className="text-[32px] md:text-[40px] font-semibold text-black mb-4 tracking-tight">Đột phá các công cụ thông minh</h2>
              <p className="text-black/50 max-w-xl mx-auto text-[15px] font-semibold">Trang bị sức mạnh công nghệ tối đa cho lộ trình học tập của bạn.</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuresList.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  onClick={() => {
                    const redirectMap = { dashboard: '/dashboard', ai: '/ai', community: '/group' };
                    onNavigate('login', redirectMap[f.view] || '/dashboard');
                  }}
                  className="p-6 bg-white border border-black/5 rounded-3xl transition-all duration-300 cursor-pointer group flex flex-col justify-between hover-card-depth shadow-sm relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#ff5c00]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="space-y-5 relative z-10">
                    <div className="w-11 h-11 bg-black/[0.01] border border-black/5 rounded-xl flex items-center justify-center text-[#ff5c00] group-hover:bg-[#ff5c00] group-hover:text-white transition-all duration-300 shadow-md">
                      <i className={`bi ${f.icon} text-[20px]`} />
                    </div>
                    <h4 className="text-[17px] font-semibold text-black group-hover:text-[#ff5c00] transition-colors">{f.title}</h4>
                    <p className="text-[13.5px] text-black/50 leading-relaxed font-medium">{f.desc}</p>
                  </div>
                  <div className="mt-6 text-[12px] font-semibold text-[#ff5c00] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {f.link} <i className="bi bi-arrow-right text-[11px]" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer Component */}
      <IntroFooter onNavigate={onNavigate} />
    </div>
  );
}
