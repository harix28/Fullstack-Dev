import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, GraduationCap, 
  Briefcase, Award, Shield, CheckCircle2, Save, Sparkles 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Button, Card, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { INDIAN_STATES } from '@/constants/categories';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || 'Citizen User',
    email: user?.email || '',
    mobile: user?.phone || user?.mobile || '',
    age: user?.age || 24,
    gender: user?.gender || 'Male',
    state: user?.state || 'Delhi',
    district: user?.district || '',
    cityVillage: user?.cityVillage || '',
    education: user?.education || 'Graduate',
    occupation: user?.occupation || 'Citizen',
    employmentStatus: user?.employmentStatus || 'Employed / Self-Employed',
    annualIncome: user?.annualIncome || 300000,
    category: user?.category || 'General',
    skills: user?.skills || ['Digital Literacy'],
    hasDisability: user?.hasDisability || false
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || 'Citizen User',
        email: user.email || '',
        mobile: user.phone || user.mobile || '',
        age: user.age || 24,
        gender: user.gender || 'Male',
        state: user.state || 'Delhi',
        district: user.district || '',
        cityVillage: user.cityVillage || '',
        education: user.education || 'Graduate',
        occupation: user.occupation || 'Citizen',
        employmentStatus: user.employmentStatus || 'Employed / Self-Employed',
        annualIncome: user.annualIncome || 300000,
        category: user.category || 'General',
        skills: user.skills || ['Digital Literacy'],
        hasDisability: user.hasDisability || false
      });
    }
  }, [user]);

  const [isEditing, setIsEditing] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleSave = () => {
    updateProfile({
      ...formData,
      age: Number(formData.age),
      annualIncome: Number(formData.annualIncome)
    });
    setIsEditing(false);
    showToast({
      title: 'Profile Updated',
      description: 'Your citizen credentials have been saved and applied across scheme recommendations.',
      variant: 'success'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0f1740] dark:text-white">
            Citizen Profile Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            GovConnect uses this single verified profile to drive all scheme and job matching.
          </p>
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} className="bg-[#1a2f8a] hover:bg-[#0f1740] text-white gap-1.5">
              <Save className="w-4 h-4" /> Save Profile
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="bg-[#1a2f8a] hover:bg-[#0f1740] text-white">
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar Profile Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0f1740] to-[#1a2f8a] text-white text-3xl font-bold flex items-center justify-center shadow-lg mb-4">
              {formData.name.slice(0, 2).toUpperCase()}
            </div>

            <h2 className="text-xl font-bold text-[#0f1740] dark:text-white">
              {formData.name}
            </h2>
            <p className="text-xs text-slate-500 mb-1">{formData.email}</p>
            <Badge className="bg-teal-50 text-teal-800 border-teal-200 text-xs mb-4">
              {formData.education} • {formData.occupation}
            </Badge>

            {/* Profile Completion Meter */}
            <div className="w-full bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Profile Completion</span>
                <span className="font-bold text-[#0d9488]">100%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-[#0d9488] h-full rounded-full" style={{ width: '100%' }} />
              </div>
              <p className="text-[11px] text-slate-400">
                Full eligibility parameters active for automated recommendation filtering.
              </p>
            </div>

            <div className="w-full pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-left space-y-2 text-slate-600 dark:text-slate-300">
              <p className="flex items-center justify-between">
                <span className="text-slate-400">Citizen Age:</span>
                <strong>{formData.age} yrs</strong>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-400">Domicile:</span>
                <strong>{formData.district}, {formData.state}</strong>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-400">Category / Quota:</span>
                <strong>{formData.category}</strong>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-400">Disability Status:</span>
                <strong>{formData.hasDisability ? 'Yes (Divyangjan)' : 'None'}</strong>
              </p>
            </div>
          </Card>
        </div>

        {/* Right Form Tabs */}
        <div className="lg:col-span-8">
          <Card className="p-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="mb-6 flex flex-wrap gap-1">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="education">Education & Career</TabsTrigger>
                <TabsTrigger value="skills">Skills & Tags</TabsTrigger>
                <TabsTrigger value="socio">Socio-Economic</TabsTrigger>
              </TabsList>

              {/* Tab 1: Personal Info */}
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 border rounded-lg text-xs bg-slate-50 disabled:opacity-75 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 border rounded-lg text-xs bg-slate-50 disabled:opacity-75 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      disabled={!isEditing}
                      value={formData.mobile}
                      onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full p-2.5 border rounded-lg text-xs bg-slate-50 disabled:opacity-75 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Age</label>
                    <input
                      type="number"
                      disabled={!isEditing}
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full p-2.5 border rounded-lg text-xs bg-slate-50 disabled:opacity-75 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">State / UT</label>
                    <select
                      disabled={!isEditing}
                      value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                      className="w-full p-2.5 border rounded-lg text-xs bg-slate-50 disabled:opacity-75 dark:bg-slate-800"
                    >
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">District</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.district}
                      onChange={e => setFormData({ ...formData, district: e.target.value })}
                      className="w-full p-2.5 border rounded-lg text-xs bg-slate-50 disabled:opacity-75 dark:bg-slate-800"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: Education & Career */}
              <TabsContent value="education" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Highest Education Level</label>
                    <select
                      disabled={!isEditing}
                      value={formData.education}
                      onChange={e => setFormData({ ...formData, education: e.target.value })}
                      className="w-full p-2.5 border rounded-lg text-xs bg-slate-50 disabled:opacity-75 dark:bg-slate-800"
                    >
                      <option value="10th Pass">10th Pass</option>
                      <option value="12th Pass">12th Pass</option>
                      <option value="Diploma">Diploma / ITI</option>
                      <option value="Graduate">Graduate (B.Tech / B.Sc / BA / B.Com)</option>
                      <option value="MCA">Post Graduate (MCA / M.Tech / MBA)</option>
                      <option value="Doctorate">Doctorate (Ph.D)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Occupation</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.occupation}
                      onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                      className="w-full p-2.5 border rounded-lg text-xs bg-slate-50 disabled:opacity-75 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Employment Status</label>
                    <select
                      disabled={!isEditing}
                      value={formData.employmentStatus}
                      onChange={e => setFormData({ ...formData, employmentStatus: e.target.value })}
                      className="w-full p-2.5 border rounded-lg text-xs bg-slate-50 disabled:opacity-75 dark:bg-slate-800"
                    >
                      <option value="Student">Student</option>
                      <option value="Employed (Private)">Employed (Private)</option>
                      <option value="Employed (Govt)">Employed (Govt)</option>
                      <option value="Self-Employed">Self-Employed / Entrepreneur</option>
                      <option value="Unemployed">Job Seeker</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              {/* Tab 3: Skills */}
              <TabsContent value="skills" className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Current Skills for Job Matching:
                  </label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.skills.map(skill => (
                      <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-800 text-xs rounded-lg font-medium border border-teal-200">
                        {skill}
                        {isEditing && (
                          <button onClick={() => handleRemoveSkill(skill)} className="text-red-500 font-bold ml-1">×</button>
                        )}
                      </span>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="flex gap-2 max-w-sm">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        placeholder="Add skill (e.g. Cloud, Docker, Accounting)..."
                        className="flex-1 p-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a2f8a]"
                      />
                      <Button size="sm" type="button" onClick={handleAddSkill} variant="outline" className="text-xs">
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Tab 4: Socio-Economic */}
              <TabsContent value="socio" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Reservation Category</label>
                    <select
                      disabled={!isEditing}
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-2.5 border rounded-lg text-xs bg-slate-50 disabled:opacity-75 dark:bg-slate-800"
                    >
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Annual Family Income (₹)</label>
                    <input
                      type="number"
                      disabled={!isEditing}
                      value={formData.annualIncome}
                      onChange={e => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
                      className="w-full p-2.5 border rounded-lg text-xs bg-slate-50 disabled:opacity-75 dark:bg-slate-800"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
