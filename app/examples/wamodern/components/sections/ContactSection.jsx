'use client';

import SectionText from '../ui/SectionText';

export default function ContactSection({ isVisible }) {
  return (
    <section
      style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 10vw',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <SectionText
        label="月 — Season IV"
        title="夜が<br/>明けても<br/>月は在る"
        subtitle="The moon remains, though dawn arrives"
        body="旅の終わりは、また別の旅の始まり。あなたがここまで辿り着いたことに、深く感謝します。桜の花びらのように、この一瞬が永遠の記憶になることを願って。"
        align="center"
        isVisible={isVisible}
      >
        {/* Moon circle motif */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            marginTop: '1rem',
          }}
        >
          {/* Enso circle */}
          <div
            style={{
              width: '5rem',
              height: '5rem',
              borderRadius: '50%',
              border: '1px solid rgba(200,170,80,0.35)',
              boxShadow: '0 0 30px rgba(200,170,80,0.08), inset 0 0 20px rgba(200,170,80,0.04)',
              transition: 'box-shadow 0.5s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 0 60px rgba(200,170,80,0.2), inset 0 0 30px rgba(200,170,80,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(200,170,80,0.08), inset 0 0 20px rgba(200,170,80,0.04)';
            }}
          >
            <span
              style={{
                fontFamily: "'Zen Old Mincho', serif",
                fontSize: '1.4rem',
                color: 'rgba(200,170,80,0.5)',
              }}
            >
              月
            </span>
          </div>

          {/* Haiku */}
          <div
            style={{
              fontFamily: "'Zen Old Mincho', serif",
              fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
              color: 'rgba(200,170,80,0.45)',
              letterSpacing: '0.35em',
              textAlign: 'center',
              lineHeight: 2.4,
            }}
          >
            <div>花びらが</div>
            <div>闇に消えても</div>
            <div>香りは残る</div>
          </div>

          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: '0.72rem',
              color: 'rgba(200,170,80,0.3)',
              letterSpacing: '0.2em',
            }}
          >
            — 無名 / Anonymous
          </div>
        </div>
      </SectionText>

      {/* Ghost kanji */}
      <div
        style={{
          position: 'absolute',
          right: '-1vw',
          bottom: '5vh',
          fontFamily: "'Zen Old Mincho', serif",
          fontSize: 'clamp(9rem, 24vw, 22rem)',
          color: 'rgba(200,160,80,0.04)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        月
      </div>

      {/* Vertical copyright */}
      <div
        style={{
          position: 'absolute',
          left: '3vw',
          bottom: '6vh',
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          color: 'rgba(200,170,80,0.2)',
          writingMode: 'vertical-rl',
        }}
      >
        © Wa-Modern · All seasons reserved
      </div>
    </section>
  );
}
