'use client';

import { useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useScrollProgress } from './hooks/useScrollProgress';
import HeroSection    from './components/sections/HeroSection';
import AboutSection   from './components/sections/AboutSection';
import WorksSection   from './components/sections/WorksSection';
import ContactSection from './components/sections/ContactSection';

// Dynamically import the canvas to avoid SSR issues
const ShaderBackground = dynamic(
  () => import('./components/canvas/ShaderBackground'),
  { ssr: false }
);

export default function Page() {
  const { scrollProgress, currentSection, sectionProgress } = useScrollProgress();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  // Track mouse in normalised [0,1] space — ref only, no re-render
  const handleMouseMove = useCallback((e) => {
    mouseRef.current.x = e.clientX / window.innerWidth;
    mouseRef.current.y = 1 - e.clientY / window.innerHeight;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Section visibility (show when ≥ 15% into the section)
  const sectionVisible = (idx) => {
    if (currentSection > idx) return true;
    if (currentSection === idx) return sectionProgress >= 0.05 || idx === 0;
    return false;
  };

  return (
    <>
      {/* ── CSS Variables & global reset ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Noto+Serif+JP:wght@200;300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink:   #0d0b0f;
          --white: #f0ebe0;
          --gold:  #c8aa4c;
          --indigo:#140f2e;
        }

        html { scroll-behavior: auto; }

        body {
          background: var(--ink);
          color: var(--white);
          overscroll-behavior: none;
        }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: var(--ink); }
        ::-webkit-scrollbar-thumb { background: var(--gold); opacity: 0.5; }

        /* Scroll progress indicator */
        .scroll-indicator {
          position: fixed;
          left: 2rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .scroll-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          border: 1px solid var(--gold);
          transition: background 0.4s, transform 0.4s;
        }

        .scroll-dot.active {
          background: var(--gold);
          transform: scale(1.5);
        }
      `}</style>

      {/* ── Fixed shader background ── */}
      <ShaderBackground
        scrollProgress={scrollProgress}
        currentSection={currentSection}
        mouseRef={mouseRef}
      />

      {/* ── Scroll progress dots ── */}
      <nav className="scroll-indicator" aria-label="Section navigation">
        {['Hero', 'About', 'Works', 'Contact'].map((label, i) => (
          <button
            key={label}
            className={`scroll-dot ${currentSection === i ? 'active' : ''}`}
            title={label}
            onClick={() => window.scrollTo({ top: i * window.innerHeight, behavior: 'smooth' })}
            style={{ background: currentSection === i ? 'var(--gold)' : 'transparent', cursor: 'pointer' }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            bottom: '-3rem',
            width: '1px',
            height: '2rem',
            background: 'linear-gradient(to bottom, var(--gold), transparent)',
          }}
        />
      </nav>

      {/* ── HTML content layer ── */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection    isVisible={sectionVisible(0)} />
        <AboutSection   isVisible={sectionVisible(1)} />
        <WorksSection   isVisible={sectionVisible(2)} />
        <ContactSection isVisible={sectionVisible(3)} />
      </main>
    </>
  );
}
