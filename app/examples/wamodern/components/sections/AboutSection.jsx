'use client';

import SectionText from '../ui/SectionText';

const pillars = [
  { jp: '侘', en: 'Wabi', desc: '不完全のなかの美' },
  { jp: '寂', en: 'Sabi', desc: '時が刻む深み' },
  { jp: '間', en: 'Ma',   desc: '余白に宿る意味' },
];

export default function AboutSection({ isVisible }) {
  return (
    <section
      style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10vw',
        gap: '4rem',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* Left: pillars */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem',
          transition: 'opacity 0.9s 0.1s, transform 0.9s 0.1s cubic-bezier(0.16,1,0.3,1)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(-24px)',
          flexShrink: 0,
        }}
      >
        {pillars.map((p, i) => (
          <div
            key={p.jp}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '1.2rem',
              transition: `opacity 0.7s ${0.2 + i * 0.12}s, transform 0.7s ${0.2 + i * 0.12}s`,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
            }}
          >
            <span
              style={{
                fontFamily: "'Zen Old Mincho', serif",
                fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                color: 'var(--gold)',
                lineHeight: 1,
                opacity: 0.7,
              }}
            >
              {p.jp}
            </span>
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: 'var(--white)',
                  letterSpacing: '0.1em',
                  opacity: 0.7,
                }}
              >
                {p.en}
              </div>
              <div
                style={{
                  fontFamily: "'Noto Serif JP', serif",
                  fontSize: '0.7rem',
                  color: 'rgba(240,235,220,0.4)',
                  letterSpacing: '0.1em',
                  marginTop: '0.15rem',
                }}
              >
                {p.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right: text */}
      <SectionText
        label="美学 — Season II"
        title="不完全を<br/>愛でる<br/>心"
        subtitle="Embracing impermanence"
        body="割れた陶器の継ぎ目を金で修繕する金継ぎのように、傷や欠けは隠すべきものではなく、歴史の証として輝かせるべき宝である。"
        align="right"
        isVisible={isVisible}
      />

      {/* Ghost kanji background */}
      <div
        style={{
          position: 'absolute',
          left: '-3vw',
          bottom: '5vh',
          fontFamily: "'Zen Old Mincho', serif",
          fontSize: 'clamp(8rem, 22vw, 20rem)',
          color: 'rgba(200,160,80,0.04)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        美
      </div>
    </section>
  );
}
