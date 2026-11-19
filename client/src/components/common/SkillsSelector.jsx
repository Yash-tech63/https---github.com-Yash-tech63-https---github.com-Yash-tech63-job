import React, { useState, useMemo } from 'react';
import { Search, X, Check, Plus, Layers } from 'lucide-react';
import { Button } from './Button';

export const SKILL_CATEGORIES = {
  Frontend: [
    'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'JavaScript', 'TypeScript',
    'HTML5', 'CSS3', 'Tailwind CSS', 'Redux', 'Vite', 'Webpack'
  ],
  Backend: [
    'Node.js', 'Express.js', 'NestJS', 'Python', 'Django', 'FastAPI', 'Java',
    'Spring Boot', 'Go (Golang)', 'Rust', 'PHP', 'Laravel', 'C#', '.NET Core'
  ],
  'Full Stack': [
    'MERN Stack', 'MEAN Stack', 'Full Stack JavaScript', 'Full Stack Python', 'LAMP Stack', 'JAMstack'
  ],
  Database: [
    'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Prisma ORM', 'Elasticsearch',
    'DynamoDB', 'Supabase', 'Firebase', 'SQLite', 'Cassandra'
  ],
  DevOps: [
    'Docker', 'Kubernetes', 'CI/CD Pipelines', 'GitHub Actions', 'Terraform',
    'Ansible', 'Jenkins', 'Linux', 'Nginx', 'Prometheus', 'Grafana'
  ],
  Cloud: [
    'Amazon Web Services (AWS)', 'Google Cloud (GCP)', 'Microsoft Azure',
    'Cloudflare', 'Serverless Architecture', 'AWS Lambda', 'AWS S3'
  ],
  'AI/ML': [
    'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Scikit-Learn',
    'Large Language Models (LLM)', 'LangChain', 'OpenCV', 'Hugging Face', 'NLP'
  ],
  'Data Science': [
    'Data Analytics', 'Pandas', 'NumPy', 'SQL', 'Apache Spark', 'Power BI',
    'Tableau', 'Data Visualization', 'Statistics', 'ETL Pipelines'
  ],
  Cybersecurity: [
    'Network Security', 'Penetration Testing', 'Ethical Hacking', 'OWASP Top 10',
    'Cryptography', 'Security Operations (SOC)', 'Identity & Access Management (IAM)'
  ],
  'UI/UX': [
    'Figma', 'User Research', 'Prototyping', 'Wireframing', 'Design Systems',
    'Adobe XD', 'Interaction Design', 'Usability Testing'
  ],
  'Testing and QA': [
    'Jest', 'Cypress', 'Playwright', 'Selenium', 'Unit Testing', 'End-to-End Testing',
    'Automation Testing', 'Postman API Testing'
  ],
  Marketing: [
    'SEO & Content Strategy', 'Performance Marketing', 'Growth Hacking', 'Google Analytics 4',
    'Social Media Marketing', 'Email Marketing Campaigns', 'Copywriting'
  ],
  Finance: [
    'Financial Modeling', 'Corporate Valuation', 'Excel & VBA', 'Accounting Principles',
    'Budgeting & Forecasting', 'Risk Assessment'
  ],
  HR: [
    'Technical Recruitment', 'Talent Sourcing', 'Candidate Interviewing',
    'HR Operations', 'Employee Onboarding', 'Performance Appraisal'
  ]
};

export const SkillsSelector = ({
  isOpen,
  onClose,
  selectedSkills = [],
  onChange,
  maxSkills = 20
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [customInput, setCustomInput] = useState('');

  const categoriesList = ['All', ...Object.keys(SKILL_CATEGORIES)];

  const filteredSkills = useMemo(() => {
    let pool = [];
    if (activeCategory === 'All') {
      Object.entries(SKILL_CATEGORIES).forEach(([cat, list]) => {
        pool.push(...list.map((skill) => ({ name: skill, category: cat })));
      });
    } else {
      const list = SKILL_CATEGORIES[activeCategory] || [];
      pool = list.map((skill) => ({ name: skill, category: activeCategory }));
    }

    if (!searchTerm.trim()) {
      return pool;
    }

    const term = searchTerm.toLowerCase();
    return pool.filter((s) => s.name.toLowerCase().includes(term));
  }, [searchTerm, activeCategory]);

  const handleToggleSkill = (skillName) => {
    const exists = selectedSkills.some(
      (s) => s.toLowerCase() === skillName.toLowerCase()
    );

    if (exists) {
      onChange(selectedSkills.filter((s) => s.toLowerCase() !== skillName.toLowerCase()));
    } else {
      if (selectedSkills.length >= maxSkills) {
        alert(`You can select a maximum of ${maxSkills} skills.`);
        return;
      }
      onChange([...selectedSkills, skillName]);
    }
  };

  const handleAddCustom = (e) => {
    e?.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;

    const exists = selectedSkills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
      alert('This skill is already in your selected list.');
      return;
    }

    if (selectedSkills.length >= maxSkills) {
      alert(`You can select a maximum of ${maxSkills} skills.`);
      return;
    }

    onChange([...selectedSkills, trimmed]);
    setCustomInput('');
  };

  const handleRemoveChip = (skillName) => {
    onChange(selectedSkills.filter((s) => s !== skillName));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202124]/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-2xl p-6 bg-[#FFFFFF] border border-[#E9E6DF] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-[#202124]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E6DF]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF] flex items-center justify-center text-[#C6A15B]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#202124]">Select Skills</h3>
              <p className="text-[11px] text-[#666666]">
                Choose skills across domains or add custom technical tags
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[#666666] hover:text-[#202124] hover:bg-[#FAF9F6] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Skills Chips Area */}
        <div className="py-2.5 border-b border-[#E9E6DF] min-h-[44px] max-h-24 overflow-y-auto">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[#666666]">
              Selected ({selectedSkills.length} / {maxSkills})
            </span>
            {selectedSkills.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-[11px] text-[#C6A15B] hover:underline cursor-pointer font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {selectedSkills.length === 0 ? (
            <p className="text-xs text-[#666666] italic">No skills selected yet.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {selectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#202124] text-[#FAF9F6]"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChip(skill)}
                    className="hover:text-[#C6A15B] transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar & Custom Input */}
        <div className="py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="relative sm:col-span-7">
            <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder-[#666666] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <form onSubmit={handleAddCustom} className="flex sm:col-span-5 gap-1.5">
            <input
              type="text"
              placeholder="Custom skill..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E9E6DF] text-xs text-[#202124] placeholder-[#666666] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#C6A15B]"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={Plus}
              disabled={!customInput.trim()}
            >
              Add
            </Button>
          </form>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-1.5 border-b border-[#E9E6DF] scrollbar-none">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#202124] text-[#FAF9F6]'
                  : 'text-[#666666] hover:text-[#202124] hover:bg-[#FAF9F6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="flex-1 overflow-y-auto py-3 pr-1">
          <div className="flex flex-wrap gap-1.5">
            {filteredSkills.map((s, idx) => {
              const isSelected = selectedSkills.some(
                (sel) => sel.toLowerCase() === s.name.toLowerCase()
              );

              return (
                <button
                  key={`${s.name}-${idx}`}
                  type="button"
                  onClick={() => handleToggleSkill(s.name)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-[#202124] border-[#C6A15B] text-[#C6A15B]'
                      : 'bg-[#FAF9F6] border-[#E9E6DF] text-[#202124] hover:border-[#C6A15B]'
                  }`}
                >
                  {isSelected ? (
                    <Check className="w-3 h-3 text-[#C6A15B]" />
                  ) : (
                    <Plus className="w-3 h-3 text-[#666666]" />
                  )}
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>

          {filteredSkills.length === 0 && (
            <div className="text-center py-6 text-xs text-[#666666]">
              No skills found. Use the field above to add a custom skill.
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-[#E9E6DF] flex items-center justify-between">
          <span className="text-xs text-[#666666]">
            {selectedSkills.length} selected
          </span>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SkillsSelector;
