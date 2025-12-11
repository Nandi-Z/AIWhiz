import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface InputAreaProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 pb-6 md:pb-8 transition-all duration-300 z-10">
      <div className="max-w-3xl mx-auto relative">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          <div className="relative flex-grow shadow-lg rounded-3xl bg-white border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all duration-200 overflow-hidden">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer..."
              className="w-full py-3.5 pl-5 pr-12 bg-transparent resize-none outline-none text-slate-700 placeholder-slate-400 max-h-[120px] scrollbar-hide"
              rows={1}
              disabled={disabled}
            />
             {/* Decorative icon inside input */}
            <div className="absolute right-3 bottom-3 text-indigo-400 pointer-events-none">
                <Sparkles size={16} className="opacity-50" />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className={`
              flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-200
              ${!input.trim() || disabled 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed scale-95' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 hover:shadow-xl active:scale-95'}
            `}
          >
            <Send size={20} className={input.trim() && !disabled ? 'ml-0.5' : ''} />
          </button>
        </form>
        <div className="text-center mt-2">
           <p className="text-[10px] text-gray-400 font-medium">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>
    </div>
  );
};