import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { apiClient } from '../utils/api';

export const RealTimeReviewPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const run = async () => {
    if (!content.trim() || !jd.trim()) return;
    setLoading(true);
    try {
      const res = await apiClient.optimizeATS({ resumeContent: content.trim(), jobDescription: jd.trim() });
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <GlassCard className="p-6">
          <h1 className="text-2xl font-bold text-white mb-4">Real-time Review</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50" placeholder="Paste resume content..." rows={12} value={content} onChange={e => setContent(e.target.value)} />
            <textarea className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50" placeholder="Paste job description..." rows={12} value={jd} onChange={e => setJd(e.target.value)} />
          </div>
          <div className="mt-4">
            <GlassButton variant="primary" loading={loading} onClick={run}>Review</GlassButton>
          </div>
        </GlassCard>

        {result && (
          <GlassCard className="p-6">
            <div className="text-white space-y-4">
              <div className="flex justify-between"><span>ATS Score</span><span className="font-semibold">{(result as any).score}/100</span></div>
              {(result as any).suggestions?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Suggestions</h3>
                  <ul className="list-disc list-inside text-white/80 text-sm space-y-1">
                    {(result as any).suggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

