"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, RefreshCw, Monitor, Tablet, Smartphone, Info, Loader2 } from "lucide-react";
import { RippleButton } from "@/components/ripple-button";

export function TemplatePreview({ htmlContent, isGenerating, onRefresh, highlightedSection }) {
  const iframeRef = useRef(null);
  const [viewMode, setViewMode] = useState("desktop");

  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();

        if (highlightedSection && highlightedSection.htmlContent) {
          setTimeout(() => {
            try {
              const style = doc.createElement("style");
              style.textContent = `
                section, [class*="section"], [id*="section"], [class*="Section"], [id*="Section"] {
                  position: relative;
                }
                section[data-highlighted="true"],
                [data-highlighted="true"] {
                  outline: 3px solid rgba(124, 58, 237, 0.8) !important;
                  outline-offset: 4px !important;
                  animation: pulse-highlight 2s ease-in-out;
                  box-shadow: 0 0 20px rgba(124, 58, 237, 0.4) !important;
                }
                @keyframes pulse-highlight {
                  0%, 100% { 
                    outline-color: rgba(124, 58, 237, 0.8);
                    box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
                  }
                  50% { 
                    outline-color: rgba(124, 58, 237, 1);
                    box-shadow: 0 0 30px rgba(124, 58, 237, 0.6);
                  }
                }
              `;
              doc.head.appendChild(style);

              const sectionHtml = highlightedSection.htmlContent;
              const sectionType = highlightedSection.type;
              
              let foundSection = null;
              
              const sectionsByType = doc.querySelectorAll(
                `section[data-type="${sectionType}"], 
                 [class*="${sectionType}"], 
                 [id*="${sectionType}"],
                 section`
              );
              
              for (const section of sectionsByType) {
                const sectionText = section.textContent || section.innerHTML || "";
                const searchText = sectionHtml.substring(0, 100).replace(/\s+/g, " ").trim();
                const sectionTextNormalized = sectionText.replace(/\s+/g, " ").trim();
                
                if (sectionTextNormalized.includes(searchText) || 
                    section.innerHTML.includes(sectionHtml.substring(0, 50))) {
                  foundSection = section;
                  break;
                }
              }
              
              if (!foundSection && sectionsByType.length > highlightedSection.order) {
                foundSection = sectionsByType[highlightedSection.order];
              }
              
              if (!foundSection) {
                foundSection = doc.querySelector("section") || doc.body.firstElementChild;
              }
              
              if (foundSection) {
                foundSection.setAttribute("data-highlighted", "true");
                foundSection.scrollIntoView({ behavior: "smooth", block: "center" });
                
                setTimeout(() => {
                  foundSection?.removeAttribute("data-highlighted");
                }, 3000);
              }
            } catch (err) {
              console.warn("Could not highlight section in preview:", err);
            }
          }, 100);
        }
      }
    }
  }, [htmlContent, highlightedSection]);

  const getViewportWidth = () => {
    switch (viewMode) {
      case "tablet":
        return "768px";
      case "mobile":
        return "375px";
      default:
        return "100%";
    }
  };

  return (
    <div className="h-full flex flex-col bg-[--muted]">
      {/* Preview Header */}
      <div className="glass border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm font-medium">Template Preview</span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[--muted] border border-[--border]">
            <button
              onClick={() => setViewMode("desktop")}
              className={`p-1.5 rounded transition ${
                viewMode === "desktop" ? "bg-primary/20 text-primary" : "text-zinc-400 hover:text-white"
              }`}
              title="Desktop"
            >
              <Monitor size={14} />
            </button>
            <button
              onClick={() => setViewMode("tablet")}
              className={`p-1.5 rounded transition ${
                viewMode === "tablet" ? "bg-primary/20 text-primary" : "text-zinc-400 hover:text-white"
              }`}
              title="Tablet"
            >
              <Tablet size={14} />
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`p-1.5 rounded transition ${
                viewMode === "mobile" ? "bg-primary/20 text-primary" : "text-zinc-400 hover:text-white"
              }`}
              title="Mobile"
            >
              <Smartphone size={14} />
            </button>
          </div>

          {/* Info Badge */}
          <div className="px-2 py-1 rounded bg-primary/20 border border-primary/30">
            <div className="flex items-center gap-1.5">
              <Info size={12} className="text-primary" />
              <span className="text-xs text-primary">Dummy data</span>
            </div>
          </div>

          {/* Refresh Button */}
          <RippleButton
            onClick={onRefresh}
            disabled={!htmlContent || isGenerating}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center gap-2 disabled:opacity-50 text-sm"
          >
            <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} />
            Refresh
          </RippleButton>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto relative bg-[--muted] flex items-center justify-center p-4">
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-[--muted]/80 z-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        )}

        {htmlContent ? (
          <div
            className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all"
            style={{
              width: getViewportWidth(),
              maxWidth: "100%",
              height: viewMode === "desktop" ? "100%" : "600px",
            }}
          >
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Template Preview"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        ) : (
          <div className="text-center">
            <FileText size={48} className="mx-auto mb-4 text-zinc-500" />
            <h3 className="text-lg font-semibold mb-2 text-zinc-300">No Preview</h3>
            <p className="text-sm text-zinc-400 max-w-md">
              Mulai mengetik HTML template untuk melihat preview di sini
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

