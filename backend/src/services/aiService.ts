import { WorkExperience, UserContext, Skill, Resume } from '../types/resume';
import { ATSAnalyzer } from './atsAnalyzer';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export class AIService {
  private atsAnalyzer = new ATSAnalyzer();
  async generateProfessionalSummary(context: {
    jobTitle: string;
    experience: string;
    skills: Skill[];
    workExperience: WorkExperience[];
  }): Promise<string> {
    const prompt = `Write a professional resume summary for a ${context.jobTitle} with ${context.experience} experience. Skills: ${context.skills.map(s => s.name).join(', ')}. Make it 3-4 sentences, professional and ATS-friendly.`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const result = await response.json();
      
      if (result.candidates && result.candidates[0]) {
        return result.candidates[0].content.parts[0].text.trim();
      }
      
      // Fallback if API fails
      return `Results-driven ${context.jobTitle} with ${context.experience} of experience. Proven expertise in ${context.skills.slice(0, 3).map(s => s.name).join(', ')}. Strong track record of delivering high-quality solutions and driving business growth.`;
    } catch (error) {
      // Fallback summary
      return `Results-driven ${context.jobTitle} with ${context.experience} of experience. Proven expertise in ${context.skills.slice(0, 3).map(s => s.name).join(', ')}. Strong track record of delivering high-quality solutions and driving business growth.`;
    }
  }

  async generateAchievements(context: {
    position: string;
    company: string;
    description: string;
  }): Promise<string[]> {
    const prompt = `Generate 4 professional achievements for a ${context.position} at ${context.company}. Job: ${context.description}. Format as bullet points with action verbs and metrics. Example: "• Increased sales by 25% through strategic client relationships"`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const result = await response.json();
      
      if (result.candidates && result.candidates[0]) {
        const text = result.candidates[0].content.parts[0].text;
        const achievements = text.split('\n')
          .filter((line: string) => line.trim().startsWith('•') || line.trim().startsWith('-'))
          .map((line: string) => line.replace(/^[•\-]\s*/, '').trim())
          .filter((line: string) => line.length > 10);
        
        return achievements.length > 0 ? achievements : [
          `Led key initiatives that improved ${context.position.toLowerCase()} processes by 20%`,
          `Collaborated with cross-functional teams to deliver high-quality results`,
          `Implemented best practices that enhanced team productivity and efficiency`,
          `Contributed to company growth through innovative solutions and strategic thinking`
        ];
      }
      
      // Fallback achievements
      return [
        `Led key initiatives that improved ${context.position.toLowerCase()} processes by 20%`,
        `Collaborated with cross-functional teams to deliver high-quality results`,
        `Implemented best practices that enhanced team productivity and efficiency`,
        `Contributed to company growth through innovative solutions and strategic thinking`
      ];
    } catch (error) {
      // Fallback achievements
      return [
        `Led key initiatives that improved ${context.position.toLowerCase()} processes by 20%`,
        `Collaborated with cross-functional teams to deliver high-quality results`,
        `Implemented best practices that enhanced team productivity and efficiency`,
        `Contributed to company growth through innovative solutions and strategic thinking`
      ];
    }
  }

  async optimizeForATS(resumeContent: string, jobDescription: string): Promise<{
    optimizedContent: string;
    suggestions: string[];
    score: number;
  }> {
    const prompt = `Analyze this resume content against the job description and provide ATS optimization suggestions.
Resume Content: ${resumeContent}
Job Description: ${jobDescription}

Return a JSON object with keys: score (0-100), suggestions (array of strings), missingKeywords (array), optimizedContent (string).`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsed = JSON.parse(text || '{}');
      return {
        optimizedContent: parsed.optimizedContent || resumeContent,
        suggestions: parsed.suggestions || [],
        score: parsed.score || 75
      };
    } catch (error) {
      return {
        optimizedContent: resumeContent,
        suggestions: ['Unable to generate suggestions at this time'],
        score: 75
      };
    }
  }

  async suggestSkills(context: {
    workExperience: WorkExperience[];
    targetRole: string;
  }): Promise<string[]> {
    const prompt = `
      Suggest relevant skills for a ${context.targetRole} based on this work experience:
      
      ${context.workExperience.map(exp => 
        `${exp.position} at ${exp.company}: ${exp.description}`
      ).join('\n')}
      
      Requirements:
      - Focus on technical skills, tools, and technologies
      - Include both hard and soft skills relevant to the role
      - Prioritize in-demand skills for the target position
      - Return 8-12 skills maximum
      
      Return as a JSON array of skill names only.
    `;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '[]';
      return JSON.parse(text);
    } catch (error) {
      return ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'];
    }
  }

  async analyzeJobDescription(jobDescription: string): Promise<{
    requiredSkills: string[];
    preferredSkills: string[];
    keywords: string[];
    experienceLevel: string;
    industry: string;
  }> {
    const prompt = `
      Analyze this job description and extract key information:
      
      ${jobDescription}
      
      Extract:
      1. Required skills and qualifications
      2. Preferred/nice-to-have skills
      3. Important keywords for ATS
      4. Experience level (Entry/Mid/Senior/Executive)
      5. Industry/sector
      
      Return as JSON with the specified structure.
    `;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      return JSON.parse(text);
    } catch (error) {
      return {
        requiredSkills: [],
        preferredSkills: [],
        keywords: [],
        experienceLevel: 'Mid',
        industry: 'Technology'
      };
    }
  }

  async reviewResumeForRole(params: {
    resume: Resume;
    targetRole: string;
    jobDescription?: string;
  }): Promise<{
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
  }> {
    const { resume, targetRole, jobDescription } = params;

    const resumeTextParts: string[] = [];
    if (resume.personalInfo) {
      const p = resume.personalInfo;
      resumeTextParts.push(`${p.fullName} ${p.email} ${p.phone} ${p.location}`);
    }
    if (resume.professionalSummary) {
      resumeTextParts.push(resume.professionalSummary);
    }
    (resume.workExperience || []).forEach(exp => {
      resumeTextParts.push(`${exp.position} ${exp.company} ${exp.description}`);
    });
    (resume.education || []).forEach(ed => {
      resumeTextParts.push(`${ed.degree} ${ed.field} ${ed.institution}`);
    });
    (resume.skills || []).forEach(sk => resumeTextParts.push(sk.name));
    (resume.projects || []).forEach(pr => resumeTextParts.push(`${pr.name} ${pr.description}`));

    const resumeText = resumeTextParts.join('\n');

    const atsReport = this.atsAnalyzer.analyzeResume(
      resumeText,
      jobDescription && jobDescription.trim().length > 0 ? jobDescription : targetRole
    );

    const prompt = `You are an ATS and career expert. Given the target role "${targetRole}", and this ATS analysis summary:
Score: ${atsReport.score}
Missing Keywords: ${atsReport.keywords.missing.join(', ') || 'None'}
Formatting Issues: ${atsReport.formatting.issues.join('; ') || 'None'}
Other Issues: ${atsReport.issues.map(i => i.message).join('; ') || 'None'}

Resume (structured): ${JSON.stringify(resume)}
Job Context: ${jobDescription || targetRole}

Return a concise JSON with keys:
{
  "suggestions": [short actionable bullets tailored to ${targetRole}],
  "optimizedContent": "Rewrite the professionalSummary to better fit the role and include missing keywords naturally (150-220 words)."
}`;

    let optimizedContent = resume.professionalSummary || '';
    let suggestions: string[] = [];

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      try {
        const parsed = JSON.parse(text);
        optimizedContent = parsed.optimizedContent || optimizedContent;
        suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions : suggestions;
      } catch {
        // If model didn't return JSON, try to heuristically extract suggestions
        suggestions = (text.split('\n').filter((l: string) => l.trim().length > 0).slice(0, 6)) || [];
      }
    } catch {
      suggestions = atsReport.recommendations.slice(0, 6);
    }

    return {
      score: atsReport.score,
      issues: atsReport.issues.map(i => i.message),
      missingKeywords: atsReport.keywords.missing,
      suggestions: suggestions.length ? suggestions : atsReport.recommendations.slice(0, 6),
      optimizedContent,
      formatting: {
        hasProperHeadings: atsReport.formatting.hasProperHeadings,
        hasConsistentFormatting: atsReport.formatting.hasConsistentFormatting,
        readableFont: atsReport.formatting.readableFont,
        appropriateLength: atsReport.formatting.appropriateLength
      }
    };
  }
}