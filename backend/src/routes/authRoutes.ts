import { Router } from 'express';
import { supabase } from '../index';

const router = Router();

// Sign up
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    res.status(201).json({
      message: 'User created successfully',
      user: data.user
    });
  } catch (error) {
    next(error);
  }
});

// Sign in
router.post('/signin', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    res.json({
      message: 'Signed in successfully',
      user: data.user,
      session: data.session
    });
  } catch (error) {
    next(error);
  }
});

// Sign out
router.post('/signout', async (req, res, next) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    res.json({ message: 'Signed out successfully' });
  } catch (error) {
    next(error);
  }
});

export { router as authRoutes };