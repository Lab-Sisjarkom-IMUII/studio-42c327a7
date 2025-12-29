"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  ChevronDown,
  ChevronRight,
  Code,
  FileText,
  Tag,
  Hash,
} from "lucide-react";

export function TemplateValidator({ htmlTemplate, parsingResult, onSectionClick }) {
  const [expandedSections, setExpandedSections] = useState({});
  const [showHeadContent, setShowHeadContent] = useState(false);
  const [showBodyAttributes, setShowBodyAttributes] = useState(false);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);

  if (!parsingResult) {
    return (
      <div className="glass rounded-xl p-4 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Loader2 size={18} className="text-primary animate-spin" />
          <h3 className="font-semibold text-sm">Template Validator</h3>
        </div>
        <div className="text-xs text-zinc-400">Parsing template...</div>
      </div>
    );
  }

  const { sections, headContent, bodyAttributes, warnings, errors } = parsingResult;
  const hasErrors = errors && errors.length > 0;
  const hasWarnings = warnings && warnings.length > 0;

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getTypeColor = (type) => {
    const colors = {
      header: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      hero: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      about: "bg-green-500/20 text-green-400 border-green-500/30",
      experience: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      education: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      skills: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      projects: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      footer: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      custom: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    };
    return colors[type] || colors.custom;
  };

  const extractPlaceholders = (html) => {
    const pattern = /\{\{(\w+)\}\}/g;
    const matches = [];
    let match;
    while ((match = pattern.exec(html)) !== null) {
      matches.push(match[1]);
    }
    return [...new Set(matches)];
  };

  return (
    <div className="space-y-4">
      {/* Overview Stats */}
      <div className="glass rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {hasErrors ? (
              <AlertCircle size={18} className="text-red-400" />
            ) : hasWarnings ? (
              <AlertTriangle size={18} className="text-yellow-400" />
            ) : (
              <CheckCircle size={18} className="text-green-400" />
            )}
            <h3 className="font-semibold text-sm">Parsing Results</h3>
          </div>
          <div
            className={`px-2 py-1 rounded text-xs font-medium ${
              hasErrors
                ? "bg-red-500/10 text-red-400 border border-red-500/30"
                : hasWarnings
                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                : "bg-green-500/10 text-green-400 border border-green-500/30"
            }`}
          >
            {hasErrors ? "Errors" : hasWarnings ? "Warnings" : "Valid"}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 rounded bg-[--muted] border border-[--border]">
            <div className="text-zinc-400">Sections</div>
            <div className="text-white font-semibold mt-1">{sections?.length || 0}</div>
          </div>
          <div className="p-2 rounded bg-[--muted] border border-[--border]">
            <div className="text-zinc-400">Warnings</div>
            <div className="text-white font-semibold mt-1">{warnings?.length || 0}</div>
          </div>
          <div className="p-2 rounded bg-[--muted] border border-[--border]">
            <div className="text-zinc-400">Errors</div>
            <div className="text-white font-semibold mt-1">{errors?.length || 0}</div>
          </div>
        </div>
      </div>

      {/* Errors */}
      {hasErrors && (
        <div className="glass rounded-xl p-4 border border-red-500/30 bg-red-500/10">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} className="text-red-400" />
            <h4 className="font-semibold text-sm text-red-400">Errors</h4>
          </div>
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div key={index} className="text-xs text-red-300 bg-[--muted] p-2 rounded border border-red-500/20">
                {error}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {hasWarnings && (
        <div className="glass rounded-xl p-4 border border-yellow-500/30 bg-yellow-500/10">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-yellow-400" />
            <h4 className="font-semibold text-sm text-yellow-400">Warnings</h4>
          </div>
          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <div key={index} className="text-xs text-yellow-300 bg-[--muted] p-2 rounded border border-yellow-500/20">
                {warning}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Head Content */}
      {headContent && (
        <div className="glass rounded-xl p-4 border border-white/10">
          <button
            onClick={() => setShowHeadContent(!showHeadContent)}
            className="w-full flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-2">
              <Code size={16} className="text-primary" />
              <h4 className="font-semibold text-sm">Head Content</h4>
            </div>
            {showHeadContent ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <AnimatePresence>
            {showHeadContent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <pre className="text-xs bg-[--muted] p-3 rounded border border-[--border] overflow-x-auto font-mono text-zinc-300">
                  {headContent}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Body Attributes */}
      {bodyAttributes && (
        <div className="glass rounded-xl p-4 border border-white/10">
          <button
            onClick={() => setShowBodyAttributes(!showBodyAttributes)}
            className="w-full flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-primary" />
              <h4 className="font-semibold text-sm">Body Attributes</h4>
            </div>
            {showBodyAttributes ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <AnimatePresence>
            {showBodyAttributes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <pre className="text-xs bg-[--muted] p-3 rounded border border-[--border] overflow-x-auto font-mono text-zinc-300">
                  {bodyAttributes || "(empty)"}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Sections Tree */}
      <div className="glass rounded-xl p-4 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={16} className="text-primary" />
          <h4 className="font-semibold text-sm">Sections ({sections?.length || 0})</h4>
        </div>

        {sections && sections.length > 0 ? (
          <div className="space-y-2">
            {sections.map((section, index) => {
              const isExpanded = expandedSections[index];
              const placeholders = extractPlaceholders(section.htmlContent);
              const htmlPreview = section.htmlContent.substring(0, 200).replace(/\n/g, " ");

              return (
                <div
                  key={index}
                  className="border border-[--border] rounded-lg overflow-hidden bg-[--muted]"
                >
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-white/5 transition text-left"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getTypeColor(section.type)}`}>
                        {section.type.toUpperCase()}
                      </span>
                      <span className="text-xs font-medium text-white truncate">{section.name}</span>
                      <span className="text-xs text-zinc-500">#{section.order}</span>
                      {section.isOptional && (
                        <span className="px-1.5 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                          Optional
                        </span>
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/10"
                      >
                        <div className="p-3 space-y-3 bg-[--card]">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <div className="text-zinc-400 mb-1">Type</div>
                              <div className={`px-2 py-1 rounded border inline-block ${getTypeColor(section.type)}`}>
                                {section.type}
                              </div>
                            </div>
                            <div>
                              <div className="text-zinc-400 mb-1">Order</div>
                              <div className="text-white font-mono">{section.order}</div>
                            </div>
                          </div>

                          {placeholders.length > 0 && (
                            <div>
                              <div className="text-xs text-zinc-400 mb-2 flex items-center gap-1">
                                <Hash size={12} />
                                Placeholders ({placeholders.length})
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {placeholders.map((placeholder, pIndex) => (
                                  <span
                                    key={pIndex}
                                    className="px-2 py-1 rounded bg-primary/20 text-primary border border-primary/30 text-xs font-mono"
                                  >
                                    {`{{${placeholder}}}`}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <div className="text-xs text-zinc-400 mb-2 flex items-center gap-1">
                              <Code size={12} />
                              HTML Preview
                            </div>
                            <pre className="text-xs bg-[--muted] p-2 rounded border border-[--border] overflow-x-auto font-mono text-zinc-300 max-h-32 overflow-y-auto">
                              {htmlPreview}
                              {section.htmlContent.length > 200 && "..."}
                            </pre>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-zinc-400 text-center py-4">
            <Info size={24} className="mx-auto mb-2 text-zinc-500 opacity-50" />
            <p>No sections found</p>
          </div>
        )}
      </div>
    </div>
  );
}

