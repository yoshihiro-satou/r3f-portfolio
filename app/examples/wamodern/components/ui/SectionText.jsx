'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * SectionText
 * Reusable text overlay for each section.
 *
 * Props:
 *  label      – small eyebrow label (e.g. "01 / HERO")
 *  title      – large Japanese/English heading
 *  subtitle   – supporting line
 *  body       – paragraph text
 *  align      – "left" | "center" | "right"  (default: "left")
 *  isVisible  – boolean to trigger entrance animation
 *  children   – optional extra content (buttons, etc.)
 */
export default function SectionText({
  label = '',
  title = '',
  subtitle = '',
  body = '',
  align = 'left',
  isVisible = false,
  children,
}) {
  const ref = useRef(null);

  const alignStyle = {
    left:   { alignItems: 'flex-start', textAlign: 'left' },
    center: { alignItems: 'center',     textAlign: 'center' },
    right:  { alignItems: 'flex-end',   textAlign: 'right' },
  }[align] || { alignItems: 'flex-start', textAlign: 'left' };

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        ...alignStyle,
        transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : 'translateY(32px)',
      }}
    >
      {/* Eyebrow label */}
      {label && (
        <span
          style={{
            fontFamily: "'Zen Old Mincho', serif",
            fontSize: 'clamp(0.6rem, 1vw, 0.75rem)',
            letterSpacing: '0.25em',
            color: 'var(--gold)',
            textTransform: 'uppercase',
            opacity: 0.8,
            transition: 'opacity 0.9s 0.1s, transform 0.9s 0.1s cubic-bezier(0.16,1,0.3,1)',
            transform: isVisible ? 'translateX(0)' : 'translateX(-12px)',
          }}
        >
          {label}
        </span>
      )}

      {/* Decorative rule */}
      <div
        style={{
          width: isVisible ? '3rem' : '0',
          height: '1px',
          background: 'linear-gradient(90deg, var(--gold), transparent)',
          transition: 'width 1s 0.2s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* Title */}
      {title && (
        <h2
          style={{
            fontFamily: "'Zen Old Mincho', serif",
            fontSize: 'clamp(2.2rem, 6vw, 5rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            color: 'var(--white)',
            letterSpacing: '-0.01em',
            margin: 0,
            transition: 'opacity 0.9s 0.15s, transform 0.9s 0.15s cubic-bezier(0.16,1,0.3,1)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
      )}

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--gold)',
            letterSpacing: '0.08em',
            margin: 0,
            transition: 'opacity 0.9s 0.25s, transform 0.9s 0.25s cubic-bezier(0.16,1,0.3,1)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Body */}
      {body && (
        <p
          style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)',
            fontWeight: 300,
            lineHeight: 2.0,
            color: 'rgba(240, 235, 220, 0.7)',
            maxWidth: '42ch',
            margin: 0,
            transition: 'opacity 0.9s 0.35s, transform 0.9s 0.35s cubic-bezier(0.16,1,0.3,1)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          {body}
        </p>
      )}

      {/* Optional children (buttons, etc.) */}
      {children && (
        <div
          style={{
            marginTop: '0.5rem',
            transition: 'opacity 0.9s 0.45s',
            opacity: isVisible ? 1 : 0,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
