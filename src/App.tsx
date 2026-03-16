import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import Lenis from 'lenis';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  Bolt, Globe, Settings, Eye, CalendarCheck, ChevronDown, 
  Mail, Twitter, Github, ShoppingCart, ShieldCheck, 
  Utensils, Search, Paintbrush, Bike, MessageSquare,
  LayoutGrid, Brain, Zap, Table, CreditCard, Phone, 
  Image as ImageIcon, Share2, Lock, PieChart, RefreshCw, 
  Layers, Rocket, Cpu, ChartLine, Code, X, Play, ExternalLink,
  Quote, Star, CheckCircle2, Sun, Moon, Send, User, Bot,
  ChevronLeft, ChevronRight, Maximize2, Command, Terminal,
  Workflow, Database, Cpu as Chip, Sparkles, Activity
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---

interface Project {
  id: string;
  icon: React.ReactNode;
  industry: string;
  title: string;
  desc: string;
  fullDesc: string;
  tags: string[];
  images: string[];
  videoUrl?: string;
  results?: string[];
  timeline?: string;
  efficiency?: string;
}

// --- Premium Components ---

const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const cursorX = useSpring(mouseX, { damping: 20, stiffness: 300, mass: 0.5 });
  const cursorY = useSpring(mouseY, { damping: 20, stiffness: 300, mass: 0.5 });
  
  const dotX = useSpring(mouseX, { damping: 30, stiffness: 500, mass: 0.2 });
  const dotY = useSpring(mouseY, { damping: 30, stiffness: 500, mass: 0.2 });

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="hidden lg:block">
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-gold rounded-full pointer-events-none z-[10000] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-gold rounded-full pointer-events-none z-[10000]"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </div>
  );
};

const BackgroundGlow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const glowX = useSpring(mouseX, { damping: 50, stiffness: 200 });
  const glowY = useSpring(mouseY, { damping: 50, stiffness: 200 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full bg-gold/5 blur-[120px]"
        style={{
          x: glowX,
          y: glowY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[150px] rounded-full" />
    </div>
  );
};

const CommandPalette = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const actions = [
    { icon: <User size={18} />, label: 'About Eldorado', href: '#about' },
    { icon: <Zap size={18} />, label: 'View Services', href: '#services' },
    { icon: <LayoutGrid size={18} />, label: 'Portfolio Projects', href: '#portfolio' },
    { icon: <CalendarCheck size={18} />, label: 'Book Strategy Call', href: 'https://cal.com/eldoradoautomate/free-strategy-call' },
    { icon: <Mail size={18} />, label: 'Contact Me', href: '#contact' },
  ];

  const filteredActions = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredActions.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredActions[selectedIndex];
        if (selected) {
          if (selected.href.startsWith('http')) {
            window.open(selected.href, '_blank');
          } else {
            window.location.hash = selected.href;
          }
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, filteredActions, selectedIndex]);

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10001] bg-black/80 backdrop-blur-md flex items-start justify-center pt-[15vh] p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-2xl glass border-gold/20 overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gold/10 flex items-center gap-4">
          <Search className="text-gold" size={20} />
          <input 
            autoFocus
            placeholder="Type a command or search..."
            className="bg-transparent border-none outline-none w-full text-lg font-tech placeholder:text-muted/50"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1 px-2 py-1 bg-gold/10 rounded border border-gold/20 text-[0.6rem] font-tech text-gold">
            <span className="opacity-50">ESC</span>
          </div>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="text-[0.6rem] font-tech text-muted uppercase tracking-widest mb-4 px-2">Suggestions</div>
          <div className="space-y-2">
            {filteredActions.map((action, i) => (
              <a 
                key={i}
                href={action.href}
                onClick={onClose}
                onMouseEnter={() => setSelectedIndex(i)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl transition-all group",
                  selectedIndex === i ? "bg-gold/20 border-gold/30" : "hover:bg-gold/10 border-transparent"
                )}
              >
                <div className={cn(
                  "transition-colors",
                  selectedIndex === i ? "text-gold" : "text-muted group-hover:text-gold"
                )}>{action.icon}</div>
                <span className={cn(
                  "font-tech text-sm transition-colors",
                  selectedIndex === i ? "text-gold" : "text-text"
                )}>{action.label}</span>
                <ChevronRight size={14} className={cn(
                  "ml-auto transition-colors",
                  selectedIndex === i ? "text-gold translate-x-1" : "text-muted/30 group-hover:text-gold"
                )} />
              </a>
            ))}
            {filteredActions.length === 0 && (
              <div className="p-8 text-center text-muted font-tech text-sm">
                No commands found for "{query}"
              </div>
            )}
          </div>
        </div>
        <div className="p-4 bg-gold/5 border-t border-gold/10 flex justify-between items-center text-[0.6rem] font-tech text-muted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Command size={10} /> + K to close</span>
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <span className="text-gold font-bold">ELDORADO OS</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LiveStats = () => {
  const [stats, setStats] = useState({
    active: 14,
    uptime: 99.98,
    processed: 1245890
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        processed: prev.processed + Math.floor(Math.random() * 5)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-8 left-8 z-[100] hidden xl:block">
      <div className="glass px-6 py-4 border-gold/20 flex items-center gap-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[0.6rem] font-tech text-muted uppercase tracking-tighter">Systems Active</span>
            <span className="text-sm font-tech font-bold text-gold">{stats.active}</span>
          </div>
        </div>
        <div className="w-px h-8 bg-gold/10" />
        <div className="flex flex-col">
          <span className="text-[0.6rem] font-tech text-muted uppercase tracking-tighter">Uptime</span>
          <span className="text-sm font-tech font-bold text-gold">{stats.uptime}%</span>
        </div>
        <div className="w-px h-8 bg-gold/10" />
        <div className="flex flex-col">
          <span className="text-[0.6rem] font-tech text-muted uppercase tracking-tighter">Data Processed</span>
          <span className="text-sm font-tech font-bold text-gold">{stats.processed.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

const ProcessTimeline = () => {
  const steps = [
    { title: 'Discovery', desc: 'Deep dive into your business bottlenecks and manual workflows.', icon: <Search /> },
    { title: 'Architecture', desc: 'Designing the technical blueprint and selecting the right AI stack.', icon: <Layers /> },
    { title: 'Build', desc: 'Rapid development of custom n8n flows and AI integrations.', icon: <Code /> },
    { title: 'Stress Test', desc: 'Rigorous testing of edge cases and error handling protocols.', icon: <Activity /> },
    { title: 'Deployment', desc: 'Live launch with 24/7 monitoring and performance optimization.', icon: <Rocket /> },
  ];

  return (
    <section className="py-40 bg-bg relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 text-center"
        >
          <span className="section-label mx-auto">The Blueprint</span>
          <h2 className="text-6xl md:text-8xl font-display font-bold mb-8 tracking-tighter">My <span className="text-gold-gradient">Process</span></h2>
        </motion.div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gold/10 hidden md:block" />
          
          <div className="space-y-24">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-12",
                  idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                <div className="flex-1 md:text-right w-full">
                  {idx % 2 === 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-4xl font-display font-bold text-gold">{step.title}</h3>
                      <p className="text-muted text-lg font-light leading-relaxed max-w-md ml-auto">{step.desc}</p>
                    </div>
                  ) : null}
                </div>

                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-full glass border-gold/30 flex items-center justify-center text-gold shadow-[0_0_30px_rgba(255,215,0,0.2)] bg-bg">
                    {React.cloneElement(step.icon as React.ReactElement, { size: 32 } as any)}
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center font-tech font-bold text-xs">
                    0{idx + 1}
                  </div>
                </div>

                <div className="flex-1 w-full">
                  {idx % 2 !== 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-4xl font-display font-bold text-gold">{step.title}</h3>
                      <p className="text-muted text-lg font-light leading-relaxed max-w-md">{step.desc}</p>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-40 pt-20 border-t border-gold/10">
          <div className="text-center mb-16">
            <span className="section-label mx-auto">The Roadmap</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter">Future <span className="text-gold-gradient">Capabilities</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 opacity-60 hover:opacity-100 transition-opacity duration-700">
            {[
              { title: 'Client Dashboard', desc: 'Real-time monitoring of all your automated flows in one secure portal.', icon: <LayoutGrid /> },
              { title: 'AI Strategy Bot', desc: 'Interactive assistant to help you discover new automation opportunities.', icon: <Bot /> },
              { title: 'ROI Analytics', desc: 'Automated tracking of time and money saved by your systems.', icon: <ChartLine /> }
            ].map((step, idx) => (
              <div key={idx} className="glass p-8 border-gold/5 flex items-start gap-6">
                <div className="text-gold/50">{React.cloneElement(step.icon as React.ReactElement<any>, { className: 'w-8 h-8' })}</div>
                <div>
                  <h4 className="text-xl font-display font-bold mb-2">{step.title}</h4>
                  <p className="text-muted text-sm font-light">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Components ---

const ThemeToggle = () => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [isLight]);

  return (
    <button 
      onClick={() => setIsLight(!isLight)}
      className="w-12 h-12 glass flex items-center justify-center text-gold hover:scale-110 transition-all cursor-pointer"
      aria-label="Toggle Theme"
    >
      {isLight ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Hi! I\'m Eldorado\'s AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = "gemini-3-flash-preview";
      
      // Map existing messages to Gemini format, excluding the initial bot greeting if needed
      // or just include everything for full context.
      const history = messages.map(msg => ({
        role: msg.role === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      // Add the current user message to history for the request
      history.push({ role: 'user', parts: [{ text: userMsg }] });

      const response = await genAI.models.generateContent({
        model,
        contents: history,
        config: {
          systemInstruction: `You are Eldorado Daniel, a premier AI Automation Builder. You are having a real-time conversation with a potential client. 
          
          Your Background:
          - 2+ years experience engineering sophisticated AI ecosystems (n8n, Make.com, GPT-4, Claude, Grok).
          - Expert in E-commerce, AI Agents, CRM Pipelines, and Logistics.
          
          Key Projects & Videos:
          - E-commerce Order Automation: https://youtu.be/yW2igOZGBaI
          - WhatsApp Business Assistant: https://youtube.com/shorts/nmP3Bvyn0BA
          - AI Food Ordering System: https://youtu.be/mbe8OkRdfE8
          
          Contact Details (Only provide if asked or if the user is ready to book):
          - Booking: https://cal.com/eldoradoautomate/free-strategy-call
          - Email: daniel@eldoradonode.work
          - WhatsApp: https://wa.me/2348083693498
          
          Guidelines:
          1. BE BRIEF: Respond only to what is asked. Avoid long introductions or "info dumps".
          2. BE CONVERSATIONAL: Speak in the first person ("I", "my"). 
          3. BE INTERACTIVE: Ask short follow-up questions to understand their needs.
          4. NO OVER-FORMATTING: Use Markdown sparingly. Keep it clean.
          5. CONTEXT: You are chatting via a small widget on your portfolio website. Keep responses short enough for a mobile screen.`
        }
      });

      const botText = response.text || "I'm sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass w-[350px] h-[500px] mb-4 overflow-hidden flex flex-col shadow-2xl border-gold/30"
          >
            <div className="bg-gold p-4 flex justify-between items-center">
              <div className="flex items-center gap-2 text-black font-tech font-bold">
                <Bot size={20} /> AI ASSISTANT
              </div>
              <button onClick={() => setIsOpen(false)} className="text-black hover:scale-110 transition-transform cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-gold text-black rounded-tr-none' : 'bg-gold/10 text-[var(--text)] border border-gold/10 rounded-tl-none'}`}>
                    {msg.role === 'bot' ? (
                      <div className="markdown-content">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gold/10 border border-gold/10 p-3 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gold/10 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-gold/5 border border-gold/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-[var(--text)]"
              />
              <button 
                onClick={handleSend}
                className="w-10 h-10 bg-gold text-black rounded-xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gold text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all group cursor-pointer"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />}
      </button>
    </div>
  );
};

const Lightbox = ({ images, isOpen, onClose, initialIndex = 0 }: { images: string[], isOpen: boolean, onClose: () => void, initialIndex?: number }) => {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-white hover:text-gold transition-colors z-10 cursor-pointer">
          <X size={40} />
        </button>

        <button 
          onClick={() => setIndex((index - 1 + images.length) % images.length)}
          className="absolute left-8 text-white hover:text-gold transition-colors z-10 cursor-pointer"
        >
          <ChevronLeft size={60} />
        </button>

        <motion.img 
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          src={images[index]} 
          className="max-w-full max-h-full object-contain shadow-2xl"
        />

        <button 
          onClick={() => setIndex((index + 1) % images.length)}
          className="absolute right-8 text-white hover:text-gold transition-colors z-10 cursor-pointer"
        >
          <ChevronRight size={60} />
        </button>

        <div className="absolute bottom-8 text-white font-tech font-bold uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
          {index + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const Modal = ({ isOpen, onClose, project }: { isOpen: boolean, onClose: () => void, project: Project | null }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/95 backdrop-blur-md" 
          onClick={onClose} 
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          data-lenis-prevent
          className="relative w-full max-w-[95vw] max-h-[98vh] overflow-y-auto bg-bg/95 backdrop-blur-2xl p-0 shadow-2xl border border-gold/20 rounded-3xl text-text custom-scrollbar"
        >
          <button 
            onClick={onClose}
            className="fixed top-8 right-8 text-text hover:text-gold transition-colors p-3 rounded-full bg-bg/50 backdrop-blur-md border border-gold/10 z-[110] cursor-pointer"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="flex flex-col">
            {/* Hero Image Section */}
            <div className="relative w-full bg-bg-alt/40 border-b border-gold/10 group">
              <div 
                className="w-full min-h-[50vh] lg:min-h-[70vh] flex items-center justify-center p-4 md:p-12 cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
              >
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImg}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    src={project.images[activeImg]} 
                    className="max-w-full max-h-[80vh] object-contain shadow-[0_0_100px_rgba(255,215,0,0.1)]" 
                  />
                </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-8 pointer-events-none">
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveImg((activeImg - 1 + project.images.length) % project.images.length); }}
                  className="w-16 h-16 glass flex items-center justify-center text-gold hover:bg-gold/20 transition-all rounded-full pointer-events-auto"
                >
                  <ChevronLeft size={32} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveImg((activeImg + 1) % project.images.length); }}
                  className="w-16 h-16 glass flex items-center justify-center text-gold hover:bg-gold/20 transition-all rounded-full pointer-events-auto"
                >
                  <ChevronRight size={32} />
                </button>
              </div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-bg/60 backdrop-blur-xl px-8 py-4 rounded-full border border-gold/20">
                <div className="flex gap-3">
                  {project.images.map((_, i) => (
                    <button 
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                      className={`w-3 h-3 rounded-full transition-all ${activeImg === i ? 'bg-gold w-8' : 'bg-gold/20 hover:bg-gold/40'}`}
                    />
                  ))}
                </div>
                <div className="w-px h-4 bg-gold/20 mx-2" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                  className="text-text text-xs font-tech uppercase tracking-widest flex items-center gap-2 hover:text-gold transition-colors"
                >
                  <Maximize2 size={16} /> Full Screen
                </button>
              </div>
            </div>

            <div className="p-8 md:p-20 grid lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 space-y-12">
                <div>
                  <div className="text-sm font-tech font-bold text-gold uppercase tracking-[0.4em] mb-6">{project.industry}</div>
                  <h2 className="text-5xl md:text-7xl font-display font-bold text-text mb-8 leading-tight tracking-tighter">{project.title}</h2>
                  <div className="flex flex-wrap gap-3">
                    {project.tags.map((tag, i) => (
                      <span key={`${tag}-${i}`} className="text-[0.8rem] px-6 py-2 bg-gold/5 border border-gold/20 rounded-full text-gold font-tech font-bold uppercase tracking-widest">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-3xl font-display font-bold text-gold-gradient">The Challenge & Solution</h3>
                  <p className="text-muted text-xl leading-relaxed font-light">{project.fullDesc}</p>
                </div>

                {project.results && (
                  <div className="space-y-8">
                    <h3 className="text-3xl font-display font-bold text-gold-gradient">Impact Delivered</h3>
                    <ul className="grid md:grid-cols-2 gap-6">
                      {project.results.map((res, i) => (
                        <li key={i} className="glass p-8 flex items-start gap-4 text-muted text-lg font-light border-gold/10">
                          <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                          {res}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Video Player (If exists) */}
                {project.videoUrl && (
                  <div className="space-y-8 pt-12 border-t border-gold/10">
                    <h3 className="text-3xl font-display font-bold text-gold">Live System Demo</h3>
                    <div className="rounded-3xl overflow-hidden border border-gold/20 bg-black/40 aspect-video relative shadow-2xl">
                      <iframe 
                        src={project.videoUrl} 
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-12">
                <div className="glass p-10 space-y-8 border-gold/20 sticky top-12">
                  <div className="grid grid-cols-1 gap-8">
                    <div className="text-center">
                      <div className="text-[0.7rem] font-tech text-muted uppercase tracking-widest mb-3">Timeline</div>
                      <div className="text-3xl font-display font-bold text-gold">{project.timeline || '2-4 Weeks'}</div>
                    </div>
                    <div className="w-full h-px bg-gold/10" />
                    <div className="text-center">
                      <div className="text-[0.7rem] font-tech text-muted uppercase tracking-widest mb-3">Efficiency</div>
                      <div className="text-3xl font-display font-bold text-gold">{project.efficiency || '+300%'}</div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <a href="https://cal.com/eldoradoautomate/free-strategy-call" target="_blank" className="w-full bg-gold text-black py-6 rounded-2xl font-tech font-bold text-sm flex items-center justify-center gap-4 hover:bg-gold-light transition-all shadow-[0_20px_50px_rgba(255,215,0,0.2)] uppercase tracking-widest">
                      <CalendarCheck className="w-6 h-6" /> Replicate This Success
                    </a>
                  </div>

                  <div className="pt-8 space-y-6">
                    <h4 className="text-xs font-tech font-bold text-muted uppercase tracking-widest text-center">Architecture Gallery</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {project.images.map((img, i) => (
                        <button 
                          key={i} 
                          onClick={() => setActiveImg(i)}
                          className={`rounded-xl overflow-hidden border-2 transition-all duration-300 aspect-video relative ${activeImg === i ? 'border-gold scale-105 shadow-lg shadow-gold/20' : 'border-transparent opacity-40 hover:opacity-100'}`}
                        >
                          <img src={img} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Lightbox images={project.images} isOpen={lightboxOpen} initialIndex={activeImg} onClose={() => setLightboxOpen(false)} />
    </AnimatePresence>
  );
};

const Navbar = ({ onOpenCommand }: { onOpenCommand: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Work', href: '#portfolio' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={cn(
      "fixed top-0 w-full z-[90] transition-all duration-700",
      scrolled ? "bg-bg/80 backdrop-blur-2xl border-b border-gold/10 py-4" : "py-8"
    )}>
      <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="h-12 w-64 flex items-center relative">
          <img 
            src="https://i.ibb.co/gbMp0c6Q/Screenshot-20260228-204116-Samsung-Internet-removebg-preview.png" 
            alt="Eldorado Logo" 
            className="h-56 w-auto object-contain logo-gold absolute left-0 top-1/2 -translate-y-1/2 z-10"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <ul className="hidden md:flex gap-12">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a href={link.href} className="text-[0.7rem] font-tech font-bold uppercase tracking-[0.25em] text-muted hover:text-gold transition-all relative group">
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-gold transition-all group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenCommand}
            className="hidden md:flex w-12 h-12 glass items-center justify-center text-gold hover:scale-110 transition-all cursor-pointer"
            title="Open Command Palette (Cmd+K)"
          >
            <Command size={20} />
          </button>
          <ThemeToggle />
          <button 
            className="md:hidden text-gold text-2xl cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <LayoutGrid />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="fixed inset-0 top-0 bg-bg/98 backdrop-blur-3xl z-[100] flex flex-col p-12 md:hidden"
            >
              <div className="flex justify-between items-center mb-16">
                <div className="h-12 w-64 flex items-center relative">
                  <img 
                    src="https://i.ibb.co/gbMp0c6Q/Screenshot-20260228-204116-Samsung-Internet-removebg-preview.png" 
                    alt="Eldorado Logo" 
                    className="h-56 w-auto object-contain logo-gold absolute left-0 top-1/2 -translate-y-1/2 z-10"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-gold cursor-pointer"><X size={32} /></button>
              </div>
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-4xl font-display font-bold text-[var(--text)] py-8 border-b border-gold/10 hover:text-gold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

const Hero = () => {
  const [text, setText] = useState('');
  const phrases = [
    'AI Automation Builder',
    'Building Intelligent Systems',
    'Scaling Businesses with AI',
    'Eliminating Manual Workflows',
    'Connecting Your Digital Future'
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const timer = setTimeout(() => {
      if (!isDeleting) {
        setText(currentPhrase.substring(0, text.length + 1));
        if (text.length === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), 2500);
        }
      } else {
        setText(currentPhrase.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? 40 : 80);

    return () => clearTimeout(timer);
  }, [text, isDeleting, phraseIndex]);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative pt-24 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-6 text-center z-10 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-64 h-64 md:w-96 md:h-96 mx-auto mb-20"
        >
          <div className="absolute inset-[-30px] rounded-full border border-dashed border-gold/20 animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-[-15px] rounded-full animate-[pulse_8s_ease-out_infinite] shadow-[0_0_100px_rgba(255,215,0,0.1)]" />
          
          <div className="w-full h-full rounded-full overflow-hidden border border-gold/20 p-2 bg-bg relative z-10 shadow-2xl">
            <img 
              src="https://i.ibb.co/DHLqSB6V/j-Rm7uq-I.jpg" 
              alt="Eldorado Daniel" 
              className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Floating Badges - Optimized for Mobile */}
          <motion.div 
            animate={{ 
              y: [0, 40, 0],
              x: [0, -20, 0],
              rotate: [5, -5, 5],
              scale: [1, 1.1, 1]
            }} 
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              delay: 1,
              ease: "easeInOut"
            }} 
            className="absolute top-1/2 -right-20 md:-right-40 glass px-4 md:px-8 py-2 md:py-4 text-[0.6rem] md:text-[0.75rem] font-tech font-bold text-gold flex items-center gap-2 md:gap-3 shadow-[0_0_50px_rgba(255,215,0,0.2)] border-gold/40 z-20"
          >
            <Zap className="w-4 h-4 md:w-6 md:h-6" /> 10x SCALABILITY
          </motion.div>
          <motion.div 
            animate={{ 
              x: [0, -40, 0],
              y: [0, -20, 0],
              rotate: [-8, 8, -8],
              scale: [1, 1.1, 1]
            }} 
            transition={{ 
              duration: 7, 
              repeat: Infinity, 
              delay: 2,
              ease: "easeInOut"
            }} 
            className="absolute -bottom-8 md:-bottom-16 -left-8 md:-left-16 glass px-4 md:px-8 py-2 md:py-4 text-[0.6rem] md:text-[0.75rem] font-tech font-bold text-gold flex items-center gap-2 md:gap-3 shadow-[0_0_50px_rgba(255,215,0,0.2)] border-gold/40 z-20"
          >
            <Settings className="w-4 h-4 md:w-6 md:h-6" /> AUTO-INFRA
          </motion.div>
        </motion.div>

        <div className="space-y-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-4 bg-gold/5 border border-gold/10 rounded-full px-6 py-2 text-[0.7rem] text-gold font-tech font-bold tracking-[0.3em] uppercase"
          >
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            Architecting the Future of Work
          </motion.div>

          <div className="mask-text">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="text-4xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.85] tracking-tighter mb-8 md:whitespace-nowrap break-words"
            >
              ELDORADO <span className="text-gold-gradient">DANIEL</span>
            </motion.h1>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="h-12 flex items-center justify-center"
          >
            <p className="text-xl md:text-4xl font-display font-light text-muted tracking-tight">
              I am <span className="text-gold font-medium">{text}</span>
              <span className="w-1 h-6 md:h-8 bg-gold ml-2 inline-block animate-pulse align-middle" />
            </p>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-muted text-xl md:text-2xl max-w-3xl mx-auto mb-16 leading-relaxed font-light"
          >
            Architecting the future of business through <span className="text-text font-bold">autonomous AI systems</span>. I transform chaotic manual processes into high-performance digital engines.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex flex-wrap justify-center gap-6 pt-12"
          >
            <a href="#portfolio" className="px-12 py-5 bg-gold text-black font-tech font-bold text-sm rounded-2xl hover:bg-gold-light transition-all shadow-[0_20px_50px_rgba(255,215,0,0.25)] uppercase tracking-widest">
              View Systems
            </a>
            <a href="https://cal.com/eldoradoautomate/free-strategy-call" target="_blank" className="px-12 py-5 glass border-gold/30 text-gold font-tech font-bold text-sm rounded-2xl hover:bg-gold/10 transition-all uppercase tracking-widest">
              Start Building
            </a>
          </motion.div>

          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [-2, 2, -2],
            }} 
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }} 
            className="inline-flex glass px-8 py-4 text-[0.75rem] font-tech font-bold text-gold items-center gap-3 shadow-[0_0_50px_rgba(255,215,0,0.2)] border-gold/40 mt-16"
          >
            <Brain className="w-6 h-6" /> NEURAL AGENTS
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[0.6rem] font-tech text-muted uppercase tracking-[0.5em]">Scroll to Explore</span>
        <div className="w-px h-16 bg-linear-to-b from-gold to-transparent" />
      </motion.div>
    </section>
  );
};

const About = () => {
  const stats = [
    { number: '2+', label: 'Years Experience' },
    { number: '20+', label: 'Processes Automated' },
    { number: '40 Hrs', label: 'Saved Per Week / Client' },
    { number: '98%', label: 'Client Satisfaction' },
  ];

  return (
    <section id="about" className="py-40 relative">
      <div className="container max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-32 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative group"
        >
          <div className="relative z-10 rounded-[40px] overflow-hidden aspect-[4/5] border border-gold/20 shadow-2xl">
            <img 
              src="https://i.ibb.co/rrJ6w1s/image.jpg" 
              alt="Workspace" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale hover:grayscale-0" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />
          </div>
          <div className="absolute inset-[-25px] border border-gold/10 rounded-[50px] -z-0 group-hover:border-gold/40 transition-colors duration-700" />
          <div className="absolute -bottom-12 -right-12 glass p-10 rounded-3xl font-display font-bold text-2xl leading-tight shadow-2xl border-gold/40 z-20">
            <span className="text-gold-gradient">AI AUTOMATION</span><br />
            <span className="text-text">BUILDER</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">The Visionary</span>
          <h2 className="text-6xl md:text-8xl font-display font-bold leading-[0.9] tracking-tighter mb-10 text-text">
            I build <span className="text-gold-gradient">Digital Engines</span> that never sleep.
          </h2>
          <div className="space-y-8 text-muted text-xl leading-relaxed mb-12 font-light">
            <p>I'm Eldorado Daniel, an AI Automation Builder with 2+ years deep in the craft. I design and deploy intelligent systems across industries, from enterprise-level AI chatbots to consumer-facing ordering platforms and full CRM pipelines.</p>
            <p>My approach is simple: understand the real problem, pick the right tools, and build something that works in production. Every system I ship is designed to save time, cut costs, and scale without adding headcount.</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-16">
            {stats.map((stat) => (
              <div key={stat.label} className="glass p-10 group hover:border-gold/50 transition-all border-gold/10">
                <span className="block text-5xl font-display font-bold text-gold-gradient mb-3">{stat.number}</span>
                <span className="text-[0.8rem] text-muted font-tech font-bold uppercase tracking-[0.2em]">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-6">
            {[
              { icon: <Cpu />, text: 'Systems Thinker' },
              { icon: <ChartLine />, text: 'Results-Driven' },
              { icon: <Code />, text: 'Technically Deep' },
              { icon: <Rocket />, text: 'Always Growing' },
            ].map((trait) => (
              <span key={trait.text} className="flex items-center gap-4 text-[0.85rem] font-tech font-bold uppercase tracking-[0.15em] bg-gold/5 border border-gold/20 px-8 py-4 rounded-2xl hover:border-gold transition-all cursor-default text-gold">
                {React.cloneElement(trait.icon as React.ReactElement, { size: 20 } as any)}
                {trait.text}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    { icon: <LayoutGrid />, title: 'AI Workflow Automation', desc: 'Multi-step intelligent workflows on n8n, Make.com, Zapier, and beyond. Connect your tools and let your systems think for themselves.', span: 'col-span-12 md:col-span-8' },
    { icon: <Brain />, title: 'AI Chatbot Development', desc: 'WhatsApp and Telegram bots powered by GPT-4, Gemini, DeepSeek, and more. With memory, persona, context, and real business logic.', span: 'col-span-12 md:col-span-4' },
    { icon: <Zap />, title: 'CRM and Sales Pipeline', desc: 'Lead scoring, automated follow-ups, booking flows, client onboarding, and contract management running on autopilot.', span: 'col-span-12 md:col-span-4' },
    { icon: <ShoppingCart />, title: 'E-Commerce Operations', desc: 'Order fulfillment, shipping, refund routing, and customer communication automated end to end across Shopify and beyond.', span: 'col-span-12 md:col-span-8' },
    { icon: <Bike />, title: 'Logistics and Dispatch', desc: 'GPS-based rider dispatch, real-time order assignment, and customer notification systems for delivery businesses.', span: 'col-span-12 md:col-span-6' },
    { icon: <Paintbrush />, title: 'AI Content and Ad Systems', desc: 'Automated ad generation using computer vision and image generation. One product photo in, complete multi-platform campaigns out.', span: 'col-span-12 md:col-span-6' },
  ];

  return (
    <section id="services" className="py-40 bg-bg-alt relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 text-center"
        >
          <span className="section-label mx-auto">Expertise</span>
          <h2 className="text-6xl md:text-9xl font-display font-bold mb-8 tracking-tighter">Core <span className="text-gold-gradient">Capabilities</span></h2>
          <p className="text-muted text-xl max-w-3xl mx-auto font-light">Precision-engineered solutions designed to solve complex operational bottlenecks.</p>
        </motion.div>

        <div className="bento-grid">
          {services.map((service, idx) => (
            <motion.div 
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "glass p-12 hover:-translate-y-2 transition-all group relative border-gold/10",
                service.span
              )}
            >
              <div className="w-20 h-20 bg-gold/10 border border-gold/20 rounded-3xl flex items-center justify-center text-gold mb-10 group-hover:bg-gold group-hover:text-black transition-all duration-700">
                {React.cloneElement(service.icon as React.ReactElement, { size: 36 } as any)}
              </div>
              <h3 className="font-display font-bold text-3xl mb-6 text-text group-hover:text-gold transition-colors">{service.title}</h3>
              <p className="text-muted text-lg leading-relaxed font-light">{service.desc}</p>
            </motion.div>
          ))}
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="col-span-12 glass p-12 flex flex-col items-center justify-center text-center border-dashed border-gold/40 bg-gold/5"
          >
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-8 animate-pulse">
              <Layers size={40} />
            </div>
            <h3 className="font-display font-bold text-3xl text-gold mb-4">And Many More...</h3>
            <p className="text-muted text-sm font-tech font-bold uppercase tracking-[0.3em]">Custom Integrations • API Development • Data Pipelines • Cloud Architecture</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: 'ecom-auto',
      icon: <ShoppingCart />,
      industry: 'E-Commerce',
      title: 'E-Commerce Order Automation System',
      desc: 'A zero-touch automation ecosystem for Shopify stores, eliminating manual data entry and processing.',
      fullDesc: 'A comprehensive enterprise-grade automation ecosystem that transforms a Shopify store into a zero-touch operation. The system features five distinct mission-critical flows: 1. Order Fulfillment (Instant parcel calculation and label generation via Shippo API), 2. Refund Request Intake (Multi-source logging via Tally/Webhooks), 3. Refund Resolution Engine (Autonomous execution of reships or Shopify API refunds), 4. Monthly BI Reporting (Automated KPI generation and historical logging), and 5. Error Watchdog (Real-time Slack monitoring for 100% reliability). All managed via a custom-built dashboard for real-time control.',
      tags: ['n8n', 'Shopify', 'Shippo', 'Airtable', 'Slack', 'Tally'],
      results: [
        'Eliminated 100% of manual data entry for order processing',
        'Autonomous refund/reship execution via Shopify & Shippo APIs',
        'Automated monthly BI reports delivered directly to management inbox',
        'Real-time Slack fail-safe monitoring for zero-downtime operations'
      ],
      images: [
        'https://i.ibb.co/B2G9TsvF/Video-Screen1771890701727.png',
        'https://i.ibb.co/spHTf5Rq/Screen-Shot-2026-02-22-at-18-14-36.png',
        'https://i.ibb.co/prMT0C3Y/Video-Screen1772573168282.png',
        'https://i.ibb.co/Csng4H8X/Video-Screen1771949222880.png'
      ],
      videoUrl: 'https://www.youtube.com/embed/yW2igOZGBaI',
      timeline: '7 - 10 Days',
      efficiency: '+100%'
    },
    {
      id: 'hunter-engine',
      icon: <Mail />,
      industry: 'HR & Recruitment',
      title: 'The Hunter Engine: Automated HR Recruitment Outreach System',
      desc: 'A fully automated end-to-end recruitment outreach pipeline targeting remote roles globally.',
      fullDesc: 'Built a fully automated end-to-end recruitment outreach pipeline for an HR professional targeting remote roles across the UK, UAE, Canada, United States and Nigeria. The system scrapes job boards daily, discovers recruiter contact details, generates personalised cold outreach emails using AI, sends them at precisely 9AM in each recruiter\'s local timezone, tracks replies, sends automated follow-ups, and delivers a branded daily pipeline report — all without any manual input.',
      tags: ['n8n', 'SerpAPI', 'Hunter.io', 'Apollo.io', 'Groq AI', 'Gmail API', 'Google Sheets'],
      results: [
        '0 hours per day spent on job searching or email writing',
        'Up to 75 job opportunities scraped daily across 3 global regions',
        'Personalised cold emails land at 9AM recruiter local time across 5 countries',
        'Automated 7-day follow-up system with zero manual intervention',
        '100% reply tracking — covers both thread replies and fresh inbox emails',
        'Branded daily pipeline report delivered every morning at 9AM'
      ],
      images: [
        'https://i.ibb.co/S76Psr8k/Video-Screen1773412408296.png',
        'https://i.ibb.co/gZfP45CS/image.png',
        'https://i.ibb.co/7dNgH3Zz/Video-Screen1773412926111.png',
        'https://i.ibb.co/zVxbZqbx/Video-Screen1773412452757.png'
      ],
      videoUrl: 'https://www.youtube.com/embed/q0LJb63FeXg',
      timeline: '5 Days',
      efficiency: '100% reduction in manual effort'
    },
    {
      id: 'insur-bot',
      icon: <ShieldCheck />,
      industry: 'Insurance',
      title: 'AI Enterprise Insurance Advisor',
      desc: 'Advanced WhatsApp AI agent trained on complex insurance regulations and product lines.',
      fullDesc: 'Developed for a major financial institution, this AI agent is modeled on the GMD\'s persona. It utilizes RAG (Retrieval-Augmented Generation) to provide accurate answers based on NAICOM regulations and internal product documents. It handles lead qualification, policy explanations, and basic claim filing directly within WhatsApp.',
      tags: ['n8n', 'Gemini 2.0', 'Green API', 'WhatsApp'],
      results: ['45% reduction in support ticket volume', '24/7 instant lead qualification', 'Automated policy inquiry handling'],
      images: [
        'https://i.ibb.co/N2GTt3Bv/Video-Screen1772065904760.png',
        'https://i.ibb.co/TMHVCY4C/Video-Screen1772065874982.png',
        'https://i.ibb.co/7xSzZkp2/Video-Screen1772065972101.png',
        'https://i.ibb.co/v6bsMGmd/photo-5837177172123127115-y.jpg'
      ],
      videoUrl: 'https://www.youtube.com/embed/0OOF8VdBdh8',
      timeline: '1 - 2 Days',
      efficiency: '+45%'
    },
    {
      id: 'crm-pipe',
      icon: <Zap />,
      industry: 'Professional Services',
      title: '5D Lead Scoring CRM Pipeline',
      desc: 'Intelligent CRM that scores leads across 5 dimensions and automates the entire onboarding flow.',
      fullDesc: 'A comprehensive sales infrastructure that takes raw leads and transforms them into scored opportunities. The system analyzes lead data against 5 key metrics (Budget, Authority, Need, Timeline, and Fit), categorizes them into Tiers, and triggers personalized follow-up sequences. It also manages Cal.com bookings and ClickUp task creation.',
      tags: ['n8n', 'Airtable', 'Cal.com', 'ClickUp'],
      results: ['40% increase in lead-to-call conversion', 'Automated onboarding saved 10 hours/week', 'Real-time sales dashboard for leadership'],
      images: [
        'https://i.ibb.co/C3CpW9ps/Video-Screen1771172981589.png',
        'https://i.ibb.co/Z6gzvNNr/Video-Screen1771173052860.png',
        'https://i.ibb.co/qMDspZb2/Screen-Shot-2026-02-15-at-14-47-38.png',
        'https://i.ibb.co/W4P46vW2/Screen-Shot-2026-02-16-at-00-29-40.png'
      ],
      videoUrl: 'https://www.youtube.com/embed/XmjvyugFOsE',
      timeline: '14 - 21 Days',
      efficiency: '+40%'
    },
    {
      id: 'food-order',
      icon: <Utensils />,
      industry: 'Food & Beverage',
      title: 'AI Food Ordering System',
      desc: 'Automated food ordering system for restaurants via Telegram, integrated with real-time payments.',
      fullDesc: 'A seamless ordering experience that lives where customers are. This system handles menu browsing, order customization, and secure payment processing via Paystack. It automatically updates kitchen displays and inventory in Google Sheets, notifying customers of their order status in real-time.',
      tags: ['Make.com', 'Telegram', 'Gemini AI', 'Paystack'],
      results: ['30% increase in off-peak orders', 'Zero manual order entry errors', 'Average order time reduced to 45 seconds'],
      images: [
        'https://i.ibb.co/whWRMHrc/image.png',
        'https://i.ibb.co/7J9pGDs3/image.png',
        'https://i.ibb.co/b5CVtTJQ/image.png',
        'https://i.ibb.co/k23fj7Vv/image.png'
      ],
      videoUrl: 'https://www.youtube.com/embed/mbe8OkRdfE8',
      timeline: '5 - 7 Days',
      efficiency: '+30%'
    },
    {
      id: 'research-engine',
      icon: <Search />,
      industry: 'Market Intelligence',
      title: 'Automated Research Engine',
      desc: 'Deep research automation that scrapes, analyzes, and summarizes company data into structured reports.',
      fullDesc: 'An autonomous research agent that performs deep-dives into target companies. It scrapes public data, analyzes financial reports using Perplexity Sonar, and generates comprehensive summaries in Google Sheets. Perfect for VC firms, sales teams, and competitive analysis.',
      tags: ['n8n', 'Perplexity', 'Google Sheets', 'OpenRouter'],
      results: ['90% faster research cycles', 'Structured data for 100+ companies daily', 'High-accuracy competitive insights'],
      images: [
        'https://i.ibb.co/wFB4RfwN/Screen-Shot-2026-02-28-at-13-53-54.png',
        'https://i.ibb.co/352tNp02/Screen-Shot-2026-02-28-at-13-52-27.png',
        'https://i.ibb.co/tPQqFtTD/Screen-Shot-2026-02-28-at-13-53-00.png',
        'https://i.ibb.co/zVLwBJYt/Video-Screen1769694535025.png'
      ],
      videoUrl: 'https://www.youtube.com/embed/BcItWgvSp1M',
      timeline: '3 - 5 Days',
      efficiency: '+90%'
    },
    {
      id: 'ad-gen',
      icon: <Paintbrush />,
      industry: 'Marketing',
      title: 'AI Ad Campaign Generator',
      desc: 'Automated ad generation using computer vision and image generation for multi-platform campaigns.',
      fullDesc: 'Transform a single product photo into a complete marketing campaign. This system uses Gemini Vision to understand product features and FLUX.1 to generate high-converting ad creative. It automatically formats assets for Instagram, Facebook, and Google Ads, saving days of creative work.',
      tags: ['n8n', 'Gemini Vision', 'FLUX.1', 'Cloudinary'],
      results: ['Creative production time cut by 98%', '15+ ad variations per product', 'Consistent brand voice across platforms'],
      images: [
        'https://i.ibb.co/rRXrywVd/Screen-Shot-2026-02-19-at-16-01-38.png',
        'https://i.ibb.co/PzV9Fb9L/Screen-Shot-2026-02-19-at-15-03-12.png',
        'https://i.ibb.co/C5wtNkWB/Screen-Shot-2026-02-19-at-15-00-37.png',
        'https://i.ibb.co/LXqDpp7f/Screen-Shot-2026-02-19-at-15-04-04.png'
      ],
      videoUrl: 'https://www.youtube.com/embed/11HwALwo1-Q',
      timeline: '2 - 4 Days',
      efficiency: '+98%'
    },
    {
      id: 'rider-dispatch',
      icon: <Bike />,
      industry: 'Logistics',
      title: 'Autonomous Rider Dispatch',
      desc: 'GPS-based rider dispatch system that optimizes delivery routes and automates assignments.',
      fullDesc: 'A real-time logistics engine that manages a fleet of delivery riders. Using Haversine formula for distance calculation, it automatically assigns orders to the nearest available rider via WhatsApp. It tracks delivery status and provides customers with live updates, ensuring maximum efficiency.',
      tags: ['n8n', 'Twilio', 'WhatsApp', 'Haversine'],
      results: ['25% reduction in delivery times', 'Automated dispatch for 500+ daily orders', 'Improved rider utilization rates'],
      images: [
        'https://i.ibb.co/TB4dn43C/Video-Screen1769371312340.png',
        'https://i.ibb.co/Xf5z8YsL/Video-Screen1769376299963.png'
      ],
      videoUrl: 'https://www.youtube.com/embed/Rn2bN5CXgQA',
      timeline: '7 - 10 Days',
      efficiency: '+25%'
    },
    {
      id: 'biz-assist',
      icon: <MessageSquare />,
      industry: 'Customer Service',
      title: 'WhatsApp Business Assistant',
      desc: 'Intelligent customer support agent that handles inquiries, bookings, and basic troubleshooting.',
      fullDesc: 'A high-performance WhatsApp assistant powered by DeepSeek V3. It handles common customer questions, schedules appointments, and provides basic technical support. It integrates with internal databases to provide personalized responses and escalates complex issues to human agents.',
      tags: ['n8n', 'DeepSeek V3', 'Twilio', 'OpenRouter'],
      results: ['85% of inquiries resolved by AI', 'Instant response times 24/7', 'Higher customer satisfaction scores'],
      images: [
        'https://i.ibb.co/5XcCHDft/Video-Screen1768827490128.png',
        'https://i.ibb.co/3mBz9Lnc/image.png',
        'https://i.ibb.co/MTJpkQp/Screenshot-20260308-125708-Whats-App-Business.jpg',
        'https://i.ibb.co/5XcCHDft/Video-Screen1768827490128.png'
      ],
      videoUrl: 'https://www.youtube.com/embed/nmP3Bvyn0BA',
      timeline: '5 - 7 Days',
      efficiency: '+85%'
    },
    {
      id: 'backup-sys',
      icon: <RefreshCw />,
      industry: 'DevOps',
      title: 'Workflow Backup System',
      desc: 'Mission-critical backup system that automatically version-controls and backs up n8n workflows.',
      fullDesc: 'A robust DevOps tool for automation engineers. It automatically exports n8n workflows, commits them to a GitHub repository for version control, and sends status reports via Telegram. It ensures that your automation infrastructure is always backed up and recoverable.',
      tags: ['n8n', 'GitHub API', 'n8n API', 'Telegram'],
      results: ['Zero data loss on workflow changes', 'Automated version history', 'Peace of mind for mission-critical ops'],
      images: [
        'https://i.ibb.co/7dHwM33Q/Video-Screen1770845448274.png',
        'https://i.ibb.co/2Y5ftT6J/image.png',
        'https://i.ibb.co/Q7MckzdJ/image.png',
        'https://i.ibb.co/Z6f0tQsb/image.png'
      ],
      timeline: '1 - 2 Days',
      efficiency: '+100%'
    }
  ];

  return (
    <section id="portfolio" className="py-40">
      <div className="container max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <span className="section-label">Selected Work</span>
          <h2 className="text-6xl md:text-9xl font-display font-bold mb-8 tracking-tighter">Production <span className="text-gold-gradient">Systems</span></h2>
          <p className="text-muted text-xl max-w-3xl font-light">Click any system to see the technical architecture, results, and video demonstrations.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {projects.map((project, idx) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedProject(project)}
              className="glass group cursor-pointer overflow-hidden border-gold/10 hover:border-gold/50 transition-all duration-700 shadow-xl"
            >
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={project.images[0]} 
                  alt={project.title} 
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-gold text-black px-8 py-4 rounded-2xl font-tech font-bold text-xs uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl">
                    <Play size={20} fill="black" /> VIEW SYSTEM
                  </div>
                </div>
              </div>
              <div className="p-10">
                <div className="text-[0.7rem] text-gold font-tech font-bold uppercase tracking-[0.3em] mb-4">{project.industry}</div>
                <h3 className="font-display font-bold text-3xl mb-6 text-text group-hover:text-gold transition-colors leading-tight">{project.title}</h3>
                <p className="text-muted text-base font-light mb-8 line-clamp-2">{project.desc}</p>
                <div className="flex flex-wrap gap-3">
                  {project.tags.slice(0, 3).map((tag, i) => (
                    <span key={`${tag}-${i}`} className="text-[0.65rem] px-3 py-1.5 bg-gold/5 border border-gold/20 rounded-full text-gold font-tech font-bold uppercase tracking-widest">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        project={selectedProject} 
      />
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Oluwaseun Adeyemi',
      role: 'Founder, Lagos Logistics',
      text: 'Eldorado transformed our dispatch operations. What used to take 4 people all day now happens autonomously in seconds. The ROI was immediate.',
      avatar: 'https://i.pravatar.cc/150?u=olu'
    },
    {
      name: 'Julian Vance',
      role: 'CEO, Vance Media Group',
      text: 'The lead scoring system he built is pure magic. We stopped wasting time on Tier C leads and saw our conversion rate jump by 40% in the first month.',
      avatar: 'https://i.pravatar.cc/150?u=julian'
    },
    {
      name: 'Clara Whitmore',
      role: 'Operations Head, Whitmore & Co',
      text: 'I have worked with many automation experts, but Eldorado is on another level. He understands the business logic as well as the technical stack.',
      avatar: 'https://i.pravatar.cc/150?u=clara'
    }
  ];

  return (
    <section className="py-40 bg-bg-alt relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="section-label mx-auto">Social Proof</span>
          <h2 className="text-6xl md:text-9xl font-display font-bold mb-8 tracking-tighter">Client <span className="text-gold-gradient">Impact</span></h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-12 relative border-gold/10"
            >
              <Quote className="absolute top-10 right-10 text-gold/10 w-16 h-16" />
              <div className="flex gap-1.5 mb-8">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-gold text-gold" />)}
              </div>
              <p className="text-muted text-xl italic font-light mb-10 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-6">
                <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full border-2 border-gold/20 shadow-xl" />
                <div>
                  <div className="font-display font-bold text-2xl text-text">{t.name}</div>
                  <div className="text-[0.7rem] font-tech font-bold text-gold uppercase tracking-[0.3em]">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ToolsMarquee = () => {
  const toolsRow1 = [
    'n8n', 'Make.com', 'Zapier', 'OpenAI GPT-4', 'Gemini 2.0', 'Claude AI', 'Grok', 'Perplexity Sonar', 
    'DeepSeek V3', 'WhatsApp', 'Telegram', 'Airtable', 'Google Workspace',
    'ClickUp', 'Cal.com', 'Paystack', 'Shopify', 'Shippo', 'Cloudinary', 'GitHub', 
    'Twilio', 'FLUX.1', 'OpenRouter'
  ];

  const toolsRow2 = [
    'Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM', 'Monday.com', 'Notion', 'Slack', 'Discord', 
    'Stripe', 'Lemlist', 'Apollo.io', 'Hunter.io', 'Instantly.ai', 'Clay', 'PhantomBuster',
    'ActiveCampaign', 'Mailchimp', 'Klaviyo', 'Typeform', 'Tally.so', 'Webflow', 'Framer'
  ];

  return (
    <div className="py-32 border-y border-gold/10 overflow-hidden bg-bg relative space-y-12">
      <div className="absolute top-0 left-0 w-40 h-full bg-linear-to-r from-bg to-transparent z-10" />
      <div className="absolute top-0 right-0 w-40 h-full bg-linear-to-l from-bg to-transparent z-10" />
      
      <div className="container max-w-7xl mx-auto px-6 mb-12 flex justify-center">
        <span className="text-[0.7rem] font-tech text-gold uppercase tracking-[0.6em] flex items-center gap-6 font-bold">
          <div className="w-16 h-px bg-gold/30" />
          The Automation Stack
          <div className="w-16 h-px bg-gold/30" />
        </span>
      </div>

      <div className="space-y-8 overflow-hidden">
        {/* Row 1 - Left to Right */}
        <div className="flex animate-marquee whitespace-nowrap will-change-transform">
          {[...toolsRow1, ...toolsRow1].map((tool, idx) => (
            <div key={`r1-${idx}`} className="flex items-center gap-4 md:gap-8 px-8 md:px-16 text-muted hover:text-gold transition-all duration-500 font-tech font-bold text-[0.6rem] md:text-sm uppercase tracking-[0.3em] md:tracking-[0.5em] group">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gold/20 group-hover:bg-gold transition-colors" />
              {tool}
            </div>
          ))}
        </div>

        {/* Row 2 - Right to Left */}
        <div className="flex animate-marquee-reverse whitespace-nowrap will-change-transform">
          {[...toolsRow2, ...toolsRow2].map((tool, idx) => (
            <div key={`r2-${idx}`} className="flex items-center gap-4 md:gap-8 px-8 md:px-16 text-muted hover:text-gold transition-all duration-500 font-tech font-bold text-[0.6rem] md:text-sm uppercase tracking-[0.3em] md:tracking-[0.5em] group">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gold/20 group-hover:bg-gold transition-colors" />
              {tool}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    { q: 'What types of businesses do you work with?', a: 'E-commerce brands, logistics companies, food businesses, coaching practices, financial services firms, and any business running manual processes that should be automated. If your team is copying and pasting data, sending repetitive messages, or doing work that follows a pattern, I can automate it.' },
    { q: 'Do you work with international clients?', a: 'Yes, absolutely. My e-commerce systems are built on Shopify and Shippo which are widely used across the US, UK, Canada, and Australia. I am comfortable working across time zones and communicate clearly in English.' },
    { q: 'How long does a typical project take?', a: 'Most standard automation setups take 7 to 14 days. Complex multi-flow systems like a full CRM pipeline or AI chatbot with custom training may take 2 to 4 weeks depending on scope.' },
    { q: 'Do I need to be technical to work with you?', a: 'Not at all. I handle all the technical work from design to build to test to handover. I explain everything in plain language and deliver systems that are easy for non-technical teams to use.' },
    { q: 'What tools and platforms do you use?', a: 'My primary platforms are n8n and Make.com. I integrate AI models including GPT-4, Gemini, Claude, Grok, DeepSeek, and Perplexity Sonar. I connect tools like Airtable, Google Sheets, Shopify, and many others.' },
    { q: 'How much do your services cost?', a: 'Pricing is project-based and depends on complexity. Book a free discovery call and I will provide a clear, itemized quote after understanding your goals and current setup.' },
  ];

  return (
    <section id="faq" className="py-40">
      <div className="container max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="section-label mx-auto">FAQ</span>
          <h2 className="text-6xl md:text-9xl font-display font-bold mb-8 tracking-tighter">Common <span className="text-gold-gradient">Inquiries</span></h2>
        </motion.div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass overflow-hidden border-gold/10"
            >
              <button 
                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                className="w-full px-10 py-10 flex justify-between items-center text-left font-display font-bold text-2xl hover:bg-gold/5 transition-colors text-text"
              >
                {faq.q}
                <ChevronDown className={`w-8 h-8 text-gold transition-transform duration-700 ${activeIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeIndex === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-10 pb-10 text-muted text-lg leading-relaxed font-light"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-40 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-gold/5 blur-[150px] pointer-events-none" />
      
      <div className="container max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-label mx-auto">Initiate Contact</span>
          <h2 className="text-6xl md:text-[10rem] font-display font-bold mb-12 leading-[0.8] tracking-tighter text-text">Ready to <span className="text-gold-gradient">Automate?</span></h2>
          <p className="text-muted text-xl md:text-3xl max-w-2xl mx-auto mb-16 font-light">Stop losing hours to manual tasks. Let's build the infrastructure your business deserves.</p>
          
          <div className="flex flex-wrap justify-center gap-8 mb-20">
            <a href="https://cal.com/eldoradoautomate/free-strategy-call" target="_blank" className="bg-gold text-black px-14 py-8 rounded-3xl font-tech font-bold text-sm flex items-center gap-4 shadow-[0_30px_70px_rgba(255,215,0,0.3)] hover:shadow-[0_30px_70px_rgba(255,215,0,0.6)] transition-all hover:-translate-y-2 uppercase tracking-[0.3em]">
              <CalendarCheck className="w-8 h-8" /> Book Strategy Call
            </a>
            <a href="https://wa.me/2348083693498" target="_blank" className="glass px-14 py-8 rounded-3xl font-tech font-bold text-sm flex items-center gap-4 transition-all hover:-translate-y-2 uppercase tracking-[0.3em] border-gold/40 hover:border-gold text-gold">
              <MessageSquare className="w-8 h-8" /> WhatsApp Direct
            </a>
          </div>

          <div className="flex justify-center gap-10">
            {[
              { icon: <Mail />, href: 'mailto:daniel@eldoradonode.work' },
              { icon: <MessageSquare />, href: 'https://wa.me/2348083693498' },
              { icon: <Twitter />, href: 'https://x.com/PathToAutomate' },
              { icon: <Github />, href: 'https://github.com/eldoradonode' },
            ].map((social, idx) => (
              <a 
                key={idx} 
                href={social.href} 
                target="_blank"
                className="w-16 h-16 rounded-2xl border border-gold/10 flex items-center justify-center text-muted hover:text-gold hover:border-gold hover:bg-gold/5 transition-all hover:-translate-y-2"
              >
                {React.cloneElement(social.icon as React.ReactElement, { size: 28 } as any)}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-24 border-t border-gold/10 text-center bg-bg"
    >
      <div className="container max-w-7xl mx-auto px-6">
        <div className="h-[500px] flex items-center justify-center mb-16">
          <img 
            src="https://i.ibb.co/gbMp0c6Q/Screenshot-20260228-204116-Samsung-Internet-removebg-preview.png" 
            alt="Eldorado Logo" 
            className="h-full w-auto object-contain logo-gold"
            referrerPolicy="no-referrer"
          />
        </div>
        <p className="text-muted text-base font-tech font-bold uppercase tracking-[0.4em] mb-12">AI Automation Builder • Systems Engineer • Digital Infrastructure</p>
        
        <div className="flex justify-center gap-10 mb-12">
          {[
            { icon: <Twitter />, href: 'https://x.com/PathToAutomate' },
            { icon: <Github />, href: 'https://github.com/eldoradonode' },
            { icon: <Mail />, href: 'mailto:daniel@eldoradonode.work' },
            { icon: <MessageSquare />, href: 'https://wa.me/2348083693498' },
          ].map((social, idx) => (
            <a key={idx} href={social.href} target="_blank" className="text-muted hover:text-gold transition-colors">
              {React.cloneElement(social.icon as React.ReactElement, { size: 24 } as any)}
            </a>
          ))}
        </div>
        
        <p className="text-[0.8rem] text-muted/30 font-tech font-bold tracking-[0.2em]">© 2026 ELDORADO DANIEL. ALL RIGHTS RESERVED. ENGINEERED FOR PERFORMANCE.</p>
      </div>
    </motion.footer>
  );
};

const WhyMe = () => {
  const reasons = [
    { icon: <Bolt />, title: 'Fast Turnaround', desc: 'I move fast without cutting corners. Most projects delivered in 7 to 14 days. Complex multi-flow systems in 2 to 4 weeks.' },
    { icon: <Lock />, title: 'Confidentiality Guaranteed', desc: 'Your API keys, business logic, and internal data stay strictly private. I treat every client system as if it were my own.' },
    { icon: <PieChart />, title: 'Built for Real Outcomes', desc: 'Every system is tied to a measurable result — hours saved, costs reduced, or revenue enabled. No vanity builds.' },
    { icon: <RefreshCw />, title: 'Post-Launch Support', desc: 'I don\'t disappear after delivery. Every project includes a follow-up window and I offer retainers for ongoing optimization.' },
    { icon: <Globe />, title: 'International Experience', desc: 'I build for global markets. My e-commerce stack is the same stack used by stores in the US, UK, Canada, and Australia.' },
    { icon: <Layers />, title: 'Multi-Industry Range', desc: 'From insurance to logistics to food service to marketing. I\'ve built across industries. Your sector is familiar territory.' },
  ];

  return (
    <section className="py-40 bg-bg-alt">
      <div className="container max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <span className="section-label">The Edge</span>
          <h2 className="text-6xl md:text-9xl font-display font-bold mb-8 tracking-tighter">Why <span className="text-gold-gradient">Eldorado?</span></h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {reasons.map((reason, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-12 flex gap-10 items-start hover:border-gold/40 transition-all border-gold/10"
            >
              <div className="w-16 h-16 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-gold flex-shrink-0">
                {React.cloneElement(reason.icon as React.ReactElement, { size: 32 } as any)}
              </div>
              <div>
                <h3 className="font-display font-bold text-3xl mb-4">{reason.title}</h3>
                <p className="text-muted text-lg leading-relaxed font-light">{reason.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Main App ---

export default function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      lenis.destroy();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative selection:bg-gold selection:text-black">
      <CustomCursor />
      <BackgroundGlow />
      <Navbar onOpenCommand={() => setIsCommandPaletteOpen(true)} />
      <main>
        <Hero />
        <About />
        <Services />
        <ProcessTimeline />
        <ToolsMarquee />
        <Portfolio />
        <Testimonials />
        <WhyMe />
        <FAQ />
        <Contact />
      </main>
      <Chatbot />
      <LiveStats />
      <Footer />
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
