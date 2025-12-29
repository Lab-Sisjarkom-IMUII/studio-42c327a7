"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Code } from "lucide-react";

export function TemplateEditor({ value, onChange, errors = [], scrollToLine, highlightedSection }) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const lineCount = value.split("\n").length;

  useEffect(() => {
    if (scrollToLine && textareaRef.current && scrollToLine > 0) {
      const textarea = textareaRef.current;
      const lineHeight = 18;
      const targetScrollTop = (scrollToLine - 1) * lineHeight;
      
      textarea.scrollTo({
        top: Math.max(0, targetScrollTop - 100),
        behavior: "smooth",
      });

      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = textarea.scrollTop;
      }

      setTimeout(() => {
        textarea.focus();
        const linesBefore = value.split("\n").slice(0, scrollToLine - 1);
        const position = linesBefore.join("\n").length + (linesBefore.length > 0 ? 1 : 0);
        if (position >= 0 && position <= value.length) {
          textarea.setSelectionRange(position, position);
        }
      }, 300);
    }
  }, [scrollToLine, value]);

  const handleTextareaScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleLineNumbersScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      textareaRef.current.scrollTop = lineNumbersRef.current.scrollTop;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[--background]">
      {/* Editor Header */}
      <div className="glass border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code size={16} className="text-primary" />
          <span className="text-sm font-medium">Template Editor</span>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line Numbers */}
        <div
          ref={lineNumbersRef}
          className="w-12 shrink-0 bg-[--muted] border-r border-[--border] overflow-y-auto text-xs font-mono py-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={handleLineNumbersScroll}
        >
          {Array.from({ length: lineCount }, (_, i) => {
            const lineNum = i + 1;
            const isHighlighted = scrollToLine === lineNum;
            return (
              <div
                key={lineNum}
                className={`text-xs text-right pr-3 select-none transition-colors ${
                  isHighlighted
                    ? "text-primary font-bold bg-primary/20 border-l-2 border-primary"
                    : "text-zinc-500"
                }`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleTextareaScroll}
            placeholder={`<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <!-- [HERO] Hero Section -->
  <section>
    <h1>{{name}}</h1>
    <p>{{email}}</p>
  </section>
</body>
</html>`}
            className="w-full h-full px-4 py-3 bg-transparent text-white font-mono text-xs resize-none focus:outline-none placeholder-zinc-600"
            spellCheck={false}
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              lineHeight: "1.5",
              tabSize: 2,
            }}
          />

          {/* Error Indicators */}
          {errors.length > 0 && (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {errors.slice(0, 3).map((error, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-2 py-1 rounded bg-red-500/20 border border-red-500/30 text-red-400 text-xs"
                >
                  {error}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

