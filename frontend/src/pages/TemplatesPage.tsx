import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { apiClient } from '../utils/api';
import { useNavigate } from 'react-router-dom';

type Template = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  is_premium?: boolean;
};

export const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await apiClient.listTemplates();
        setTemplates(data as Template[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Professional Templates</h1>
        {loading ? (
          <div className="text-white/70">Loading templates...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map(t => (
              <GlassCard key={t.id} className="p-6 flex flex-col">
                <h3 className="text-lg font-semibold text-white">{t.name}</h3>
                <p className="text-white/70 text-sm mb-4">{t.description || '—'}</p>
                <div className="text-white/60 text-xs mb-4">ID: {t.id}</div>
                <GlassButton
                  variant="primary"
                  onClick={() => navigate(`/builder?template=${t.id}`)}
                  className="mt-auto"
                >
                  Use this template
                </GlassButton>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

