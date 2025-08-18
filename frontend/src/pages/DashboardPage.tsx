import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Edit, Trash2, Download } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { Resume } from '../types/resume';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchResumes();
    }
  }, [user]);

  const fetchResumes = async () => {
    try {
      const response = await fetch(`/api/resumes/user/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const normalized: Resume[] = (data || []).map((row: any) => {
          const content = row?.content || {};
          return {
            id: row?.id ?? content.id,
            userId: row?.user_id ?? content.userId,
            title: row?.title ?? content.title ?? 'Untitled Resume',
            personalInfo: content.personalInfo ?? {
              fullName: '',
              email: '',
              phone: '',
              location: ''
            },
            professionalSummary: content.professionalSummary ?? '',
            workExperience: content.workExperience ?? [],
            education: content.education ?? [],
            skills: content.skills ?? [],
            projects: content.projects ?? [],
            templateId: content.templateId ?? row?.template_id ?? 'modern-professional',
            atsScore: row?.ats_score ?? content.atsScore,
            createdAt: row?.created_at ?? content.createdAt,
            updatedAt: row?.updated_at ?? content.updatedAt,
          } as Resume;
        });
        setResumes(normalized);
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (resumeId: string) => {
    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      if (response.ok) {
        setResumes(resumes.filter(resume => resume.id !== resumeId));
      }
    } catch (error) {
      console.error('Failed to delete resume:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Sign In</h2>
          <p className="text-white/70 mb-6">You need to be signed in to view your dashboard.</p>
          <GlassButton variant="primary" onClick={() => navigate('/')}>
            Go to Home
          </GlassButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Resumes</h1>
              <p className="text-white/70">Manage and create your professional resumes</p>
            </div>
            <GlassButton
              variant="primary"
              icon={<Plus />}
              onClick={() => navigate('/builder')}
            >
              Create New Resume
            </GlassButton>
          </div>
        </GlassCard>

        {/* Resume Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-white/70">Loading your resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <FileText className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No resumes yet</h3>
            <p className="text-white/70 mb-6">Create your first AI-powered resume to get started</p>
            <GlassButton
              variant="primary"
              icon={<Plus />}
              onClick={() => navigate('/builder')}
            >
              Create Your First Resume
            </GlassButton>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {resume.title}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {resume.personalInfo?.fullName || 'Unnamed'}
                      </p>
                    </div>
                    {resume.atsScore && (
                      <div className="text-right">
                        <div className="text-sm text-white/60">ATS Score</div>
                        <div className={`text-lg font-bold ${
                          resume.atsScore >= 80 ? 'text-green-400' : 
                          resume.atsScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {resume.atsScore}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-white/60 text-sm mb-4">
                    <p>Updated: {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : '—'}</p>
                    <p>Template: {(resume.templateId || '').replace('-', ' ')}</p>
                  </div>

                  <div className="flex gap-2">
                    <GlassButton
                      variant="outline"
                      size="sm"
                      icon={<Edit />}
                      onClick={() => navigate(`/builder?resume=${resume.id}`)}
                      className="flex-1"
                    >
                      Edit
                    </GlassButton>
                    <GlassButton
                      variant="outline"
                      size="sm"
                      icon={<Download />}
                      onClick={() => console.log('Download', resume.id)}
                    >
                      PDF
                    </GlassButton>
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 />}
                      onClick={() => deleteResume(resume.id!)}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};