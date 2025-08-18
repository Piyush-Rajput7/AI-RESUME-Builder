import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../utils/supabaseClient';
import { ResumeBuilder } from '../components/resume/ResumeBuilder';
import { ResumePreview } from '../components/resume/ResumePreview';
import { Resume } from '../types/resume';
import { useAuth } from '../hooks/useAuth';



export const ResumeBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [initialStep, setInitialStep] = useState<string | null>(null);

  const handleSaveResume = async (resume: Resume) => {
    if (!user) {
      toast.error('Please sign in to save resume');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          user_id: user.id,
          title: resume.title,
          content: resume,
          template_id: resume.templateId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Resume saved successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Failed to save resume: ' + error.message);
      console.error('Save error:', error);
    }
  };

  const handlePreviewResume = (resume: Resume) => {
    setCurrentResume(resume);
    setShowPreview(true);
  };

  useEffect(() => {
    const preview = searchParams.get('preview');
    const step = searchParams.get('step');
    const templates = searchParams.get('templates');
    const template = searchParams.get('template');
    if (preview === '1') setShowPreview(true);
    if (step) setInitialStep(step);
    // templates param can be used later to open templates panel
    if (template) {
      setCurrentResume(prev => ({
        ...(prev || ({} as any)),
        title: prev?.title || 'My Resume',
        personalInfo: prev?.personalInfo || { fullName: '', email: '', phone: '', location: '' },
        professionalSummary: prev?.professionalSummary || '',
        workExperience: prev?.workExperience || [],
        education: prev?.education || [],
        skills: prev?.skills || [],
        projects: prev?.projects || [],
        templateId: template as any,
      } as any));
    }
  }, [searchParams]);

  if (showPreview && currentResume) {
    return (
      <ResumePreview
        resume={currentResume}
        onBack={() => setShowPreview(false)}
        onSave={() => handleSaveResume(currentResume)}
      />
    );
  }

  return (
    <ResumeBuilder
      onSave={handleSaveResume}
      onPreview={handlePreviewResume}
      initialData={{ ...(initialStep === 'summary' ? { professionalSummary: '' } : {}), ...(currentResume?.templateId ? { templateId: currentResume.templateId } : {}) }}
    />
  );
};