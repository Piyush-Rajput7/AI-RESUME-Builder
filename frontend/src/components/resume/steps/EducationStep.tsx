import React from 'react';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { GlassInput } from '../../ui/GlassInput';
import { GlassButton } from '../../ui/GlassButton';
import { GlassCard } from '../../ui/GlassCard';
import { Resume, Education } from '../../../types/resume';

interface EducationStepProps {
  data: Partial<Resume>;
  onChange: (section: string, data: any) => void;
}

export const EducationStep: React.FC<EducationStepProps> = ({
  data,
  onChange
}) => {
  const education = data.education || [];

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    
    onChange('education', [...education, newEducation]);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = education.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    );
    onChange('education', updated);
  };

  const removeEducation = (index: number) => {
    const updated = education.filter((_, i) => i !== index);
    onChange('education', updated);
  };

  return (
    <div className="space-y-6">
      {education.map((edu, index) => (
        <GlassCard key={edu.id} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-medium text-white">
                {edu.degree || `Education ${index + 1}`}
              </h3>
            </div>
            
            <GlassButton
              variant="ghost"
              size="sm"
              icon={<Trash2 />}
              onClick={() => removeEducation(index)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassInput
              label="Institution"
              value={edu.institution}
              onChange={(value) => updateEducation(index, 'institution', value)}
              placeholder="University of California, Berkeley"
              required
            />
            
            <GlassInput
              label="Degree"
              value={edu.degree}
              onChange={(value) => updateEducation(index, 'degree', value)}
              placeholder="Bachelor of Science"
              required
            />
            
            <GlassInput
              label="Field of Study"
              value={edu.field}
              onChange={(value) => updateEducation(index, 'field', value)}
              placeholder="Computer Science"
              required
            />
            
            <GlassInput
              label="GPA (Optional)"
              value={edu.gpa || ''}
              onChange={(value) => updateEducation(index, 'gpa', value)}
              placeholder="3.8/4.0"
            />
            
            <GlassInput
              label="Start Date"
              type="month"
              value={edu.startDate}
              onChange={(value) => updateEducation(index, 'startDate', value)}
            />
            
            <GlassInput
              label="End Date"
              type="month"
              value={edu.endDate}
              onChange={(value) => updateEducation(index, 'endDate', value)}
            />
          </div>
        </GlassCard>
      ))}

      <GlassButton
        variant="outline"
        icon={<Plus />}
        onClick={addEducation}
        className="w-full"
      >
        Add Education
      </GlassButton>
    </div>
  );
};