import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUpRight, 
  Layers, 
  Cpu, 
  Globe, 
  Zap, 
  ArrowRight,
  Lightbulb,
  Moon,
  Film,
  TrendingUp,
  ChevronUp
} from 'lucide-react';

/**
 * UTILITY COMPONENTS
 */

const ChevronPattern = ({ color }: { color: string }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.1] md:opacity-[0.15] select-none">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="chevron-main" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M30 20L50 40L30 60" fill="none" stroke={color} strokeWidth="2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#chevron-main)" />
    </svg>
  </div>
);

const Logo = ({ 
  className = "", 
  sizeClass = "h-8", 
  textClass = "text-3xl", 
  brandColor = "#B9EE01" 
}: { 
  className?: string; 
  sizeClass?: string; 
  textClass?: string; 
  brandColor?: string;
}) => (
  <div className={`flex items-center group cursor-pointer ${className}`}>
    <div className="relative flex items-center h-full">
      <img 
        src="/revox-green-logo.png" 
        alt="revox logo" 
        className={`${sizeClass} w-auto object-contain transition-transform duration-500 group-hover:scale-105`}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          const next = e.currentTarget.nextElementSibling as HTMLElement;
          if (next) next.style.display = 'block';
        }}
      />
      <span 
        className={`font-teko font-bold tracking-tighter leading-none pt-1 hidden ${textClass}`} 
        style={{ color: brandColor }}
      >
        revox
      </span>
    </div>
  </div>
);

/**
 * Dynamic Global Background with Liquid/Water-Drop Cursor Effect
 */
const GlobalBackground = ({ darkMode, glowColor }: { darkMode: boolean; glowColor: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let animationFrameId: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };
    
    const animate = () => {
      // Lerp (Linear Interpolation) creates the smooth fluid motion delay
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;

      if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', `${currentX}px`);
        containerRef.current.style.setProperty('--mouse-y', `${currentY}px`);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden" ref={containerRef}>
      
      {/* SVG Filter for Underwater Motion Distortion (Expanded bounds to prevent edge box effect) */}
      <svg className="hidden">
        <filter id="water-ripple" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="3" result="noise">
            <animate attributeName="baseFrequency" values="0.005;0.008;0.005" dur="8s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Static ambient background glow */}
      <div className="absolute top-[40%] left-[60%] w-[80vw] h-[80vw] rounded-full blur-[180px] opacity-20"
        style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
      />
      
      {/* Base subtle grid pattern WITH Water Ripple Filter (Negative inset hides rough filter edges) */}
      <div className="absolute -inset-[100px]">
        <svg 
          width="100%" 
          height="100%" 
          xmlns="http://www.w3.org/2000/svg" 
          className={darkMode ? "opacity-[0.03]" : "opacity-[0.08]"}
          style={{ filter: 'url(#water-ripple)' }}
        >
          <defs>
            <pattern id="small-chevron-global" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M8 6L13 10L8 14" fill="none" stroke={glowColor} strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#small-chevron-global)" />
        </svg>
      </div>
      
      {/* Water Drop Style Glass/Fluid Glow */}
      {isMounted && (
        <div 
          className="absolute pointer-events-none mix-blend-screen"
          style={{
            left: 'var(--mouse-x, -1000px)',
            top: 'var(--mouse-y, -1000px)',
            transform: 'translate(-50%, -50%)',
            width: '450px',
            height: '450px',
          }}
        >
          <div 
            className="w-full h-full water-drop-cursor"
            style={{
              background: `radial-gradient(circle at center, ${glowColor}25 0%, ${glowColor}05 50%, transparent 80%)`,
              backdropFilter: 'blur(6px) brightness(1.1)',
              WebkitBackdropFilter: 'blur(6px) brightness(1.1)',
              border: `1px solid ${glowColor}10`,
              boxShadow: `inset 0 0 40px ${glowColor}15, 0 0 60px ${glowColor}10`,
            }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Service Card Component with Cursor Following Glow
 */
const ServiceCard = ({ 
  icon, 
  title, 
  items, 
  cardBg, 
  primaryGreen, 
  darkMode 
}: any) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovered] = useState(false);
  const [cardSize, setCardSize] = useState({ w: 0, h: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setCardSize({
        w: rect.width,
        h: rect.height,
      });
      setIsHovered(true);
    }
  };

  // Calculate dynamic 3D rotation based on cursor position
  let rotateX = 0;
  let rotateY = 0;
  if (isHovering && cardSize.w > 0 && cardSize.h > 0) {
    const MAX_ROTATION = 3.5; // Reduced from 8 for softer, more subtle tilt
    const centerX = cardSize.w / 2;
    const centerY = cardSize.h / 2;
    
    // Rotate Y pushes the left/right sides down based on X cursor position
    rotateY = ((mousePos.x - centerX) / centerX) * MAX_ROTATION;
    // Rotate X pushes the top/bottom sides down based on Y cursor position (inverted)
    rotateX = -((mousePos.y - centerY) / centerY) * MAX_ROTATION;
  }

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative z-0 hover:z-10 cursor-pointer" 
      style={{ perspective: '1200px' }}
    >
      {/* INNER WRAPPER: Unified card that holds background and performs dynamic 3D tilt */}
      <div 
        className="w-full h-full p-10 overflow-hidden relative transition-all duration-700 ease-out shadow-none hover:shadow-2xl"
        style={{ 
          backgroundColor: cardBg,
          transform: isHovering ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.985)` : 'rotateX(0deg) rotateY(0deg) scale(1)'
        }}
      >
        {/* Default Dim Gradient at top-left corner */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{ 
            background: `radial-gradient(circle at 0% 0%, ${primaryGreen} 0%, transparent 70%)`
          }} 
        />
        
        {/* Interactive Cursor Follower Gradient that fades out gracefully without snapping */}
        <div 
          className={`absolute inset-0 transition-opacity duration-700 ease-out pointer-events-none ${isHovering ? 'opacity-[0.18]' : 'opacity-0'}`}
          style={{ 
            background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, ${primaryGreen} 0%, transparent 70%)`
          }} 
        />
        
        <div className="relative z-10">
          <div className="mb-10 text-[#B9EE01] transition-transform duration-500 ease-out group-hover:translate-x-2">
            {React.cloneElement(icon as React.ReactElement, { size: 44, strokeWidth: 1.5 })}
          </div>
          <h3 className="text-4xl font-teko uppercase font-bold mb-6 tracking-wide">{title}</h3>
          <ul className={`space-y-3 font-telegraf text-sm uppercase tracking-[0.15em] transition-opacity group-hover:opacity-100 ${darkMode ? "opacity-70" : "opacity-90"}`}>
            {items.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
      setScrollOffset(offset);
      setShowBackToTop(offset > 400);
    };

    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    link.href = '/green-chevron.svg';
    if (!document.head.contains(link)) document.head.appendChild(link);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Brand Style Constants
  const primaryGreen = "#B9EE01";
  const bgColor = darkMode ? "#000000" : "#3500EE";
  
  // Page gradient simulating "diving into the sea" for light mode
  const pageBackground = darkMode 
    ? "#000000" 
    : "linear-gradient(to bottom, #3500EE 0%, #2000A8 40%, #0F0060 75%, #09003B 100%)";
    
  const textColor = "#FFFFFF"; 
  const cardBg = darkMode ? "rgba(15, 15, 15, 0.6)" : "rgba(255, 255, 255, 0.15)";
  const borderColor = darkMode ? "rgba(185, 238, 1, 0.15)" : "rgba(255, 255, 255, 0.3)";
  const glowColor = darkMode ? primaryGreen : "#00FF41";

  // Typography Constants
  const headingScale = "text-6xl md:text-8xl font-teko uppercase font-bold leading-[0.75]";
  const sectionLabel = "text-[#B9EE01] font-bold tracking-[0.4em] uppercase text-sm mb-3 block";
  const descColor = darkMode ? "text-white/60" : "text-white";
  const descTypography = `text-xl md:text-2xl leading-snug max-w-lg ${descColor}`;
  const primaryBtn = "group px-10 py-5 bg-[#B9EE01] text-black font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all active:scale-[0.96] overflow-hidden relative select-none cursor-pointer";

  // Project Data
  const projects = [
    {
      title: "Nebula OS",
      category: "Product Design",
      tags: ["UI/UX", "3D Motion", "Ecosystem"],
      description: "Redefining spatial computing interfaces for the next generation of wearable devices.",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=2070"
    },
    {
      title: "Veridian",
      category: "Branding",
      tags: ["Identity", "Strategy", "Web"],
      description: "A full-scale digital rebirth for the world's leading sustainable logistics platform.",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2070"
    },
    {
      title: "Arcade Labs",
      category: "Web3 Platform",
      tags: ["Blockchain", "Fintech", "Security"],
      description: "Bridging the gap between traditional finance and decentralized gaming economies.",
      image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2070"
    }
  ];

  const services = [
    { icon: <Layers />, title: "Brand Strategy", items: ["Naming", "Visual Identity", "Voice"] },
    { icon: <Globe />, title: "Web Platforms", items: ["React & Next.js", "WebGL", "headless CMS"] },
    { icon: <Zap />, title: "Digital Growth", items: ["Paid Acquisition", "SEO", "Optimization"] },
    { icon: <Cpu />, title: "Product Design", items: ["UX Research", "Rapid Prototyping", "UI Design"] },
    { icon: <Film />, title: "Motion Design", items: ["3D Animation", "Video Production", "Sound"] },
    { icon: <TrendingUp />, title: "Scaling", items: ["Fractional CTO", "DevOps", "Infrastructure"] }
  ];

  const markOpacity = 0.8; 
  const markShift = scrollOffset * 0.5;

  return (
    <div 
      className="relative min-h-screen overflow-x-hidden transition-colors duration-700 font-sans selection:bg-[#B9EE01] selection:text-black"
      style={{ background: pageBackground, color: textColor }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Teko:wght@400;600;700&display=swap');
          
          .font-telegraf { font-family: 'Space Grotesk', sans-serif; }
          .font-teko { font-family: 'Teko', sans-serif; }
          .font-space { font-family: 'Space Grotesk', sans-serif; }

          .neon-text-glow {
            text-shadow: 0 0 20px ${glowColor}66;
          }

          @keyframes infinite-scroll { 
            from { transform: translateX(0); } 
            to { transform: translateX(-50%); } 
          }
          .animate-infinite-scroll { 
            animation: infinite-scroll 40s linear infinite; 
          }

          /* Fluid Water Drop Morphing & Rotating Animation */
          @keyframes water-drop-morph {
            0% { 
              border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; 
              transform: rotate(0deg) scale(1);
            }
            50% { 
              border-radius: 30% 70% 70% 30% / 30% 70% 30% 70%; 
              transform: rotate(180deg) scale(1.05);
            }
            100% { 
              border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; 
              transform: rotate(360deg) scale(1);
            }
          }
          .water-drop-cursor {
            animation: water-drop-morph 10s infinite linear;
            z-index: 10;
          }

          /* Floating Sun Rays */
          @keyframes sun-rays-float {
            0%, 100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.05); opacity: 0.7; }
          }
          .sun-rays {
            transform-origin: top center;
            animation: sun-rays-float 3s infinite ease-in-out;
          }

          .project-card-mask {
            mask-image: linear-gradient(to top, black, transparent);
            -webkit-mask-image: linear-gradient(to top, black, transparent);
          }
        `}
      </style>

      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-[120] w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-md border border-[#B9EE01] transition-all duration-500 rounded-sm group cursor-pointer ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
      >
        <ChevronUp size={20} className="text-[#B9EE01] transition-transform duration-300 group-hover:-translate-y-1" strokeWidth={3} />
      </button>

      {/* DYNAMIC WATER DROP BACKGROUND LAYER */}
      <GlobalBackground darkMode={darkMode} glowColor={glowColor} />

      {/* SUNLIGHT GLARE (Absolute at top, scrolls away to create "diving" effect) */}
      {!darkMode && (
        <div className="absolute -top-[10vh] left-0 w-full h-[130vh] pointer-events-none z-0 overflow-hidden sun-rays">
          {/* Intense sun core */}
          <div 
            className="absolute top-0 left-0 w-full h-[60vh] mix-blend-screen opacity-90"
            style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.4) 30%, transparent 70%)' }}
          />
          {/* Widespread underwater light bleed */}
          <div 
            className="absolute top-0 left-0 w-full h-[100vh] mix-blend-overlay opacity-70"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${glowColor}66 0%, rgba(255,255,255,0.2) 40%, transparent 80%)` }}
          />
        </div>
      )}

      {/* FIXED LARGE BACKGROUND MARK */}
      <div 
        className="fixed top-1/2 right-[20%] hidden lg:block z-0 pointer-events-none"
        style={{ 
          transform: `translateY(-50%) translateX(${markShift}px)`,
          opacity: markOpacity,
          transition: 'transform 0.4s ease-out, opacity 0.4s ease-out',
          willChange: 'transform, opacity'
        }}
      >
        <img 
          src="/green-chevron.svg" 
          alt="revox chevron mark" 
          className="w-[300px] xl:w-[300px] h-auto"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const next = e.currentTarget.nextElementSibling as HTMLElement;
            if (next) next.style.display = 'block';
          }}
        />
        <svg width="600" height="800" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden opacity-15">
          <path d="M10 10L60 50L10 90" stroke={primaryGreen} strokeWidth="12" strokeLinecap="square" style={{ filter: `drop-shadow(0 0 30px ${glowColor}44)` }} />
        </svg>
      </div>

      {/* Navigation */}
      <nav 
        className={`fixed w-full z-[100] transition-all duration-500 flex items-center ${scrolled ? 'py-3' : 'py-5'}`}
        style={{ 
          backgroundColor: scrolled ? (darkMode ? 'rgba(0,0,0,0.9)' : 'rgba(53,0,238,0.95)') : 'transparent', 
          minHeight: scrolled ? '70px' : '90px' 
        }}
      >
        <div className="w-full px-6 flex justify-between items-center h-full">
          <Logo sizeClass="h-8" textClass="text-3xl" brandColor={primaryGreen} className="pointer-events-auto" />

          <div className="flex items-center gap-6 md:gap-8 h-full">
            <button className="hidden sm:block text-[11px] font-bold uppercase tracking-[0.2em] font-telegraf hover:text-[#B9EE01] transition-colors underline underline-offset-[6px] decoration-1 cursor-pointer">
              Start Project
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full border border-current opacity-80 hover:opacity-100 hover:text-[#B9EE01] hover:border-[#B9EE01] transition-all flex items-center justify-center cursor-pointer">
              {darkMode ? <Lightbulb size={14} /> : <Moon size={14} />}
            </button>
            <button className="z-[110] flex items-center group cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className="relative w-8 h-8 flex flex-col justify-center items-end gap-[6px]">
                <div className={`h-[2px] transition-all duration-500 ease-out ${isMenuOpen ? 'w-6 translate-y-[4px] rotate-45' : 'w-8'}`} style={{ backgroundColor: "#FFFFFF" }} />
                <div className={`h-[2px] transition-all duration-500 ease-out ${isMenuOpen ? 'w-6 -translate-y-[4px] -rotate-45' : 'w-5 group-hover:w-8'}`} style={{ backgroundColor: "#FFFFFF" }} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Overlay */}
      <div className={`fixed inset-0 z-[90] flex flex-col justify-center items-center px-6 transition-all duration-700 origin-top ${isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`} style={{ backgroundColor: bgColor }}>
        <ChevronPattern color={glowColor} />
        <div className="flex flex-col gap-4 text-center relative z-10 w-full max-w-4xl">
          {['Services', 'Work', 'Approach', 'Contact'].map((item, idx) => (
            <div key={item} className="overflow-hidden py-2">
              <a href={`#${item.toLowerCase()}`} className={`block text-3xl md:text-5xl font-telegraf font-bold uppercase tracking-tighter hover:text-[#B9EE01] transition-transform duration-700 cursor-pointer ${isMenuOpen ? 'translate-y-0' : 'translate-y-[120%]'}`} style={{ transitionDelay: `${isMenuOpen ? 300 + (idx * 100) : 0}ms` }} onClick={() => setIsMenuOpen(false)}>
                {item}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden z-10">
        <div className="container max-w-screen-xl mx-auto px-6 relative z-10">
          <div className="w-full">
            <h1 className={`${headingScale} mb-2 max-w-6xl`}>
              DIGITAL <br />
              <span className="flex flex-wrap items-center gap-x-8">
                <span className="text-[#B9EE01] neon-text-glow">EVOLUTION</span>
                <div className="hidden lg:block w-24 h-[2px] bg-current opacity-20" />
              </span>
              FOR BRANDS
            </h1>
            <div className="flex flex-col gap-6 mt-4">
              <p className={`font-telegraf mb-8 ${descTypography} !max-w-lg`}>
                Strategic design partner for startups ready to redefine their industry through high-performance digital ecosystems.
              </p>
              <button className={`${primaryBtn} self-start`}>
                <span className="relative z-10">Our Portfolio</span> 
                <ArrowUpRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-40 relative z-10">
        <div className="container max-w-screen-xl mx-auto px-6">
          <div className="flex flex-col gap-4 mb-24">
            <div>
               <span className={sectionLabel}>Capabilities</span>
               <h2 className={headingScale}>Disruptive <br/> Thinking.</h2>
            </div>
            <p className={`font-telegraf ${descTypography}`}>
              Modern brands require more than just aesthetic. We build scalable digital products that prioritize conversion and brand longevity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, idx) => (
              <ServiceCard 
                key={idx} 
                {...service} 
                cardBg={cardBg} 
                primaryGreen={primaryGreen} 
                darkMode={darkMode} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="work" className="py-40 relative overflow-hidden z-20">
        <div className="container max-w-screen-xl mx-auto px-6">
          <div className="flex flex-col gap-4 mb-24">
            <div>
               <span className={sectionLabel}>Selected Work</span>
               <h2 className={headingScale}>Featured <br/> Case Studies.</h2>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <p className={`font-telegraf ${descTypography}`}>
                A curated selection of digital experiences where strategy, engineering, and bold design converge.
              </p>
              <button className={`${primaryBtn} !px-8 !py-4 whitespace-nowrap`}>
                <span className="relative z-10">Explore All</span> 
                <ArrowRight size={14} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-32">
            {projects.map((project, idx) => (
              <div key={idx} className="group relative cursor-pointer">
                <div className="aspect-[21/9] w-full overflow-hidden relative transition-transform duration-700 ease-out group-hover:scale-[1.01] bg-neutral-900">
                  <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[12vw] font-teko opacity-[0.05] uppercase font-bold tracking-tighter select-none">{project.title}</span>
                  </div>
                  <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                      <div className="max-w-2xl">
                        <div className="flex gap-3 mb-6">
                          {project.tags.map(tag => <span key={tag} className="text-[10px] px-3 py-1 border border-white/20 bg-white/5 backdrop-blur-md uppercase tracking-widest font-bold text-white/90">{tag}</span>)}
                        </div>
                        <h3 className="text-5xl md:text-7xl font-teko uppercase font-bold text-white tracking-tight leading-none mb-2">{project.title}</h3>
                      </div>
                      <div className="bg-black/60 backdrop-blur-2xl p-8 border border-white/10 max-w-sm transition-all duration-500 transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hidden md:block">
                        <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 text-[#B9EE01]">Insight</p>
                        <p className="text-sm font-telegraf leading-relaxed text-white/95 mb-8">{project.description}</p>
                        <div className="flex items-center gap-3 text-[#B9EE01] text-[10px] uppercase font-bold tracking-widest group/link cursor-pointer">
                          View Case Study <ArrowUpRight size={16} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:hidden mt-6">
                   <p className={`font-telegraf leading-relaxed ${descTypography}`}>{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 overflow-hidden z-20">
        <div className="flex whitespace-nowrap animate-infinite-scroll">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex items-center gap-16 px-8">
              <span className="text-5xl md:text-6xl font-teko uppercase opacity-30 font-bold">Innovation</span>
              <span className="text-5xl md:text-6xl font-teko uppercase opacity-30 font-bold">Scale</span>
            </div>
          ))}
        </div>
      </section>

      <footer id="contact" className="pt-40 pb-12 relative overflow-hidden z-20">
        <div className="container max-w-screen-xl mx-auto px-6 relative z-10">
          <div className="flex flex-col gap-4 mb-24">
            <div>
               <span className={sectionLabel}>Get in Touch</span>
               <h2 className={headingScale}>Let's start <br/> <span className="text-[#B9EE01]">the revolution.</span></h2>
            </div>
            <p className={`font-telegraf ${descTypography}`}>
              Ready to redefine your digital presence? We are currently accepting new projects and partnerships for the upcoming quarter.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-40 items-start">
            <div className="w-full">
              <div className="flex flex-col gap-10 font-telegraf uppercase tracking-[0.2em] text-[11px] opacity-100">
                <div>
                  <div className="opacity-70 text-[15px] mb-2 tracking-[0.3em]">Email</div>
                  <a href="mailto:hello@revox.agency" className="text-lg hover:text-[#B9EE01] transition-colors cursor-pointer">hello@revox.agency</a>
                </div>
                <div>
                  <div className="opacity-70 text-[15px] mb-2 tracking-[0.3em]">Phone</div>
                  <a href="tel:+442071234567" className="text-lg hover:text-[#B9EE01] transition-colors cursor-pointer">+44 20 7123 4567</a>
                </div>
                <div>
                  <div className="opacity-70 text-[15px] mb-2 tracking-[0.3em]">Address</div>
                  <p className="text-lg">124 Innovation Drive, London, E1 6AN</p>
                </div>
              </div>
            </div>
            
            <div className="w-full xl:pl-16">
              <form className="flex flex-col gap-12 font-telegraf" onSubmit={(e) => e.preventDefault()}>
                {['Your Name', 'Email Address', 'Company / Startup'].map((label) => (
                  <input key={label} type="text" placeholder={label.toUpperCase()} className="w-full bg-transparent border-b-2 pb-5 pt-3 outline-none focus:border-[#B9EE01] placeholder:text-white/60 transition-all text-sm uppercase" style={{ borderColor: 'rgba(255, 255, 255, 0.4)' }} />
                ))}
                <textarea placeholder="PROJECT DETAILS" rows={4} className="w-full bg-transparent border-b-2 pb-5 pt-3 outline-none focus:border-[#B9EE01] placeholder:text-white/60 resize-none transition-all text-sm uppercase" style={{ borderColor: 'rgba(255, 255, 255, 0.4)' }}></textarea>
                <button type="submit" className={primaryBtn}>
                  <span className="relative z-10">Submit Request</span> 
                  <ArrowRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          </div>

          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-[0.3em] font-bold border-t border-white/10">
            <Logo sizeClass="h-8" textClass="text-3xl" brandColor={primaryGreen} />
            <p className="opacity-100">© 2024 REVOX AGNCY. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;