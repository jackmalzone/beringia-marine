'use client';

import React, { useEffect, useState, useRef } from 'react';
import styles from './SmartPanel.module.css';

interface SmartPanelProps {
  isVisible: boolean;
  title: string;
  accentColor: string;
  children: React.ReactNode;
  anchorSelector?: string; // CSS selector for the anchor element
  panelSide?: 'left' | 'right'; // Which side to position the panel
}

export const SmartPanel: React.FC<SmartPanelProps> = ({
  isVisible,
  title,
  accentColor,
  children,
  anchorSelector,
  panelSide = 'right',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0, placement: 'right' });
  const [isPositioned, setIsPositioned] = useState(false);

  useEffect(() => {
    if (!isVisible || !anchorSelector) {
      setIsPositioned(false);
      return;
    }

    // Reset positioned state when visibility changes
    setIsPositioned(false);

    // Use a timeout to ensure DOM is ready and prevent loops
    const timeoutId = setTimeout(() => {
      const anchorElement = document.querySelector(anchorSelector) as HTMLElement;
      if (!anchorElement) return;

      const anchorRect = anchorElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const anchorCenterX = anchorRect.left + anchorRect.width / 2;
      const anchorCenterY = anchorRect.top + anchorRect.height / 2;

      const panelWidth = 280;
      const panelHeight = 120;
      const offset = 60;

      let x: number;
      let y = anchorCenterY - panelHeight / 2;

      // Position based on panelSide prop
      if (panelSide === 'right') {
        x = anchorCenterX + offset;
        // If would go off right edge, position on left
        if (x + panelWidth > viewportWidth - 20) {
          x = anchorCenterX - panelWidth - offset;
        }
      } else {
        x = anchorCenterX - panelWidth - offset;
        // If would go off left edge, position on right
        if (x < 20) {
          x = anchorCenterX + offset;
        }
      }

      // Keep in bounds
      x = Math.max(20, Math.min(x, viewportWidth - panelWidth - 20));
      y = Math.max(20, Math.min(y, viewportHeight - panelHeight - 20));

      setPosition({ x, y, placement: 'right' });

      // Small additional delay before showing to ensure smooth positioning
      setTimeout(() => {
        setIsPositioned(true);
      }, 20);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [anchorSelector, isVisible, panelSide]);

  if (!isVisible) return null;

  return (
    <div
      ref={panelRef}
      className={styles.smartPanel}
      style={
        {
          position: 'fixed',
          left: position.x,
          top: position.y,
          '--accent-color': accentColor,
          zIndex: 1000,
          opacity: isVisible && isPositioned ? 1 : 0,
          pointerEvents: isVisible && isPositioned ? 'auto' : 'none',
        } as React.CSSProperties
      }
    >
      <div className={styles.panelHeader}>
        <div className={styles.panelStatus}>
          <span className={styles.panelDot} />
          <span className={styles.panelStatusText}>{title.toUpperCase()}</span>
        </div>
      </div>
      <div className={styles.panelContent}>{children}</div>
    </div>
  );
};
