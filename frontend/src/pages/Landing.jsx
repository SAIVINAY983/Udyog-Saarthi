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
  Clock,
  Star,
  Award,
  Users
} from 'lucide-react';

export default function Landing({ user, highContrast, simpleMode }) {
  const heroImage = "/udyog_saarthi_hero_1778940425296.png";

  return (
    <div className={`flex flex-col w-full selection:bg-saffron/30 ${highContrast ? 'high-contrast' : ''}`}>
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-40 overflow-hidden bg-mesh">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 animate-slide-up z-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold tracking-tight bg-white/40 backdrop-blur-md border border-white/50 text-chakra shadow-xl shadow-chakra/5">
              <span className="flex h-2 w-2 rounded-full bg-saffron mr-2 animate-ping"></span>
              {simpleMode ? "New Jobs for You" : "India's First Inclusive Job Chariot"}
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tight text-chakra-dark">
              {simpleMode ? (
                <>Empowering <span className="text-saffron">Every</span> Indian</>
              ) : (
                <>Your Path to <span className="text-saffron">Dignity</span> & Progress</>
              )}
            </h1>
            
            <p className="text-xl md:text-2xl text-chakra/70 max-w-lg leading-relaxed font-medium">
              {simpleMode 
                ? "We help you find jobs and learn skills at NIEPMD and beyond. Your future starts here."
                : "A premium platform dedicated to job coaching and 4% reservation opportunities for adults under NIEPMD and national institutions."
              }
            </p>
            
            {!user && (
              <div className="flex flex-wrap gap-5 pt-4">
                <Link to="/register" className="btn-primary text-xl px-10 py-5">
                  {simpleMode ? "Start Here" : "Join the Movement"} <ChevronRight className="w-6 h-6" />
                </Link>
                <Link to="/login" className="btn-outline text-xl px-10 py-5">
                  Log In
                </Link>
              </div>
            )}

            <div className="flex items-center gap-6 pt-8 border-t border-chakra/5">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-chakra">1,200+ Professionals</p>
                <p className="text-xs font-medium text-chakra/50">Joined this month</p>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="absolute -inset-10 bg-gradient-to-tr from-saffron/20 via-white to-emerald/20 blur-3xl opacity-60"></div>
            <div className="relative glass-card p-4 rotate-3 hover:rotate-0 transition-transform duration-700 animate-float">
              <img 
                src={heroImage} 
                alt="Inclusive workspace" 
                className="rounded-2xl shadow-2xl w-full h-full object-cover border-4 border-white"
              />
              <div className="absolute -bottom-10 -left-10 glass-card p-6 flex items-center gap-4 animate-bounce delay-700">
                <div className="w-12 h-12 rounded-full bg-emerald flex items-center justify-center text-white">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold">NIEPMD Certified</p>
                  <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">National Standard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass-card p-12 md:p-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald/5 blur-3xl rounded-full"></div>
            
            <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
              <div className="inline-block px-5 py-2 rounded-full bg-chakra text-white text-[10px] font-black uppercase tracking-[0.3em]">
                Our National Mission
              </div>
              <h2 className="text-4xl md:text-6xl font-black leading-tight text-chakra-dark">
                Revolutionizing Access to the <span className="text-emerald">4% Reservation</span> Scheme
              </h2>
              <p className="text-xl md:text-2xl leading-relaxed font-medium text-chakra/80 italic">
                "Udyog Saarthi acts as a digital charioteer, bridging the gap between talent and institutional opportunities at NIEPMD and beyond."
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-12 pt-8">
                <StatItem label="Active Vacancies" value="1.4k" icon={<Briefcase className="text-saffron" />} />
                <StatItem label="Partner Institutes" value="85+" icon={<Award className="text-chakra" />} />
                <StatItem label="Success Stories" value="3k+" icon={<Users className="text-emerald" />} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-5xl font-black text-chakra-dark tracking-tight">Built for <span className="text-emerald">Excellence</span></h2>
              <p className="text-lg font-medium text-chakra/60">Everything you need to secure your future, designed with accessibility at its core.</p>
            </div>
            <Link to="/register" className="btn-outline">View All Services <ChevronRight size={20} /></Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<ShieldCheck size={32} />}
              title="Verified Jobs"
              color="saffron"
              desc="Directly sourced from NIEPMD and national career portals under the 4% reservation."
            />
            <FeatureCard 
              icon={<GraduationCap size={32} />}
              title="Smart Coaching"
              color="chakra"
              desc="Adaptive learning modules tailored to your pace and specific job requirements."
            />
            <FeatureCard 
              icon={<Accessibility size={32} />}
              title="Universal Access"
              color="emerald"
              desc="Full voice navigation and high-contrast support for a truly inclusive experience."
            />
          </div>
        </div>
      </section>

      {/* Path Section */}
      <section className="py-32 bg-chakra text-white rounded-[3rem] mx-6 my-12 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-mesh opacity-20"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-24 space-y-6">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight">Your Journey to <span className="text-saffron">Success</span></h2>
            <p className="text-xl opacity-60 max-w-2xl mx-auto font-medium">Follow the guided path to your dream career.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <Step number="01" title="Digital Profile" desc="Create your verified professional identity." />
            <Step number="02" title="Skill Sync" desc="Complete modules matched to your goals." />
            <Step number="03" title="Interview Ready" desc="Practice with our AI simulator." />
            <Step number="04" title="Placements" desc="Get hired by top institutions." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-32 pb-12 bg-white border-t border-chakra/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 pb-20 border-b border-chakra/5">
            <div className="col-span-2 space-y-10">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-chakra flex items-center justify-center text-white shadow-xl shadow-chakra/20">
                  <Briefcase size={32} />
                </div>
                <span className="text-4xl font-black tracking-tighter text-chakra-dark">Udyog Saarthi</span>
              </div>
              <p className="text-2xl font-semibold text-chakra/80 leading-relaxed max-w-md">
                Dedicated to the Nation. <br />Empowering Every Indian through Inclusive Employment.
              </p>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center text-saffron hover:bg-saffron hover:text-white transition-all cursor-pointer">
                  <Star size={20} />
                </div>
                <div className="w-12 h-12 rounded-full bg-chakra/10 flex items-center justify-center text-chakra hover:bg-chakra hover:text-white transition-all cursor-pointer">
                  <ShieldCheck size={20} />
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald/10 flex items-center justify-center text-emerald hover:bg-emerald hover:text-white transition-all cursor-pointer">
                  <Users size={20} />
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-chakra/40">Contact HQ</h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <MapPin className="text-saffron shrink-0" />
                  <span className="font-bold text-chakra">LPU, Punjab, India</span>
                </li>
                <li className="flex gap-4">
                  <Clock className="text-chakra shrink-0" />
                  <span className="font-bold text-chakra">+91 6304233983</span>
                </li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-chakra/40">Resources</h4>
              <ul className="space-y-4">
                <li><a href="#" className="nav-link !p-0">Privacy & Terms</a></li>
                <li><a href="#" className="nav-link !p-0">Accessibility Standards</a></li>
                <li><a href="#" className="nav-link !p-0">NIEPMD Portal</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] opacity-30">© 2026 Udyog Saarthi • Dedicated to the Nation</p>
            <div className="flex gap-3">
              <div className="w-3 h-3 rounded-full bg-saffron"></div>
              <div className="w-3 h-3 rounded-full bg-white border border-gray-200"></div>
              <div className="w-3 h-3 rounded-full bg-emerald"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ label, value, icon }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="p-3 rounded-xl bg-white shadow-lg border border-chakra/5">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div className="text-3xl font-black text-chakra-dark">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-chakra/40">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  const colors = {
    saffron: 'text-saffron bg-saffron/5 group-hover:bg-saffron group-hover:text-white',
    emerald: 'text-emerald bg-emerald/5 group-hover:bg-emerald group-hover:text-white',
    chakra: 'text-chakra bg-chakra/5 group-hover:bg-chakra group-hover:text-white'
  };

  return (
    <div className="glass-card p-10 group cursor-pointer border-transparent hover:border-chakra/10">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${colors[color]}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 text-chakra-dark">{title}</h3>
      <p className="text-chakra/60 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="space-y-6 group">
      <div className="text-6xl font-black text-white/10 group-hover:text-saffron transition-colors duration-500">{number}</div>
      <h4 className="text-xl font-extrabold tracking-tight">{title}</h4>
      <p className="text-white/60 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
