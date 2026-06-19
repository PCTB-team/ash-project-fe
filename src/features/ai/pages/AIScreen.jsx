import React from 'react';

export default function AIScreen() {
  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-4 md:px-8 pb-10 pt-5 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white mb-4 shadow-lg">
        <i className="bi bi-robot text-[28px]" />
      </div>
      <h1 className="text-xl font-semibold text-[#1d1d1f] mb-2">Trợ lý AI (Đang phát triển)</h1>
      <p className="text-[13px] text-black/50 font-medium max-w-md">
        Tính năng trợ lý học tập AI sẽ sớm ra mắt. Bạn có thể trò chuyện, tóm tắt tài liệu và hỏi đáp trực tiếp.
      </p>
    </div>
  );
}
