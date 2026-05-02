import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  Accessibility, 
  TrendingUp, 
  ChevronRight,
  MapPin,
  Clock
} from 'lucide-react';

export default function Landing({ user, highContrast, simpleMode }) {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative py-16 md:py-32 overflow-hidden">
        <div className={`absolute top-0 right-0 w-1/2 h-full opacity-10 -z-10 ${highContrast ? 'hidden' : ''}`}>
           <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#FF9933] blur-3xl animate-pulse"></div>
           <div className="absolute bottom-20 right-40 w-96 h-96 rounded-full bg-[#128807] blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-slide-up">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold tracking-wide border shadow-sm ${highContrast ? 'border-yellow-300 text-yellow-300' : 'bg-white border-gray-100 text-[#000080]'}`}>
              <ShieldCheck className="w-4 h-4 mr-2" />
              {simpleMode ? "Safe and Real Jobs for You" : "Verified Opportunities for All"}
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter">
              {simpleMode ? (
                <>Good jobs for <span className={highContrast ? 'text-yellow-300 underline' : 'text-[#FF9933]'}>Everyone</span></>
              ) : (
                <>Bridging the gap between <span className={highContrast ? 'text-yellow-300 underline' : 'text-[#FF9933]'}>Ability and Opportunity</span></>
              )}
            </h1>
            <p className="text-xl md:text-2xl opacity-80 max-w-lg leading-relaxed font-medium">
              {simpleMode 
                ? "We help you find jobs, learn new skills, and get ready for interviews. Everything is easy to use."
                : "Empowering adults with disabilities through structured job coaching, inclusive training, and reserved employment opportunities."
              }
            </p>
            {!user && (
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/register" className={`px-10 py-5 rounded-3xl text-xl font-black shadow-2xl hover:scale-105 transition-all transform active:scale-95 flex items-center gap-2 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-gradient-to-r from-[#FF9933] to-[#cc7a29] text-white shadow-orange-500/30'}`}>
                  {simpleMode ? "Start Here" : "Get Started"} <ChevronRight className="w-6 h-6" />
                </Link>
                <Link to="/login" className={`px-10 py-5 rounded-3xl text-xl font-bold border-2 hover:bg-gray-50 transition-all ${highContrast ? 'border-yellow-300 text-yellow-300' : 'border-gray-200 text-gray-800 bg-white shadow-sm'}`}>
                  Log In
                </Link>
              </div>
            )}
          </div>
          <div className="relative animate-fade-in delay-200">
            <div className={`absolute -inset-6 rounded-[3rem] opacity-20 blur-3xl ${highContrast ? 'bg-yellow-300' : 'bg-gradient-to-tr from-[#FF9933] to-[#128807]'}`}></div>
            <img 
              src="/hero.png" 
              alt="Diverse professionals working together" 
              className="relative rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] w-full object-cover transform hover:scale-102 transition-transform duration-700 border-8 border-white"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 ${highContrast ? 'bg-gray-900 border-y border-yellow-300' : 'bg-gradient-to-b from-white to-gray-50 border-y border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <StatItem label="Active Jobs" value="500+" highContrast={highContrast} />
          <StatItem label="Trained Users" value="1,200+" highContrast={highContrast} />
          <StatItem label="Expert Coaches" value="50+" highContrast={highContrast} />
          <StatItem label="Success Rate" value="85%" highContrast={highContrast} />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl font-black">{simpleMode ? "How we help you" : "Comprehensive Support System"}</h2>
            <p className="opacity-70 max-w-2xl mx-auto text-xl font-medium">
              {simpleMode ? "We have everything you need to get a good job." : "We provide the tools and guidance needed to succeed in today's competitive job market."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Briefcase className="w-8 h-8" />}
              title={simpleMode ? "Good Jobs" : "Reserved Category Jobs"}
              desc={simpleMode ? "Find jobs made for you in big companies." : "Direct access to vacancies under the 4% reservation scheme in government and private sectors."}
              highContrast={highContrast}
            />
            <FeatureCard 
              icon={<GraduationCap className="w-8 h-8" />}
              title={simpleMode ? "Learn Skills" : "Guided Career Paths"}
              desc={simpleMode ? "Simple lessons to help you learn and grow." : "Step-by-step roadmaps: from skill assessment to interview preparation and placement."}
              highContrast={highContrast}
            />
            <FeatureCard 
              icon={<Accessibility className="w-8 h-8" />}
              title={simpleMode ? "Easy to Use" : "Accessibility First"}
              desc={simpleMode ? "Our app works for everyone. Big buttons and easy reading." : "Built-in voice navigation, screen reader support, and high-contrast visuals for a seamless experience."}
              highContrast={highContrast}
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className={`py-32 rounded-[4rem] mx-4 mb-20 shadow-2xl relative overflow-hidden ${highContrast ? 'bg-gray-900 border-4 border-yellow-300' : 'bg-[#000080] text-white'}`}>
        {!highContrast && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-black text-center mb-20 tracking-tight">{simpleMode ? "4 Steps to Success" : "Your Path to Employment"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <Step number="01" title={simpleMode ? "Join" : "Onboarding"} desc={simpleMode ? "Tell us about yourself." : "Create your profile and list your skills."} />
            <Step number="02" title={simpleMode ? "Learn" : "Skill Up"} desc={simpleMode ? "Take easy classes." : "Complete training modules for your job."} />
            <Step number="03" title={simpleMode ? "Apply" : "Apply"} desc={simpleMode ? "Pick a job you like." : "Discover verified jobs and apply."} />
            <Step number="04" title={simpleMode ? "Job" : "Succeed"} desc={simpleMode ? "Start your new work!" : "Get coached and start your journey."} />
          </div>
        </div>
      </section>

      {/* Accessibility Showcase */}
      <section className="py-24 mb-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-20">
          <div className="md:w-1/2 space-y-8">
            <h2 className="text-5xl font-black leading-tight tracking-tighter">Designed for <span className={highContrast ? 'text-yellow-300' : 'text-[#128807]'}>{simpleMode ? "You" : "Everyone"}</span></h2>
            <p className="text-2xl font-medium opacity-80 leading-relaxed">
              {simpleMode ? "We believe every person can work and succeed. We made this app simple for you." : "We believe technology should empower, not exclude. Our platform is built on WCAG 2.1 standards."}
            </p>
            <ul className="space-y-6">
              <AccessPoint text={simpleMode ? "Listen to page" : "Integrated Text-to-Speech"} highContrast={highContrast} />
              <AccessPoint text={simpleMode ? "Bright colors" : "One-Click High Contrast Mode"} highContrast={highContrast} />
              <AccessPoint text={simpleMode ? "Voice control" : "Keyboard & Voice Navigation"} highContrast={highContrast} />
              <AccessPoint text={simpleMode ? "Easy words" : "Simplified Language Mode"} highContrast={highContrast} />
            </ul>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-8 relative">
             <div className={`absolute -z-10 w-full h-full border-4 border-dashed rounded-[3rem] -rotate-3 ${highContrast ? 'border-yellow-300' : 'border-gray-100'}`}></div>
            <div className={`h-64 rounded-3xl flex flex-col items-center justify-center p-8 text-center gap-4 transition-transform hover:-rotate-3 ${highContrast ? 'border-2 border-yellow-300' : 'bg-white border border-gray-100 shadow-2xl'}`}>
              <TrendingUp className={`w-12 h-12 ${highContrast ? 'text-yellow-300' : 'text-[#FF9933]'}`} />
              <span className="font-black text-xl">Grow</span>
            </div>
            <div className={`h-64 rounded-3xl flex flex-col items-center justify-center p-8 text-center gap-4 transition-transform hover:rotate-3 mt-12 ${highContrast ? 'border-2 border-yellow-300' : 'bg-white border border-gray-100 shadow-2xl'}`}>
              <UserCheck className={`w-12 h-12 ${highContrast ? 'text-yellow-300' : 'text-[#128807]'}`} />
              <span className="font-black text-xl">Succeed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-24 border-t ${highContrast ? 'bg-black border-yellow-300 text-yellow-300' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <div className="text-4xl font-black flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#000080] text-white'}`}>
                <Briefcase size={32} />
              </div>
              Udyog Saarthi
            </div>
            <p className="text-lg font-medium opacity-60 leading-relaxed">
              Empowering the nation through inclusive employment. Join the movement for an accessible India.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-xl font-black uppercase tracking-widest opacity-40">Contact Us</h4>
            <div className="space-y-4 font-bold">
              <p className="flex items-center gap-3 group">
                <MapPin className={`transition-colors ${highContrast ? 'text-yellow-300' : 'text-[#FF9933]'}`} size={20} />
                <span>LPU, Punjab, India</span>
              </p>
              <p className="flex items-center gap-3 group">
                <Clock className={`transition-colors ${highContrast ? 'text-yellow-300' : 'text-[#000080]'}`} size={20} />
                <span>+91 6304233983</span>
              </p>
              <p className="flex items-center gap-3 group">
                <ShieldCheck className={`transition-colors ${highContrast ? 'text-yellow-300' : 'text-[#128807]'}`} size={20} />
                <span className="break-all text-sm sm:text-base">billakantisaivinay943@gmail.com</span>
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xl font-black uppercase tracking-widest opacity-40">Quick Links</h4>
            <div className="flex flex-col gap-3 font-black text-lg">
              <a href="#" className="hover:text-[#FF9933] transition">Privacy Policy</a>
              <a href="#" className="hover:text-[#128807] transition">Accessibility Statement</a>
              <a href="#" className="hover:text-[#000080] transition">National Portal</a>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 mt-20 pt-10 border-t border-gray-200/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm font-bold opacity-40 uppercase tracking-widest">
            © 2026 Udyog Saarthi • Dedicated to the Nation
          </div>
          <div className="flex gap-6">
             <div className="w-8 h-8 rounded-full bg-[#FF9933] opacity-20"></div>
             <div className="w-8 h-8 rounded-full bg-white border border-gray-200"></div>
             <div className={`w-8 h-8 rounded-full ${highContrast ? 'bg-yellow-300' : 'bg-[#128807]'} opacity-20`}></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ label, value, highContrast }) {
  return (
    <div className="space-y-2">
      <div className={`text-4xl md:text-6xl font-black ${highContrast ? 'text-yellow-300' : 'text-[#000080]'}`}>{value}</div>
      <div className="text-sm font-black opacity-50 uppercase tracking-[0.2em]">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, highContrast }) {
  return (
    <div className={`p-10 rounded-[2.5rem] transition-all hover:-translate-y-2 group cursor-pointer ${highContrast ? 'border-2 border-yellow-300 bg-black' : 'bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100'}`}>
      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-gray-50 text-[#000080]'}`}>
        {icon}
      </div>
      <h3 className="text-3xl font-black mb-6">{title}</h3>
      <p className="text-lg opacity-70 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="space-y-6 group">
      <div className="text-7xl font-black opacity-10 group-hover:opacity-30 transition-opacity">{number}</div>
      <h4 className="text-2xl font-black tracking-tight">{title}</h4>
      <p className="opacity-80 text-lg leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function AccessPoint({ text, highContrast }) {
  return (
    <li className="flex items-center gap-4 group cursor-default">
      <div className={`w-3 h-3 rounded-full transition-transform group-hover:scale-150 ${highContrast ? 'bg-yellow-300' : 'bg-[#FF9933]'}`}></div>
      <span className="font-bold text-xl opacity-90">{text}</span>
    </li>
  );
}



