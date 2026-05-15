import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Briefcase, GraduationCap, Download, CheckCircle, ChevronRight, ChevronLeft, Phone, Link as LinkIcon, Image as ImageIcon, Save } from 'lucide-react';

import html2pdf from 'html2pdf.js';

import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function ResumeBuilder({ highContrast, user }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    linkedin: '',
    address: '',
    permanentAddress: '',
    summary: '',
    education: '',
    experience: '',
    projects: '',
    certifications: '',
    researchPapers: '',
    achievements: '',
    extracurriculars: '',
    hobbies: '',
    skills: user?.profile?.skills || '',
    photo: null
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get('/resume');
        if (res.data) {
          setFormData({
            ...formData,
            ...res.data,
            name: res.data.name || user?.name || '',
            email: res.data.email || user?.email || '',
          });
        }
      } catch (err) {
        console.error('No existing resume found or fetch failed');
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  const steps = [
    { title: "Contact", icon: <User /> },
    { title: "Summary & Skills", icon: <CheckCircle /> },
    { title: "Edu & Exp", icon: <GraduationCap /> },
    { title: "Projects", icon: <Briefcase /> },
    { title: "Extras", icon: <CheckCircle /> },
    { title: "Review", icon: <Download /> }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const downloadResume = () => {
    const element = document.getElementById('resume-preview');
    const opt = {
      margin:       0,
      filename:     `${formData.name || 'Resume'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
    handleSave(); // Auto-save when downloading
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post('/resume', formData);
      alert('Resume saved to profile!');
    } catch (err) {
      console.error('Failed to save resume', err);
      alert('Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8 px-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className={`flex items-center gap-2 font-black uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95 ${highContrast ? 'text-yellow-300' : 'text-gray-400 hover:text-[#000080]'}`}
        >
          &larr; Exit to Dashboard
        </button>
        <div className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${highContrast ? 'bg-yellow-300 text-black' : 'bg-orange-50 text-[#FF9933]'}`}>
          AI Resume Builder
        </div>
      </div>
      <div className={`p-10 rounded-[3rem] shadow-2xl ${highContrast ? 'border-2 border-yellow-300 bg-black' : 'bg-white border border-gray-100'}`}>
        <div className="flex justify-between items-center mb-16 overflow-x-auto pb-4 scrollbar-hide print:hidden">
          {steps.map((s, i) => (
            <div key={i} className={`flex flex-col items-center min-w-[80px] transition-all ${step === i ? (highContrast ? 'text-yellow-300' : 'text-[#000080]') : 'opacity-30'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform ${step === i ? (highContrast ? 'bg-yellow-300 text-black' : 'bg-[#000080] text-white shadow-xl shadow-blue-200 scale-110') : 'bg-gray-100'}`}>
                {React.cloneElement(s.icon, { size: 28 })}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{s.title}</span>
            </div>
          ))}
        </div>

        <div className="min-h-[450px]">
          {step === 0 && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-4xl font-black tracking-tight">Contact & Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                <Input label="Email Address" name="email" value={formData.email} onChange={handleChange} type="email" />
                <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} type="tel" />
                <Input label="LinkedIn URL" name="linkedin" value={formData.linkedin} onChange={handleChange} />
                <Input label="Current Address" name="address" value={formData.address} onChange={handleChange} />
                <Input label="Permanent Address" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} />
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">Profile Photo</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#FF9933] outline-none transition-all font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-4xl font-black tracking-tight">Summary & Core Skills</h2>
                <span className="px-4 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full">Mandatory Section</span>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">Professional Summary</label>
                  <textarea 
                    name="summary" 
                    className="w-full p-6 rounded-3xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#FF9933] outline-none h-[120px] font-medium transition-all"
                    placeholder="e.g., Highly motivated individual with a strong foundation in..."
                    value={formData.summary}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">Core Skills (Mandatory)</label>
                  <textarea 
                    name="skills" 
                    className="w-full p-6 rounded-3xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#FF9933] outline-none h-[120px] font-medium transition-all"
                    placeholder="e.g., JavaScript, React, Public Speaking, Data Entry, Team Collaboration"
                    value={formData.skills}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-[10px] text-slate-400 font-bold ml-4 uppercase">Tip: Separate skills with commas for better visibility.</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-4xl font-black tracking-tight">Education & Experience</h2>
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">Education (Format: Degree - School - Percentage - Year)</label>
                  <textarea 
                    name="education" 
                    className="w-full p-6 rounded-3xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#FF9933] outline-none h-[150px] font-medium transition-all"
                    placeholder="- 10th: XYZ School, CBSE, 90%, 2018&#10;- 12th: XYZ School, CBSE, 85%, 2020&#10;- BTech: ABC College, CSE, 8.5 CGPA, 2024"
                    value={formData.education}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">Internships / Experience</label>
                  <textarea 
                    name="experience" 
                    className="w-full p-6 rounded-3xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#FF9933] outline-none h-[150px] font-medium transition-all"
                    placeholder="- Software Intern – Tech Corp (Jan 2023 - Jun 2023)&#10;  * Developed REST APIs...&#10;  * Improved efficiency by..."
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-4xl font-black tracking-tight">Projects & Certifications</h2>
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">Projects</label>
                  <textarea 
                    name="projects" 
                    className="w-full p-6 rounded-3xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#FF9933] outline-none h-[150px] font-medium transition-all"
                    placeholder="- Portfolio Website&#10;  * React, TailwindCSS&#10;  * Built a responsive portfolio showcasing my projects."
                    value={formData.projects}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">Certifications</label>
                  <textarea 
                    name="certifications" 
                    className="w-full p-6 rounded-3xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#FF9933] outline-none h-[150px] font-medium transition-all"
                    placeholder="- AWS Certified Practitioner – Amazon – 2023"
                    value={formData.certifications}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-4xl font-black tracking-tight">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">Research Papers (If any)</label>
                  <textarea 
                    name="researchPapers" 
                    className="w-full p-6 rounded-3xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#FF9933] outline-none h-[120px] font-medium transition-all"
                    placeholder="- Paper Title – Publication – 2023"
                    value={formData.researchPapers}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">Achievements</label>
                  <textarea 
                    name="achievements" 
                    className="w-full p-6 rounded-3xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#FF9933] outline-none h-[120px] font-medium transition-all"
                    placeholder="- Won 1st prize in Hackathon"
                    value={formData.achievements}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">Extracurriculars</label>
                  <textarea 
                    name="extracurriculars" 
                    className="w-full p-6 rounded-3xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#FF9933] outline-none h-[120px] font-medium transition-all"
                    placeholder="- President of Coding Club"
                    value={formData.extracurriculars}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">Hobbies / Interests</label>
                  <textarea 
                    name="hobbies" 
                    className="w-full p-6 rounded-3xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#FF9933] outline-none h-[120px] font-medium transition-all"
                    placeholder="- Reading, Chess"
                    value={formData.hobbies}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-wrap gap-4 items-center">
                <h2 className="text-4xl font-black tracking-tight">Your Resume is Ready</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-3 transition-all shadow-xl hover:scale-105 active:scale-95 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#FF9933] text-white shadow-orange-200'}`}
                  >
                    <Save size={24} /> {isSaving ? 'Saving...' : 'Save to Profile'}
                  </button>
                  <button 
                    onClick={downloadResume}
                    className={`px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-3 transition-all shadow-xl hover:scale-105 active:scale-95 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#000080] text-white shadow-blue-200'}`}
                  >
                    <Download size={24} /> Save PDF
                  </button>
                </div>
              </div>
              
              {/* CLEAN, SINGLE-COLUMN RESUME FORMAT */}
              <div id="resume-preview" className="p-12 border-0 bg-white text-black text-left shadow-lg max-w-[800px] mx-auto font-sans leading-relaxed text-[14px]">
                
                {/* 1. HEADER SECTION */}
                <div className="flex justify-between items-center border-b border-gray-800 pb-6 mb-6">
                  <div className="space-y-1">
                    <h1 className="text-4xl font-bold uppercase tracking-wide">{formData.name || "YOUR NAME"}</h1>
                    <div className="flex flex-wrap gap-4 text-sm mt-2 text-gray-700">
                      {formData.phone && <span className="flex items-center gap-1"><Phone size={14} /> {formData.phone}</span>}
                      {formData.email && <span className="flex items-center gap-1"><Mail size={14} /> {formData.email}</span>}
                      {formData.linkedin && <span className="flex items-center gap-1"><LinkIcon size={14} /> {formData.linkedin}</span>}
                    </div>
                  </div>
                  <div className="w-24 h-28 bg-gray-100 border border-dashed border-gray-400 flex items-center justify-center flex-col text-gray-400 overflow-hidden">
                    {formData.photo ? (
                      <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon size={24} />
                        <span className="text-[10px] mt-1">[Photo]</span>
                      </>
                    )}
                  </div>
                </div>

                {/* 2. PERSONAL DETAILS */}
                {(formData.address || formData.permanentAddress) && (
                  <div className="mb-6 text-sm text-gray-700">
                    {formData.address && <div className="flex gap-2"><span className="font-bold min-w-[140px]">Current Address:</span> <span>{formData.address}</span></div>}
                    {formData.permanentAddress && <div className="flex gap-2"><span className="font-bold min-w-[140px]">Permanent Address:</span> <span>{formData.permanentAddress}</span></div>}
                  </div>
                )}

                {/* 3. PROFESSIONAL SUMMARY */}
                {formData.summary && (
                  <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2 tracking-widest">Professional Summary</h2>
                    <p className="whitespace-pre-line text-sm text-justify">{formData.summary}</p>
                  </div>
                )}

                {/* 4. SKILLS SECTION (NEW) */}
                {formData.skills && (
                  <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2 tracking-widest">Core Skills</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skills.split(',').map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-50 border border-gray-200 text-xs font-bold rounded-md uppercase tracking-tight">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. EDUCATION */}
                {formData.education && (
                  <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2 tracking-widest">Education</h2>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {formData.education.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                        <li key={i}>{line.replace(/^- /, '')}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 6. INTERNSHIPS / EXPERIENCE */}
                {formData.experience && (
                  <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2 tracking-widest">Internships / Experience</h2>
                    <ul className="list-none space-y-2 text-sm">
                      {formData.experience.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                        <li key={i} className={line.trim().startsWith('*') || line.trim().startsWith('-') ? "pl-5 list-disc ml-5" : "font-semibold mt-2"}>
                          {line.replace(/^[-*]\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 7. PROJECTS */}
                {formData.projects && (
                  <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2 tracking-widest">Projects</h2>
                    <ul className="list-none space-y-2 text-sm">
                      {formData.projects.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                        <li key={i} className={line.trim().startsWith('*') || line.trim().startsWith('-') ? "pl-5 list-disc ml-5" : "font-semibold mt-2"}>
                          {line.replace(/^[-*]\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 8. CERTIFICATIONS */}
                {formData.certifications && (
                  <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2 tracking-widest">Certifications</h2>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {formData.certifications.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                        <li key={i}>{line.replace(/^- /, '')}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 9. RESEARCH PAPERS */}
                {formData.researchPapers && (
                  <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2 tracking-widest">Research Papers</h2>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {formData.researchPapers.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                        <li key={i}>{line.replace(/^- /, '')}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 10. ACHIEVEMENTS */}
                {formData.achievements && (
                  <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2 tracking-widest">Achievements</h2>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {formData.achievements.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                        <li key={i}>{line.replace(/^- /, '')}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 11. EXTRACURRICULAR ACTIVITIES */}
                {formData.extracurriculars && (
                  <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2 tracking-widest">Extracurricular Activities</h2>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {formData.extracurriculars.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                        <li key={i}>{line.replace(/^- /, '')}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 12. HOBBIES / INTERESTS */}
                {formData.hobbies && (
                  <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 pb-1 mb-2 tracking-widest">Hobbies / Interests</h2>
                    <p className="text-sm">{formData.hobbies}</p>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-16 print:hidden">
          <button 
            onClick={prevStep} 
            disabled={step === 0}
            className={`px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-2 transition-all ${step === 0 ? 'opacity-10 cursor-not-allowed' : 'hover:bg-gray-50 text-gray-800'}`}
          >
            <ChevronLeft size={24} /> Previous
          </button>
          
          {step < 5 ? (
            <button 
              onClick={nextStep}
              className={`px-10 py-4 rounded-2xl font-black text-xl flex items-center gap-2 transition-all shadow-xl transform active:scale-95 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#FF9933] text-white shadow-orange-200'}`}
            >
              Next Step <ChevronRight size={24} />
            </button>
          ) : (
            <button 
              onClick={() => navigate('/dashboard')}
              className={`px-10 py-4 rounded-2xl font-black text-xl flex items-center gap-2 transition-all hover:bg-gray-50 border-4 border-gray-100 ${highContrast ? 'text-yellow-300 border-yellow-300' : 'text-gray-500 hover:border-gray-200'}`}
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">{label}</label>
      <input 
        type={type} 
        name={name} 
        value={value} 
        onChange={onChange}
        className="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#FF9933] outline-none transition-all font-bold"
      />
    </div>
  );
}
