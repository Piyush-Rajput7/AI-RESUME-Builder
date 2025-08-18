import { Router } from 'express';
import { AIService } from '../services/aiService';
import { authenticateUser } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import Joi from 'joi';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { supabase } from '../app';

const router = Router();
const aiService = new AIService();
const upload = multer();

// Validation schemas
const generateSummarySchema = Joi.object({
  jobTitle: Joi.string().required(),
  experience: Joi.string().required(),
  skills: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Expert'),
    category: Joi.string().valid('Technical', 'Soft', 'Language', 'Certification')
  })).default([]),
  workExperience: Joi.array().items(Joi.object({
    position: Joi.string().required(),
    company: Joi.string().required(),
    description: Joi.string().required()
  })).default([])
});

const generateAchievementsSchema = Joi.object({
  position: Joi.string().required(),
  company: Joi.string().required(),
  description: Joi.string().required()
});

const optimizeATSSchema = Joi.object({
  resumeContent: Joi.string().required(),
  jobDescription: Joi.string().required()
});

const suggestSkillsSchema = Joi.object({
  workExperience: Joi.array().items(Joi.object({
    position: Joi.string().required(),
    company: Joi.string().required(),
    description: Joi.string().required()
  })).required(),
  targetRole: Joi.string().required()
});

const atsReviewSchema = Joi.object({
  resume: Joi.object({}).required(),
  targetRole: Joi.string().required(),
  jobDescription: Joi.string().allow('').optional()
});

// Generate professional summary
router.post('/generate-summary', 
  authenticateUser,
  validateRequest(generateSummarySchema),
  async (req, res, next) => {
    try {
      const summary = await aiService.generateProfessionalSummary(req.body);
      res.json({ summary });
    } catch (error) {
      next(error);
    }
  }
);

// Generate achievements
router.post('/generate-achievements',
  authenticateUser,
  validateRequest(generateAchievementsSchema),
  async (req, res, next) => {
    try {
      const achievements = await aiService.generateAchievements(req.body);
      res.json({ achievements });
    } catch (error) {
      next(error);
    }
  }
);

// Optimize for ATS
router.post('/optimize-ats',
  authenticateUser,
  validateRequest(optimizeATSSchema),
  async (req, res, next) => {
    try {
      const result = await aiService.optimizeForATS(
        req.body.resumeContent,
        req.body.jobDescription
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Suggest skills
router.post('/suggest-skills',
  authenticateUser,
  validateRequest(suggestSkillsSchema),
  async (req, res, next) => {
    try {
      const suggestions = await aiService.suggestSkills(req.body);
      res.json({ suggestions });
    } catch (error) {
      next(error);
    }
  }
);

// Analyze job description
router.post('/analyze-job',
  authenticateUser,
  async (req, res, next) => {
    try {
      const { jobDescription } = req.body;
      if (!jobDescription) {
        return res.status(400).json({ error: 'Job description is required' });
      }

      const analysis = await aiService.analyzeJobDescription(jobDescription);
      res.json(analysis);
    } catch (error) {
      next(error);
    }
  }
);

// ATS Review for specific role
router.post('/ats-review',
  authenticateUser,
  validateRequest(atsReviewSchema),
  async (req, res, next) => {
    try {
      const result = await aiService.reviewResumeForRole({
        resume: req.body.resume,
        targetRole: req.body.targetRole,
        jobDescription: req.body.jobDescription,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ATS Review via PDF upload (multipart/form-data)
router.post('/ats-review-upload',
  authenticateUser,
  upload.single('file'),
  async (req, res, next) => {
    try {
      const { targetRole, jobDescription } = req.body as { targetRole?: string; jobDescription?: string };
      if (!targetRole) {
        return res.status(400).json({ error: 'targetRole is required' });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'file (PDF) is required' });
      }

      const parsed = await pdfParse(req.file.buffer);
      const text = parsed.text || '';
      const resume = {
        title: 'Uploaded Resume',
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          location: ''
        },
        professionalSummary: text.slice(0, 5000),
        workExperience: [],
        education: [],
        skills: [],
        projects: [],
        templateId: 'modern-professional'
      } as any;

      const result = await aiService.reviewResumeForRole({
        resume,
        targetRole,
        jobDescription
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// List resume templates from DB
router.get('/templates', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('resume_templates')
      .select('*')
      .order('name');
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    next(error);
  }
});

export { router as aiRoutes };