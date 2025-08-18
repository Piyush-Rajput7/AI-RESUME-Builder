# 🚀 AI Resume Builder - Complete Setup Guide

This guide will walk you through setting up the AI Resume Builder from scratch.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control
- A **Supabase** account ([Sign up here](https://supabase.com/))
- An **OpenAI** account with API access ([Sign up here](https://platform.openai.com/))

## 🛠️ Quick Setup (Automated)

1. **Clone and setup the project:**

```bash
git clone <your-repo-url>
cd ai-resume-builder
npm run setup
```

2. **Configure environment variables** (see detailed steps below)

3. **Start development servers:**

```bash
npm run dev
```

## 📝 Manual Setup Steps

### 1. Install Dependencies

```bash
# Install all dependencies
npm run install:all

# Or install individually:
npm install                    # Root dependencies
cd frontend && npm install     # Frontend dependencies
cd ../backend && npm install   # Backend dependencies
```

### 2. Set Up Supabase

#### Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Choose your organization and fill in project details
4. Wait for the project to be created (2-3 minutes)

#### Get Your Supabase Credentials

1. Go to **Settings** → **API**
2. Copy your **Project URL**
3. Copy your **anon/public key** (for frontend)
4. Copy your **service_role key** (for backend)

#### Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `database/schema.sql`
3. Paste and run the SQL script
4. Verify tables are created in **Table Editor**

### 3. Set Up OpenAI

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Go to **API Keys** section
4. Click **Create new secret key**
5. Copy the API key (starts with `sk-`)

### 4. Configure Environment Variables

#### Backend Environment (.env)

Create `backend/.env` with:

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_api_key_here

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### Frontend Environment (.env)

Create `frontend/.env` with:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# API Configuration
VITE_API_URL=http://localhost:3001
```

### 5. Test the Setup

1. **Start the development servers:**

```bash
npm run dev
```

2. **Verify the services:**

   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001/health

3. **Test user registration:**

   - Go to the frontend
   - Click "Sign Up"
   - Create a test account
   - Check Supabase Auth dashboard for the new user

4. **Test AI features:**
   - Create a resume
   - Try generating a professional summary
   - Verify OpenAI API calls work

## 🔧 Troubleshooting

### Common Issues

#### "Module not found" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

#### Supabase connection errors

- Verify your Supabase URL and keys are correct
- Check if your project is paused (free tier limitation)
- Ensure RLS policies are set up correctly

#### OpenAI API errors

- Verify your API key is correct and active
- Check your OpenAI account has available credits
- Ensure you have access to GPT-4 (may require payment)

#### CORS errors

- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check Supabase project settings for allowed origins

### Environment Variable Issues

If you see "undefined" values:

1. Restart your development servers after changing `.env` files
2. Verify environment variable names match exactly (including `VITE_` prefix for frontend)
3. Check for typos in variable names

### Database Issues

If tables aren't created:

1. Re-run the SQL schema in Supabase SQL Editor
2. Check for SQL syntax errors in the console
3. Verify you have the correct permissions

## 🚀 Deployment

### Frontend (Vercel)

1. **Connect to Vercel:**

```bash
npm install -g vercel
vercel login
vercel --prod
```

2. **Set environment variables in Vercel dashboard:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (your backend URL)

### Backend (Railway)

1. **Connect to Railway:**

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

2. **Set environment variables in Railway dashboard:**
   - All variables from `backend/.env`
   - Update `FRONTEND_URL` to your Vercel URL

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 🆘 Getting Help

If you encounter issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all services (Supabase, OpenAI) are working
4. Check the GitHub issues for similar problems
5. Create a new issue with detailed error information

## 🎉 Success!

Once everything is working, you should be able to:

- ✅ Sign up and sign in users
- ✅ Create and save resumes
- ✅ Generate AI content (summaries, achievements)
- ✅ Preview and manage resumes
- ✅ Export resumes as PDF

Happy building! 🚀
