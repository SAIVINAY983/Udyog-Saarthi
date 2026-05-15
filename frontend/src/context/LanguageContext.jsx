import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    welcome: "Welcome",
    dashboard: "Dashboard",
    login: "Login",
    register: "Register",
    logout: "Logout",
    jobs: "Jobs",
    training: "Training",
    applications: "Applications",
    admin: "Admin",
    highContrast: "High Contrast",
    simpleMode: "Easy Reading",
    readAloud: "Read Aloud",
    resumeBuilder: "AI Resume Builder",
    applyNow: "Apply Now",
    searchJobs: "Search Jobs",
    postJob: "Post New Job",
    talentDiscovery: "Talent Discovery",
    myOpenings: "My Openings",
    interviewRoom: "Interview Room",
    backToDashboard: "Back to Dashboard",
    coreSkills: "Core Skills",
    summary: "Summary",
    education: "Education",
    experience: "Experience",
    projects: "Projects",
    saveToProfile: "Save to Profile",
    downloadPDF: "Download PDF",
    systemManagement: "System Management",
    rootAdmin: "Root Admin",
    globalBroadcast: "Global Broadcast",
  },
  hi: {
    welcome: "स्वागत है",
    dashboard: "डैशबोर्ड",
    login: "लॉगिन",
    register: "पंजीकरण",
    logout: "लॉगआउट",
    jobs: "नौकरियां",
    training: "प्रशिक्षण",
    applications: "आवेदन",
    admin: "एडमिन",
    highContrast: "उच्च कंट्रास्ट",
    simpleMode: "आसान पठन",
    readAloud: "ज़ोर से पढ़ें",
    resumeBuilder: "एआई बायोडाटा निर्माता",
    applyNow: "अभी आवेदन करें",
    searchJobs: "नौकरियां खोजें",
    postJob: "नई नौकरी डालें",
    talentDiscovery: "प्रतिभा खोज",
    myOpenings: "मेरी रिक्तियां",
    interviewRoom: "साक्षात्कार कक्ष",
    backToDashboard: "डैशबोर्ड पर वापस",
    coreSkills: "मुख्य कौशल",
    summary: "सारांश",
    education: "शिक्षा",
    experience: "अनुभव",
    projects: "परियोजनाएं",
    saveToProfile: "प्रोफ़ाइल में सहेजें",
    downloadPDF: "पीडीएफ डाउनलोड करें",
    systemManagement: "सिस्टम प्रबंधन",
    rootAdmin: "रूट एडमिन",
    globalBroadcast: "वैश्विक प्रसारण",
  },
  ta: {
    welcome: "வரவேற்பு",
    dashboard: "டாஷ்போர்டு",
    login: "உள்நுழை",
    register: "பதிவு",
    logout: "வெளியேறு",
    jobs: "வேலைகள்",
    training: "பயிற்சி",
    applications: "விண்ணப்பங்கள்",
    admin: "நிர்வாகி",
    highContrast: "உயர் கான்ட்ராஸ்ட்",
    simpleMode: "எளிதான வாசிப்பு",
    readAloud: "சத்தமாக வாசி",
    resumeBuilder: "AI ரெஸ்யூம் பில்டர்",
    applyNow: "இப்போதே விண்ணப்பிக்கவும்",
    searchJobs: "வேலைகளைத் தேடுங்கள்",
    postJob: "புதிய வேலையை இடுங்கள்",
    talentDiscovery: "திறமை கண்டுபிடிப்பு",
    myOpenings: "எனது காலியிடங்கள்",
    interviewRoom: "நேர்காணல் அறை",
    backToDashboard: "டாஷ்போர்டிற்கு திரும்பு",
    coreSkills: "முக்கிய திறன்கள்",
    summary: "சுருக்கம்",
    education: "கல்வி",
    experience: "அனுபவம்",
    projects: "திட்டங்கள்",
    saveToProfile: "சுயவிவரத்தில் சேமிக்கவும்",
    downloadPDF: "PDF பதிவிறக்கவும்",
    systemManagement: "கணினி மேலாண்மை",
    rootAdmin: "ரூட் நிர்வாகி",
    globalBroadcast: "உலகளாவிய ஒளிபரப்பு",
  },
  te: {
    welcome: "స్వాగతం",
    dashboard: "డ్యాష్‌బోర్డ్",
    login: "లాగిన్",
    register: "నమోదు",
    logout: "లాగ్ అవుట్",
    jobs: "ఉద్యోగాలు",
    training: "శిక్షణ",
    applications: "దరఖాస్తులు",
    admin: "అడ్మిన్",
    highContrast: "హై కాంట్రాస్ట్",
    simpleMode: "సులభమైన పఠనం",
    readAloud: "బిగ్గరగా చదవండి",
    resumeBuilder: "AI రెజ్యూమ్ బిల్డర్",
    applyNow: "ఇప్పుడే దరఖాస్తు చేసుకోండి",
    searchJobs: "ఉద్యోగాల కోసం వెతకండి",
    postJob: "కొత్త ఉద్యోగాన్ని పోస్ట్ చేయండి",
    talentDiscovery: "ప్రతిభను కనుగొనండి",
    myOpenings: "నా ఖాళీలు",
    interviewRoom: "ఇంటర్వ్యూ గది",
    backToDashboard: "డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్ళు",
    coreSkills: "ప్రధాన నైపుణ్యాలు",
    summary: "సారాంశం",
    education: "విద్య",
    experience: "అనుభవం",
    projects: "ప్రాజెక్టులు",
    saveToProfile: "ప్రొఫైల్‌కు సేవ్ చేయి",
    downloadPDF: "PDF డౌన్‌లోడ్ చేయి",
    systemManagement: "సిస్టమ్ నిర్వహణ",
    rootAdmin: "రూట్ అడ్మిన్",
    globalBroadcast: "గ్లోబల్ బ్రాడ్‌కాస్ట్",
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('app_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('app_lang', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
