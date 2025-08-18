import React, { useState } from 'react';
import { Sparkles, RefreshCw, Shield } from 'lucide-react';
import { GlassInput } from '../../ui/GlassInput';
import { GlassButton } from '../../ui/GlassButton';
import { Resume } from '../../../types/resume';
import { apiClient } from '../../../utils/api';

interface SummaryStepProps {
  data: Partial<Resume>;
  onChange: (section: string, data: any) => void;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  data,
  onChange
}) => {
  const [generating, setGenerating] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [optimizing, setOptimizing] = useState(false);

  const generateSummary = async () => {
    if (!jobTitle || !experience) return;
    setGenerating(true);
    try {
      const result = await apiClient.generateSummary({
        jobTitle,
        experience,
        skills: data.skills || [],
        workExperience: data.workExperience || []
      });
      onChange('professionalSummary', (result as any).summary || '');
    } catch (e) {
      // no-op; keep previous content
    } finally {
      setGenerating(false);
    }
  };

  const optimizeForATS = async () => {
    if (!data.professionalSummary || !jobDescription.trim()) return;
    setOptimizing(true);
    try {
      const payload = {
        resumeContent: data.professionalSummary,
        jobDescription: jobDescription.trim()
      };
      const result = await apiClient.optimizeATS(payload);
      const { optimizedContent, suggestions } = result as any;
      if (optimizedContent) {
        onChange('professionalSummary', optimizedContent);
      }
      // Optionally we could surface suggestions in UI later
    } catch (e) {
      // ignore
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassInput
          label="Target Job Title"
          value={jobTitle}
          onChange={setJobTitle}
          placeholder="e.g., Senior Software Engineer"
        />
        
        <GlassInput
          label="Years of Experience"
          value={experience}
          onChange={setExperience}
          placeholder="e.g., 5+ years"
        />
      </div>

      <div className="flex gap-3">
        <GlassButton
          variant="primary"
          icon={<Sparkles />}
          onClick={generateSummary}
          loading={generating}
          disabled={!jobTitle || !experience}
        >
          Generate AI Summary
        </GlassButton>
        
        <GlassButton
          variant="outline"
          icon={<RefreshCw />}
          onClick={generateSummary}
          disabled={!data.professionalSummary}
        >
          Regenerate
        </GlassButton>
      </div>

      <GlassInput
        label="Professional Summary"
        multiline
        rows={6}
        value={data.professionalSummary || ''}
        onChange={(value) => onChange('professionalSummary', value)}
        placeholder="Write a compelling 3-4 sentence summary highlighting your key achievements and value proposition..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassInput
          label="Job Description (for ATS Optimization)"
          multiline
          rows={4}
          value={jobDescription}
          onChange={setJobDescription}
          placeholder="Paste the JD here to optimize your summary for ATS..."
        />
        <div className="flex items-end">
          <GlassButton
            variant="outline"
            icon={<Shield />}
            onClick={optimizeForATS}
            loading={optimizing}
            disabled={!data.professionalSummary || !jobDescription.trim()}
          >
            Optimize for ATS
          </GlassButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-green-500/10 border border-green-400/20 rounded-lg">
          <h4 className="text-green-300 font-medium mb-2">✅ Good Example</h4>
          <p className="text-white/80 text-sm">
            "Results-driven Software Engineer with 5+ years developing scalable web applications. 
            Led team of 8 developers, increased system performance by 40%, and delivered 15+ 
            successful projects using React, Node.js, and AWS."
          </p>
        </div>
        
        <div className="p-4 bg-red-500/10 border border-red-400/20 rounded-lg">
          <h4 className="text-red-300 font-medium mb-2">❌ Avoid</h4>
          <p className="text-white/80 text-sm">
            "Hardworking individual seeking opportunities to grow. I am passionate about 
            technology and eager to learn new things. Looking for a challenging position."
          </p>
        </div>
      </div>
    </div>
  );
};