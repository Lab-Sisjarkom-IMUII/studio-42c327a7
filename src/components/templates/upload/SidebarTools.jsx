"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, FileText, BookOpen, BarChart3, ExternalLink } from "lucide-react";
import { TemplateValidator } from "../TemplateValidator";
import Link from "next/link";

export function SidebarTools({ parsingResult, htmlTemplate, onSectionClick }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("validator");

  if (isCollapsed) {
    return (
      <div className="w-12 bg-[--background] border-r border-white/10 flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-lg hover:bg-white/5 transition"
          title="Expand sidebar"
        >
          <ChevronRight size={20} className="text-zinc-400" />
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 320, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      className="w-80 bg-[--background] border-r border-white/10 flex flex-col overflow-hidden"
    >
      {/* Sidebar Header */}
      <div className="glass border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <h2 className="font-semibold text-sm">Tools</h2>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1.5 rounded-lg hover:bg-white/5 transition"
          title="Collapse sidebar"
        >
          <ChevronLeft size={16} className="text-zinc-400" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {[
          { id: "validator", icon: BarChart3, label: "Validator" },
          { id: "examples", icon: FileText, label: "Examples" },
          { id: "docs", icon: BookOpen, label: "Docs" },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 text-xs font-medium transition ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary border-b-2 border-primary"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={14} className="mx-auto mb-1" />
              <div>{tab.label}</div>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "validator" && (
          <div className="space-y-4">
            <TemplateValidator 
              htmlTemplate={htmlTemplate} 
              parsingResult={parsingResult}
              onSectionClick={onSectionClick}
            />
          </div>
        )}

        {activeTab === "examples" && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-4 border border-white/10">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                Template Examples
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg bg-black/20 hover:bg-black/40 border border-white/5 transition text-xs">
                  Basic Portfolio
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg bg-black/20 hover:bg-black/40 border border-white/5 transition text-xs">
                  Modern Dark
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg bg-black/20 hover:bg-black/40 border border-white/5 transition text-xs">
                  Minimalist
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "docs" && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-4 border border-white/10">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <BookOpen size={16} className="text-primary" />
                Documentation
              </h3>
              <div className="space-y-2">
                <Link
                  href="/faq"
                  target="_blank"
                  className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-black/20 hover:bg-black/40 border border-white/5 transition text-xs group"
                >
                  <span>Template Guide</span>
                  <ExternalLink size={12} className="text-zinc-400 group-hover:text-primary" />
                </Link>
                <Link
                  href="/faq"
                  target="_blank"
                  className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-black/20 hover:bg-black/40 border border-white/5 transition text-xs group"
                >
                  <span>Getting Started</span>
                  <ExternalLink size={12} className="text-zinc-400 group-hover:text-primary" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

