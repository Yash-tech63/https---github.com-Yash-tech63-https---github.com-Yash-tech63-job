import React, { useState, useEffect } from 'react';
import { candidateService } from '../../services/candidateService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { SkillsInput } from '../../components/candidate/SkillsInput';
import { ResumeUploadCard } from '../../components/candidate/ResumeUploadCard';
import { ProfileCompletionRing } from '../../components/candidate/ProfileCompletionRing';
import {
  User,
  GraduationCap,
  Briefcase,
  Compass,
  FileText,
  Plus,
  Trash2
} from 'lucide-react';

export const CandidateProfile = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [completeness, setCompleteness] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [education, setEducation] = useState([{ college: '', degree: '', gradYear: '' }]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([{ title: '', company: '', duration: '', description: '' }]);
  const [preferences, setPreferences] = useState({ preferredRole: '', location: '' });
  const [links, setLinks] = useState({ linkedin: '', github: '', portfolio: '' });
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeOriginalName, setResumeOriginalName] = useState('');
  const [resumeSize, setResumeSize] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await candidateService.getProfile();
      if (res && res.data) {
        const p = res.data.profile;
        setProfile(p);
        setCompleteness(res.data.completeness || 0);

        setName(p.name || '');
        setHeadline(p.headline || '');
        setEducation(p.education?.length ? p.education : [{ college: '', degree: '', gradYear: '' }]);
        setSkills(p.skills || []);
        setExperience(p.experience?.length ? p.experience : [{ title: '', company: '', duration: '', description: '' }]);
        setPreferences(p.preferences || { preferredRole: '', location: '' });
        setLinks(p.links || { linkedin: '', github: '', portfolio: '' });
        setResumeUrl(p.resumeUrl || '');
        setResumeOriginalName(p.resumeOriginalName || '');
        setResumeSize(p.resumeSize || 0);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setToast({ message: 'Failed to load candidate profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name,
        headline,
        education: education.filter((e) => e.college || e.degree),
        skills,
        experience: experience.filter((e) => e.title || e.company),
        preferences,
        links
      };

      const res = await candidateService.updateProfile(payload);
      if (res?.data) {
        setProfile(res.data.profile);
        setCompleteness(res.data.completeness);
        await refreshUser();
        setToast({ message: 'Candidate profile saved successfully!', type: 'success' });
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || err.message || 'Error saving profile',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (file, onProgress) => {
    const res = await candidateService.uploadResume(file, onProgress);
    if (res?.data) {
      setResumeUrl(res.data.resumeUrl);
      setResumeOriginalName(file.name);
      setResumeSize(file.size);
      setCompleteness(res.data.completeness);
      await refreshUser();
      setToast({ message: 'Resume uploaded and linked to profile!', type: 'success' });
    }
  };

  const handleResumeDelete = async () => {
    const res = await candidateService.deleteResume();
    if (res?.data) {
      setResumeUrl('');
      setResumeOriginalName('');
      setResumeSize(0);
      setCompleteness(res.data.completeness);
      await refreshUser();
      setToast({ message: 'Resume removed from profile.', type: 'success' });
    }
  };

  const addEducation = () => {
    setEducation([...education, { college: '', degree: '', gradYear: '' }]);
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, idx) => idx !== index));
  };

  const addExperience = () => {
    setExperience([...experience, { title: '', company: '', duration: '', description: '' }]);
  };

  const removeExperience = (index) => {
    setExperience(experience.filter((_, idx) => idx !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-[#666666]">
        Loading candidate profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Sections */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202124] tracking-tight">Candidate Profile</h1>
              <p className="text-xs text-[#666666] mt-1">
                Complete your profile to unlock verified recruiter recommendations and direct 1-click applications.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* 1. Personal Section */}
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 border-b border-[#E9E6DF] pb-3.5">
                  <User className="w-5 h-5 text-[#C6A15B]" />
                  <h3 className="text-sm font-bold text-[#202124] uppercase tracking-wider">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Chen"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] transition-colors outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. CS Junior @ Stanford | Full-Stack & Systems"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] transition-colors outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Education Section */}
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E9E6DF] pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-5 h-5 text-[#C6A15B]" />
                    <h3 className="text-sm font-bold text-[#202124] uppercase tracking-wider">Education</h3>
                  </div>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="text-xs text-[#C6A15B] hover:text-[#A98443] flex items-center gap-1 font-semibold cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add School
                  </button>
                </div>

                {education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] space-y-3 relative"
                  >
                    {education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(idx)}
                        className="absolute top-3 right-3 text-[#666666] hover:text-[#202124] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-[#202124] mb-1">
                          College / University
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Stanford University"
                          value={edu.college}
                          onChange={(e) => {
                            const updated = [...education];
                            updated[idx].college = e.target.value;
                            setEducation(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:border-[#C6A15B] transition-colors outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#202124] mb-1">
                          Graduation Year
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 2025"
                          value={edu.gradYear}
                          onChange={(e) => {
                            const updated = [...education];
                            updated[idx].gradYear = e.target.value;
                            setEducation(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:border-[#C6A15B] transition-colors outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#202124] mb-1">
                        Degree / Major
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. B.S. in Computer Science"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...education];
                          updated[idx].degree = e.target.value;
                          setEducation(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:border-[#C6A15B] transition-colors outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 3. Skills Section */}
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 border-b border-[#E9E6DF] pb-3.5">
                  <Briefcase className="w-5 h-5 text-[#C6A15B]" />
                  <h3 className="text-sm font-bold text-[#202124] uppercase tracking-wider">Technical Skills</h3>
                </div>
                <SkillsInput skills={skills} onChange={setSkills} />
              </div>

              {/* 4. Experience Section */}
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E9E6DF] pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-5 h-5 text-[#C6A15B]" />
                    <h3 className="text-sm font-bold text-[#202124] uppercase tracking-wider">Experience & Projects</h3>
                  </div>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="text-xs text-[#C6A15B] hover:text-[#A98443] flex items-center gap-1 font-semibold cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Experience
                  </button>
                </div>

                {experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] space-y-3 relative"
                  >
                    {experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(idx)}
                        className="absolute top-3 right-3 text-[#666666] hover:text-[#202124] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#202124] mb-1">
                          Role / Title
                        </label>
                        <input
                          type="text"
                          placeholder="Software Engineering Intern"
                          value={exp.title}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[idx].title = e.target.value;
                            setExperience(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:border-[#C6A15B] transition-colors outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#202124] mb-1">
                          Company / Project Name
                        </label>
                        <input
                          type="text"
                          placeholder="Acme Cloud"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[idx].company = e.target.value;
                            setExperience(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:border-[#C6A15B] transition-colors outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#202124] mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          placeholder="Summer 2024"
                          value={exp.duration}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[idx].duration = e.target.value;
                            setExperience(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:border-[#C6A15B] transition-colors outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#202124] mb-1">
                        Key Highlights & Impact
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Built real-time telemetry dashboards in React & Node.js..."
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[idx].description = e.target.value;
                          setExperience(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:border-[#C6A15B] transition-colors outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 5. Preferences & Links */}
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 border-b border-[#E9E6DF] pb-3.5">
                  <Compass className="w-5 h-5 text-[#C6A15B]" />
                  <h3 className="text-sm font-bold text-[#202124] uppercase tracking-wider">Preferences & Links</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                      Preferred Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Frontend Intern or Full Stack"
                      value={preferences.preferredRole}
                      onChange={(e) =>
                        setPreferences({ ...preferences, preferredRole: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] transition-colors outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                      Preferred Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Remote or New York"
                      value={preferences.location}
                      onChange={(e) =>
                        setPreferences({ ...preferences, location: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] transition-colors outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#202124] mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={links.linkedin}
                      onChange={(e) => setLinks({ ...links, linkedin: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] transition-colors outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#202124] mb-1">
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={links.github}
                      onChange={(e) => setLinks({ ...links, github: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] transition-colors outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#202124] mb-1">
                      Portfolio / Website
                    </label>
                    <input
                      type="url"
                      placeholder="https://portfolio.dev"
                      value={links.portfolio}
                      onChange={(e) => setLinks({ ...links, portfolio: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] transition-colors outline-none"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full font-bold" isLoading={saving}>
                Save Profile Updates
              </Button>
            </form>
          </div>

          {/* Right Column: Profile Ring & Resume Upload */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Progress Ring Card */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-sm text-center">
              <h3 className="text-sm font-bold text-[#202124] uppercase tracking-wider mb-4">Profile Completeness</h3>
              <ProfileCompletionRing score={completeness} />
              <p className="text-[11px] text-[#666666] mt-4 leading-relaxed">
                Completing your education, skills, and uploading a resume gets you verified by recruiters.
              </p>
            </div>

            {/* Resume Upload Card */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-sm">
              <h3 className="text-sm font-bold text-[#202124] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C6A15B]" />
                Verified Resume
              </h3>
              <ResumeUploadCard
                currentResumeUrl={resumeUrl}
                resumeOriginalName={resumeOriginalName}
                resumeSize={resumeSize}
                onUploadSuccess={handleResumeUpload}
                onDeleteSuccess={handleResumeDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
