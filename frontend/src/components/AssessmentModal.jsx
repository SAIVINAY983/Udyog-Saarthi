import React, { useState } from 'react';
import { CheckCircle, XCircle, Brain, Target, ArrowRight, Code, ListChecks, Clock } from 'lucide-react';
import api from '../api';

export default function AssessmentModal({ application, onClose, onSuccess, highContrast }) {
  const [step, setStep] = useState(0); // 0: Intro, 1: MCQ, 2: Technical, 3: Result
  const [answers, setAnswers] = useState({});
  const [techAnswers, setTechAnswers] = useState({});
  const [activeTechIdx, setActiveTechIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  const mcqs = [
    { id: 1, text: "Which protocol is used for secure web browsing?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], correct: 2 },
    { id: 2, text: "What is the primary purpose of a database?", options: ["Editing photos", "Storing structured data", "Browsing the web", "Calculating math"], correct: 1 },
    { id: 3, text: "In programming, what does a 'loop' do?", options: ["Exits the program", "Repeats a block of code", "Changes variable type", "Deletes data"], correct: 1 },
    { id: 4, text: "What should you do if you cannot complete a task on time?", options: ["Hide the mistake", "Inform your lead immediately", "Blame someone else", "Work silently"], correct: 1 },
    { id: 5, text: "Which language is used for styling web pages?", options: ["Python", "HTML", "CSS", "SQL"], correct: 2 },
    { id: 6, text: "What does 'UI' stand for?", options: ["User Interface", "Uniform Identity", "Universal Input", "User Integration"], correct: 0 },
    { id: 7, text: "Which of these is a version control system?", options: ["Chrome", "Git", "VS Code", "Windows"], correct: 1 },
    { id: 8, text: "A 'variable' in code is most like a:", options: ["Hammer", "Box to store data", "Fixed wall", "Empty room"], correct: 1 },
    { id: 9, text: "What is the first step in solving a bug?", options: ["Deleting all code", "Reproducing the error", "Restarting computer", "Searching for a new job"], correct: 1 },
    { id: 10, text: "Working in a 'Sprint' usually means:", options: ["Running fast", "Working in a fixed time-block", "Drinking coffee", "Working alone"], correct: 1 }
  ];

  const techScenarios = [
    { id: 1, text: "Write a JavaScript function that takes an array of numbers and returns only the even numbers." },
    { id: 2, text: "Create a CSS class that centers a div perfectly in the middle of a screen using Flexbox." },
    { id: 3, text: "Write a SQL query to find all users from a table named 'Candidates' where the score is above 80." },
    { id: 4, text: "Write a React functional component that displays a 'Hello World' message in an H1 tag." },
    { id: 5, text: "Write a simple 'if/else' statement in any language that checks if a variable 'age' is 18 or older." }
  ];

  const handleFinish = async () => {
    setLoading(true);
    let mcqScore = 0;
    mcqs.forEach((q, idx) => {
      if (answers[idx] === q.correct) mcqScore += 10;
    });
    
    // Technical questions give a 'completion' bonus of 5 points each if they wrote something
    let techScore = 0;
    techScenarios.forEach((q, idx) => {
      if (techAnswers[idx] && techAnswers[idx].length > 10) techScore += 10;
    });

    const finalScore = Math.min(100, mcqScore + (techScore / 2)); // Max 100
    const status = finalScore >= 50 ? 'qualified' : 'failed';

    try {
      await api.put(`/applications/${application.id}`, {
        assessment_score: Math.round(finalScore),
        assessment_status: status,
        notes: JSON.stringify(techAnswers)
      });
      setStep(3);
      if (onSuccess) onSuccess();
    } catch (err) {
      alert('Failed to save assessment results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto p-12 rounded-[3.5rem] shadow-2xl animate-scale-up relative ${highContrast ? 'bg-black border-4 border-yellow-300 text-yellow-300' : 'bg-white text-gray-900'}`}>
        
        {step === 0 && (
          <div className="text-center space-y-10 py-10">
            <div className="w-28 h-28 bg-blue-50 text-[#000080] rounded-3xl flex items-center justify-center mx-auto shadow-inner"><Brain size={56} /></div>
            <div>
              <h2 className="text-5xl font-black mb-4 tracking-tighter">Advanced Skills Assessment</h2>
              <p className="text-2xl opacity-40 font-bold italic">Position: {application.job_posting?.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
              <div className="p-6 bg-gray-50 rounded-3xl border-2 border-gray-100 flex items-center gap-4 text-left">
                <ListChecks className="text-[#000080]" size={32} />
                <div><p className="font-black">Phase 1</p><p className="text-xs opacity-50">10 MCQs</p></div>
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl border-2 border-gray-100 flex items-center gap-4 text-left">
                <Code className="text-[#FF9933]" size={32} />
                <div><p className="font-black">Phase 2</p><p className="text-xs opacity-50">Technical Logic</p></div>
              </div>
            </div>
            <button onClick={() => setStep(1)} className={`w-full py-6 rounded-[2rem] font-black text-2xl shadow-2xl transition transform hover:scale-[1.02] ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#000080] text-white shadow-blue-200'}`}>Begin Professional Exam</button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-12">
            <div className="flex justify-between items-center border-b-4 border-gray-50 pb-6">
              <h2 className="text-3xl font-black uppercase tracking-widest opacity-20">Phase 1: Knowledge</h2>
              <span className="bg-blue-50 text-[#000080] px-6 py-2 rounded-xl font-black">{Object.keys(answers).length}/10 Complete</span>
            </div>
            <div className="space-y-16">
              {mcqs.map((q, qIdx) => (
                <div key={q.id} className="space-y-8">
                  <p className="text-3xl font-black leading-tight text-gray-800">{qIdx + 1}. {q.text}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, oIdx) => (
                      <button key={oIdx} onClick={() => setAnswers({...answers, [qIdx]: oIdx})} className={`p-6 rounded-2xl border-4 text-left font-bold text-lg transition-all ${answers[qIdx] === oIdx ? (highContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-blue-50 border-[#000080] text-[#000080] shadow-lg') : 'border-gray-50 hover:border-gray-200 bg-gray-50/50'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button disabled={Object.keys(answers).length < 10} onClick={() => setStep(2)} className={`w-full py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl transition transform hover:scale-[1.02] disabled:opacity-20 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#FF9933] text-white shadow-orange-200'}`}>Next: Technical Round &rarr;</button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col h-[85vh]">
            {/* IDE Toolbar */}
            <div className="flex justify-between items-center bg-[#f8f9fa] border-b-2 border-gray-100 p-4 rounded-t-[2rem]">
              <div className="flex gap-6 items-center">
                <span className="bg-[#000080] text-white px-4 py-1 rounded-lg font-black text-xs uppercase tracking-widest">Problem {activeTechIdx + 1}</span>
                <div className="flex gap-4 text-sm font-bold opacity-40">
                  <span className="border-b-2 border-[#000080] text-[#000080]">Problem</span>
                  <span>Editorial</span>
                  <span>Submissions</span>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2 px-4 py-1 bg-white rounded-lg border border-gray-200 text-sm font-bold shadow-sm">
                  <Clock size={16} className="text-red-500" />
                  <span>29:45</span>
                </div>
                <select className="bg-white border border-gray-200 rounded-lg px-4 py-1 text-xs font-bold outline-none">
                  <option>JavaScript (Node.js)</option>
                  <option>Python 3</option>
                  <option>Java 17</option>
                  <option>C++ (G++ 11)</option>
                </select>
              </div>
            </div>

            {/* Split Screen Container */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Side: Problem Description */}
              <div className="w-1/2 p-10 overflow-y-auto bg-white border-r-2 border-gray-100 space-y-8">
                <div>
                  <h3 className="text-4xl font-black mb-4 text-gray-800">
                    {activeTechIdx === 0 && "Filter Even Numbers"}
                    {activeTechIdx === 1 && "Flexbox Centering"}
                    {activeTechIdx === 2 && "SQL User Query"}
                    {activeTechIdx === 3 && "React Greeting Component"}
                    {activeTechIdx === 4 && "Age Verification Logic"}
                  </h3>
                  <div className="flex gap-3 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-600 px-3 py-1 rounded-md">Easy</span>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1 rounded-md">Accuracy: 85%</span>
                  </div>
                </div>

                <div className="text-xl font-medium leading-relaxed text-gray-600 space-y-6">
                  <p>{techScenarios[activeTechIdx].text}</p>
                  
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 font-mono text-sm space-y-4">
                    <p className="font-black text-gray-400 uppercase tracking-tighter">Example 1:</p>
                    <p><span className="text-[#000080] font-black">Input:</span> data = [1, 2, 3, 4, 5, 6]</p>
                    <p><span className="text-[#000080] font-black">Output:</span> [2, 4, 6]</p>
                    <p><span className="text-gray-400 italic font-medium">Explanation: The function filters out odd numbers and returns only evens.</span></p>
                  </div>

                  <div className="space-y-4 pt-10">
                    <h4 className="font-black text-gray-800 uppercase tracking-widest text-xs">Constraints:</h4>
                    <ul className="text-sm list-disc pl-6 space-y-2 opacity-60">
                      <li>Use ES6 syntax if using JavaScript</li>
                      <li>Complexity should be O(n)</li>
                      <li>Handle empty array case</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Side: Code Editor */}
              <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
                <div className="flex-1 relative">
                  <div className="absolute top-4 left-4 text-[#d4d4d4]/20 font-mono text-xs select-none pointer-events-none">
                    {Array.from({length: 20}).map((_, i) => <div key={i}>{i+1}</div>)}
                  </div>
                  <textarea 
                    className="w-full h-full p-10 pl-16 bg-transparent text-[#d4d4d4] font-mono text-lg outline-none resize-none leading-relaxed"
                    placeholder="// Start coding here..."
                    value={techAnswers[activeTechIdx] || ''}
                    onChange={(e) => {
                      const newAnswers = {...techAnswers};
                      newAnswers[activeTechIdx] = e.target.value;
                      setTechAnswers(newAnswers);
                    }}
                  />
                </div>
                
                {/* Editor Actions */}
                <div className="p-6 bg-[#252526] flex justify-between items-center border-t border-white/5">
                  <div className="flex gap-4">
                    <button className="px-6 py-2 bg-gray-700 text-white rounded-lg font-bold text-sm hover:bg-gray-600 transition">Run Code</button>
                    <button 
                      onClick={() => {
                        if (activeTechIdx < techScenarios.length - 1) setActiveTechIdx(activeTechIdx + 1);
                        else handleFinish();
                      }}
                      className="px-8 py-2 bg-[#128807] text-white rounded-lg font-black text-sm hover:bg-[#0e6b05] transition"
                    >
                      {activeTechIdx < techScenarios.length - 1 ? 'Submit & Next' : 'Submit Exam'}
                    </button>
                  </div>
                  <span className="text-xs font-bold text-gray-500">Character Count: {(techAnswers[activeTechIdx] || '').length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && resultData && (
          <div className="text-center space-y-10 py-10">
            <div className={`w-28 h-28 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl ${resultData.assessment_status === 'qualified' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}><Target size={56} /></div>
            <div>
              <h2 className="text-5xl font-black mb-4 tracking-tighter">Exam Completed!</h2>
              <p className="text-2xl opacity-40 font-bold italic">Final Review Score: {resultData.assessment_score}%</p>
            </div>
            <div className={`p-10 rounded-[3.5rem] border-4 ${highContrast ? 'border-yellow-300' : 'bg-gray-50 border-gray-100 shadow-inner'}`}>
              {resultData.assessment_status === 'qualified' ? (
                <div className="space-y-6">
                  <h3 className="text-4xl font-black text-green-600 tracking-tight">🎉 Qualified for Interview!</h3>
                  <p className="text-xl font-medium leading-relaxed">Excellent work. Your technical and logical scores meet our criteria. The employer will now be notified to schedule your live video interview.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-4xl font-black text-red-600 tracking-tight">Score Pending Review</h3>
                  <p className="text-xl font-medium leading-relaxed">Your results are being processed. Don't worry—you can continue practicing in our training hub to improve your score for future applications.</p>
                </div>
              )}
            </div>
            <button onClick={onClose} className={`w-full py-6 rounded-[2.5rem] font-black text-2xl transition hover:scale-105 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#000080] text-white'}`}>Return to Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
}
