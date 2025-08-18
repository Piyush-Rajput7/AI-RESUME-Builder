import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { Resume } from '../../types/resume';
import { apiClient } from '../../utils/api';

interface ResumePreviewProps {
  resume: Resume;
  onBack: () => void;
  onSave: () => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resume,
  onBack,
  onSave
}) => {
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [review, setReview] = useState<null | {
    score: number;
    issues: string[];
    missingKeywords: string[];
    suggestions: string[];
    optimizedContent: string;
    formatting: {
      hasProperHeadings: boolean;
      hasConsistentFormatting: boolean;
      readableFont: boolean;
      appropriateLength: boolean;
    };
  }>(null);
  const handleDownloadPDF = async () => {
    try {
      // Simple PDF download using browser print
      const printContent = document.querySelector('.resume-content');
      if (printContent) {
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent.outerHTML;
        
        // Add print styles
        const style = document.createElement('style');
        style.textContent = `
          @media print {
            body { margin: 0; padding: 20px; }
            .resume-content { box-shadow: none !important; }
          }
        `;
        document.head.appendChild(style);
        
        window.print();
        
        // Restore original content
        document.body.innerHTML = originalContent;
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GlassButton
                variant="outline"
                icon={<ArrowLeft />}
                onClick={onBack}
              >
                Back to Editor
              </GlassButton>
              <h1 className="text-2xl font-bold text-white">{resume.title}</h1>
            </div>
            
            <div className="flex gap-3">
              <GlassButton
                variant="outline"
                icon={<Download />}
                onClick={handleDownloadPDF}
              >
                Download PDF
              </GlassButton>
              <GlassButton
                variant="primary"
                icon={<Save />}
                onClick={onSave}
              >
                Save Resume
              </GlassButton>
            </div>
          </div>
        </GlassCard>

        {/* Resume Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <GlassCard className="p-8">
              <div className="resume-content bg-white text-black p-8 rounded-lg shadow-2xl max-w-[8.5in] mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {resume.personalInfo.fullName}
                  </h1>
                  <div className="text-gray-600 space-y-1">
                    <p>{resume.personalInfo.email} • {resume.personalInfo.phone}</p>
                    <p>{resume.personalInfo.location}</p>
                    {resume.personalInfo.linkedin && (
                      <p>{resume.personalInfo.linkedin}</p>
                    )}
                  </div>
                </div>

                {/* Professional Summary */}
                {resume.professionalSummary && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-1">
                      Professional Summary
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {resume.professionalSummary}
                    </p>
                  </div>
                )}

                {/* Work Experience */}
                {resume.workExperience.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-1">
                      Work Experience
                    </h2>
                    {resume.workExperience.map((exp, index) => (
                      <div key={exp.id} className={index > 0 ? 'mt-4' : ''}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                            <p className="text-gray-700">{exp.company}</p>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </p>
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 mb-2">{exp.description}</p>
                        )}
                        {exp.achievements.length > 0 && (
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {exp.achievements.map((achievement, achIndex) => (
                              <li key={achIndex}>{achievement}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {resume.education.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-1">
                      Education
                    </h2>
                    {resume.education.map((edu, index) => (
                      <div key={edu.id} className={index > 0 ? 'mt-3' : ''}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {edu.degree} in {edu.field}
                            </h3>
                            <p className="text-gray-700">{edu.institution}</p>
                            {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                          </div>
                          <p className="text-gray-600 text-sm">
                            {edu.startDate} - {edu.endDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {resume.skills.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-1">
                      Skills
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {['Technical', 'Soft', 'Language', 'Certification'].map(category => {
                        const categorySkills = resume.skills.filter(skill => skill.category === category);
                        if (categorySkills.length === 0) return null;
                        
                        return (
                          <div key={category}>
                            <h4 className="font-semibold text-gray-800 mb-2">{category}</h4>
                            <div className="flex flex-wrap gap-1">
                              {categorySkills.map((skill, index) => (
                                <span key={index} className="text-sm text-gray-700">
                                  {skill.name}{index < categorySkills.length - 1 ? ',' : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {resume.projects.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-1">
                      Projects
                    </h2>
                    {resume.projects.map((project, index) => (
                      <div key={project.id} className={index > 0 ? 'mt-4' : ''}>
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <p className="text-gray-700 mb-2">{project.description}</p>
                        {project.technologies.length > 0 && (
                          <p className="text-gray-600 text-sm">
                            <strong>Technologies:</strong> {project.technologies.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Resume Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">ATS Score</span>
                  <span className="text-green-400 font-semibold">
                    {resume.atsScore || 85}/100
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Sections</span>
                  <span className="text-white">
                    {[
                      resume.professionalSummary && 'Summary',
                      resume.workExperience.length > 0 && 'Experience',
                      resume.education.length > 0 && 'Education',
                      resume.skills.length > 0 && 'Skills',
                      resume.projects.length > 0 && 'Projects'
                    ].filter(Boolean).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Template</span>
                  <span className="text-white capitalize">
                    {resume.templateId.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Tips</h3>
              <ul className="text-white/80 text-sm space-y-2">
                <li>• Keep your resume to 1-2 pages</li>
                <li>• Use action verbs in achievements</li>
                <li>• Include relevant keywords</li>
                <li>• Quantify your accomplishments</li>
                <li>• Proofread for errors</li>
              </ul>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">ATS Role Review</h3>
              <div className="space-y-3">
                <input
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  placeholder="Target Role (e.g., Frontend Engineer)"
                  className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50"
                />
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste Job Description (optional)"
                  rows={5}
                  className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50"
                />
                <GlassButton
                  variant="primary"
                  loading={reviewLoading}
                  onClick={async () => {
                    if (!targetRole.trim()) return;
                    setReviewLoading(true);
                    try {
                      const result = await apiClient.atsReview({
                        resume,
                        targetRole: targetRole.trim(),
                        jobDescription: jobDescription.trim()
                      });
                      setReview(result as any);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setReviewLoading(false);
                    }
                  }}
                >
                  Run ATS Review
                </GlassButton>
              </div>

              {review && (
                <div className="mt-6 space-y-4 text-white/90">
                  <div className="flex justify-between">
                    <span>Role-fit ATS Score</span>
                    <span className="font-semibold">{review.score}/100</span>
                  </div>
                  {review.missingKeywords.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-1">Missing Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {review.missingKeywords.map((k, i) => (
                          <span key={i} className="px-2 py-1 text-xs bg-white/10 border border-white/20 rounded">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {review.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-1">Suggestions</h4>
                      <ul className="list-disc list-inside space-y-1 text-white/80 text-sm">
                        {review.suggestions.slice(0, 8).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.optimizedContent && (
                    <div>
                      <h4 className="font-semibold mb-1">Improved Summary</h4>
                      <p className="text-white/80 text-sm whitespace-pre-line">{review.optimizedContent}</p>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};