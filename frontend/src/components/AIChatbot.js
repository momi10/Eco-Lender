import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm your Eco-Lender AI Assistant. I can help you analyze investment trends, evaluate project risks, or suggest categories with high returns. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responseText = generateAIResponse(userMessage.text);
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: responseText }
      ]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // 1.5 - 2.5s delay
  };

  const generateAIResponse = (query) => {
    const q = query.toLowerCase();
    
    if (q.includes('trend') || q.includes('popular')) {
      return "Based on recent platform data, Renewable Energy and Sustainable Agriculture are currently the highest trending categories, showing a 24% increase in funding speed this quarter. Would you like me to find some active projects in these areas?";
    }
    if (q.includes('risk') || q.includes('safe')) {
      return "For low-risk investments, I recommend looking at fully-funded projects that are opening secondary rounds, or projects with 'Low' risk scores in the Community Development sector. Our AI risk analysis suggests diversifying across at least 3 categories.";
    }
    if (q.includes('return') || q.includes('yield') || q.includes('profit') || q.includes('interest')) {
      return "Projects offering between 8% to 12% APY are currently yielding the best balance of return and completion rate. Clean Water initiatives typically offer steady 6% returns with very low default rates.";
    }
    if (q.includes('project') || q.includes('invest')) {
      return "When evaluating a project, I look at the borrower's credit score, the funding traction, and the environmental impact metric. Is there a specific project you'd like me to analyze for you?";
    }
    if (q.includes('hello') || q.includes('hi')) {
      return `Hello ${user?.firstName || 'there'}! How can I assist your eco-investing journey today?`;
    }

    return "That's an interesting question. While I'm still learning about specific niche metrics, I'd suggest checking out the Analytics page for a macro view of your portfolio, or the Explore Projects page to see AI Match Scores for individual projects.";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 flex flex-col overflow-hidden border border-purple-200 dark:border-purple-900 transition-all duration-300 transform origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={24} className="text-purple-100" />
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1">Eco-Lender AI <Sparkles size={12} className="text-yellow-300" /></h3>
                <p className="text-xs text-purple-200">Investment Assistant</p>
              </div>
            </div>
            <button onClick={toggleChat} className="text-purple-100 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96 min-h-[300px] bg-gray-50 dark:bg-gray-900/50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-green-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-900/50 text-gray-800 dark:text-gray-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%] flex-row">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-100 text-purple-700">
                    <Bot size={16} />
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-purple-100 rounded-tl-none shadow-sm flex gap-1 items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about trends, risks, or projects..."
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white focus:ring-2 focus:ring-purple-500 rounded-full text-sm outline-none transition-all"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Send size={18} className="ml-1" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-gray-800' : 'bg-gradient-to-r from-purple-600 to-indigo-600 animate-bounce-slow'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
      
      {/* Pulse effect behind button when closed */}
      {!isOpen && (
        <div className="absolute w-14 h-14 bg-purple-500 rounded-full opacity-20 animate-ping -z-10"></div>
      )}
    </div>
  );
};

export default AIChatbot;
