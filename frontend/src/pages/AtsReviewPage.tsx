import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { apiClient } from '../utils/api';

export const AtsReviewPage: React.FC = () => {
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const onUpload = async () => {
    if (!targetRole.trim() || !file) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append('targetRole', targetRole.trim());
      form.append('jobDescription', jobDescription.trim());
      form.append('file', file);
      const data = await apiClient.atsReviewUpload(form);
      setResult(data);
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
          <h1 className="text-2xl font-bold text-white mb-4">ATS Optimization</h1>
          <div className="space-y-3">
            <input
              className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50"
              placeholder="Target Role (e.g., Frontend Engineer)"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
            />
            <textarea
              className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50"
              placeholder="Paste Job Description (optional)"
              rows={6}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="text-white"
            />
            <GlassButton variant="primary" loading={loading} onClick={onUpload}>
              Run ATS Review
            </GlassButton>
          </div>
        </GlassCard>

        {result && (
          <GlassCard className="p-6">
            <div className="text-white space-y-4">
              <div className="flex justify-between">
                <span>ATS Score</span>
                <span className="font-semibold">{result.score}/100</span>
              </div>
              {result.missingKeywords?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((k: string, i: number) => (
                      <span key={i} className="px-2 py-1 text-xs bg-white/10 border border-white/20 rounded">{k}</span>
                    ))}
                  </div>
                </div>
              )}
              {result.suggestions?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Suggestions</h3>
                  <ul className="list-disc list-inside text-white/80 text-sm space-y-1">
                    {result.suggestions.slice(0, 10).map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.optimizedContent && (
                <div>
                  <h3 className="font-semibold mb-2">Improved Summary</h3>
                  <p className="text-white/80 whitespace-pre-line text-sm">{result.optimizedContent}</p>
                </div>
              )}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

