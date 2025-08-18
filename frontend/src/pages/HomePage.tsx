import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Target, Award, ArrowRight } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI-Powered Generation',
      description: 'Generate professional resume content with advanced AI that understands your industry and role.',
      action: () => navigate('/ai-generation')
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'ATS Optimization',
      description: 'Ensure your resume passes Applicant Tracking Systems with our intelligent formatting and keyword optimization.',
      action: () => navigate('/ats-review')
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-time Review',
      description: 'Get instant feedback on your resume with actionable suggestions to improve your chances.',
      action: () => navigate('/real-time-review')
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Professional Templates',
      description: 'Choose from industry-specific templates designed by HR professionals and career experts.',
      action: () => navigate('/templates')
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Build Your Perfect
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {' '}AI Resume
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              Create ATS-friendly resumes in minutes with AI-powered content generation, 
              professional templates, and intelligent optimization.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/builder')}
                icon={<Sparkles />}
              >
                Start Building Free
              </GlassButton>
              
              <GlassButton
                variant="outline"
                size="lg"
                onClick={() => navigate('/dashboard')}
                icon={<ArrowRight />}
              >
                View Examples
              </GlassButton>
            </div>
          </motion.div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Our AI Resume Builder?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Leverage cutting-edge AI technology to create resumes that get you noticed by both ATS systems and hiring managers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard
                  className="p-6 h-full text-center hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={features[index].action}
                >
                  <div className="text-blue-400 mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/70">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">95%</div>
                <div className="text-white/80">ATS Pass Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">3x</div>
                <div className="text-white/80">More Interviews</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-pink-400 mb-2">10k+</div>
                <div className="text-white/80">Resumes Created</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of professionals who've transformed their careers with our AI resume builder.
            </p>
            <GlassButton
              variant="primary"
              size="lg"
              onClick={() => navigate('/builder')}
              icon={<Sparkles />}
            >
              Create Your Resume Now
            </GlassButton>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};