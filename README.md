# AI Resume Builder

A modern, AI-powered resume creation and review platform with glassmorphism UI design. Build ATS-friendly resumes in minutes with intelligent content generation and professional templates.

## 🚀 Features

- **AI-Powered Content Generation**: Generate professional summaries, achievements, and optimize content with OpenAI GPT-4
- **ATS Optimization**: Ensure your resume passes Applicant Tracking Systems with intelligent formatting and keyword optimization
- **Glassmorphism UI**: Modern, beautiful interface with frosted glass effects and smooth animations
- **Multiple Templates**: Industry-specific templates designed by HR professionals
- **Real-time Preview**: See your resume as you build it with instant updates
- **Resume Review**: Get intelligent feedback and suggestions for improvement
- **PDF Export**: Download professional PDF versions of your resumes

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Zustand** for state management
- **React Hook Form** for form handling

### Backend

- **Node.js** with Express.js
- **TypeScript** for type safety
- **Supabase** for database and authentication
- **OpenAI API** for AI content generation
- **Stripe** for payment processing
- **JWT** for authentication

### Database

- **PostgreSQL** (via Supabase)
- **Supabase Auth** for user management
- **Supabase Storage** for file uploads

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/yourusername/ai-resume-builder.git
cd ai-resume-builder
\`\`\`

### 2. Install dependencies

\`\`\`bash

# Install root dependencies

npm install

# Install frontend dependencies

cd frontend && npm install

# Install backend dependencies

cd ../backend && npm install
\`\`\`

### 3. Set up environment variables

#### Backend (.env)

\`\`\`bash
cp backend/.env.example backend/.env
\`\`\`

Fill in your environment variables:

- Supabase URL and service key
- OpenAI API key
- Stripe keys (optional)
- JWT secret

#### Frontend (.env)

\`\`\`bash
cp frontend/.env.example frontend/.env
\`\`\`

Fill in your frontend environment variables:

- Supabase URL and anon key
- Stripe public key (optional)

### 4. Set up Supabase Database

Run the following SQL in your Supabase SQL editor:

\`\`\`sql
-- Users table (handled by Supabase Auth)

-- Resumes table
CREATE TABLE resumes (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
title TEXT NOT NULL,
content JSONB NOT NULL,
template_id TEXT DEFAULT 'modern-professional',
ats_score INTEGER,
last_reviewed TIMESTAMP,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);

-- Resume reviews table
CREATE TABLE resume_reviews (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
overall_score INTEGER,
ats_issues JSONB,
keywords_analysis JSONB,
recommendations JSONB,
created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own resumes" ON resumes
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" ON resumes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON resumes
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON resumes
FOR DELETE USING (auth.uid() = user_id);
\`\`\`

### 5. Start the development servers

\`\`\`bash

# Start both frontend and backend

npm run dev

# Or start them separately:

# Backend (from root directory)

npm run dev:backend

# Frontend (from root directory)

npm run dev:frontend
\`\`\`

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 🎨 Glassmorphism Design System

The application uses a custom glassmorphism design system with:

- **Glass Cards**: Translucent containers with backdrop blur
- **Glass Buttons**: Interactive buttons with hover effects
- **Glass Inputs**: Form inputs with floating labels
- **Smooth Animations**: Framer Motion powered transitions
- **Gradient Backgrounds**: Beautiful color gradients
- **Responsive Design**: Mobile-first approach

## 🤖 AI Features

### Content Generation

- Professional summaries based on job title and experience
- Achievement bullets with quantified results
- Skills suggestions based on work experience
- Job description analysis and keyword extraction

### ATS Optimization

- Keyword density analysis
- Formatting compliance checks
- Content structure validation
- Industry-specific optimization

## 📱 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Resumes

- `GET /api/resumes/user/:userId` - Get user's resumes
- `POST /api/resumes/create` - Create new resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### AI Services

- `POST /api/ai/generate-summary` - Generate professional summary
- `POST /api/ai/generate-achievements` - Generate achievement bullets
- `POST /api/ai/suggest-skills` - Suggest relevant skills
- `POST /api/ai/optimize-ats` - Optimize for ATS compatibility

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway)

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📞 Support

For support, email support@airesume.com or join our Discord community.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Supabase for backend infrastructure
- Tailwind CSS for styling system
- Framer Motion for animations
