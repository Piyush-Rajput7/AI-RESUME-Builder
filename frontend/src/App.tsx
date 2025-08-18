import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HomePage } from './pages/HomePage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { DashboardPage } from './pages/DashboardPage';
import { AtsReviewPage } from './pages/AtsReviewPage';
import { AIGenerationPage } from './pages/AIGenerationPage';
import { RealTimeReviewPage } from './pages/RealTimeReviewPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { Navbar } from './components/layout/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <Navbar />
          <div className="pt-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/builder" element={<ResumeBuilderPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/ats-review" element={<AtsReviewPage />} />
              <Route path="/ai-generation" element={<AIGenerationPage />} />
              <Route path="/real-time-review" element={<RealTimeReviewPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
            </Routes>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;