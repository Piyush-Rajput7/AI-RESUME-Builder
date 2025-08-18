import { ATSReport, ATSIssue, KeywordAnalysis, FormattingAnalysis } from '../types/resume';

export class ATSAnalyzer {
  analyzeResume(resumeContent: string, jobDescription?: string): ATSReport {
    const issues: ATSIssue[] = [];
    const keywords = this.analyzeKeywords(resumeContent, jobDescription);
    const formatting = this.analyzeFormatting(resumeContent);
    
    // Check for common ATS issues
    issues.push(...this.checkCommonIssues(resumeContent));
    issues.push(...formatting.issues.map(issue => ({
      type: 'warning' as const,
      category: 'formatting' as const,
      message: issue
    })));

    const score = this.calculateATSScore(issues, keywords, formatting);
    const recommendations = this.generateRecommendations(issues, keywords);

    return {
      score,
      issues,
      keywords,
      formatting,
      recommendations
    };
  }

  private analyzeKeywords(resumeContent: string, jobDescription?: string): KeywordAnalysis {
    const resumeWords = this.extractKeywords(resumeContent);
    
    if (!jobDescription) {
      return {
        missing: [],
        present: resumeWords,
        density: {},
        suggestions: []
      };
    }

    const jobWords = this.extractKeywords(jobDescription);
    const missing = jobWords.filter(word => 
      !resumeWords.some(rWord => rWord.toLowerCase() === word.toLowerCase())
    );
    
    const present = jobWords.filter(word => 
      resumeWords.some(rWord => rWord.toLowerCase() === word.toLowerCase())
    );

    const density = this.calculateKeywordDensity(resumeContent, jobWords);

    return {
      missing: missing.slice(0, 10), // Top 10 missing keywords
      present,
      density,
      suggestions: this.generateKeywordSuggestions(missing)
    };
  }

  private analyzeFormatting(resumeContent: string): FormattingAnalysis {
    const issues: string[] = [];
    
    // Check for proper headings
    const hasProperHeadings = /^(EXPERIENCE|EDUCATION|SKILLS|SUMMARY)/mi.test(resumeContent);
    if (!hasProperHeadings) {
      issues.push('Missing standard section headings (Experience, Education, Skills, etc.)');
    }

    // Check length
    const wordCount = resumeContent.split(/\s+/).length;
    const appropriateLength = wordCount >= 200 && wordCount <= 800;
    if (!appropriateLength) {
      issues.push(`Resume length (${wordCount} words) should be between 200-800 words`);
    }

    // Check for consistent formatting
    const hasConsistentFormatting = this.checkConsistentFormatting(resumeContent);
    if (!hasConsistentFormatting) {
      issues.push('Inconsistent date formatting or bullet point style detected');
    }

    // Check for readable font indicators
    const readableFont = !resumeContent.includes('Comic Sans') && !resumeContent.includes('Papyrus');

    return {
      hasProperHeadings,
      hasConsistentFormatting,
      readableFont,
      appropriateLength,
      issues
    };
  }

  private checkCommonIssues(resumeContent: string): ATSIssue[] {
    const issues: ATSIssue[] = [];

    // Check for images/graphics
    if (resumeContent.includes('image') || resumeContent.includes('graphic')) {
      issues.push({
        type: 'critical',
        category: 'formatting',
        message: 'Images and graphics may not be readable by ATS systems'
      });
    }

    // Check for tables
    if (resumeContent.includes('<table>') || resumeContent.includes('|')) {
      issues.push({
        type: 'warning',
        category: 'formatting',
        message: 'Complex tables may cause parsing issues in ATS systems'
      });
    }

    // Check for contact info
    const hasEmail = /@/.test(resumeContent);
    const hasPhone = /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(resumeContent);
    
    if (!hasEmail) {
      issues.push({
        type: 'critical',
        category: 'content',
        message: 'Missing email address in contact information'
      });
    }

    if (!hasPhone) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: 'Missing phone number in contact information'
      });
    }

    return issues;
  }

  private calculateATSScore(
    issues: ATSIssue[], 
    keywords: KeywordAnalysis, 
    formatting: FormattingAnalysis
  ): number {
    let score = 100;

    // Deduct points for issues
    issues.forEach(issue => {
      switch (issue.type) {
        case 'critical':
          score -= 15;
          break;
        case 'warning':
          score -= 8;
          break;
        case 'suggestion':
          score -= 3;
          break;
      }
    });

    // Bonus for keyword optimization
    const keywordScore = Math.min(keywords.present.length * 2, 20);
    score += keywordScore;

    // Formatting bonus
    if (formatting.hasProperHeadings) score += 5;
    if (formatting.hasConsistentFormatting) score += 5;
    if (formatting.appropriateLength) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  private extractKeywords(text: string): string[] {
    // Extract meaningful keywords (nouns, technical terms, etc.)
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !this.isStopWord(word));

    // Remove duplicates and return
    return [...new Set(words)];
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
      'after', 'above', 'below', 'between', 'among', 'this', 'that', 'these',
      'those', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves'
    ]);
    return stopWords.has(word.toLowerCase());
  }

  private calculateKeywordDensity(text: string, keywords: string[]): { [key: string]: number } {
    const density: { [key: string]: number } = {};
    const totalWords = text.split(/\s+/).length;

    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex) || [];
      density[keyword] = (matches.length / totalWords) * 100;
    });

    return density;
  }

  private checkConsistentFormatting(text: string): boolean {
    // Check for consistent date formats
    const dateFormats = [
      /\d{1,2}\/\d{1,2}\/\d{4}/g,  // MM/DD/YYYY
      /\d{4}-\d{2}-\d{2}/g,        // YYYY-MM-DD
      /[A-Za-z]+ \d{4}/g           // Month YYYY
    ];

    const formatCounts = dateFormats.map(format => 
      (text.match(format) || []).length
    );

    // If multiple date formats are used, it's inconsistent
    const formatsUsed = formatCounts.filter(count => count > 0).length;
    return formatsUsed <= 1;
  }

  private generateRecommendations(issues: ATSIssue[], keywords: KeywordAnalysis): string[] {
    const recommendations: string[] = [];

    if (issues.some(issue => issue.category === 'formatting')) {
      recommendations.push('Use a simple, clean format with standard section headings');
    }

    if (keywords.missing.length > 0) {
      recommendations.push(`Add relevant keywords: ${keywords.missing.slice(0, 5).join(', ')}`);
    }

    if (issues.some(issue => issue.type === 'critical')) {
      recommendations.push('Address critical issues first to improve ATS compatibility');
    }

    recommendations.push('Use standard fonts like Arial, Calibri, or Times New Roman');
    recommendations.push('Save resume as both PDF and Word document formats');

    return recommendations;
  }

  private generateKeywordSuggestions(missingKeywords: string[]): string[] {
    return missingKeywords.slice(0, 8).map(keyword => 
      `Consider adding "${keyword}" to relevant sections`
    );
  }
}