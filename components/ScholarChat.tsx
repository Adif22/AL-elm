
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, getSystemPrompt } from '../types';
import { generateScholarResponse, transcribeAudio } from '../services/geminiService';
import { useApp } from '../contexts/AppContext';

const ScholarChat: React.FC = () => {
  const { settings } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Settings - Default to 'fast' mode
  const [mode, setMode] = useState<'deep' | 'fast'>('fast');
  const [useSearch, setUseSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Attachments & Voice
  const [attachment, setAttachment] = useState<{data: string, mimeType: string, preview: string} | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // --- PERSISTENCE LOGIC START ---
  // Load chat history from local storage on mount
  useEffect(() => {
      const savedHistory = localStorage.getItem('chat_history');
      if (savedHistory) {
          try {
              setMessages(JSON.parse(savedHistory));
          } catch (e) { console.error("Error parsing chat history", e); }
      } else {
          // Initialize greeting if no history
          initializeGreeting();
      }
  }, []);

  // Save chat history whenever messages change
  useEffect(() => {
      if (messages.length > 0) {
          localStorage.setItem('chat_history', JSON.stringify(messages));
      }
      scrollToBottom();
  }, [messages]);

  const initializeGreeting = () => {
     let text = "As-salamu alaykum. I am Al-Alim. How may I assist you today?";
     switch(settings.language) {
         case 'Bangla': text = "আসসালামু আলাইকুম। আমি আল-আলিম। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?"; break;
         case 'Arabic': text = "السلام عليكم. أنا العليم. كيف يمكنني مساعدتك اليوم؟"; break;
         case 'Chinese': text = "阿萨拉姆·阿莱库姆。我是全知者（Al-Alim）。今天我能为您做什么？"; break;
         case 'Hindi': text = "अस-सलाम अलैकुम। मैं अल-अलीम हूं। आज मैं आपकी कैसे मदद कर सकता हूं?"; break;
         case 'Urdu': text = "السلام علیکم! میں العلیم ہوں۔ آج میں آپ کی کس طرح مدد کر سکتا ہوں؟"; break;
         case 'Indonesian': text = "Assalamualaikum. Saya Al-Alim. Bagaimana saya bisa membantu Anda hari ini?"; break;
         default: text = "As-salamu alaykum. I am Al-Alim. How may I assist you today?";
     }
     setMessages([{ id: 'welcome', role: 'model', text: text }]);
  };
  // --- PERSISTENCE LOGIC END ---

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle File Upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const [meta, data] = result.split(',');
        const mimeType = meta.split(':')[1].split(';')[0];
        setAttachment({ data, mimeType, preview: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Voice Recording
  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };
        recorder.onstop = async () => {
          setIsLoading(true);
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = async () => {
             const base64String = (reader.result as string).split(',')[1];
             try {
               const text = await transcribeAudio(base64String, 'audio/webm');
               if (text) setInput(prev => prev + " " + text);
             } catch (e) { console.error("Transcription failed", e); } 
             finally { setIsLoading(false); }
          };
          reader.readAsDataURL(blob);
          stream.getTracks().forEach(t => t.stop());
        };
        recorder.start();
        setIsRecording(true);
      } catch (e) {
        alert("Microphone access denied or not available.");
      }
    }
  };

  // Send Message Logic
  const executeSend = async (textInput: string, imgAttachment: typeof attachment) => {
    if ((!textInput.trim() && !imgAttachment) || isLoading) return;

    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      text: textInput,
      image: imgAttachment?.preview 
    };
    
    // Optimistically update UI
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachment(null);
    setIsLoading(true);

    try {
      let model = 'gemini-3-pro-preview';
      let thinking = mode === 'deep';
      
      if (imgAttachment) {
        model = 'gemini-3-pro-preview';
        thinking = false; 
      } else if (mode === 'fast') {
        model = 'gemini-flash-lite-latest';
        thinking = false;
      } else if (useSearch) {
        model = 'gemini-2.5-flash';
        thinking = false;
      }

      const systemPrompt = getSystemPrompt(settings.language);

      const images = imgAttachment ? [{
        inlineData: {
          data: imgAttachment.data,
          mimeType: imgAttachment.mimeType
        }
      }] : undefined;

      // Pass previous messages to provide context (Memory)
      const historyContext = messages.slice(-20); // Send last 20 messages for context

      const response = await generateScholarResponse(
        userMsg.text,
        historyContext,
        model,
        systemPrompt,
        useSearch,
        thinking,
        images
      );

      const text = response.text || "Sorry, I could not generate a response.";
      
      const sources: string[] = [];
      if (useSearch && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
          if (chunk.web?.uri) sources.push(chunk.web.uri);
        });
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text,
        sources: sources.length > 0 ? sources : undefined
      };

      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Error accessing knowledge base. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
      executeSend(input, attachment);
  };

  // Helper to clear chat history
  const clearChat = () => {
      if(confirm("Are you sure you want to clear chat history?")) {
          localStorage.removeItem('chat_history');
          setMessages([]);
          initializeGreeting();
      }
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 dark:bg-stone-900 font-arabic transition-colors">
      {/* Header / Controls */}
      <div className="bg-white dark:bg-stone-800 p-4 border-b border-stone-200 dark:border-stone-700 flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
          <span>📖</span> {settings.language === 'Bangla' ? 'স্কলার চ্যাট' : 'Scholar Chat'}
        </h2>
        
        <div className="flex items-center gap-4 text-sm">
           <div className="flex bg-stone-100 dark:bg-stone-700 p-1 rounded-lg">
              <button 
                onClick={() => { setMode('deep'); setUseSearch(false); }}
                className={`px-3 py-1.5 rounded-md transition-colors ${mode === 'deep' && !useSearch ? 'bg-emerald-600 text-white shadow' : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600'}`}
              >
                Thinking
              </button>
              <button 
                onClick={() => { setMode('fast'); setUseSearch(false); }}
                className={`px-3 py-1.5 rounded-md transition-colors ${mode === 'fast' && !useSearch ? 'bg-amber-500 text-white shadow' : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600'}`}
              >
                Fast
              </button>
           </div>

           <button 
             onClick={() => setUseSearch(!useSearch)}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${useSearch ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300'}`}
           >
             <span className="material-icons text-lg">search</span>
             {useSearch ? 'On' : 'Off'}
           </button>

           <button 
             onClick={clearChat}
             className="text-red-500 hover:bg-red-50 p-2 rounded-full"
             title="Clear Chat History"
            >
               <span className="material-icons text-lg">delete_outline</span>
           </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50 dark:bg-stone-900">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-5 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-emerald-700 text-white rounded-br-none' 
                : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 rounded-bl-none'
            }`}>
              {/* User Image Attachment */}
              {msg.image && (
                <div className="mb-3">
                  <img src={msg.image} alt="Attached" className="max-w-xs rounded-lg border-2 border-white/20" />
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed font-arabic text-lg">
                {msg.text.split('\n').map((line, i) => (
                    <span key={i}>{line}<br/></span>
                ))}
              </div>
              
              {/* Sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700">
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1">Sources:</p>
                  <ul className="list-disc list-inside text-xs text-blue-600 dark:text-blue-400">
                    {msg.sources.map((src, idx) => (
                      <li key={idx}><a href={src} target="_blank" rel="noopener noreferrer" className="hover:underline truncate block max-w-xs">{src}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-4 rounded-2xl rounded-bl-none flex items-center gap-3">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
               <span className="text-sm text-stone-400">
                 {isRecording ? "Listening & Transcribing..." : "Thinking..."}
               </span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 relative">
        
        {/* Attachment Preview */}
        {attachment && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-stone-100 dark:bg-stone-700 rounded-lg w-fit">
                <img src={attachment.preview} alt="preview" className="w-10 h-10 object-cover rounded" />
                <span className="text-xs text-stone-500 dark:text-stone-300">Image attached</span>
                <button onClick={() => setAttachment(null)} className="text-red-500 hover:text-red-700">
                    <span className="material-icons text-sm">close</span>
                </button>
            </div>
        )}

        <div className="max-w-4xl mx-auto flex gap-3 items-end">
          
          {/* File Upload Button */}
          <div className="flex-none">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/*" 
                className="hidden" 
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-600 dark:text-stone-300 rounded-full p-3 w-12 h-12 flex items-center justify-center transition-all"
                title="Attach Image"
            >
                <span className="material-icons">add_photo_alternate</span>
            </button>
          </div>

           {/* Voice Input Button */}
           <div className="flex-none">
            <button 
                onClick={toggleRecording}
                className={`rounded-full p-3 w-12 h-12 flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-600 dark:text-stone-300'}`}
                title="Voice Input"
            >
                <span className="material-icons">{isRecording ? 'stop' : 'mic'}</span>
            </button>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
            }}
            placeholder="Ask a question..."
            rows={1}
            className="flex-1 border border-stone-300 dark:border-stone-600 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 resize-none min-h-[50px] max-h-[120px]"
          />
          
          <button 
            onClick={handleSend}
            disabled={(!input.trim() && !attachment) || isLoading}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center transition-all shadow-lg flex-none"
          >
            <span className="material-icons">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScholarChat;
