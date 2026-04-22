import { useEffect, useState } from 'react';

/**
 * useScrollProgress
 * Returns scrollProgress (0.0 – 1.0), currentSection (0–3), and sectionProgress (0.0–1.0)
 * Works with a container of 4 × 100vh sections.
 */
export function useScrollProgress() {
  const [state, setState] = useState({
    scrollProgress: 0,
    currentSection: 0,
    sectionProgress: 0,
    scrollY: 0,
  });

  useEffect(() => {
    let raf = null;
    let lastY = -1;

    const update = () => {
      const y = window.scrollY;
      if (y === lastY) {
        raf = requestAnimationFrame(update);
        return;
      }
      lastY = y;

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min(y / totalHeight, 1) : 0;

      const sectionHeight = window.innerHeight;
      const section = Math.min(Math.floor(y / sectionHeight), 3);
      const secProgress = (y % sectionHeight) / sectionHeight;

      setState({
        scrollProgress: progress,
        currentSection: section,
        sectionProgress: secProgress,
        scrollY: y,
      });

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return state;
}
