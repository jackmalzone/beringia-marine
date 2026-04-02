import React from 'react';

interface VILogoProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

export default function VILogo({
  className = '',
  width = 80,
  height = 48,
  color = '#ffffff',
  strokeWidth = 4,
}: VILogoProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 120 60" className={className}>
      {/* Horizontal line - adjusted for better centering */}
      <line
        x1="28"
        y1="8"
        x2="72"
        y2="8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* V letter using SF Pro font */}
      <text
        x="40"
        y="35"
        fontSize="32"
        fontWeight="600"
        fontFamily="'SF Pro Display', 'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fill={color}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        V
      </text>

      {/* I letter using SF Pro font */}
      <text
        x="70"
        y="35"
        fontSize="32"
        fontWeight="600"
        fontFamily="'SF Pro Display', 'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fill={color}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        I
      </text>
    </svg>
  );
}
