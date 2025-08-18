import React, { useState } from 'react';
import { Plus, Trash2, Briefcase, Calendar, Sparkles } from 'lucide-react';
import { GlassInput } from '../../ui/GlassInput';
import { GlassButton } from '../../ui/GlassButton';
import { GlassCard } from '../../ui/GlassCard';
import { Resume, WorkExperience } from '../../../types/resume';
import { apiClient } from '../../../utils/api';

interface WorkExperienceStepProps {
  data: Partial<Resume>;
  onChange: (section: string, data: any) => void;
}

export const WorkExperienceStep: React.FC<WorkExperienceStepProps> = ({
  data,
  onChange
}) => {
  const experiences = data.workExperience || [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: ['']
    };
    
    onChange('workExperience', [...experiences, newExperience]);
    setExpandedIndex(experiences.length);
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = experiences.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    onChange('workExperience', updated);
  };

  const removeExperience = (index: number) => {
    const updated = experiences.filter((_, i) => i !== index);
    onChange('workExperience', updated);
    setExpandedIndex(null);
  };

  const addAchievement = (expIndex: number) => {
    const updated = [...experiences];
    updated[expIndex].achievements.push('');
    onChange('workExperience', updated);
  };

  const updateAchievement = (expIndex: number, achIndex: number, value: string) => {
    const updated = [...experiences];
    updated[expIndex].achievements[achIndex] = value;
    onChange('workExperience', updated);
  };

  const removeAchievement = (expIndex: number, achIndex: number) => {
    const updated = [...experiences];
    updated[expIndex].achievements.splice(achIndex, 1);
    onChange('workExperience', updated);
  };

  const generateAchievements = async (expIndex: number) => {
    const experience = experiences[expIndex];
    if (!experience.position || !experience.description) return;

    try {
      const result = await apiClient.generateAchievements({
        position: experience.position,
        company: experience.company,
        description: experience.description
      });
      updateExperience(expIndex, 'achievements', (result as any).achievements || []);
    } catch (e) {
      // keep previous
    }
  };

  return (
    <div className="space-y-6">
      {experiences.map((experience, index) => (
        <GlassCard key={experience.id} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-medium text-white">
                {experience.position || `Experience ${index + 1}`}
              </h3>
            </div>
            
            <div className="flex gap-2">
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                {expandedIndex === index ? 'Collapse' : 'Expand'}
              </GlassButton>
              <GlassButton
                variant="ghost"
                size="sm"
                icon={<Trash2 />}
                onClick={() => removeExperience(index)}
              >
                Remove
              </GlassButton>
            </div>
          </div>

          {expandedIndex === index && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassInput
                  label="Job Title"
                  value={experience.position}
                  onChange={(value) => updateExperience(index, 'position', value)}
                  required
                />
                
                <GlassInput
                  label="Company"
                  value={experience.company}
                  onChange={(value) => updateExperience(index, 'company', value)}
                  required
                />
                
                <GlassInput
                  label="Start Date"
                  type="month"
                  value={experience.startDate}
                  onChange={(value) => updateExperience(index, 'startDate', value)}
                  icon={<Calendar />}
                />
                
                <div className="space-y-2">
                  <GlassInput
                    label="End Date"
                    type="month"
                    value={experience.endDate}
                    onChange={(value) => updateExperience(index, 'endDate', value)}
                    icon={<Calendar />}
                  />
                  <label className="flex items-center gap-2 text-white/80">
                    <input
                      type="checkbox"
                      checked={experience.current}
                      onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                      className="rounded"
                    />
                    Currently working here
                  </label>
                </div>
              </div>

              <GlassInput
                label="Job Description"
                multiline
                rows={3}
                value={experience.description}
                onChange={(value) => updateExperience(index, 'description', value)}
                placeholder="Briefly describe your role and responsibilities..."
              />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">Key Achievements</h4>
                  <div className="flex gap-2">
                    <GlassButton
                      variant="outline"
                      size="sm"
                      icon={<Sparkles />}
                      onClick={() => generateAchievements(index)}
                    >
                      AI Generate
                    </GlassButton>
                    <GlassButton
                      variant="outline"
                      size="sm"
                      icon={<Plus />}
                      onClick={() => addAchievement(index)}
                    >
                      Add Achievement
                    </GlassButton>
                  </div>
                </div>

                {experience.achievements.map((achievement, achIndex) => (
                  <div key={achIndex} className="flex gap-2 mb-2">
                    <GlassInput
                      placeholder="• Increased sales by 25% through strategic client relationships..."
                      value={achievement}
                      onChange={(value) => updateAchievement(index, achIndex, value)}
                      className="flex-1"
                    />
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 />}
                      onClick={() => removeAchievement(index, achIndex)}
                    >
                      Remove
                    </GlassButton>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      ))}

      <GlassButton
        variant="outline"
        icon={<Plus />}
        onClick={addExperience}
        className="w-full"
      >
        Add Work Experience
      </GlassButton>

      <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
        <h3 className="text-white font-medium mb-2">💡 Achievement Tips</h3>
        <ul className="text-white/80 text-sm space-y-1">
          <li>• Start with action verbs (Led, Developed, Increased, Managed)</li>
          <li>• Include specific numbers and percentages when possible</li>
          <li>• Focus on results and impact, not just responsibilities</li>
          <li>• Use keywords relevant to your target job</li>
        </ul>
      </div>
    </div>
  );
};