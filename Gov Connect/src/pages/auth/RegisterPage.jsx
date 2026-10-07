import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, CheckCircle2, ArrowRight, ArrowLeft, User, MapPin, GraduationCap, Sliders, Sparkles, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Card, Badge } from '@/components/ui';
import { INDIAN_STATES } from '@/constants/categories';
import ROUTES from '@/constants/routes';
const WIZARD_STEPS = [
    { id: 1, title: 'Basic Info', icon: User },
    { id: 2, title: 'Demographics', icon: MapPin },
    { id: 3, title: 'Education & Skills', icon: GraduationCap },
    { id: 4, title: 'Preferences', icon: Sliders },
    { id: 5, title: 'Ready', icon: Sparkles },
];
const SKILL_SUGGESTIONS = [
    'Python', 'SQL', 'React', 'Data Analysis', 'Web Development',
    'Accounting / Tally', 'Machine Learning', 'Electrician',
    'Digital Marketing', 'Civil Drafting', 'Agriculture / Farming', 'Customer Support'
];
const SCHEME_INTERESTS = [
    'Education & Scholarships', 'Small Business & Startups (MUDRA)',
    'Affordable Housing (PMAY)', 'Healthcare (Ayushman Bharat)',
    'Agriculture & Farmer Welfare', 'Skill Development & ITI', 'Women Empowerment'
];
const JOB_INTERESTS = [
    'Staff Selection Commission (SSC)', 'Banking & Insurance (IBPS / SBI)',
    'Indian Railways (RRB)', 'Civil Services (UPSC / State PSC)',
    'Public Sector Undertakings (PSU)', 'Defence & Police Forces', 'State IT & Tech Services'
];
export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [customSkillInput, setCustomSkillInput] = useState('');
    const [formData, setFormData] = useState({
        // Step 1
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        // Step 2
        age: 21,
        gender: 'Male',
        state: 'Delhi',
        district: '',
        cityVillage: '',
        category: 'General',
        annualIncome: 250000,
        hasDisability: false,
        // Step 3
        education: 'Graduate',
        occupation: 'Student / Seeking Opportunities',
        employmentStatus: 'Student',
        skills: [],
        // Step 4
        interestedSchemes: ['Education & Scholarships'],
        interestedJobs: ['Staff Selection Commission (SSC)'],
        preferredLocation: 'All India'
    });
    const toggleSkill = (skill) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };
    const addCustomSkill = () => {
        if (customSkillInput.trim() && !formData.skills.includes(customSkillInput.trim())) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, customSkillInput.trim()] }));
            setCustomSkillInput('');
        }
    };
    const toggleSchemeInterest = (interest) => {
        setFormData(prev => ({
            ...prev,
            interestedSchemes: prev.interestedSchemes.includes(interest)
                ? prev.interestedSchemes.filter(i => i !== interest)
                : [...prev.interestedSchemes, interest]
        }));
    };
    const toggleJobInterest = (job) => {
        setFormData(prev => ({
            ...prev,
            interestedJobs: prev.interestedJobs.includes(job)
                ? prev.interestedJobs.filter(j => j !== job)
                : [...prev.interestedJobs, job]
        }));
    };
    const handleNext = () => {
        setError('');
        if (currentStep === 1) {
            if (!formData.name.trim())
                return setError('Please enter your full name.');
            if (!formData.email.trim() || !formData.email.includes('@'))
                return setError('Valid email is required.');
            if (!formData.mobile.trim() || formData.mobile.length < 10)
                return setError('Valid 10-digit mobile number is required.');
            if (formData.password.length < 6)
                return setError('Password must be at least 6 characters.');
            if (formData.password !== formData.confirmPassword)
                return setError('Passwords do not match.');
        }
        if (currentStep === 2) {
            if (!formData.state)
                return setError('Please select your state.');
            if (!formData.district)
                return setError('Please specify your district.');
        }
        if (currentStep === 3) {
            if (!formData.education)
                return setError('Please select your highest education level.');
        }
        if (currentStep < 5) {
            setCurrentStep(prev => prev + 1);
        }
    };
    const handleFinish = async () => {
        try {
            await register({
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                state: formData.state,
                district: formData.district,
                cityVillage: formData.cityVillage,
                age: Number(formData.age),
                gender: formData.gender,
                education: formData.education,
                occupation: formData.occupation,
                employmentStatus: formData.employmentStatus,
                skills: formData.skills,
                category: formData.category,
                annualIncome: Number(formData.annualIncome),
            });
            navigate(ROUTES.DASHBOARD);
        }
        catch (err) {
            setError(err.message || 'Registration failed');
        }
    };
    const statesList = Array.isArray(INDIAN_STATES) && INDIAN_STATES.length > 0
        ? INDIAN_STATES
        : ['Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh'];
    return (<div className="min-h-screen flex flex-col bg-[#F5EBE0] font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-[#D6CCC2] px-6 py-4 flex items-center justify-between">
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-[#59463B]"/>
          <span className="font-bold text-xl text-[#2D231E]">
            Gov<span className="text-[#A67C65]">Connect</span>
          </span>
        </Link>
        <div className="text-sm text-[#7D6E63]">
          Already registered?{' '}
          <Link to={ROUTES.LOGIN} className="font-semibold text-[#59463B] hover:underline">
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        
        {/* Progress Stepper Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#E3D5CA] -z-10 rounded-full"/>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#59463B] -z-10 rounded-full transition-all duration-300" style={{ width: `${((currentStep - 1) / (WIZARD_STEPS.length - 1)) * 100}%` }}/>

            {WIZARD_STEPS.map((step) => {
            const Icon = step.icon;
            const isDone = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (<div key={step.id} className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all border-2 ${isDone
                    ? 'bg-[#59463B] border-[#59463B] text-white shadow-sm'
                    : isCurrent
                        ? 'bg-white border-[#59463B] text-[#59463B] ring-4 ring-[#E3D5CA] shadow'
                        : 'bg-white border-[#D6CCC2] text-[#8C7D73]'}`}>
                    {isDone ? <CheckCircle2 className="w-5 h-5"/> : <Icon className="w-4 h-4"/>}
                  </div>
                  <span className={`text-[11px] font-medium mt-1.5 hidden sm:block ${isCurrent ? 'text-[#59463B] font-bold' : isDone ? 'text-[#43342B]' : 'text-[#8C7D73]'}`}>
                    {step.title}
                  </span>
                </div>);
        })}
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-6 sm:p-8 shadow-md">
          {error && (<div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex gap-3 items-center text-sm text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500"/>
              <span>{error}</span>
            </div>)}

          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (<div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-[#2D231E]">Basic Citizen Credentials</h2>
                <p className="text-sm text-[#7D6E63] mt-1">
                  Enter your identification details to create your secure GovConnect account.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#43342B] mb-1">
                    Full Name (as on official ID) *
                  </label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Ramesh Kumar" className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] focus:outline-none focus:ring-2 focus:ring-[#59463B] text-sm"/>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#43342B] mb-1">
                      Email Address *
                    </label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="e.g. name@example.com" className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] focus:outline-none focus:ring-2 focus:ring-[#59463B] text-sm"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#43342B] mb-1">
                      10-Digit Mobile Number *
                    </label>
                    <input type="tel" maxLength={10} required value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} placeholder="9876543210" className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] focus:outline-none focus:ring-2 focus:ring-[#59463B] text-sm"/>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#43342B] mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Min 6 characters" className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] focus:outline-none focus:ring-2 focus:ring-[#59463B] text-sm"/>
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7D73] hover:text-[#6B5E55]">
                        {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#43342B] mb-1">
                      Confirm Password *
                    </label>
                    <input type="password" required value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Re-enter password" className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] focus:outline-none focus:ring-2 focus:ring-[#59463B] text-sm"/>
                  </div>
                </div>
              </div>
            </div>)}

          {/* STEP 2: Demographics */}
          {currentStep === 2 && (<div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-[#2D231E]">Personal & Demographics</h2>
                <p className="text-sm text-[#7D6E63] mt-1">
                  Used by our AI to compute accurate welfare scheme eligibility and quotas.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#43342B] mb-1">Age *</label>
                    <input type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: Number(e.target.value) })} className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#43342B] mb-1">Gender</label>
                    <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#43342B] mb-1">Category / Quota</label>
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]">
                      <option value="General">General</option>
                      <option value="OBC">OBC (Other Backward Classes)</option>
                      <option value="SC">SC (Scheduled Caste)</option>
                      <option value="ST">ST (Scheduled Tribe)</option>
                      <option value="EWS">EWS (Economically Weaker Section)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#43342B] mb-1">State / UT *</label>
                    <select value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]">
                      {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#43342B] mb-1">District *</label>
                    <input type="text" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} placeholder="e.g. New Delhi" className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#43342B] mb-1">City / Village</label>
                    <input type="text" value={formData.cityVillage} onChange={e => setFormData({ ...formData, cityVillage: e.target.value })} placeholder="e.g. Connaught Place" className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]"/>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-sm font-semibold text-[#43342B] mb-1">Annual Household Income (₹)</label>
                    <input type="number" step={25000} value={formData.annualIncome} onChange={e => setFormData({ ...formData, annualIncome: Number(e.target.value) })} className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]"/>
                    <p className="text-[11px] text-[#8C7D73] mt-1">Helps unlock BPL, EWS and income-targeted subsidies</p>
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={formData.hasDisability} onChange={e => setFormData({ ...formData, hasDisability: e.target.checked })} className="w-4 h-4 rounded text-[#59463B]"/>
                      <span className="text-sm font-medium text-[#43342B]">Person with Disability (Divyangjan)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>)}

          {/* STEP 3: Education & Career */}
          {currentStep === 3 && (<div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-[#2D231E]">Education & Skills Profile</h2>
                <p className="text-sm text-[#7D6E63] mt-1">
                  GovConnect uses your qualification and skills to match SSC, Banking, and IT job vacancies.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#43342B] mb-1">Highest Education Level *</label>
                    <select value={formData.education} onChange={e => setFormData({ ...formData, education: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]">
                      <option value="10th Pass">10th Pass (Matriculation)</option>
                      <option value="12th Pass">12th Pass (Higher Secondary)</option>
                      <option value="Diploma / ITI">Diploma / ITI</option>
                      <option value="Graduate (B.Tech / B.Sc / B.Com / BA)">Graduate (B.Tech / B.Sc / B.Com / BA)</option>
                      <option value="MCA">Post Graduate (MCA / M.Tech / MBA)</option>
                      <option value="Doctorate (Ph.D)">Doctorate (Ph.D)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#43342B] mb-1">Employment Status</label>
                    <select value={formData.employmentStatus} onChange={e => setFormData({ ...formData, employmentStatus: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6CCC2] text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]">
                      <option value="Student">Student</option>
                      <option value="Employed (Private)">Employed (Private)</option>
                      <option value="Employed (Govt/PSU)">Employed (Govt / PSU)</option>
                      <option value="Self-Employed / Freelancer">Self-Employed / Freelancer</option>
                      <option value="Seeking Employment">Seeking Employment (Job Seeker)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#43342B] mb-2">
                    Key Skills & Competencies
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {SKILL_SUGGESTIONS.map(skill => {
                const isSelected = formData.skills.includes(skill);
                return (<button type="button" key={skill} onClick={() => toggleSkill(skill)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isSelected
                        ? 'bg-[#59463B] text-white shadow-sm'
                        : 'bg-[#EDEDE9] text-[#43342B] hover:bg-[#E3D5CA]'}`}>
                          {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                        </button>);
            })}
                  </div>

                  <div className="flex gap-2">
                    <input type="text" value={customSkillInput} onChange={e => setCustomSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') {
            e.preventDefault();
            addCustomSkill();
        } }} placeholder="Add custom skill (e.g. AutoCAD, Welding, Cloud)..." className="flex-1 px-3.5 py-2 border border-[#D6CCC2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#59463B]"/>
                    <Button type="button" variant="outline" onClick={addCustomSkill} className="text-xs">
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>)}

          {/* STEP 4: Preferences */}
          {currentStep === 4 && (<div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-[#2D231E]">Personalized Preferences</h2>
                <p className="text-sm text-[#7D6E63] mt-1">
                  Choose which scheme categories and job avenues you want prioritized on your dashboard.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#43342B] mb-2">
                    Interested Government Scheme Categories
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SCHEME_INTERESTS.map(interest => {
                const checked = formData.interestedSchemes.includes(interest);
                return (<label key={interest} className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${checked ? 'bg-[#FAF7F2] border-[#59463B] text-[#59463B]' : 'border-[#D6CCC2] hover:bg-[#FAF7F2]'}`}>
                          <input type="checkbox" checked={checked} onChange={() => toggleSchemeInterest(interest)} className="rounded text-[#59463B]"/>
                          <span>{interest}</span>
                        </label>);
            })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#43342B] mb-2">
                    Target Job & Recruitment Boards
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {JOB_INTERESTS.map(job => {
                const checked = formData.interestedJobs.includes(job);
                return (<label key={job} className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${checked ? 'bg-[#FAF7F2] border-[#8C644F] text-[#59463B]' : 'border-[#D6CCC2] hover:bg-[#FAF7F2]'}`}>
                          <input type="checkbox" checked={checked} onChange={() => toggleJobInterest(job)} className="rounded text-[#A67C65]"/>
                          <span>{job}</span>
                        </label>);
            })}
                  </div>
                </div>
              </div>
            </div>)}

          {/* STEP 5: Profile Ready Confirmation */}
          {currentStep === 5 && (<div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10"/>
              </div>

              <div>
                <Badge className="bg-green-100 text-green-800 border-green-200 mb-2">
                  Profile 100% Complete
                </Badge>
                <h2 className="text-3xl font-extrabold text-[#2D231E]">
                  Your GovConnect Profile is Ready!
                </h2>
                <p className="text-[#6B5E55] text-sm mt-2 max-w-lg mx-auto">
                  Welcome aboard, <strong className="text-[#2D231E]">{formData.name}</strong>. Your single citizen profile has been calibrated with your education in <strong className="text-[#2D231E]">{formData.education}</strong>, skills ({formData.skills.join(', ')}), and location in <strong className="text-[#2D231E]">{formData.state}</strong>.
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#D6CCC2] text-left max-w-md mx-auto text-xs space-y-2.5">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-[#7D6E63]">Citizen Name:</span>
                  <span className="font-bold text-[#2D231E]">{formData.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-[#7D6E63]">Qualification & Age:</span>
                  <span className="font-bold text-[#2D231E]">{formData.education} • {formData.age} yrs</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-[#7D6E63]">State / District:</span>
                  <span className="font-bold text-[#2D231E]">{formData.district}, {formData.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7D6E63]">Matched Opportunities:</span>
                  <span className="font-bold text-[#A67C65]">12+ Schemes & 8+ Govt Jobs</span>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleFinish} className="w-full sm:w-auto px-10 py-3.5 bg-[#59463B] hover:bg-[#2D231E] text-white font-bold text-base rounded-xl shadow-lg">
                  Enter Citizen Dashboard <ArrowRight className="w-5 h-5 ml-2 inline"/>
                </Button>
              </div>
            </div>)}

          {/* Stepper Navigation Buttons */}
          {currentStep < 5 && (<div className="flex items-center justify-between pt-6 mt-6 border-t border-[#D6CCC2]">
              {currentStep > 1 ? (<Button type="button" variant="outline" onClick={() => setCurrentStep(prev => prev - 1)} className="gap-1.5">
                  <ArrowLeft className="w-4 h-4"/> Back
                </Button>) : (<div />)}

              <Button type="button" onClick={handleNext} className="bg-[#59463B] hover:bg-[#2D231E] text-white gap-2 px-6">
                Continue <ArrowRight className="w-4 h-4"/>
              </Button>
            </div>)}
        </Card>
      </main>
    </div>);
}
