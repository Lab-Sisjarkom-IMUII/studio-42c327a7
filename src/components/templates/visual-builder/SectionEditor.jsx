"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertCircle, Plus, Trash2, GripVertical } from 'lucide-react';
import { getSectionPreset, getSectionTemplate } from './SectionPresets';
import { validateSection } from '@/lib/visual-builder-utils';
import { RippleButton } from '@/components/ripple-button';

/**
 * Section Editor Component
 * Panel untuk edit section properties dengan constraints
 */
export function SectionEditor({ 
  section, 
  onSave, 
  onClose,
  onDelete
}) {
  const [editedSection, setEditedSection] = useState(section);
  const [errors, setErrors] = useState([]);
  const preset = getSectionPreset(section?.type);

  useEffect(() => {
    if (section) {
      setEditedSection({ ...section });
      setErrors([]);
    }
  }, [section]);

  if (!section || !preset) {
    return null;
  }

  const handleChange = (field, value) => {
    setEditedSection(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfigChange = (key, value) => {
    setEditedSection(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value
      }
    }));
  };

  // Handle layout change - update HTML content
  const handleLayoutChange = (layout) => {
    const newHtmlContent = getSectionTemplate(editedSection.type, layout);
    // Apply config ke HTML content
    const preset = getSectionPreset(editedSection.type);
    let htmlWithConfig = newHtmlContent;
    
    // Apply config jika ada
    if (editedSection.config && preset?.configurable) {
      // Import applySectionConfig dari utils
      // For now, kita akan apply di generateHtmlFromSection
      // Jadi cukup update layout dan htmlContent
    }
    
    setEditedSection(prev => ({
      ...prev,
      layout: layout,
      htmlContent: htmlWithConfig
    }));
  };

  const handleSave = () => {
    const validation = validateSection(editedSection);
    
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    onSave?.(editedSection);
  };

  const renderField = (key, fieldConfig) => {
    if (fieldConfig.type === 'text') {
      return (
        <div key={key} className="space-y-2">
          <label className="text-xs font-medium text-zinc-300">
            {key.charAt(0).toUpperCase() + key.slice(1)}
            {fieldConfig.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <input
            type="text"
            value={editedSection.config?.[key] || fieldConfig.default || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (!fieldConfig.maxLength || value.length <= fieldConfig.maxLength) {
                handleConfigChange(key, value);
              }
            }}
            maxLength={fieldConfig.maxLength}
            className="w-full px-3 py-2 rounded-lg bg-[--muted] border border-[--border] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-white text-sm"
            placeholder={fieldConfig.default || ''}
          />
          {fieldConfig.maxLength && (
            <p className="text-xs text-zinc-500">
              {(editedSection.config?.[key] || '').length} / {fieldConfig.maxLength}
            </p>
          )}
        </div>
      );
    }

    if (fieldConfig.type === 'boolean') {
      return (
        <div key={key} className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-300">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          <button
            onClick={() => handleConfigChange(key, !(editedSection.config?.[key] ?? fieldConfig.default ?? false))}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              editedSection.config?.[key] ?? fieldConfig.default ?? false
                ? 'bg-primary'
                : 'bg-zinc-600'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                editedSection.config?.[key] ?? fieldConfig.default ?? false
                  ? 'translate-x-6'
                  : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      );
    }

    if (fieldConfig.type === 'select') {
      return (
        <div key={key} className="space-y-2">
          <label className="text-xs font-medium text-zinc-300">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          <select
            value={editedSection.config?.[key] || fieldConfig.default || fieldConfig.options[0]}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[--muted] border border-[--border] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-white text-sm"
          >
            {fieldConfig.options.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (fieldConfig.type === 'color') {
      return (
        <div key={key} className="space-y-2">
          <label className="text-xs font-medium text-zinc-300">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {fieldConfig.options?.map(option => {
              const isSelected = (editedSection.config?.[key] || fieldConfig.default) === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleConfigChange(key, option.value)}
                  className={`px-3 py-2 rounded-lg border-2 transition text-xs ${
                    isSelected
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (fieldConfig.type === 'array') {
      const arrayValue = editedSection.config?.[key] || fieldConfig.default || [];
      const itemSchema = fieldConfig.itemSchema || {};

      return (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-300">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <button
              onClick={() => {
                const newItem = {};
                Object.keys(itemSchema).forEach(itemKey => {
                  newItem[itemKey] = itemSchema[itemKey].default || '';
                });
                handleConfigChange(key, [...arrayValue, newItem]);
              }}
              className="px-2 py-1 text-xs bg-primary/20 text-primary rounded hover:bg-primary/30 transition flex items-center gap-1"
            >
              <Plus size={12} />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2">
            {arrayValue.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-black/20 rounded-lg border border-white/5 space-y-2"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-400">Item {index + 1}</span>
                  <button
                    onClick={() => {
                      const newArray = arrayValue.filter((_, i) => i !== index);
                      handleConfigChange(key, newArray);
                    }}
                    className="p-1 rounded hover:bg-red-500/20 transition text-zinc-400 hover:text-red-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                {Object.entries(itemSchema).map(([itemKey, itemFieldConfig]) => (
                  <div key={itemKey} className="space-y-1">
                    <label className="text-xs text-zinc-400 capitalize">
                      {itemKey}
                      {itemFieldConfig.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <input
                      type="text"
                      value={item[itemKey] || ''}
                      onChange={(e) => {
                        const newArray = [...arrayValue];
                        newArray[index] = {
                          ...newArray[index],
                          [itemKey]: e.target.value
                        };
                        handleConfigChange(key, newArray);
                      }}
                      className="w-full px-2 py-1.5 rounded bg-black/30 border border-white/5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 text-white text-xs"
                      placeholder={itemFieldConfig.placeholder || itemKey}
                    />
                  </div>
                ))}
              </div>
            ))}

            {arrayValue.length === 0 && (
              <div className="p-4 bg-black/10 rounded-lg border border-dashed border-white/10 text-center">
                <p className="text-xs text-zinc-500">No items yet</p>
                <p className="text-xs text-zinc-600 mt-1">Click "Add" to add items</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderNestedField = (parentKey, nestedConfig) => {
    return (
      <div key={parentKey} className="space-y-3 p-4 bg-black/20 rounded-lg border border-white/5">
        <h4 className="text-xs font-semibold text-zinc-300 uppercase">
          {parentKey.charAt(0).toUpperCase() + parentKey.slice(1)}
        </h4>
        <div className="space-y-3">
          {Object.entries(nestedConfig).map(([key, fieldConfig]) => (
            <div key={key}>
              {renderField(`${parentKey}.${key}`, fieldConfig)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="h-full w-96 bg-[--background] border-l border-white/10 flex flex-col"
      >
        {/* Header */}
        <div className="glass border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-sm text-white">Edit Section</h2>
            <p className="text-xs text-zinc-400 mt-1 capitalize">{section.type}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 transition text-zinc-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Basic Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase">Basic Info</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">
                Section Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={editedSection.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[--muted] border border-[--border] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-white text-sm"
                placeholder="Section name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">Layout</label>
              <select
                value={editedSection.layout || preset.defaultLayout}
                onChange={(e) => handleLayoutChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[--muted] border border-[--border] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-white text-sm"
              >
                {preset.layouts.map(layout => (
                  <option key={layout} value={layout}>
                    {layout.charAt(0).toUpperCase() + layout.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Settings */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase">Settings</h3>
            
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-300">Optional Section</label>
              <button
                onClick={() => handleChange('isOptional', !editedSection.isOptional)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  editedSection.isOptional ? 'bg-primary' : 'bg-zinc-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    editedSection.isOptional ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {editedSection.isOptional && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-300">Condition</label>
                <select
                  value={editedSection.condition || ''}
                  onChange={(e) => handleChange('condition', e.target.value || null)}
                  className="w-full px-3 py-2 rounded-lg bg-[--muted] border border-[--border] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-white text-sm"
                >
                  <option value="">Always show</option>
                  <option value="if:experience">If experience exists</option>
                  <option value="if:projects">If projects exist</option>
                  <option value="if:education">If education exists</option>
                  <option value="if:skills">If skills exist</option>
                </select>
              </div>
            )}
          </div>

          {/* Configurable Fields */}
          {preset.configurable && Object.keys(preset.configurable).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase">Content</h3>
              <div className="space-y-3">
                {Object.entries(preset.configurable).map(([key, fieldConfig]) => {
                  // Handle nested config (e.g., ctaButton)
                  if (typeof fieldConfig === 'object' && fieldConfig !== null && fieldConfig.type === undefined && !Array.isArray(fieldConfig)) {
                    return renderNestedField(key, fieldConfig);
                  }
                  return renderField(key, fieldConfig);
                })}
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-red-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-red-400 mb-1">Validation Errors</p>
                  <ul className="text-xs text-red-300 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="glass border-t border-white/10 px-4 py-3 space-y-2">
          <RippleButton
            onClick={handleSave}
            className="w-full px-4 py-2 rounded-lg bg-primary hover:opacity-90 text-primary-foreground font-medium transition flex items-center justify-center gap-2"
          >
            <Save size={16} />
            <span>Save Changes</span>
          </RippleButton>
          
          {onDelete && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this section?')) {
                  onDelete(editedSection.id);
                }
              }}
              className="w-full px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium transition border border-red-500/30"
            >
              Delete Section
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

