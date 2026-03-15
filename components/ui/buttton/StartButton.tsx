'use client'  // ← これを必ずファイルの先頭に！（Server Componentではstyled-components使えない）

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

interface StartButtonProps {
  children: React.ReactNode;
  href: string;
}

const StartButton = ({ children, href }: StartButtonProps) => {
  return (
    <StyledWrapper>
      <div className="container pointer-events-auto">
        <Link className="button" href={href}>
          {children}
        </Link>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    font-size: 1.4em;
    padding: 0.6em 0.8em;
    border-radius: 0.5em;
    border: none;
    background-color: #000;
    color: #fff;
    cursor: pointer;
    box-shadow: 2px 2px 3px #000000b4;
    text-decoration: none;          /* Linkのデフォルト下線を消す */
    display: inline-block;
  }

  .container {
    position: relative;
    padding: 3px;
    background: linear-gradient(90deg, #03a9f4, #f441a5);
    border-radius: 0.9em;
    transition: all 0.4s ease;
  }

  .container::before {
    content: "";
    position: absolute;
    inset: -3px;                    /* padding分だけ外に広げて自然に */
    border-radius: 0.9em;
    background: linear-gradient(90deg, #03a9f4, #f441a5);
    z-index: -1;                    /* -1 で安全に背後に */
    filter: blur(0);
    transition: filter 0.4s ease;
  }

  .container:hover::before {
    filter: blur(1.2em);
  }

  .container:active::before {
    filter: blur(0.2em);
  }
`;

export default StartButton;
