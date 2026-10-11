import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShieldAlert,
  Bot,
  User,
  RefreshCw,
  FileText
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { speechService } from '../../lib/speech';

export const HealthAgentChat: React.FC = () => {
  const { chatMessages, sendChatMessage, clearChat, isChatResponding, language, activeMember } = useHealth();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatResponding]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isChatResponding) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  const handleToggleVoiceInput = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechService.startListening(
        language,
        (transcript) => {
          setInputText(transcript);
          setIsListening(false);
        },
        (error) => {
          console.warn('Voice recognition error:', error);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  const handleSpeakReply = (msgId: string, content: string) => {
    if (speakingMsgId === msgId) {
      speechService.stop();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msgId);
      speechService.speak(content, language, () => setSpeakingMsgId(null));
    }
  };

  const quickPrompts = [
    'Explain my Inamdar LFT liver report',
    'Why is my SGPT 78.32 and Bilirubin 1.9?',
    'What foods should I eat or avoid?',
    'What questions should I ask Dr. Shalini Vijay?'
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col bg-white rounded-3xl border border-purple-100 shadow-sm shadow-purple-500/5 overflow-hidden select-none">
      {/* Chat Header */}
      <div className="p-4 sm:px-6 border-b border-purple-100 bg-purple-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>AYUSH+ Health Agent</span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-purple-100 text-purple-700">
                Active for {activeMember}
              </span>
            </h3>
            <p className="text-[11px] text-purple-600/70 font-medium">
              Answers grounded exclusively in your private uploaded medical reports
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="text-xs font-semibold text-purple-600 hover:text-purple-900 hover:bg-purple-100/60 px-3 py-1.5 rounded-xl transition"
        >
          Reset Session
        </button>
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="px-4 py-2 bg-purple-50/30 border-b border-purple-100 text-[11px] text-purple-800/80 flex items-center gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-purple-500 shrink-0" />
        <span>AYUSH+ Copilot provides informational explanations of your lab records. Always consult a licensed clinician.</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {chatMessages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isAssistant
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-800 text-white'
                }`}
              >
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isAssistant
                    ? 'bg-purple-50/70 border border-purple-150 text-slate-900 shadow-xs'
                    : 'bg-purple-600 text-white font-medium'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>

                {/* Sources & Speak Button */}
                {isAssistant && (
                  <div className="mt-3 pt-2 border-t border-purple-200/60 flex items-center justify-between text-[10px] text-purple-700/80">
                    <span className="flex items-center gap-1 font-semibold">
                      <FileText className="w-3 h-3" />
                      Sources: Inamdar Hospital LFT (Jan 13, 2024)
                    </span>

                    <button
                      onClick={() => handleSpeakReply(msg.id, msg.content)}
                      className="flex items-center gap-1 font-bold text-purple-800 hover:text-purple-950 px-2 py-0.5 rounded-lg bg-white/60 hover:bg-white transition"
                    >
                      {speakingMsgId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{speakingMsgId === msg.id ? 'Stop' : 'Speak Reply'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isChatResponding && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-purple-50 p-3 rounded-2xl border border-purple-150 text-xs text-purple-700 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing your medical records...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="px-4 py-2 border-t border-purple-100 flex items-center gap-2 overflow-x-auto bg-purple-50/20">
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 shrink-0">
          Suggested:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => sendChatMessage(qp)}
            className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-[11px] font-semibold transition shrink-0 whitespace-nowrap"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-purple-100 bg-white flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleVoiceInput}
          className={`p-2.5 rounded-2xl border transition ${
            isListening
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
              : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
          }`}
          title={isListening ? 'Listening... click to stop' : 'Click to speak your question'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          placeholder="Ask a question about your reports, SGPT, medicines, or doctor visit..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-purple-50/50 border border-purple-200 rounded-2xl text-xs text-slate-900 outline-none focus:border-purple-400 focus:bg-white font-medium"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isChatResponding}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-purple-500/20 disabled:opacity-40 transition flex items-center gap-1.5"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
