import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Role, Message } from '../types';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div
      className={`flex w-full mb-6 ${
        isUser ? 'justify-end' : 'justify-start'
      } animate-fade-in-up`}
    >
      <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Bubble */}
        <div
          className={`relative px-5 py-3.5 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm ${
            isUser
              ? 'bg-indigo-600 text-white rounded-tr-none'
              : 'bg-white text-slate-700 border border-gray-100 rounded-tl-none'
          }`}
        >
          {message.isStreaming && message.text.length === 0 ? (
             <div className="flex space-x-1 h-6 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
          ) : (
            <div className={`prose ${isUser ? 'prose-invert' : 'prose-slate'} max-w-none break-words`}>
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          )}
          
          <div className={`text-[10px] mt-2 opacity-70 ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};