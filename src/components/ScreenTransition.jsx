import React from 'react';

export default function ScreenTransition({ children, className = '' }) {
  return (
    <div className={`animate-screen-enter ${className}`}>
      {children}
    </div>
  );
}
