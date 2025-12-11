import React, { useState, useEffect, useRef } from 'react';
import { Message, Role } from '../types';
import { MessageBubble } from './MessageBubble';
import { InputArea } from './InputArea';
import { createChatSession, sendMessageStream } from '../services/geminiService';
import { Chat } from '@google/genai';
import { MessageSquare, RefreshCw } from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat
  useEffect(() => {
    startNewSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNewSession = () => {
    const session = createChatSession();
    setChatSession(session);
    setMessages([
      {
        id: 'init-1',
        role: Role.MODEL,
        text: "Hi there! 👋 I'm your AI assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!chatSession) return;

    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: text,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Create placeholder for bot message
    const botMsgId = (Date.now() + 1).toString();
    const botMsgPlaceholder: Message = {
      id: botMsgId,
      role: Role.MODEL,
      text: "",
      timestamp: new Date(),
      isStreaming: true
    };
    
    setMessages((prev) => [...prev, botMsgPlaceholder]);

    try {
      let accumulatedText = "";
      
      await sendMessageStream(chatSession, text, (chunk) => {
        accumulatedText += chunk;
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === botMsgId 
              ? { ...msg, text: accumulatedText } 
              : msg
          )
        );
      });

      // Finalize message
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMsgId 
            ? { ...msg, isStreaming: false } 
            : msg
        )
      );

    } catch (error) {
      console.error("Failed to send message", error);
       setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMsgId 
            ? { ...msg, text: "I'm having trouble connecting right now. Please try again.", isStreaming: false } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 relative overflow-hidden">
        
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-indigo-50 to-transparent pointer-events-none"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      {/* Header */}
      <header className="flex-shrink-0 bg-white/70 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <MessageSquare size={20} />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">AIWhiz</h1>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <button 
          onClick={startNewSession}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          title="Restart Chat"
        >
          <RefreshCw size={20} />
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-grow overflow-y-auto px-4 pt-6 pb-32 scroll-smooth" id="chat-container">
        <div className="max-w-3xl mx-auto flex flex-col">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <InputArea onSend={handleSendMessage} disabled={isLoading && !messages.some(m => m.isStreaming)} />
    </div>
  );
};