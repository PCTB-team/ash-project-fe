import { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage.jsx';
import WelcomePrompts from './WelcomePrompts.jsx';

export default function MessageList({ messages, onSelectPrompt }) {
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, messages[messages.length - 1]?.content]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <WelcomePrompts onSelectPrompt={onSelectPrompt} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar">
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-6 space-y-5">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>
    </div>
  );
}
