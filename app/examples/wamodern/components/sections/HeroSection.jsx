'use client';

import SectionText from '../ui/SectionText';

export default function HeroSection({ isVisible }) {
  return (
    <section
      style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10vw',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <SectionText
        label="花 · 光 · 刹那　— Season I"
        title="散ることを<br/>知って<br/><em style='color:var(--gold);font-style:normal'>咲く</em>"
        subtitle="To bloom knowing it must fall"
        body="桜は散るために咲く。その潔さの中に、日本人が数千年をかけて発見した美の本質がある。一瞬の輝きが、永遠より深く心に刻まれる。"
        align="left"
        isVisible={isVisible}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: '0.85rem',
              letterSpacing: '0.18em',
              color: 'rgba(200,170,80,0.6)',
            }}
          >
            Scroll to begin ↓
          </span>
          <div style={{ width: '3rem', height: '1px', background: 'linear-gradient(90deg, rgba(200,170,80,0.4), transparent)' }} />
        </div>
      </SectionText>

      {/* Giant ghost kanji */}
      <div
        style={{
          position: 'absolute',
          right: '-2vw',
          top: '50%',
          transform: 'translateY(-52%)',
          fontFamily: "'Zen Old Mincho', serif",
          fontSize: 'clamp(10rem, 26vw, 22rem)',
          color: 'rgba(200, 160, 80, 0.045)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '-0.05em',
        }}
      >
        花
      </div>

      {/* Season badge */}
      <div
        style={{
          position: 'absolute',
          right: '10vw',
          bottom: '8vh',
          fontFamily: "'Zen Old Mincho', serif",
          fontSize: '0.65rem',
          letterSpacing: '0.4em',
          color: 'rgba(200,170,80,0.35)',
          writingMode: 'vertical-rl',
        }}
      >
        春 · 令和
      </div>
    </section>
  );
}
