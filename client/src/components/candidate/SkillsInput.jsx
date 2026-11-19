import React, { useState } from 'react';
import { X, Plus, Layers } from 'lucide-react';
import { SkillsSelector } from '../common/SkillsSelector';

export const SkillsInput = ({ skills = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addSkill = (skillToAdd) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setInputValue('');
    }
  };

  const removeSkill = (indexToRemove) => {
    onChange(skills.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type skill & press Enter (e.g. React, Python, Go)..."
          className="flex-1 px-3 py-2 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder-[#666666] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#C6A15B]"
        />
        <button
          type="button"
          onClick={() => addSkill(inputValue)}
          className="px-3.5 py-2 rounded-lg bg-[#C6A15B] hover:bg-[#A98443] text-[#202124] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-2 rounded-lg bg-[#FFFFFF] hover:bg-[#FAF9F6] text-[#202124] border border-[#E9E6DF] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-[#C6A15B]" />
          <span className="hidden sm:inline">Browse Categories</span>
        </button>
      </div>

      <SkillsSelector
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedSkills={skills}
        onChange={onChange}
      />

      {/* Selected tags */}
      <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF]">
        {skills.length === 0 ? (
          <span className="text-xs text-[#666666] italic p-0.5">No skills added yet.</span>
        ) : (
          skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#FFFFFF] text-[#202124] border border-[#E9E6DF] hover:border-[#C6A15B] transition-colors"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="hover:text-[#A98443] transition-colors cursor-pointer ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
};
