import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ResumeBuilder } from '../components/resume/ResumeBuilder';
import { Resume } from '../types/resume';

export const BuilderPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSave = async (resume: Resume) => {
    try {
      // This would save to your backend
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume)
      });

      if (response.ok) {
        toast.success('Resume saved successfully!');
        navigate('/dashboard');
      } else {
        throw new Error('Failed to save resume');
      }
    } catch (error) {
      toast.error('Failed to save resume. Please try again.');
      console.error('Save error:', error);
    }
  };

  const handlePreview = (resume: Resume) => {
    // Store resume data temporarily and navigate to preview
    sessionStorage.setItem('previewResume', JSON.stringify(resume));
    window.open('/preview', '_blank');
  };

  return (
    <ResumeBuilder 
      onSave={handleSave}
      onPreview={handlePreview}
    />
  );
};