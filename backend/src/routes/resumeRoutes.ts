import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

// Validation schema for resume
const resumeSchema = Joi.object({
  title: Joi.string().required(),
  personalInfo: Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    location: Joi.string().required(),
    linkedin: Joi.string().optional(),
    portfolio: Joi.string().optional()
  }).required(),
  professionalSummary: Joi.string().allow(''),
  workExperience: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    company: Joi.string().required(),
    position: Joi.string().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().allow(''),
    current: Joi.boolean().required(),
    description: Joi.string().allow(''),
    achievements: Joi.array().items(Joi.string())
  })),
  education: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    institution: Joi.string().required(),
    degree: Joi.string().required(),
    field: Joi.string().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    gpa: Joi.string().optional()
  })),
  skills: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Expert').required(),
    category: Joi.string().valid('Technical', 'Soft', 'Language', 'Certification').required()
  })),
  projects: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    technologies: Joi.array().items(Joi.string()),
    url: Joi.string().optional(),
    github: Joi.string().optional()
  })),
  templateId: Joi.string().required()
});

// Create resume
router.post('/create', 
  authenticateUser,
  validateRequest(resumeSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const resumeData = {
        ...req.body,
        user_id: req.user!.id,
        content: req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('resumes')
        .insert([resumeData])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }
);

// Get user's resumes
router.get('/user/:userId', 
  authenticateUser,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { userId } = req.params;
      
      // Ensure user can only access their own resumes
      if (userId !== req.user!.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

// Get specific resume
router.get('/:id', 
  authenticateUser,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .eq('user_id', req.user!.id)
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({ error: 'Resume not found' });
      }

      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

// Update resume
router.put('/:id', 
  authenticateUser,
  validateRequest(resumeSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      
      const updateData = {
        ...req.body,
        content: req.body,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('resumes')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', req.user!.id)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({ error: 'Resume not found' });
      }

      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

// Delete resume
router.delete('/:id', 
  authenticateUser,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)
        .eq('user_id', req.user!.id);

      if (error) throw error;

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export { router as resumeRoutes };