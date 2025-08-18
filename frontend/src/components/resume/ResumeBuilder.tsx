import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Save, Eye } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { WorkExperienceStep } from './steps/WorkExperienceStep';
import { EducationStep } from './steps/EducationStep';
import { SkillsStep } from './steps/SkillsStep';
import { ProjectsStep } from './steps/ProjectsStep';
import { SummaryStep } from './steps/SummaryStep';
import { Resume } from '../../types/resume';

interface ResumeBuilderProps {
  onSave: (resume: Resume) => void;
  onPreview: (resume: Resume) => void;
  initialData?: Partial<Resume>;
}

const steps = [
  { id: 'personal', title: 'Personal Info', component: PersonalInfoStep },
  { id: 'summary', title: 'Professional Summary', component: SummaryStep },
  { id: 'experience', title: 'Work Experience', component: WorkExperienceStep },
  { id: 'education', title: 'Education', component: EducationStep },
  { id: 'skills', title: 'Skills', component: SkillsStep },
  { id: 'projects', title: 'Projects', component: ProjectsStep },
];

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  onSave,
  onPreview,
  initialData
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState<Partial<Resume>>({
    title: 'My Resume',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: ''
    },
    professionalSummary: '',
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    templateId: 'modern-professional',
    ...initialData
  });

  const updateResumeData = (section: string, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    onSave(resumeData as Resume);
  };

  const handlePreview = () => {
    onPreview(resumeData as Resume);
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Resume Builder</h1>
            <div className="flex gap-3">
              <GlassButton
                variant="outline"
                icon={<Eye />}
                onClick={handlePreview}
              >
                Preview
              </GlassButton>
              <GlassButton
                variant="primary"
                icon={<Save />}
                onClick={handleSave}
              >
                Save Resume
              </GlassButton>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-white/80 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {steps.map((step, index) => (
                <motion.button
                  key={step.id}
                  className={`
                    px-3 py-1 rounded-full text-sm transition-all duration-200
                    ${index === currentStep
                      ? 'bg-white/20 text-white border border-white/30'
                      : index < currentStep
                      ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                      : 'bg-white/5 text-white/60 border border-white/10'
                    }
                  `}
                  onClick={() => setCurrentStep(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {step.title}
                </motion.button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Step Content */}
        <GlassCard className="p-6 mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-white mb-6">
                {steps[currentStep].title}
              </h2>
              <CurrentStepComponent
                data={resumeData}
                onChange={updateResumeData}
              />
            </motion.div>
          </AnimatePresence>
        </GlassCard>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <GlassButton
            variant="outline"
            icon={<ChevronLeft />}
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </GlassButton>
          
          <GlassButton
            variant="primary"
            icon={<ChevronRight />}
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
          >
            Next Step
          </GlassButton>
        </div>
      </div>
    </div>
  );
};