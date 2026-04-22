'use client';

import SectionText from '../ui/SectionText';

const seasons = [
  { kanji: '春', romaji: 'Haru',  en: 'Spring', note: '桜が舞い、命が芽吹く季節。新しい始まりの予感。', accent: 'rgba(220,130,150,0.15)' },
  { kanji: '夏', romaji: 'Natsu', en: 'Summer', note: '夕立のあとの涼風。蛍が川面を流れる夜。',         accent: 'rgba(80,160,200,0.12)'  },
  { kanji: '秋', romaji: 'Aki',   en: 'Autumn', note: '紅葉が山を染め、月の光が冴えわたる夜。',         accent: 'rgba(200,120,60,0.15)'  },
  { kanji: '冬', romaji: 'Fuyu',  en: 'Winter', note: '雪の静寂の中、梅の一輪が凛と咲く。',             accent: 'rgba(160,180,210,0.12)' },
];

export default function WorksSection({ isVisible }) {
  return (
    <section
      style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 10vw',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <SectionText
        label="四季 — Season III"
        title="めぐる<br/>季節の<br/>彩り"
        subtitle="The four colors of time"
        align="left"
        isVisible={isVisible}
      />

      {/* Season cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          marginTop: '3rem',
          borderLeft: '1px solid rgba(200,170,80,0.15)',
          transition: 'opacity 1s 0.5s, transform 1s 0.5s cubic-bezier(0.16,1,0.3,1)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
        }}
      >
        {seasons.map((s, i) => (
          <div
            key={s.kanji}
            style={{
              padding: '2rem 1.5rem 2rem 1.5rem',
              borderRight: '1px solid rgba(200,170,80,0.15)',
              borderTop: '1px solid rgba(200,170,80,0.1)',
              background: s.accent,
              transition: 'background 0.4s, transform 0.3s',
              cursor: 'default',
              transitionDelay: `${0.55 + i * 0.08}s`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = s.accent.replace(/0\.\d+\)/, '0.28)');
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = s.accent;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Kanji */}
            <div
              style={{
                fontFamily: "'Zen Old Mincho', serif",
                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                color: 'var(--gold)',
                opacity: 0.6,
                marginBottom: '0.6rem',
                lineHeight: 1,
              }}
            >
              {s.kanji}
            </div>

            {/* Romaji + EN */}
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '0.8rem',
                fontStyle: 'italic',
                color: 'var(--gold)',
                letterSpacing: '0.12em',
                marginBottom: '0.4rem',
              }}
            >
              {s.romaji} / {s.en}
            </div>

            {/* Divider */}
            <div style={{ width: '1.5rem', height: '1px', background: 'rgba(200,170,80,0.3)', marginBottom: '0.8rem' }} />

            {/* Note */}
            <div
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: '0.68rem',
                lineHeight: 2,
                color: 'rgba(240,235,220,0.5)',
              }}
            >
              {s.note}
            </div>
          </div>
        ))}
      </div>

      {/* Ghost kanji */}
      <div
        style={{
          position: 'absolute',
          right: '-2vw',
          top: '8vh',
          fontFamily: "'Zen Old Mincho', serif",
          fontSize: 'clamp(8rem, 22vw, 20rem)',
          color: 'rgba(200,160,80,0.04)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        季
      </div>
    </section>
  );
}
