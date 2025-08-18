import React, { useState } from 'react';
import { Plus, X, Zap } from 'lucide-react';
import { GlassInput } from '../../ui/GlassInput';
import { GlassButton } from '../../ui/GlassButton';
import { GlassCard } from '../../ui/GlassCard';
import { Resume, Skill } from '../../../types/resume';
import { apiClient } from '../../../utils/api';

interface SkillsStepProps {
  data: Partial<Resume>;
  onChange: (section: string, data: any) => void;
}

const skillCategories = ['Technical', 'Soft', 'Language', 'Certification'] as const;
const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

export const SkillsStep: React.FC<SkillsStepProps> = ({
  data,
  onChange
}) => {
  const skills = data.skills || [];
  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Skill['category']>('Technical');

  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    const skill: Skill = {
      name: newSkill.trim(),
      level: 'Intermediate',
      category: selectedCategory
    };
    
    onChange('skills', [...skills, skill]);
    setNewSkill('');
  };

  const removeSkill = (index: number) => {
    const updated = skills.filter((_, i) => i !== index);
    onChange('skills', updated);
  };

  const updateSkillLevel = (index: number, level: Skill['level']) => {
    const updated = skills.map((skill, i) => 
      i === index ? { ...skill, level } : skill
    );
    onChange('skills', updated);
  };

  const groupedSkills = skillCategories.reduce((acc, category) => {
    acc[category] = skills.filter(skill => skill.category === category);
    return acc;
  }, {} as Record<Skill['category'], Skill[]>);

  const suggestSkills = async () => {
    try {
      const { suggestions } = (await apiClient.suggestSkills({
        workExperience: data.workExperience || [],
        targetRole: 'Software Engineer'
      })) as any;
      const existingSkillNames = skills.map(s => s.name.toLowerCase());
      const newSkills = suggestions
        .filter((name: string) => !existingSkillNames.includes(name.toLowerCase()))
        .map((name: string) => ({
          name,
          level: 'Intermediate' as const,
          category: 'Technical' as const
        }));
      onChange('skills', [...skills, ...newSkills]);
    } catch (error) {
      console.error('Failed to suggest skills:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Skill */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Add Skills</h3>
        
        <div className="flex gap-3 mb-4">
          {skillCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-3 py-1 rounded-full text-sm transition-all duration-200
                ${selectedCategory === category
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                  : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <GlassInput
            placeholder="Enter a skill..."
            value={newSkill}
            onChange={setNewSkill}
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          />
          <GlassButton
            variant="primary"
            icon={<Plus />}
            onClick={addSkill}
            disabled={!newSkill.trim()}
          >
            Add
          </GlassButton>
        </div>

        <div className="mt-4">
          <GlassButton
            variant="outline"
            icon={<Zap />}
            onClick={suggestSkills}
            size="sm"
          >
            AI Suggest Skills
          </GlassButton>
        </div>
      </GlassCard>

      {/* Skills by Category */}
      {skillCategories.map(category => (
        groupedSkills[category].length > 0 && (
          <GlassCard key={category} className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">
              {category} Skills ({groupedSkills[category].length})
            </h3>
            
            <div className="space-y-3">
              {groupedSkills[category].map((skill, categoryIndex) => {
                const globalIndex = skills.findIndex(s => s === skill);
                return (
                  <div key={globalIndex} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white font-medium">{skill.name}</span>
                    
                    <div className="flex items-center gap-3">
                      <select
                        value={skill.level}
                        onChange={(e) => updateSkillLevel(globalIndex, e.target.value as Skill['level'])}
                        className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                      >
                        {skillLevels.map(level => (
                          <option key={level} value={level} className="bg-gray-800">
                            {level}
                          </option>
                        ))}
                      </select>
                      
                      <button
                        onClick={() => removeSkill(globalIndex)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )
      ))}

      <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
        <h3 className="text-white font-medium mb-2">💡 Skill Tips</h3>
        <ul className="text-white/80 text-sm space-y-1">
          <li>• Include both technical and soft skills relevant to your target role</li>
          <li>• Be honest about your skill levels - employers may test them</li>
          <li>• Focus on skills mentioned in job descriptions you're targeting</li>
          <li>• Include certifications and specific technologies/tools</li>
        </ul>
      </div>
    </div>
  );
};