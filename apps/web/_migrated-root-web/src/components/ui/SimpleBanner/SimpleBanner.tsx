'use client';

import { FC, useState } from 'react';
import Link from 'next/link';

const SimpleBanner: FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.95)',
        borderBottom: '1px solid rgba(0, 183, 181, 0.3)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        minHeight: '50px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ color: '#ffffff', fontSize: '0.9rem' }}>
        <span style={{ color: '#00b7b5', fontWeight: 500 }}>New:</span> Founding Memberships
        Available
      </div>
      <Link
        href="/book"
        style={{
          background: 'rgba(0, 183, 181, 0.1)',
          color: '#00b7b5',
          border: '1px solid #00b7b5',
          borderRadius: '4px',
          padding: '6px 16px',
          fontSize: '0.85rem',
          textDecoration: 'none',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Learn More
      </Link>
      <button
        onClick={() => setIsVisible(false)}
        style={{
          position: 'absolute',
          right: '20px',
          background: 'none',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.6)',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        ×
      </button>
    </div>
  );
};

export default SimpleBanner;
