"use client";

import { useState, useRef } from "react";

export function RippleButton({ children, className = "", onClick, ...props }) {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  const createRipple = (e) => {
    const button = buttonRef.current;
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size,
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onClick={createRipple}
      {...props}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            background: "var(--ripple-color, rgba(255, 255, 255, 0.3))",
            borderRadius: "50%",
            transform: "scale(0)",
            animation: "ripple 0.6s linear",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
}

