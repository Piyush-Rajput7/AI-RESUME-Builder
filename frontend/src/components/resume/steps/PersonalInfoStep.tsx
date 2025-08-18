import React from 'react';
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { GlassInput } from '../../ui/GlassInput';
import { Resume } from '../../../types/resume';

interface PersonalInfoStepProps {
  data: Partial<Resume>;
  onChange: (section: string, data: any) => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  data,
  onChange
}) => {
  const personalInfo = data.personalInfo || {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: ''
  };

  const updateField = (field: string, value: string) => {
    onChange('personalInfo', {
      ...personalInfo,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassInput
          label="Full Name"
          value={personalInfo.fullName}
          onChange={(value) => updateField('fullName', value)}
          icon={<User />}
          required
        />
        
        <GlassInput
          label="Email Address"
          type="email"
          value={personalInfo.email}
          onChange={(value) => updateField('email', value)}
          icon={<Mail />}
          required
        />
        
        <GlassInput
          label="Phone Number"
          type="tel"
          value={personalInfo.phone}
          onChange={(value) => updateField('phone', value)}
          icon={<Phone />}
          required
        />
        
        <GlassInput
          label="Location"
          value={personalInfo.location}
          onChange={(value) => updateField('location', value)}
          icon={<MapPin />}
          placeholder="City, State"
          required
        />
        
        <GlassInput
          label="LinkedIn Profile"
          value={personalInfo.linkedin || ''}
          onChange={(value) => updateField('linkedin', value)}
          icon={<Linkedin />}
          placeholder="https://linkedin.com/in/yourprofile"
        />
        
        <GlassInput
          label="Portfolio/Website"
          value={personalInfo.portfolio || ''}
          onChange={(value) => updateField('portfolio', value)}
          icon={<Globe />}
          placeholder="https://yourportfolio.com"
        />
      </div>
      
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
        <h3 className="text-white font-medium mb-2">💡 Pro Tips</h3>
        <ul className="text-white/80 text-sm space-y-1">
          <li>• Use a professional email address</li>
          <li>• Include your city and state for location targeting</li>
          <li>• LinkedIn profile should be complete and professional</li>
          <li>• Portfolio URL should showcase your best work</li>
        </ul>
      </div>
    </div>
  );
};