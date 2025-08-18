import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { apiClient } from '../utils/api';

export const AIGenerationPage: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState<string>('React, Node.js, TypeScript');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!jobTitle || !experience) return;
    setLoading(true);
    try {
      const result = await apiClient.generateSummary({
        jobTitle,
        experience,
        skills: skills.split(',').map(s => ({ name: s.trim(), level: 'Intermediate', category: 'Technical' })),
        workExperience: []
      });
      setSummary((result as any).summary || '');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <GlassCard className="p-6">
          <h1 className="text-2xl font-bold text-white mb-4">AI-Powered Generation</h1>
          <div className="space-y-3">
            <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50" placeholder="Job Title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
            <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50" placeholder="Experience (e.g., 5+ years)" value={experience} onChange={e => setExperience(e.target.value)} />
            <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50" placeholder="Skills (comma separated)" value={skills} onChange={e => setSkills(e.target.value)} />
            <GlassButton variant="primary" loading={loading} onClick={run}>Generate Summary</GlassButton>
          </div>
        </GlassCard>
        {summary && (
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Generated Summary</h3>
            <p className="text-white/80 whitespace-pre-line text-sm">{summary}</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

