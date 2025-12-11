import React from 'react';
import { ChatInterface } from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <ChatInterface />
    </div>
  );
};

export default App;