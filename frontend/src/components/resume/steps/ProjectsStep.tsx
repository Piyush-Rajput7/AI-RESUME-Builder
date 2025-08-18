import React from 'react';
import { Plus, Trash2, Code, ExternalLink, Github } from 'lucide-react';
import { GlassInput } from '../../ui/GlassInput';
import { GlassButton } from '../../ui/GlassButton';
import { GlassCard } from '../../ui/GlassCard';
import { Resume, Project } from '../../../types/resume';

interface ProjectsStepProps {
  data: Partial<Resume>;
  onChange: (section: string, data: any) => void;
}

export const ProjectsStep: React.FC<ProjectsStepProps> = ({
  data,
  onChange
}) => {
  const projects = data.projects || [];

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      github: ''
    };
    
    onChange('projects', [...projects, newProject]);
  };

  const updateProject = (index: number, field: string, value: any) => {
    const updated = projects.map((project, i) => 
      i === index ? { ...project, [field]: value } : project
    );
    onChange('projects', updated);
  };

  const removeProject = (index: number) => {
    const updated = projects.filter((_, i) => i !== index);
    onChange('projects', updated);
  };

  const addTechnology = (projectIndex: number, tech: string) => {
    if (!tech.trim()) return;
    
    const project = projects[projectIndex];
    const technologies = [...project.technologies, tech.trim()];
    updateProject(projectIndex, 'technologies', technologies);
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const project = projects[projectIndex];
    const technologies = project.technologies.filter((_, i) => i !== techIndex);
    updateProject(projectIndex, 'technologies', technologies);
  };

  return (
    <div className="space-y-6">
      {projects.map((project, index) => (
        <GlassCard key={project.id} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-medium text-white">
                {project.name || `Project ${index + 1}`}
              </h3>
            </div>
            
            <GlassButton
              variant="ghost"
              size="sm"
              icon={<Trash2 />}
              onClick={() => removeProject(index)}
            />
          </div>

          <div className="space-y-4">
            <GlassInput
              label="Project Name"
              value={project.name}
              onChange={(value) => updateProject(index, 'name', value)}
              placeholder="E-commerce Platform"
              required
            />

            <GlassInput
              label="Description"
              multiline
              rows={3}
              value={project.description}
              onChange={(value) => updateProject(index, 'description', value)}
              placeholder="Built a full-stack e-commerce platform with user authentication, payment processing, and admin dashboard..."
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassInput
                label="Live Demo URL"
                value={project.url || ''}
                onChange={(value) => updateProject(index, 'url', value)}
                placeholder="https://myproject.com"
                icon={<ExternalLink />}
              />
              
              <GlassInput
                label="GitHub Repository"
                value={project.github || ''}
                onChange={(value) => updateProject(index, 'github', value)}
                placeholder="https://github.com/username/project"
                icon={<Github />}
              />
            </div>

            {/* Technologies */}
            <div>
              <h4 className="text-white font-medium mb-3">Technologies Used</h4>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm text-blue-300"
                  >
                    {tech}
                    <button
                      onClick={() => removeTechnology(index, techIndex)}
                      className="ml-1 text-blue-300 hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <GlassInput
                  placeholder="Add technology (React, Node.js, etc.)"
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      addTechnology(index, input.value);
                      input.value = '';
                    }
                  }}
                />
                <GlassButton
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).parentElement?.querySelector('input');
                    if (input?.value) {
                      addTechnology(index, input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </GlassButton>
              </div>
            </div>
          </div>
        </GlassCard>
      ))}

      <GlassButton
        variant="outline"
        icon={<Plus />}
        onClick={addProject}
        className="w-full"
      >
        Add Project
      </GlassButton>

      <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
        <h3 className="text-white font-medium mb-2">💡 Project Tips</h3>
        <ul className="text-white/80 text-sm space-y-1">
          <li>• Include 2-4 of your best projects that showcase relevant skills</li>
          <li>• Focus on projects that align with your target job requirements</li>
          <li>• Mention the impact or results of your projects when possible</li>
          <li>• Include both personal and professional projects</li>
          <li>• Make sure live demos are working and GitHub repos are clean</li>
        </ul>
      </div>
    </div>
  );
};